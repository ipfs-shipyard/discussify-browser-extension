import * as actionTypes from './action-types';

const initialState = {
    open: false,
};

const open = (state) => ({
    ...state,
    open: true,
});

const close = (state) => ({
    ...state,
    open: false,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.OPEN:
        return open(state, action);
    case actionTypes.CLOSE:
        return close(state, action);
    default:
        return state;
    }
};

export default reducer;
