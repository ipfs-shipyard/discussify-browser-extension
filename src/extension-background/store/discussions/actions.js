import * as actionTypes from './action-types';
import sanitizeBody from './util/sanitize-body';
import { getUser } from '../session';
import { getDiscussionDependantsCount, hasDiscussion } from './selectors';

const getCollaboration = async (discussionId, peerStarApp) => {
    await peerStarApp.start();

    return peerStarApp.collaborate(`discussion-${discussionId}`, '2pset');
};

export const startDiscussion = (discussionId, tabId) => async (dispatch, getState, { peerStarApp }) => {
    const collaboration = await getCollaboration(discussionId, peerStarApp);
    const dependantsCount = getDiscussionDependantsCount(getState(), tabId);

    // Listen to changes if this is the first dependant
    if (!dependantsCount) {
        collaboration.on('state changed', () => {
            dispatch({
                type: actionTypes.UPDATE_COMMENTS,
                payload: {
                    discussionId,
                    comments: Array.from(collaboration.shared.value()),
                },
            });
        });
    }

    dispatch({
        type: actionTypes.START_DISCUSSION,
        payload: {
            discussionId,
            tabId,
            comments: Array.from(collaboration.shared.value()),
        },
    });
};

export const stopDiscussion = (discussionId, tabId) => async (dispatch, getState, { peerStarApp }) => {
    dispatch({
        type: actionTypes.STOP_DISCUSSION,
        payload: {
            discussionId,
            tabId,
        },
    });

    const dependantsCount = getDiscussionDependantsCount(getState(), discussionId);

    // Stop the collaboration if there's no more dependants
    if (!dependantsCount) {
        const collaboration = await getCollaboration(discussionId, peerStarApp);

        // await collaboration.stop();
    }
};

export const createComment = (discussionId, body) => async (dispatch, getState, { peerStarApp }) => {
    if (!hasDiscussion(getState(), discussionId)) {
        throw new Error(`Discussion with id ${discussionId} does not exist`);
    }

    const user = getUser(getState());
    const sanitizedBody = sanitizeBody(body);

    if (!user || !sanitizedBody) {
        return;
    }

    const comment = {
        id: Math.random().toString(),
        author: user,
        body: sanitizedBody,
        createdAt: (new Date()).toISOString(),
    };

    await peerStarApp.start();

    const collaboration = await peerStarApp.collaborate(`discussion-${discussionId}`, 'gset');

    console.log('adding', comment);

    collaboration.shared.add(comment);
};

export const updateComment = (discussionId, commentId, body) => ({

});

export const removeComment = (discussionId, commentId) => ({

});
