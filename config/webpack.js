'use strict';

const path = require('path');
const fs = require('fs');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const BannerPlugin = require('webpack/lib/BannerPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const createResolver = require('postcss-import-webpack-resolver');

const BROWSERS = [
    'last 2 Chrome versions',
    'last 2 Firefox versions',
];

const buildConfig = (env) => {
    const projectDir = path.resolve(__dirname, '..');
    const isDev = env === 'development';
    const existsStyleguideSrc = fs.existsSync(path.join(projectDir, 'node_modules/@discussify/styleguide/src'));

    return {
        context: projectDir,
        mode: env,
        entry: {
            background: [
                path.join(__dirname, 'util/webextension-polyfill.js'),
                path.join(projectDir, 'src/entry-background.js'),
            ],
            'content-script': [
                path.join(__dirname, 'util/webextension-polyfill.js'),
                path.join(projectDir, 'src/entry-content-script.js'),
            ],
            'error-popup': [
                path.join(__dirname, 'util/webextension-polyfill.js'),
                path.join(projectDir, 'src/entry-error-popup.js'),
            ],
            authentication: [
                path.join(__dirname, 'util/webextension-polyfill.js'),
                path.join(projectDir, 'src/entry-authentication.js'),
            ],
            sidebar: [
                path.join(__dirname, 'util/webextension-polyfill.js'),
                path.join(projectDir, 'src/entry-sidebar.js'),
            ],
        },
        output: {
            path: path.join(projectDir, 'dist-template/build'),
            publicPath: '/build/',
            filename: '[name].js',
            chunkFilename: '[id].chunk.js',
        },
        resolve: {
            // Allow symlinked packages to work normally, e.g.: when linking @discussify/styleguide
            symlinks: false,
            // In dev, we want to compile the styleguide when linked
            alias: isDev && existsStyleguideSrc ? {
                '@discussify/styleguide': path.join(projectDir, 'node_modules/@discussify/styleguide/src'),
            } : undefined,
        },
        module: {
            rules: [
                // JS files
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: {
                                babelrc: false,
                                cacheDirectory: path.join(projectDir, 'node_modules/.cache/babel-loader'),
                                presets: [
                                    [require.resolve('babel-preset-moxy'), {
                                        targets: {
                                            browsers: BROWSERS,
                                        },
                                        react: true,
                                        modules: false,
                                    }],
                                ],
                            },
                        },
                    ],
                },
                // CSS files
                {
                    test: /\.css$/,
                    loader: [
                        {
                            loader: require.resolve('style-loader'),
                            options: {
                                singleton: true,
                                attrs: { 'data-role': 'styles' },
                                /* eslint-disable no-undef */
                                // Inject styles into the host element's shadow root and fallback to head
                                insertInto: () => {
                                    const hostEl = document.getElementById('discussify-host');

                                    return hostEl ? hostEl.shadowRoot : document.head;
                                },
                                /* eslint-enable */
                                transform: path.join(__dirname, './util/css-transform'),
                            },
                        },
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                modules: true,
                                sourceMap: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]___[hash:base64:5]!',
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: require('postcss-preset-moxy')({
                                browsers: BROWSERS,
                                // Inline any url() calls to avoid Content Security Policy errors
                                // Do not inline woff files because woff2 will be used instead, saving space in the bundle,
                                // but instead just print their basenames to avoid having your disk path there
                                url: [
                                    { filter: /.woff$/, url: ({ pathname }) => `https://${path.basename(pathname)}}` },
                                    { filter: /.*/, url: 'inline' },
                                ],
                                import: {
                                    // In dev, we want to compile the styleguide when linked
                                    resolve: createResolver({
                                        alias: isDev && existsStyleguideSrc ? {
                                            '@discussify/styleguide/styles': path.join(projectDir, 'node_modules/@discussify/styleguide/src/styles'), // eslint-disable-line max-len
                                        } : undefined,
                                    }),
                                },
                            }),
                        },
                    ],
                },
                // SVG files
                {
                    test: /\.svg$/,
                    use: [
                        require.resolve('raw-loader'),
                        {
                            loader: require.resolve('svgo-loader'),
                            options: {
                                plugins: [
                                    { removeTitle: true },
                                    { removeDimensions: true },
                                    { removeViewBox: false },
                                    { cleanupIDs: false },
                                ],
                            },
                        },
                        // Uniquify classnames and ids so they don't conflict with each other
                        {
                            loader: require.resolve('svg-css-modules-loader'),
                            options: {
                                transformId: true,
                            },
                        },
                    ],
                },
                // Web fonts
                {
                    test: /\.(woff|woff2)$/,
                    loader: require.resolve('file-loader'),
                    options: {
                        name: 'fonts/[name].[ext]',
                        // Do not emit fonts as they will be inlined to avoid Content Security Policy errors
                        emitFile: false,
                    },
                },
            ],
        },
        plugins: [
            // Assign __DISCUSSIFY_HOST_ELEMENT_ID__ to the background entry, which is used by the script-injector
            new BannerPlugin({
                banner: 'window.__DISCUSSIFY_HOST_ELEMENT_ID__ = \'discussify-host\';',
                raw: true,
                entryOnly: true,
                include: /background/,
            }),
            // Create host element on the content-script entry with a shadow-dom
            // so that styles are isolated from the webpage
            new BannerPlugin({
                banner: `
                    (() => {
                        const discussifyEl = document.createElement('div');
                        const rootEl = document.createElement('div');

                        discussifyEl.setAttribute('id', 'discussify-host');
                        discussifyEl.attachShadow({ mode: 'open' });
                        rootEl.setAttribute('data-role', 'root');

                        discussifyEl.shadowRoot.appendChild(rootEl);
                        document.body.appendChild(discussifyEl);
                    })();
                    `,
                raw: true,
                entryOnly: true,
                include: /content-script/,
            }),
            // Add support for environment variables under `process.env`
            new DefinePlugin({
                'process.env.NODE_ENV': `"${env}"`,
                DATA_VERSIONS: JSON.stringify(require('../package.json').dataVersions),
            }),
            // Alleviate cases where developers working on OSX, which does not follow strict path case sensitivity
            new CaseSensitivePathsPlugin(),
            // Support reloading extension during development
            isDev && new ChromeExtensionReloader(),
        ].filter(Boolean),
        devtool: isDev ? 'cheap-module-eval-source-map' : 'nosources-source-map',
        optimization: {
            minimize: !isDev,
            minimizer: [
                new TerserPlugin({
                    sourceMap: true,
                    extractComments: true,
                    parallel: true,
                    cache: true,
                    terserOptions: {
                        mangle: true,
                        compress: {
                            warnings: false, // Mute warnings
                            /* eslint-disable camelcase */
                            drop_console: true, // Drop console.* statements
                            drop_debugger: true, // Drop debugger statements
                            /* eslint-enable camelcase */
                        },
                    },
                }),
            ],
        },
        performance: {
            hints: false,
        },
    };
};

module.exports = buildConfig;
