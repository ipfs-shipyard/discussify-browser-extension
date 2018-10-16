import * as actionTypes from './action-types';

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

export const markTabAsReady = (tabId, url) => ({
    type: actionTypes.MARK_TAB_AS_READY,
    payload: {
        tabId,
        url,
    },
});

export const unmarkTabAsReady = (tabId) => ({
    type: actionTypes.UNMARK_TAB_AS_READY,
    payload: {
        tabId,
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

export const dismissTabInjectionError = (tabId) => ({
    type: actionTypes.DISMISS_TAB_INJECTION_ERROR,
    payload: {
        tabId,
    },
});

export const setTabMetadata = (tabId, metadata) => ({
    type: actionTypes.SET_TAB_METADATA,
    payload: {
        tabId,
        metadata,
    },
});

export const openSidebar = (tabId) => ({
    type: actionTypes.OPEN_SIDEBAR,
    payload: {
        tabId,
    },
});

export const closeSidebar = (tabId) => ({
    type: actionTypes.CLOSE_SIDEBAR,
    payload: {
        tabId,
    },
});
