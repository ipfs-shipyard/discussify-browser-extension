import * as actionTypes from './action-types';

const initialState = {
    user: null,
    sidebarOpen: false,
    url: null,
    metadata: null,
};

const updateState = (state, action) => action.payload.state;

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.UPDATE_STATE:
        return updateState(state, action);
    default:
        return state;
    }
};

export default reducer;
