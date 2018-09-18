import promiseDone from 'promise-done';
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

const setupStore = () => {
    // const store = configureStore(readState());
    const store = configureStore();

    store.subscribe(() => {
        // writeState(store.getState());
    });

    return store;
};

const setupStateOverseer = (store) => {
    const stateOverseer = createStateOverseer(store);

    stateOverseer.onBrowserActionChange((tabId, { status, count }) => {
        browser.browserAction.setBadgeText({
            text: status[0],
            tabId,
        });
    });

    stateOverseer.onInjectScript((tabId, sliceState) => {
        store.dispatch(updateTabInjection(tabId, 'inject-pending'));

        injectScript(tabId, sliceState)
        .then(
            () => store.dispatch(updateTabInjection(tabId, 'inject-success')),
            (err) => store.dispatch(updateTabInjection(tabId, 'inject-error', err))
        )
        .catch(promiseDone);
    });

    stateOverseer.onRemoveScript((tabId) => {
        store.dispatch(updateTabInjection(tabId, 'remove-pending'));

        removeScript(tabId)
        .then(
            () => store.dispatch(updateTabInjection(tabId, 'remove-success')),
            (err) => store.dispatch(updateTabInjection(tabId, 'remove-error', err))
        )
        .catch(promiseDone);
    });

    stateOverseer.onSliceStateChange(() => {});
};

const setupMethods = (store) => {
    const methods = {
        setUser: (user) => store.dispatch(setUser(user)),
        setSidebarOpen: (sidebarOpen) => store.dispatch(setTabSidebarOpen(sidebarOpen)),
    };

    browser.runtime.onMessage.addListener((request) => {
        if (request.type === messageTypes.METHOD_CALL) {
            const { name, args } = request.payload;

            console.log('exec method', name, args);

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
    browser.webNavigation.onBeforeNavigate.addListener(({ tabId, frameId }) => {
        !frameId && store.dispatch(setTabReady(tabId, false));
    });
    browser.webNavigation.onDOMContentLoaded.addListener(({ tabId, frameId }) => {
        !frameId && store.dispatch(setTabReady(tabId, true));
    });
};

const setupBrowserAction = (store) => {
    browser.browserAction.onClicked.addListener((tab) => {
        store.dispatch(toggleTabEnabled(tab.id));
    });
};

const setupInstallListeners = () => {
    browser.runtime.onInstalled.addListener(({ reason }) => {
        console.log('onInstalled', reason);
    });
};

const createExtension = () => {
    const store = setupStore();

    setupStateOverseer(store);
    setupTabListeners(store);
    setupMethods(store);
    setupBrowserAction(store);
    setupInstallListeners(store);
};

export default createExtension;

export { messageTypes };
