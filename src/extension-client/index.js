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

        ensureState: async () => {
            if (state) {
                return;
            }

            const newState = await methods.getState();

            if (!state) {
                console.log('onStateChange from ensureState', location.host, newState);

                state = newState;
                callListeners(listeners.onStateChange, newState);
            }
        },

        getState: () => state,

        onStateChange: (fn) => registerListener(listeners.onStateChange, fn),

        destroy: () => {
            browser.runtime.onMessage.removeListener(handleMessage);
        },
    };
};

export default createExtensionClient;
