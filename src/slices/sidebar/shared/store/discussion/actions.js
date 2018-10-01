import * as actionTypes from './action-types';
import { getUser } from '../extension';

const cleanupBody = (body) =>
    body
    // Remove leading & trailing spaces
    .trim()
    // Remove leading spaces from empty lines
    .replace(/^[ \t]+/gm, '')
    // Avoid more than two consecutive empty lines
    .replace(/^\n\n\n+/gm, '\n\n');

export const addComment = (body) => (dispatch, getState) => {
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
        type: actionTypes.ADD_COMMENT,
        payload: {
            comment,
        },
    });
};
