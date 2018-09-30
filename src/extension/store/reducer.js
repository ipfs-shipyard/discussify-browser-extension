import { omit } from 'lodash';
import * as actionTypes from './action-types';

export const initialState = {
    // Holds the logged in user
    user: null,
    // Holds the tabs state
    tabs: {},
};

export const initialTabState = {
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
};

const setUser = (state, action) => {
    const { user } = action.payload;

    return {
        ...state,
        user,
    };
};

const addTab = (state, action) => {
    const { tabId } = action.payload;

    return {
        ...state,
        tabs: {
            ...state.tabs,
            [tabId]: initialTabState,
        },
    };
};

const removeTab = (state, action) => {
    const { tabId } = action.payload;

    return {
        ...state,
        tabs: omit(state.tabs, tabId),
    };
};

const replaceTab = (state, action) => {
    const { addedTabId, removedTabId } = action.payload;
    const removedTabState = state.tabs[removedTabId] || initialTabState;
    const addedTabState = state.tabs[addedTabId] || initialTabState;

    const tabs = omit(state.tabs, removedTabId);

    return {
        ...state,
        tabs: {
            ...tabs,
            [addedTabId]: {
                ...addedTabState,
                ready: true,
                enabled: removedTabState.enabled,
                sidebarOpen: removedTabState.sidebarOpen,
            },
        },
    };
};

const setTabReady = (state, action) => {
    const { tabId, ready } = action.payload;
    const tabState = state.tabs[tabId] || initialTabState;

    return {
        ...state,
        tabs: {
            ...state.tabs,
            [tabId]: {
                ...tabState,
                ready,
                sidebarOpen: false,
                injectionStatus: null,
                injectionError: null,
            },
        },
    };
};

const toggleTabEnabled = (state, action) => {
    const { tabId } = action.payload;
    const tabState = state.tabs[tabId] || initialTabState;

    return {
        ...state,
        tabs: {
            ...state.tabs,
            [tabId]: {
                ...tabState,
                enabled: !tabState.enabled,
                sidebarOpen: false,
            },
        },
    };
};

const updateTabInjection = (state, action) => {
    const { tabId, status, error } = action.payload;
    const tabState = state.tabs[tabId] || initialTabState;

    return {
        ...state,
        tabs: {
            ...state.tabs,
            [tabId]: {
                ...tabState,
                enabled: error ? false : tabState.enabled,
                injectionStatus: status,
                injectionError: error || null,
            },
        },
    };
};

const setTabSidebarOpen = (state, action) => {
    const { tabId, open } = action.payload;
    const tabState = state.tabs[tabId] || initialTabState;

    return {
        ...state,
        tabs: {
            ...state.tabs,
            [tabId]: {
                ...tabState,
                sidebarOpen: open,
            },
        },
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.SET_USER:
        return setUser(state, action);
    case actionTypes.ADD_TAB:
        return addTab(state, action);
    case actionTypes.REMOVE_TAB:
        return removeTab(state, action);
    case actionTypes.REPLACE_TAB:
        return replaceTab(state, action);
    case actionTypes.SET_TAB_READY:
        return setTabReady(state, action);
    case actionTypes.TOGGLE_TAB_ENABLED:
        return toggleTabEnabled(state, action);
    case actionTypes.UPDATE_TAB_INJECTION:
        return updateTabInjection(state, action);
    case actionTypes.SET_TAB_SIDEBAR_OPEN:
        return setTabSidebarOpen(state, action);
    default:
        return state;
    }
};

export default reducer;
