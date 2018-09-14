export const isAuthenticated = (state) => !!getUser(state);

export const getPromptQrCodeUri = (state) => state.session.qrCodeUri;

export const getPromptError = (state) => state.session.error;

export const getUser = (state) => state.session.user;
