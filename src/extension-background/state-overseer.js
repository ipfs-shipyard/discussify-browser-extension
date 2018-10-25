import shallowEqual from 'shallowequal';
import { reduce, size, throttle } from 'lodash';
import buildClientState from './util/client-state';
import { isAuthenticated } from './store/session';
import {
    getTabIds,
    getTabState,
    isTabReady,
    isTabEnabled,
    getTabUrl,
    getTabDiscussionId,
    getTabInjectionStatus,
    getTabInjectionError,
} from './store/tabs';

const wrappedFnSymbol = Symbol('wrapped-fn');

const registerListener = (listenersSet, fn) => {
    // Wrap fn in setImmediate to avoid circular loops of listener -> state change -> listener -> ...
    const wrappedFn = (...args) => setImmediate(() => fn(...args));

    fn[wrappedFnSymbol] = wrappedFn;
    listenersSet.add(fn);

    return () => listenersSet.delete(fn);
};

const callListeners = (listenersSet, ...args) => {
    listenersSet.forEach((fn) => fn[wrappedFnSymbol](...args));
};

const shouldInjectScriptIntoTab = (state, tabId) => {
    const injectionStatus = getTabInjectionStatus(state, tabId);

    return isTabReady(state, tabId) &&
           isTabEnabled(state, tabId) &&
           (!injectionStatus || injectionStatus === 'remove-success');
};

const shouldRemoveScriptFromTab = (state, tabId) => {
    const injectionStatus = getTabInjectionStatus(state, tabId);

    return isTabReady(state, tabId) &&
           !isTabEnabled(state, tabId) &&
           injectionStatus === 'inject-success';
};

const buildTabBrowserAction = (state, tabId) => {
    const tabInjectionStatus = getTabInjectionStatus(state, tabId);
    let status;

    if (tabInjectionStatus === 'inject-error' || tabInjectionStatus === 'remove-error') {
        status = 'error';
    } else if (isTabEnabled(state, tabId) && (tabInjectionStatus === 'inject-success' || tabInjectionStatus === 'inject-pending')) {
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

const getTabUrlForMetadata = (state, tabId) => {
    const tabInjectionStatus = getTabInjectionStatus(state, tabId);
    const url = getTabUrl(state, tabId);

    return tabInjectionStatus === 'inject-pending' || tabInjectionStatus === 'inject-success' ?
        url :
        null;
};

const shouldTabHaveDiscussion = (state, tabId) => {
    const tabInjectionStatus = getTabInjectionStatus(state, tabId);
    const tabDiscussionId = getTabDiscussionId(state, tabId);

    return tabDiscussionId != null &&
           (tabInjectionStatus === 'inject-pending' || tabInjectionStatus === 'inject-success');
};

const buildClientStateDiff = (clientState, previousClientState) => {
    const diff = reduce(clientState, (diff, value, key) => {
        const previousValue = previousClientState && previousClientState[key];

        if (!shallowEqual(value, previousValue)) {
            diff[key] = value;
        }

        return diff;
    }, {});

    return size(diff) > 0 ? diff : null;
};

const checkUserState = (listeners, state, previousState) => {
    // Check if the authenticated state changed
    const previousAuthenticated = previousState && isAuthenticated(previousState);
    const authenticated = isAuthenticated(state);

    if (authenticated !== previousAuthenticated) {
        callListeners(listeners.onAuthenticatedChange, authenticated);
    }
};

const checkTabState = (listeners, state, previousState, tabId) => {
    // Short-circuit if the tab hasn't changed
    if (!previousState || getTabState(state, tabId) !== getTabState(previousState, tabId)) {
        // Check if script should be injected/removed
        const injectScript = shouldInjectScriptIntoTab(state, tabId);

        if (injectScript) {
            const previousInjectScript = previousState && shouldInjectScriptIntoTab(previousState, tabId);

            if (injectScript !== previousInjectScript) {
                callListeners(listeners.onInjectOrRemoveScript, tabId, 'inject', buildClientState(state, tabId));
            }
        } else {
            const removeScript = shouldRemoveScriptFromTab(state, tabId);
            const previousRemoveScript = previousState && shouldRemoveScriptFromTab(previousState, tabId);

            if (removeScript && removeScript !== previousRemoveScript) {
                callListeners(listeners.onInjectOrRemoveScript, tabId, 'remove');
            }
        }

        // Check if browser action changed
        const browserAction = buildTabBrowserAction(state, tabId);
        const previousBrowserAction = previousState && buildTabBrowserAction(previousState, tabId);

        if (!shallowEqual(browserAction, previousBrowserAction)) {
            callListeners(listeners.onBrowserActionChange, tabId, browserAction);
        }

        // Check if the metadata should be fetched
        const url = getTabUrlForMetadata(state, tabId);
        const previousUrl = previousState && getTabUrlForMetadata(previousState, tabId);

        if (url && url !== previousUrl) {
            callListeners(listeners.onUpdateMetadata, tabId, url);
        }

        // Check if we should start/stop the discussion
        const hasDiscussion = shouldTabHaveDiscussion(state, tabId);
        const previousHasDiscussion = previousState && shouldTabHaveDiscussion(previousState, tabId);

        if (hasDiscussion && !previousHasDiscussion) {
            callListeners(listeners.onStartOrStopDiscussion, tabId, getTabDiscussionId(state, tabId), 'start');
        } else if (!hasDiscussion && previousHasDiscussion) {
            callListeners(listeners.onStartOrStopDiscussion, tabId, getTabDiscussionId(previousState, tabId), 'stop');
        }
    }

    // Check if client state changed, skipping if the extension is not injected
    const tabsInjectionStatus = getTabInjectionStatus(state, tabId);

    if (tabsInjectionStatus === 'inject-pending' || tabsInjectionStatus === 'inject-success') {
        const clientState = buildClientState(state, tabId);
        const previousClientState = buildClientState(previousState, tabId);
        const diffClientState = buildClientStateDiff(clientState, previousClientState);

        if (diffClientState) {
            callListeners(listeners.onClientStateChange, tabId, diffClientState);
        }
    }
};

const createStateOverseer = (store) => {
    let previousState = null;

    const listeners = {
        onInjectOrRemoveScript: new Set(),
        onBrowserActionChange: new Set(),
        onAuthenticatedChange: new Set(),
        onUpdateMetadata: new Set(),
        onStartOrStopDiscussion: new Set(),
        onClientStateChange: new Set(),
    };

    const handleStateChange = () => {
        const state = store.getState();
        const tabIds = getTabIds(state);

        checkUserState(listeners, state, previousState);
        tabIds.forEach((tabId) => checkTabState(listeners, state, previousState, tabId));

        previousState = state;
    };
    const throttledHandleStateChange = throttle(handleStateChange, 50);

    store.subscribe(throttledHandleStateChange);

    setImmediate(handleStateChange);

    return {
        onAuthenticatedChange: (fn) => registerListener(listeners.onAuthenticatedChange, fn),
        onInjectOrRemoveScript: (fn) => registerListener(listeners.onInjectOrRemoveScript, fn),
        onBrowserActionChange: (fn) => registerListener(listeners.onBrowserActionChange, fn),
        onUpdateMetadata: (fn) => registerListener(listeners.onUpdateMetadata, fn),
        onStartOrStopDiscussion: (fn) => registerListener(listeners.onStartOrStopDiscussion, fn),
        onClientStateChange: (fn) => registerListener(listeners.onClientStateChange, fn),
    };
};

export default createStateOverseer;
