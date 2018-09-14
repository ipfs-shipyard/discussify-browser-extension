import * as messageTypes from './modules/message-types';
import createTabsStore from './modules/tabs-store';

const configureTabsStore = () =>
    createTabsStore((tabId, state) => {
        console.log('sending', tabId, state);
        chrome.tabs.sendMessage(tabId, {
            type: messageTypes.STATE_CHANGE,
            payload: { state },
        });
    });

const setupMethods = (tabsStore) => {
    const methods = {
        setUser: (...args) => tabsStore.setUser(...args),

        setSidebarOpen: (...args) => tabsStore.setSidebarOpen(...args),
    };

    chrome.runtime.onMessage.addListener((request) => {
        if (request.type === messageTypes.METHOD_CALL) {
            const { name, args } = request.payload;

            console.log('exec method', name, args);

            methods[name](...args);
        }
    });
};

const setupTabListeners = (tabsStore) => {
    const tabListeners = {
        onCreated: (tab) => tabsStore.addTab(tab.id),
        onUpdated: (tabId, changeInfo) => {
            console.log('change info', tabId, changeInfo)
        }
    };

    chrome.tabs.onCreated.addListener(tabListeners.onCreated);
    chrome.tabs.onUpdated.addListener(tabListeners.onUpdated);
};

const createExtension = () => {
    const tabsStore = configureTabsStore();

    setupTabListeners(tabsStore);
    setupMethods(tabsStore);
};

export default createExtension;
