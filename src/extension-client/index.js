import { SET_CLIENT_STATE } from '../extension-background/message-types';
import createMethods from './methods';

const registerListener = (listenersSet, fn) => {
    listenersSet.add(fn);

    return () => listenersSet.delete(fn);
};

const callListeners = (listenersSet, ...args) => {
    listenersSet.forEach((fn) => fn(...args));
};

const createExtensionClient = (options) => {
    options = {
        initialState: null,
        tabId: null,
        ...options,
    };

    let state = options.initialState;

    const methods = createMethods(options.tabId);

    const listeners = {
        onStateChange: new Set(),
    };

    const handleMessage = (request) => {
        if (request.type === SET_CLIENT_STATE) {
            const { state: newState } = request.payload;

            state = {
                ...state,
                ...newState,
            };

            console.log('onStateChange', location.host, state);
            callListeners(listeners.onStateChange, state);
        }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    return {
        ...methods,

        syncState: async () => {
            state = await methods.syncState();

            console.log('onStateChange from sync', location.host, state);
            callListeners(listeners.onStateChange, state);

            return state;
        },

        getState: () => state,

        onStateChange: (fn) => registerListener(listeners.onStateChange, fn),

        destroy: () => {
            browser.runtime.onMessage.removeListener(handleMessage);
        },
    };
};

export default createExtensionClient;
