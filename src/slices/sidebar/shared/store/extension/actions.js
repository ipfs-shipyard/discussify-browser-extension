import * as actionTypes from './action-types';

export const updateState = (state) => ({
    type: actionTypes.UPDATE_STATE,
    payload: { state },
});

export const closeSidebar = () => (dispatch, getState, { extensionClient }) =>
    extensionClient.setSidebarOpen(false);
