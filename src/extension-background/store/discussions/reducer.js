import { omit } from 'lodash';
import * as actionTypes from './action-types';

const initialState = {};

const initialDiscussionState = {
    dependants: [],
    comments: [],
};

const connectDiscussion = (state, action) => {
    const { discussionId, tabId, comments } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    return {
        ...state,
        [discussionId]: {
            ...discussionState,
            comments,
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

const updateComments = (state, action) => {
    const { discussionId, comments } = action.payload;
    const discussionState = state[discussionId] || initialDiscussionState;

    return {
        ...state,
        [discussionId]: {
            ...discussionState,
            comments,
        },
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.START_DISCUSSION:
        return connectDiscussion(state, action);
    case actionTypes.STOP_DISCUSSION:
        return disconnectDiscussion(state, action);
    case actionTypes.UPDATE_COMMENTS:
        return updateComments(state, action);
    default:
        return state;
    }
};

export default reducer;
