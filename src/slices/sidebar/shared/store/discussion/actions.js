import * as actionTypes from './action-types';
import { getUser } from '../extension';
import cleanupBody from './util/cleanup-body';

export const createComment = (body) => (dispatch, getState) => {
    body = cleanupBody(body);

    if (!body) {
        return;
    }

    const state = getState();

    const comment = {
        id: Math.random().toString(),
        author: getUser(state),
        body,
        createdAt: (new Date()).toISOString(),
    };

    dispatch({
        type: actionTypes.CREATE_COMMENT,
        payload: {
            comment,
        },
    });
};

export const removeComment = (id) => ({
    type: actionTypes.REMOVE_COMMENT,
    payload: {
        id,
    },
});
