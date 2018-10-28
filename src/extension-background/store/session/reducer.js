import serializeError from 'serialize-error';
import * as actionTypes from './action-types';

const initialState = {
    // Timeout id used to automatically cancel a pending authenticate
    timeoutId: null,
    // The URI of the QR code to be scanned
    qrCodeUri: null,
    // A function to be called to cancel the prompt
    cancelFn: null,
    // The authenticate error if any
    error: null,
    // The authenticated user if any
    user: null,
};

const authenticate = (state, action) => {
    switch (action.type) {
    case actionTypes.AUTHENTICATE_START: {
        const { timeoutId } = action.payload;

        return {
            ...state,
            timeoutId,
        };
    }
    case actionTypes.AUTHENTICATE_PROMPT: {
        const { qrCodeUri, cancelFn } = action.payload;

        return {
            ...state,
            cancelFn,
            qrCodeUri,
            error: null,
        };
    }
    case actionTypes.AUTHENTICATE_OK: {
        const { user } = action.payload;

        return {
            ...state,
            timeoutId: null,
            qrCodeUri: null,
            cancelFn: null,
            user,
        };
    }
    case actionTypes.AUTHENTICATE_ERROR: {
        const { error } = action.payload;

        return {
            ...state,
            timeoutId: null,
            qrCodeUri: null,
            cancelFn: null,
            error: serializeError(error),
        };
    }
    default:
        return state;
    }
};

const cancelAuthenticate = (state) => ({
    ...state,
    timeoutId: null,
    cancelFn: null,
    qrCodeUri: null,
    error: null,
});

const unauthenticate = (state) => ({
    ...state,
    user: initialState.user,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.AUTHENTICATE_PROMPT:
    case actionTypes.AUTHENTICATE_OK:
    case actionTypes.AUTHENTICATE_ERROR:
        return authenticate(state, action);
    case actionTypes.CANCEL_AUTHENTICATE:
        return cancelAuthenticate(state, action);
    case actionTypes.UNAUTHENTICATE:
        return unauthenticate(state, action);
    default:
        return state;
    }
};

export default reducer;
