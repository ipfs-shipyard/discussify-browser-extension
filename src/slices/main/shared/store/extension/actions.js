import * as actionTypes from './action-types';

export const updateState = (state) => ({
    type: actionTypes.UPDATE_STATE,
    payload: { state },
});

export const fetchMetadata = () => (dispatch, getState, { extensionClient }) =>
    extensionClient.fetchMetadata();

export const openSidebar = () => (dispatch, getState, { extensionClient }) => {
    extensionClient.setSidebarOpen(true);
};

export const closeSidebar = () => (dispatch, getState, { extensionClient }) =>
    extensionClient.setSidebarOpen(false);
