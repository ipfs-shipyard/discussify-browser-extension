import * as actionTypes from './action-types';

export const updateState = (state) => ({
    type: actionTypes.UPDATE_STATE,
    payload: { state },
});
