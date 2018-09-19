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

    stateOverseer.onBrowserActionChange((tabId, { status, count }) => {
        console.log('onBrowserActionChange', tabId, status);

        browser.browserAction.setBadgeText({
            text: status[0],
            tabId,
        });
    });

    stateOverseer.onInjectScript(async (tabId, sliceState) => {
        store.dispatch(updateTabInjection(tabId, 'inject-pending'));

        try {
            await injectScript(tabId, sliceState);
        } catch (err) {
            return store.dispatch(updateTabInjection(tabId, 'inject-error', err));
        }

        store.dispatch(updateTabInjection(tabId, 'inject-success'));
    });

    stateOverseer.onRemoveScript(async (tabId, sliceState) => {
        store.dispatch(updateTabInjection(tabId, 'remove-pending'));

        try {
            await removeScript(tabId, sliceState);
        } catch (err) {
            return store.dispatch(updateTabInjection(tabId, 'remove-error', err));
        }

        store.dispatch(updateTabInjection(tabId, 'remove-success'));
    });

    stateOverseer.onSliceStateChange((tabId, sliceState) => {
        console.log('onSliceStateChange', tabId);

        browser.tabs.sendMessage(tabId, {
            type: messageTypes.CALL_CLIENT_METHOD,
            payload: {
                name: 'setSliceState',
                args: [sliceState],
            },
        });
    });
};

const setupMethods = (store) => {
    const methods = {
        setUser: (user) => store.dispatch(setUser(user)),
    };

    browser.runtime.onMessage.addListener((request) => {
        if (request.type === messageTypes.CALL_BACKGROUND_METHOD) {
            const { name, args } = request.payload;

            if (methods[name]) {
                methods[name](...args);
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

const setupInstallListeners = () => {
    // TODO:
    browser.runtime.onInstalled.addListener(({ reason }) => {
        console.log('onInstalled2', reason);
    });
};

const createExtension = async () => {
    const store = await setupStore();

    setupStateOverseer(store);
    setupTabListeners(store);
    setupMethods(store);
    setupBrowserAction(store);
    setupInstallListeners(store);
};

export default createExtension;

export { messageTypes };
