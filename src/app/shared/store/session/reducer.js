import * as actionTypes from './action-types';

const initialState = {
    qrCodeUri: null,
    cancelPrompt: null,
    error: null,
    user: null,
};

const authenticate = (state, action) => {
    switch (action.type) {
    case actionTypes.AUTHENTICATE_PROMPT: {
        const { qrCodeUri, cancelPrompt } = action.payload;

        return {
            ...state,
            cancelPrompt,
            qrCodeUri,
            error: null,
        };
    }
    case actionTypes.AUTHENTICATE_OK: {
        const { user } = action.payload;

        return {
            ...state,
            qrCodeUri: null,
            cancelPrompt: null,
            user,
        };
    }
    case actionTypes.AUTHENTICATE_ERROR: {
        const { error } = action.payload;

        return {
            ...state,
            qrCodeUri: null,
            cancelPrompt: null,
            error,
        };
    }
    default:
        return state;
    }
};

const resetAuthenticate = (state) => ({
    ...state,
    cancelPrompt: null,
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
    case actionTypes.RESET_AUTHENTICATE:
        return resetAuthenticate(state, action);
    case actionTypes.UNAUTHENTICATE:
        return unauthenticate(state, action);
    default:
        return state;
    }
};

export default reducer;
