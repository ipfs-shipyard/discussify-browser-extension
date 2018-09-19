import { get } from 'lodash';

export const getTabIds = (state) =>
    Object.keys(state.tabs).map((tabId) => Number(tabId));

export const getUser = (state) => state.user;

export const isTabReady = (state, tabId) =>
    get(state.tabs, [tabId, 'ready'], false);

export const isTabEnabled = (state, tabId) =>
    get(state.tabs, [tabId, 'enabled'], false);

export const getTabInjectionStatus = (state, tabId) =>
    get(state.tabs, [tabId, 'injectionStatus']);

export const getTabInjectionError = (state, tabId) =>
    get(state.tabs, [tabId, 'injectionError']);
