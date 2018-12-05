#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const template = require('lodash/template');
const argv = require('yargs')
.alias('h', 'help')
.help('help')
.usage('Usage: $0 <distDir> [options]')
.example('$0 dist/chrome --manifest.target=chrome')
.demand(1)
.showHelpOnFail(false, 'Specify --help for available options')
.options({
    t: {
        alias: 'manifest.target',
        describe: 'defines target browser',
        type: 'string',
        nargs: 1,
        demand: true,
        demand: 'target is required',
    },
})
.argv;

const templateDir = 'dist-template/';
const distDir = argv._[0];
const manifestOptions = argv.manifest;

// Clean distDir by removing it
fs.removeSync(distDir);

// Copy content from 'dist-template/' folder to distDir
fs.copySync(templateDir, distDir);

// Interpolate manifest template
const manifestTemplate = fs.readFileSync(path.join(__dirname, `${distDir}/manifest.json`));
const finalManifest = template(manifestTemplate)({ options: manifestOptions }).replace(/^\s*\r?\n/gm, '');

fs.writeFileSync(path.join(__dirname, `${distDir}/manifest.json`), finalManifest);
