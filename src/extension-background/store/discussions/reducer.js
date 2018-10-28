import { omit, mapValues } from 'lodash';
import serializeError from 'serialize-error';
import * as actionTypes from './action-types';

const initialState = {};

const initialDiscussionState = {
    tabIds: [],
    starting: false,
    error: null,
    sharedValue: null,
    peersCount: null,
    comments: {},
};

const initialDiscussionCommentState = {
    loading: false,
    error: null,
    data: null,
};

const createDiscussion = (state, action) => {
    const { discussionId, tabId } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    return {
        ...state,
        [discussionId]: {
            ...discussionState,
            tabIds: discussionState.tabIds.includes(tabId) ?
                discussionState.tabIds :
                [...discussionState.tabIds, tabId],
        },
    };
};

const destroyDiscussion = (state, action) => {
    const { discussionId, tabId } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    const tabIds = discussionState.tabIds.filter((tabId_) => tabId_ !== tabId);

    // Remove discussion if there's no more tabIds
    if (!tabIds.length) {
        return omit(state, discussionId);
    }

    return {
        ...state,
        [discussionId]: {
            ...discussionState,
            tabIds,
        },
    };
};

const startDiscussion = (state, action) => {
    const { discussionId } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    switch (action.type) {
    case actionTypes.START_DISCUSSION_START: {
        return {
            ...state,
            [discussionId]: {
                ...discussionState,
                starting: true,
                error: null,
                sharedValue: null,
                peersCount: null,
            },
        };
    }
    case actionTypes.START_DISCUSSION_OK: {
        const { sharedValue, peersCount } = action.payload;

        return {
            ...state,
            [discussionId]: {
                ...discussionState,
                starting: false,
                error: null,
                sharedValue,
                peersCount,
            },
        };
    }
    case actionTypes.START_DISCUSSION_ERROR: {
        const { error } = action.payload;

        return {
            ...state,
            [discussionId]: {
                ...discussionState,
                starting: false,
                error: serializeError(error),
                sharedValue: null,
                peersCount: null,
            },
        };
    }
    default:
        return state;
    }
};

const updateSharedValue = (state, action) => {
    const { discussionId, sharedValue } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    return {
        ...state,
        [discussionId]: {
            ...discussionState,
            sharedValue,
        },
    };
};

const updatePeersCount = (state, action) => {
    const { discussionId, peersCount } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    return {
        ...state,
        [discussionId]: {
            ...discussionState,
            peersCount,
        },
    };
};

const setComment = (state, action) => {
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
    case actionTypes.CREATE_DISCUSSION:
        return createDiscussion(state, action);
    case actionTypes.DESTROY_DISCUSSION:
        return destroyDiscussion(state, action);
    case actionTypes.START_DISCUSSION_START:
    case actionTypes.START_DISCUSSION_OK:
    case actionTypes.START_DISCUSSION_ERROR:
        return startDiscussion(state, action);
    case actionTypes.UPDATE_SHARED_VALUE:
        return updateSharedValue(state, action);
    case actionTypes.UPDATE_PEERS_COUNT:
        return updatePeersCount(state, action);
    case actionTypes.SET_COMMENT:
        return setComment(state, action);
    case actionTypes.LOAD_COMMENTS_START:
    case actionTypes.LOAD_COMMENTS_DONE:
        return loadComments(state, action);
    default:
        return state;
    }
};

export default reducer;
