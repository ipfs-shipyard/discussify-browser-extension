export const isAuthenticating = (state) => getTimeoutId(state) != null;

export const getTimeoutId = (state) => state.session.timeoutId;

export const isAuthenticated = (state) => !!getUser(state);

export const getQrCodeUri = (state) => state.session.qrCodeUri;

export const getCancelFn = (state) => state.session.cancelFn;

export const getError = (state) => state.session.error;

export const getUser = (state) => state.session.user;

export const getSerializedSession = (state) => ({
    ...state.session,
    timeoutId: null,
    qrCodeUri: null,
    cancelFn: null,
    error: null,
});
