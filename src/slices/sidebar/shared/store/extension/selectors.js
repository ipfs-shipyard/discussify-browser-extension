export const isAuthenticated = (state) => !!getUser(state);

export const getUser = (state) => state.extension.user;

export const isSidebarOpen = (state) => state.extension.sidebarOpen;

export const getUrl = (state) => state.extension.url;

export const getMetadata = (state) => state.extension.metadata;
