/* eslint-disable prefer-import/prefer-import-over-require */

const path = require('path');

module.exports = {
    webpack: (config, env) => {
        // Allow symlinked packages to work normally
        config.resolve.symlinks = false;

        // Add support for PostCSS
        config = require('react-app-rewire-postcss')(config);

        // Add support for CSS modules
        config = require('react-app-rewire-css-modules-extensionless').webpack(config, env, {
            include: [
                path.join(__dirname, 'src'),
                path.join(__dirname, 'node_modules/@discussify/styleguide'),
            ],
            camelCase: 'dashes',
        });

        // Create svg sprites
        config = require('react-app-rewire-external-svg-loader')(config, env, {
            include: [
                path.join(__dirname, 'src'),
                path.join(__dirname, 'node_modules/@discussify/styleguide'),
            ],
        });

        return config;
    },
    jest: (config) => {
        // Add support for css modules
        config = require('react-app-rewire-css-modules-extensionless').jest(config);

        return config;
    },
};
