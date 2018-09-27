export const isAuthenticated = (state) => !!getUser(state);

export const getPromptQrCodeUri = (state) => state.qrCodeUri;

export const getPromptError = (state) => state.error;

export const getUser = (state) => state.user;
