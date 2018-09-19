import {
    getTabIds,
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

const shouldNotifyBrowserAction = (state, previousState, tabId) =>
    isTabReady(state, tabId) !== isTabReady(previousState, tabId) ||
    isTabEnabled(state, tabId) !== isTabEnabled(previousState, tabId) ||
    getTabInjectionStatus(state, tabId) !== getTabInjectionStatus(previousState, tabId);

const shouldNotifySliceStateChange = (state, previousState, tabId) =>
    getUser(state) !== getUser(previousState) &&
    isTabReady(state, tabId) &&
    isTabEnabled(state, tabId);

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
        count: null, // TODO:
    };
};

const computeSliceState = (state) => ({
    user: getUser(state),
});

const wrapHandlerWithSetImmediate = (handler) =>
    (...args) => setImmediate(() => handler(...args));

const createStateOverseer = (store) => {
    let previousState = store.getState();

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
        if (shouldInjectScriptIntoTab(state, tabId)) {
            handlers.onInjectScript(tabId);
        } else if (shouldRemoveScriptFromTab(state, tabId)) {
            handlers.onRemoveScript(tabId);
        }

        if (shouldNotifyBrowserAction(state, previousState, tabId)) {
            handlers.onBrowserActionChange(tabId, computeBrowserAction(state, tabId));
        }

        if (shouldNotifySliceStateChange(state, previousState, tabId)) {
            handlers.onSliceStateChange(tabId, computeSliceState(state, tabId));
        }
    };

    store.subscribe(handleStateChange);

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
