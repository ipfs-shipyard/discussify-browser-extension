'use strict';

const browser = require('webextension-polyfill');

global.browser = global.browser || browser;
