'use strict';

const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const buildConfig = (env) => {
    const projectDir = path.resolve(__dirname, '..');
    const isDev = env === 'development';

    return {
        context: projectDir,
        mode: env,
        entry: {
            background: path.join(projectDir, 'src/chrome/background.js'),
            'content-script': path.join(projectDir, 'src/chrome/content-script.js'),
        },
        output: {
            path: path.join(projectDir, 'dist/build'),
            publicPath: '.',
            filename: '[name].js',
            chunkFilename: '[id].chunk.js',
            libraryTarget: 'umd',
        },
        resolve: {
            // Allow symlinked packages to work normally, e.g.: when linking @discussify/styleguide
            symlinks: false,
        },
        module: {
            rules: [
                // JS files
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: {
                                cacheDirectory: path.join(projectDir, 'node_modules/.cache/babel-loader'),
                                presets: [
                                    [require.resolve('babel-preset-moxy'), {
                                        targets: {
                                            browsers: [
                                                'last 2 Chrome versions',
                                                'last 2 Firefox versions',
                                            ],
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
                // Raster images (png, jpg, etc)
                {
                    test: /\.(png|jpg|jpeg|gif|webp)$/,
                    loader: require.resolve('file-loader'),
                    options: {
                        name: 'images/[name].[ext]',
                    },
                },
                // Web fonts
                {
                    test: /\.(eot|ttf|woff|woff2|otf)$/,
                    loader: require.resolve('file-loader'),
                    options: {
                        name: 'fonts/[name].[ext]',
                    },
                },
            ],
        },
        plugins: [
            // Add support for environment variables under `process.env`
            new DefinePlugin({
                'process.env.NODE_ENV': `"${env}"`,
            }),
            // Alleviate cases where developers working on OSX, which does not follow strict path case sensitivity
            new CaseSensitivePathsPlugin(),
            // Support reloading extension during development
            isDev && new ChromeExtensionReloader(),
        ].filter(Boolean),
        devtool: 'cheap-module-eval-source-map',
        optimization: {
            minimize: false,
        },
    };
};

module.exports = buildConfig;
