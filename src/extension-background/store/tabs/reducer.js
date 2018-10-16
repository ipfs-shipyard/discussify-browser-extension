import { omit } from 'lodash';
import serializeError from 'serialize-error';
import * as actionTypes from './action-types';

const initialState = {};

const initialTabState = {
    // Indicates if the tab is ready and that the extension can be installed
    ready: false,
    // Indicates if the extension is enabled on this tab
    enabled: false,
    // Indicates the injection status, one of:
    // 'inject-pending', 'inject-success', 'inject-error',
    // 'remove-pending', 'remove-success', 'remove-error'
    injectionStatus: null,
    // The injection error object in case the status is 'inject-error' or `remove-error`
    injectionError: null,
    // Indicates if the sidebar is open
    sidebarOpen: false,
    // Tab tab URL
    url: null,
    // The metadata the tab, an object with the title, description, favicon, canonicalUrl and discussionId
    metadata: null,
};

const addTab = (state, action) => {
    const { tabId } = action.payload;

    return {
        ...state,
        [tabId]: initialTabState,
    };
};

const removeTab = (state, action) => {
    const { tabId } = action.payload;

    return omit(state, tabId);
};

const markTabAsReady = (state, action) => {
    const { tabId, url } = action.payload;
    const tabState = state[tabId] || initialTabState;

    console.log(url);

    return {
        ...state,
        [tabId]: {
            ...tabState,
            ready: true,
            sidebarOpen: false,
            injectionStatus: null,
            injectionError: null,
            url,
            metadata: null,
        },
    };
};

const unmarkTabAsReady = (state, action) => {
    const { tabId } = action.payload;
    const tabState = state[tabId] || initialTabState;

    return {
        ...state,
        [tabId]: {
            ...tabState,
            ready: false,
            sidebarOpen: false,
            injectionStatus: null,
            injectionError: null,
            url: null,
            metadata: null,
        },
    };
};

const setTabMetadata = (state, action) => {
    const { tabId, metadata } = action.payload;
    const tabState = state[tabId] || initialTabState;

    return {
        ...state,
        [tabId]: {
            ...tabState,
            metadata,
        },
    };
};

const toggleTabEnabled = (state, action) => {
    const { tabId } = action.payload;
    const tabState = state[tabId] || initialTabState;

    return {
        ...state,
        [tabId]: {
            ...tabState,
            enabled: !tabState.enabled,
            sidebarOpen: false,
        },
    };
};

const updateTabInjection = (state, action) => {
    const { tabId, status, error } = action.payload;
    const tabState = state[tabId] || initialTabState;

    return {
        ...state,
        [tabId]: {
            ...tabState,
            enabled: error ? false : tabState.enabled,
            injectionStatus: status,
            injectionError: error ? serializeError(error) : null,
        },
    };
};

const dismissTabInjectionError = (state, action) => {
    const { tabId } = action.payload;
    const tabState = state[tabId] || initialTabState;

    return {
        ...state,
        [tabId]: {
            ...tabState,
            injectionStatus: null,
            injectionError: null,
        },
    };
};

const openSidebar = (state, action) => {
    const { tabId } = action.payload;
    const tabState = state[tabId] || initialTabState;

    return {
        ...state,
        [tabId]: {
            ...tabState,
            sidebarOpen: true,
        },
    };
};

const closeSidebar = (state, action) => {
    const { tabId } = action.payload;
    const tabState = state[tabId] || initialTabState;

    return {
        ...state,
        [tabId]: {
            ...tabState,
            sidebarOpen: false,
        },
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.ADD_TAB:
        return addTab(state, action);
    case actionTypes.REMOVE_TAB:
        return removeTab(state, action);
    case actionTypes.MARK_TAB_AS_READY:
        return markTabAsReady(state, action);
    case actionTypes.UNMARK_TAB_AS_READY:
        return unmarkTabAsReady(state, action);
    case actionTypes.TOGGLE_TAB_ENABLED:
        return toggleTabEnabled(state, action);
    case actionTypes.SET_TAB_METADATA:
        return setTabMetadata(state, action);
    case actionTypes.UPDATE_TAB_INJECTION:
        return updateTabInjection(state, action);
    case actionTypes.DISMISS_TAB_INJECTION_ERROR:
        return dismissTabInjectionError(state, action);
    case actionTypes.OPEN_SIDEBAR:
        return openSidebar(state, action);
    case actionTypes.CLOSE_SIDEBAR:
        return closeSidebar(state, action);
    default:
        return state;
    }
};

export default reducer;
export { initialTabState };
