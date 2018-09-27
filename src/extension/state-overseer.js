import shallowEqual from 'shallow-equal/objects';
import {
    initialState,
    getTabIds,
    isAuthenticated,
    getUser,
    isTabReady,
    isTabEnabled,
    getTabInjectionStatus,
    getTabInjectionError,
} from './store';

const shouldInjectScriptIntoTab = (state, tabId) => {
    const tabInjectionStatus = getTabInjectionStatus(state, tabId);

    return isTabReady(state, tabId) &&
           isTabEnabled(state, tabId) &&
           (!tabInjectionStatus || tabInjectionStatus === 'remove-success');
};

const shouldRemoveScriptFromTab = (state, tabId) => {
    const tabInjectionStatus = getTabInjectionStatus(state, tabId);

    return isTabReady(state, tabId) &&
           !isTabEnabled(state, tabId) &&
           tabInjectionStatus === 'inject-success';
};

const computeBrowserAction = (state, tabId) => {
    const tabInjectionStatus = getTabInjectionStatus(state, tabId);
    let status;

    if (tabInjectionStatus === 'inject-error' || tabInjectionStatus === 'remove-error') {
        status = 'error';
    } else if (tabInjectionStatus === 'inject-pending' || tabInjectionStatus === 'remove-pending') {
        status = 'loading';
    } else if (isTabEnabled(state, tabId) && tabInjectionStatus === 'inject-success') {
        status = 'enabled';
    } else {
        status = 'disabled';
    }

    return {
        status,
        error: getTabInjectionError(state, tabId),
        count: null, // TODO:
    };
};

const computeSliceState = (state) => ({
    user: getUser(state),
});

const wrapHandler = (handler) => {
    let promise;

    // Wrap the handler so that all promises are returned by them are awaited
    return (...args) => {
        // Wait for previous promise
        promise = Promise.resolve(promise)
        // Execute the handler, ignoring any errors
        .then(() => handler(...args))
        .catch((err) => console.error(err))
        // Cleanup the promise chain if we are still the latest promise,
        // This is to avoid memory leaks
        .finally(() => {
            if (thisPromise === promise) {
                promise = null;
            }
        });

        const thisPromise = promise;

        return promise;
    };
};

const createStateOverseer = (store) => {
    let previousState = initialState;

    const handlers = {
        onInjectScript: () => {},
        onRemoveScript: () => {},
        onBrowserActionChange: () => {},
        onSliceStateChange: () => {},
        onAuthenticatedChange: () => {},
    };

    const handleStateChange = () => {
        const state = store.getState();
        const tabIds = getTabIds(state);

        checkCommonState(state, previousState);
        tabIds.forEach((tabId) => checkTabState(state, previousState, tabId));

        previousState = state;
    };

    const checkCommonState = (state, previousState) => {
        // Check if the authenticated state changed
        const previousAuthenticated = isAuthenticated(previousState);
        const authenticated = isAuthenticated(state);

        if (authenticated !== previousAuthenticated) {
            handlers.onAuthenticatedChange(authenticated);
        }
    };

    const checkTabState = (state, previousState, tabId) => {
        // Check if script should be injected/removed
        if (shouldInjectScriptIntoTab(state, tabId)) {
            handlers.onInjectScript(tabId, computeSliceState(state, tabId));
        } else if (shouldRemoveScriptFromTab(state, tabId)) {
            handlers.onRemoveScript(tabId);
        }

        // Check if browser action changed
        const browserAction = computeBrowserAction(state, tabId);
        const previousBrowserAction = computeBrowserAction(previousState, tabId);

        if (!shallowEqual(browserAction, previousBrowserAction)) {
            handlers.onBrowserActionChange(tabId, browserAction);
        }

        // Check if slice state changed, skipping if the extension is not injected
        if (getTabInjectionStatus(state, tabId) === 'inject-success') {
            const sliceState = computeSliceState(state, tabId);
            const previousSliceState = computeSliceState(previousState, tabId);

            if (!shallowEqual(sliceState, previousSliceState)) {
                handlers.onSliceStateChange(tabId, sliceState);
            }
        }
    };

    store.subscribe(handleStateChange);

    setImmediate(handleStateChange);

    return {
        onInjectScript: (handler) => {
            handlers.onInjectScript = wrapHandler(handler);
        },
        onRemoveScript: (handler) => {
            handlers.onRemoveScript = wrapHandler(handler);
        },
        onBrowserActionChange: (handler) => {
            handlers.onBrowserActionChange = wrapHandler(handler);
        },
        onSliceStateChange: (handler) => {
            handlers.onSliceStateChange = wrapHandler(handler);
        },
        onAuthenticatedChange: (handler) => {
            handlers.onAuthenticatedChange = wrapHandler(handler);
        },
    };
};

export default createStateOverseer;
