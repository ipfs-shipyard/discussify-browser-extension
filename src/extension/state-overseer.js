import shallowEqual from 'shallow-equal/objects';
import {
    initialState,
    getTabIds,
    isAuthenticated,
    getUser,
    isTabReady,
    isTabEnabled,
    getTabInjectionStatus,
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
        count: null, // TODO:
    };
};

const computeSliceState = (state) => ({
    user: getUser(state),
});

const wrapHandlerWithSetImmediate = (handler) =>
    (...args) => setImmediate(() => handler(...args));

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

        // Check if slice state changed, skipping if the content-
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
            handlers.onInjectScript = wrapHandlerWithSetImmediate(handler);
        },
        onRemoveScript: (handler) => {
            handlers.onRemoveScript = wrapHandlerWithSetImmediate(handler);
        },
        onBrowserActionChange: (handler) => {
            handlers.onBrowserActionChange = wrapHandlerWithSetImmediate(handler);
        },
        onSliceStateChange: (handler) => {
            handlers.onSliceStateChange = wrapHandlerWithSetImmediate(handler);
        },
        onAuthenticatedChange: (handler) => {
            handlers.onAuthenticatedChange = wrapHandlerWithSetImmediate(handler);
        },
    };
};

export default createStateOverseer;
