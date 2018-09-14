import createExtension from './extension';

console.log('background');

createExtension({
    chromeRuntime: chrome.runtime,
    chromeTabs: chrome.tabs,
});
