import { omit, mapValues } from 'lodash';
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

const setLoadedComment = (state, action) => {
    const { discussionId, cid, comment } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;
    const commentState = discussionState.comments[cid] || initialDiscussionCommentState;

    return {
        ...state,
        [discussionId]: {
            ...discussionState,
            comments: {
                ...discussionState.comments,
                [cid]: {
                    ...commentState,
                    loading: false,
                    error: null,
                    data: comment,
                },
            },
        },
    };
};

const loadComments = (state, action) => {
    const { discussionId } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    switch (action.type) {
    case actionTypes.LOAD_COMMENTS_START: {
        const { cids } = action.payload;

        const comments = cids.reduce((comments, cid) => {
            const commentState = discussionState.comments[cid] || initialDiscussionCommentState;

            comments[cid] = {
                ...commentState,
                loading: true,
            };

            return comments;
        }, {});

        return {
            ...state,
            [discussionId]: {
                ...discussionState,
                comments: {
                    ...discussionState.comments,
                    ...comments,
                },
            },
        };
    }
    case actionTypes.LOAD_COMMENTS_DONE: {
        const { result } = action.payload;

        const comments = mapValues(result, (item, cid) => {
            const commentState = discussionState.comments[cid] || initialDiscussionCommentState;

            if (item.type === 'error') {
                return {
                    ...commentState,
                    loading: false,
                    data: null,
                    error: serializeError(item.error),
                };
            }
            if (item.type === 'ok') {
                return {
                    ...commentState,
                    loading: false,
                    data: item.comment,
                    error: null,
                };
            }

            return commentState;
        });

        return {
            ...state,
            [discussionId]: {
                ...discussionState,
                comments: {
                    ...discussionState.comments,
                    ...comments,
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
    case actionTypes.SET_LOADED_COMMENT:
        return setLoadedComment(state, action);
    case actionTypes.LOAD_COMMENTS_START:
    case actionTypes.LOAD_COMMENTS_DONE:
        return loadComments(state, action);
    default:
        return state;
    }
};

export default reducer;
