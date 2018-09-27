import * as actionTypes from './action-types';

const initialState = {
    open: false,
    pendingOpen: false,
};

const open = (state) => ({
    ...state,
    open: true,
    pendingOpen: false,
});

const close = (state) => ({
    ...state,
    open: false,
    pendingOpen: false,
});

const setPendingOpen = (state, action) => ({
    ...state,
    pendingOpen: action.payload.pendingOpen,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.OPEN:
        return open(state, action);
    case actionTypes.CLOSE:
        return close(state, action);
    case actionTypes.SET_PENDING_OPEN:
        return setPendingOpen(state, action);
    default:
        return state;
    }
};

export default reducer;
