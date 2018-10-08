import { get } from 'lodash';

export const getTabIds = (state) =>
    Object.keys(state.tabs).map((tabId) => Number(tabId));

export const isAuthenticated = (state) => !!getUser(state);

export const getUser = (state) => state.user;

export const isTabReady = (state, tabId) =>
    get(state.tabs, [tabId, 'ready'], false);

export const isTabEnabled = (state, tabId) =>
    get(state.tabs, [tabId, 'enabled'], false);

export const getTabInjectionStatus = (state, tabId) =>
    get(state.tabs, [tabId, 'injectionStatus']);

export const getTabInjectionError = (state, tabId) =>
    get(state.tabs, [tabId, 'injectionError']);

export const getTabUrl = (state, tabId) =>
    get(state.tabs, [tabId, 'url'], false);

export const getTabMetadata = (state, tabId) =>
    get(state.tabs, [tabId, 'metadata'], false);

export const isTabSidebarOpen = (state, tabId) =>
    get(state.tabs, [tabId, 'sidebarOpen'], false);

export const getSliceState = (state, tabId) => ({
    user: getUser(state),
    sidebarOpen: isTabSidebarOpen(state, tabId),
    url: getTabUrl(state, tabId),
    metadata: getTabMetadata(state, tabId),
});
