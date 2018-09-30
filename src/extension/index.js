import queryString from 'query-string';
import * as messageTypes from './message-types';
import { injectScript, removeScript } from './script-injector';
import { readState, writeState } from './state-storage';
import createStateOverseer from './state-overseer';
import configureStore, {
    setUser,
    addTab,
    replaceTab,
    removeTab,
    setTabReady,
    toggleTabEnabled,
    updateTabInjection,
    setTabSidebarOpen,
} from './store';

const setupStore = async () => {
    const state = await readState();
    const store = configureStore(state);

    store.subscribe(() => {
        writeState(store.getState());
    });

    return store;
};

const setupStateOverseer = (store) => {
    const stateOverseer = createStateOverseer(store);

    stateOverseer.onBrowserActionChange(async (tabId, { status, error, count }) => {
        console.info('onBrowserActionChange', { tabId, status, error, count });

        // Update icon & badge
        let icon;

        switch (status) {
        case 'disabled':
            icon = 'icons/discussify-gray.svg';
            break;
        case 'error':
            icon = 'icons/discussify-error.svg';
            break;
        default:
            icon = 'icons/discussify-blue.svg';
        }

        await browser.browserAction.setIcon({ tabId, path: icon });
        await browser.browserAction.setBadgeText({ text: count ? count.toString() : '', tabId });
        await browser.browserAction.setBadgeBackgroundColor({ color: '#0a6adb', tabId });

        // Disable if loading to avoid double injections/removals
        if (status === 'loading') {
            await browser.browserAction.disable();
        } else {
            await browser.browserAction.enable();
        }

        // Setup popup based on the error
        await browser.browserAction.setPopup({
            tabId,
            popup: error ?
                `error-popup.html?${queryString.stringify({
                    tabId,
                    message: error.message,
                    code: error.code,
                })}` :
                '',
        });
    });

    stateOverseer.onInjectScript(async (tabId, sliceState) => {
        console.info('onInjectScript', { tabId, sliceState });

        store.dispatch(updateTabInjection(tabId, 'inject-pending'));

        try {
            await injectScript(tabId, sliceState);
        } catch (err) {
            return store.dispatch(updateTabInjection(tabId, 'inject-error', err));
        }

        store.dispatch(updateTabInjection(tabId, 'inject-success'));
    });

    stateOverseer.onRemoveScript(async (tabId, sliceState) => {
        console.info('onRemoveScript', { tabId, sliceState });

        store.dispatch(updateTabInjection(tabId, 'remove-pending'));

        try {
            await removeScript(tabId, sliceState);
        } catch (err) {
            return store.dispatch(updateTabInjection(tabId, 'remove-error', err));
        }

        store.dispatch(updateTabInjection(tabId, 'remove-success'));
    });

    stateOverseer.onSliceStateChange(async (tabId, sliceState) => {
        console.info('onSliceStateChange', { tabId, sliceState });

        await browser.tabs.sendMessage(tabId, {
            type: messageTypes.CALL_CLIENT_METHOD,
            payload: {
                name: 'setSliceState',
                args: [sliceState],
            },
        });
    });

    stateOverseer.onAuthenticatedChange(async (authenticated) => {
        console.log('onAuthenticatedChange', authenticated);

        await browser.contextMenus.update('logout', {
            enabled: authenticated,
        });
    });
};

const setupMethods = (store) => {
    const methods = {
        setUser: (tabId, user) => store.dispatch(setUser(user)),
        setSidebarOpen: (tabId, open) => store.dispatch(setTabSidebarOpen(tabId, open)),
        dismissInjectionError: (tabId) => store.dispatch(updateTabInjection(tabId, null, null)),
    };

    browser.runtime.onMessage.addListener((request, sender) => {
        if (request.type === messageTypes.CALL_BACKGROUND_METHOD) {
            const { name, args } = request.payload;
            const tabId = request.payload.tabId || sender.tab.id;

            if (methods[name]) {
                methods[name](tabId, ...args);
            } else {
                throw Object.assign(
                    new Error(`Unknown method: ${name}`),
                    { code: 'UNKNOWN_METHOD' }
                );
            }
        }
    });
};

const setupTabListeners = (store) => {
    browser.tabs.onCreated.addListener((tab) => {
        store.dispatch(addTab(tab.id));
    });
    browser.tabs.onRemoved.addListener((tabId) => {
        store.dispatch(removeTab(tabId));
    });
    browser.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
        store.dispatch(replaceTab(addedTabId, removedTabId));
    });
    browser.tabs.onUpdated.addListener((tabId, info) => {
        if (info.status === 'loading') {
            store.dispatch(setTabReady(tabId, false));
        } else if (info.status === 'complete') {
            store.dispatch(setTabReady(tabId, true));
        }
    });
};

const setupBrowserAction = (store) => {
    browser.browserAction.onClicked.addListener((tab) => {
        store.dispatch(toggleTabEnabled(tab.id));
    });
};

const setupContextMenus = async (store) => {
    await browser.contextMenus.removeAll();

    await browser.contextMenus.create({
        id: 'logout',
        title: 'Logout',
        contexts: ['browser_action'],
        enabled: false,
    });

    browser.contextMenus.onClicked.addListener((info) => {
        if (info.menuItemId === 'logout') {
            store.dispatch(setUser(null));
        }
    });
};

const createExtension = async () => {
    const store = await setupStore();

    await setupContextMenus(store);

    setupStateOverseer(store);
    setupTabListeners(store);
    setupMethods(store);
    setupBrowserAction(store);
};

export default createExtension;

export { messageTypes };
