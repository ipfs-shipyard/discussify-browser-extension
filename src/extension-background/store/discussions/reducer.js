import { omit } from 'lodash';
import serializeError from 'serialize-error';
import * as actionTypes from './action-types';

const initialState = {};

const initialDiscussionState = {
    dependants: [],
    crdtValue: [],
    comments: {},
};

const initialDiscussionCommentState = {
    loading: false,
    error: null,
    data: null,
};

const connectDiscussion = (state, action) => {
    const { discussionId, tabId, crdtValue } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    return {
        ...state,
        [discussionId]: {
            ...discussionState,
            crdtValue,
            dependants: discussionState.dependants.includes(tabId) ?
                discussionState.dependants :
                [...discussionState.dependants, tabId],
        },
    };
};

const disconnectDiscussion = (state, action) => {
    const { discussionId, tabId } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    const dependants = discussionState.dependants.filter((dependant) => dependant !== tabId);

    // Remove discussion if there's no more dependants
    if (!dependants.length) {
        return omit(state, discussionId);
    }

    return {
        ...state,
        [discussionId]: {
            ...discussionState,
            dependants,
        },
    };
};

const updateCrdtValue = (state, action) => {
    const { discussionId, crdtValue } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    return {
        ...state,
        [discussionId]: {
            ...discussionState,
            crdtValue,
        },
    };
};

const loadComment = (state, action) => {
    const { discussionId, cid } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;
    const commentState = discussionState.comments[discussionId] || initialDiscussionCommentState;

    switch (action.type) {
    case actionTypes.LOAD_COMMENT_START: {
        return {
            ...state,
            [discussionId]: {
                ...discussionState,
                comments: {
                    ...discussionState.comments,
                    [cid]: {
                        ...commentState,
                        loading: true,
                    },
                },
            },
        };
    }
    case actionTypes.LOAD_COMMENT_OK: {
        const { comment } = action.payload;

        return {
            ...state,
            [discussionId]: {
                ...discussionState,
                comments: {
                    ...discussionState.comments,
                    [cid]: {
                        ...commentState,
                        loading: false,
                        data: comment,
                        error: null,
                    },
                },
            },
        };
    }
    case actionTypes.LOAD_COMMENT_ERROR: {
        const { error } = action.payload;

        return {
            ...state,
            [discussionId]: {
                ...discussionState,
                comments: {
                    ...discussionState.comments,
                    [cid]: {
                        ...commentState,
                        loading: false,
                        data: null,
                        error: serializeError(error),
                    },
                },
            },
        };
    }
    default:
        return state;
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.START_DISCUSSION:
        return connectDiscussion(state, action);
    case actionTypes.STOP_DISCUSSION:
        return disconnectDiscussion(state, action);
    case actionTypes.UPDATE_CRDT_VALUE:
        return updateCrdtValue(state, action);
    case actionTypes.LOAD_COMMENT_START:
    case actionTypes.LOAD_COMMENT_OK:
    case actionTypes.LOAD_COMMENT_ERROR:
        return loadComment(state, action);
    default:
        return state;
    }
};

export default reducer;
