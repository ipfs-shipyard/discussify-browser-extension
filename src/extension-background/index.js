import queryString from 'query-string';
import { get } from 'lodash';
import createPeerStarApp from 'peer-star-app';
import { CALL_BACKGROUND_METHOD, SET_CLIENT_STATE } from './message-types';
import { injectScript, removeScript } from './script-injector';
import { readState, writeState } from './state-storage';
import createStateOverseer from './state-overseer';
import createMethods from './methods';
import configureStore from './store';
import { unauthenticate } from './store/session';
import { startDiscussion, stopDiscussion } from './store/discussions';
import {
    addTab,
    removeTab,
    setTabMetadata,
    markTabAsReady,
    unmarkTabAsReady,
    toggleTabEnabled,
    updateTabInjection,
    getTabInjectionStatus,
} from './store/tabs';
import buildTabMetadata from './util/tab-metadata';

const setupPeerStarApp = () => {
    const app = createPeerStarApp('Discussify');

    app.on('error', (err) => console.error('Error in peer-star-app', err));

    return app;
};

const setupStore = async (peerStarApp) => {
    const initialState = await readState();
    const store = configureStore(peerStarApp, initialState);

    store.subscribe(() => {
        writeState(store.getState());
    });

    return store;
};

const setupStateOverseer = (store) => {
    const stateOverseer = createStateOverseer(store);

    stateOverseer.onAuthenticatedChange(async (authenticated) => {
        console.log('onAuthenticatedChange', { authenticated });

        await browser.contextMenus.update('logout', {
            enabled: authenticated,
        });
    });

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

    stateOverseer.onInjectOrRemoveScript(async (tabId, injectOrRemove, clientState) => {
        console.info('onInjectOrRemoveScript', { tabId, injectOrRemove, clientState });

        store.dispatch(updateTabInjection(tabId, `${injectOrRemove}-pending`));

        try {
            if (injectOrRemove === 'inject') {
                await injectScript(tabId, clientState);
            } else {
                await removeScript(tabId);
            }
        } catch (err) {
            return store.dispatch(updateTabInjection(tabId, `${injectOrRemove}-error`, err));
        }

        store.dispatch(updateTabInjection(tabId, `${injectOrRemove}-success`));
    });

    stateOverseer.onClientStateChange(async (tabId, clientState) => {
        console.info('onClientStateChange', { tabId, clientState });

        try {
            await browser.tabs.sendMessage(tabId, {
                type: SET_CLIENT_STATE,
                payload: {
                    state: clientState,
                },
            });
        } catch (error) {
            // Ignore any clients that disconnected meanwhile
            if (error.message.includes('disconnected port')) {
                return;
            }

            throw error;
        }
    });

    stateOverseer.onStartOrStopDiscussion(async (tabId, discussionId, startOrStop) => {
        console.log('onStartOrStopDiscussion', { tabId, startOrStop });

        if (startOrStop === 'start') {
            await store.dispatch(startDiscussion(discussionId, tabId));
        } else {
            await store.dispatch(stopDiscussion(discussionId, tabId));
        }
    });

    stateOverseer.onUpdateMetadata(async (tabId) => {
        console.log('onUpdateMetadata', { tabId });

        // TODO: deal with metadata errors
        store.dispatch(setTabMetadata(tabId, await buildTabMetadata(tabId)));
    });

    return stateOverseer;
};

const setupMethods = (store) => {
    const methods = createMethods(store);

    browser.runtime.onMessage.addListener((request, sender) => {
        if (request.type === CALL_BACKGROUND_METHOD) {
            const { name, args } = request.payload;
            const method = get(methods, name);
            const tabId = request.payload.tabId || sender.tab.id;

            if (!method) {
                throw Object.assign(
                    new Error(`Unknown method: ${name}`),
                    { code: 'UNKNOWN_METHOD' }
                );
            }

            return Promise.resolve(method(tabId, ...args));
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
    browser.tabs.onUpdated.addListener((tabId, info, tab) => {
        if (info.status === 'loading') {
            store.dispatch(unmarkTabAsReady(tabId));
        } else if (info.status === 'complete') {
            store.dispatch(markTabAsReady(tabId, tab.url));
        }
    });

    // TODO: listen to url change
    // store.dispatch(changeTabUrl(tabId, tab.url));
    // store.dispatch(setTabMetadata(tabId, await buildTabMetadata(tabId)));
};

const setupBrowserAction = (store) => {
    browser.browserAction.onClicked.addListener((tab) => {
        const tabInjectionStatus = getTabInjectionStatus(store.getState(), tab.id);

        // Ignore any clicks while we are injecting or removing
        if (tabInjectionStatus === 'inject-pending' || tabInjectionStatus === 'remove-pending') {
            return;
        }

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
            store.dispatch(unauthenticate());
        }
    });
};

const createExtensionBackground = async () => {
    const peerStarApp = setupPeerStarApp();
    const store = await setupStore(peerStarApp);

    await setupContextMenus(store);

    setupStateOverseer(store);
    setupTabListeners(store);
    setupMethods(store);
    setupBrowserAction(store);
};

export default createExtensionBackground;
