import * as actionTypes from './action-types';

export const setUser = (user) => ({
    type: actionTypes.SET_USER,
    payload: {
        user,
    },
});

export const addTab = (tabId) => ({
    type: actionTypes.ADD_TAB,
    payload: {
        tabId,
    },
});

export const removeTab = (tabId) => ({
    type: actionTypes.REMOVE_TAB,
    payload: {
        tabId,
    },
});

export const replaceTab = (addedTabId, removedTabId) => ({
    type: actionTypes.REMOVE_TAB,
    payload: {
        addedTabId,
        removedTabId,
    },
});

export const setTabReady = (tabId, ready) => ({
    type: actionTypes.SET_TAB_READY,
    payload: {
        tabId,
        ready,
    },
});

export const toggleTabEnabled = (tabId) => ({
    type: actionTypes.TOGGLE_TAB_ENABLED,
    payload: {
        tabId,
    },
});

export const updateTabInjection = (tabId, status, error) => ({
    type: actionTypes.UPDATE_TAB_INJECTION,
    payload: {
        tabId,
        status,
        error,
    },
});

export const setTabSidebarOpen = (tabId, open) => ({
    type: actionTypes.SET_TAB_SIDEBAR_OPEN,
    payload: {
        tabId,
        open,
    },
});
