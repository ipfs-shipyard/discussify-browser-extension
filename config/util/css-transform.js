/* globals window:false, document:false */

'use strict';

// This transform is used by style-loader and has the goal of keeping 1rem = 10px in web pages
// Because we don't own the pages were the content-script will be injected, we need to fix all
// `rem` by multiplying it with the rem ratio

const fontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 10;
const fontSizeRemRatio = 10 / fontSize;

const transform = (cssText) =>
    cssText.replace(/\b(\d+(?:\.\d+)?)rem\b/gm, `calc($1rem * ${fontSizeRemRatio})`);

module.exports = transform;
