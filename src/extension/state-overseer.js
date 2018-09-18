import {
    getTabIds,
    hasTabChanged,
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

const shouldUpdateBrowserAction = (state, previousState, tabId) => {
    const tabEnabled = isTabEnabled(state, tabId);
    const previousTabEnabled = isTabEnabled(previousState, tabId);
    const tabInjectionStatus = getTabInjectionStatus(state, tabId);
    const previousInjectionStatus = getTabInjectionStatus(previousState, tabId);

    return tabEnabled !== previousTabEnabled ||
           tabInjectionStatus !== previousInjectionStatus;
};

const computeBrowserAction = (state, tabId) => {
    const tabInjectionStatus = getTabInjectionStatus(state, tabId);
    let status;

    if (tabInjectionStatus === 'inject-error' || tabInjectionStatus === 'remove-error') {
        status = 'error';
    } else if (tabInjectionStatus === 'inject-pending' || tabInjectionStatus === 'remove-pending') {
        status = 'loading';
    } else if (isTabEnabled(state, tabId)) {
        status = 'enabled';
    } else {
        status = 'disabled';
    }

    return {
        status,
        count: null,
    };
};

const wrapHandlerWithSetImmediate = (handler) =>
    (...args) => setImmediate(() => handler(...args));

const createStateOverseer = (store) => {
    let previousState;

    const handlers = {
        onInjectScript: () => {},
        onRemoveScript: () => {},
        onBrowserActionChange: () => {},
        onSliceStateChange: () => {},
    };

    const handleStateChange = () => {
        const state = store.getState();
        const tabIds = getTabIds(state);

        tabIds.forEach((tabId) => checkTabState(state, tabId));

        previousState = state;
    };

    const checkTabState = (state, tabId) => {
        if (!hasTabChanged(state, previousState, tabId)) {
            return;
        }

        if (shouldInjectScriptIntoTab(state, tabId)) {
            handlers.onInjectScript(tabId);
        } else if (shouldRemoveScriptFromTab(state, tabId)) {
            handlers.onRemoveScript(tabId);
        } else if (shouldUpdateBrowserAction(state, previousState, tabId)) {
            handlers.onBrowserActionChange(tabId, computeBrowserAction(state, tabId));
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
    };
};

export default createStateOverseer;
