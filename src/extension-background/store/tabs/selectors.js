import { get } from 'lodash';

export const getTabIds = (state) =>
    Object.keys(state.tabs).map((tabId) => Number(tabId));

export const getTabState = (state, tabId) => state.tabs[tabId];

export const isTabReady = (state, tabId) =>
    get(state.tabs, [tabId, 'ready']);

export const isTabEnabled = (state, tabId) =>
    get(state.tabs, [tabId, 'enabled']);

export const getTabInjectionStatus = (state, tabId) =>
    get(state.tabs, [tabId, 'injectionStatus']);

export const getTabInjectionError = (state, tabId) =>
    get(state.tabs, [tabId, 'injectionError']);

export const getTabUrl = (state, tabId) =>
    get(state.tabs, [tabId, 'url']);

export const getTabMetadata = (state, tabId) =>
    get(state.tabs, [tabId, 'metadata']);

export const getTabDiscussionId = (state, tabId) =>
    get(state.tabs, [tabId, 'metadata', 'discussionId']);

export const isTabSidebarOpen = (state, tabId) =>
    get(state.tabs, [tabId, 'sidebarOpen']);

export const getSerializedTabs = (state) => state.tabs;
