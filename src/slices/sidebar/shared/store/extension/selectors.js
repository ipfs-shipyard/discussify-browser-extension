export const isAuthenticated = (state) => !!getUser(state);

export const getUser = (state) => state.extension.user;

export const isSidebarOpen = (state) => state.extension.sidebarOpen;
