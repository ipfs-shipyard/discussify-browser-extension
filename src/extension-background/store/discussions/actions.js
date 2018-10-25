import PeerStarApp from 'peer-star-app';
import * as actionTypes from './action-types';
import { getUser } from '../session';
import { getDiscussionDependantsCount, hasDiscussion, getCommentCid, hasComment, isCommentLoading } from './selectors';
import sanitizeBody from './util/sanitize-body';
import commentsCrdt from './util/comments-crdt';
import { retrieveComments, storeComment } from './util/comments-store';

PeerStarApp.collaborationTypes.define('discussify-comments', commentsCrdt);

// TODO: add timeouts to async actions
// TODO: handle errors
// TODO: conntrol concurrency of load comments?

const getCollaboration = async (peerStarApp, discussionId) => {
    await peerStarApp.start();

    return peerStarApp.collaborate(`discussion-${discussionId}`, 'discussify-comments');
};

export const startDiscussion = (discussionId, tabId) => async (dispatch, getState, { peerStarApp }) => {
    const collaboration = await getCollaboration(peerStarApp, discussionId);

    // Listen to changes if this is the first dependant
    const dependantsCount = getDiscussionDependantsCount(getState(), tabId);

    if (!dependantsCount) {
        collaboration.on('state changed', () => {
            dispatch({
                type: actionTypes.UPDATE_CRDT_VALUE,
                payload: {
                    discussionId,
                    crdtValue: collaboration.shared.value(),
                },
            });
        });
    }

    dispatch({
        type: actionTypes.START_DISCUSSION,
        payload: {
            discussionId,
            tabId,
            crdtValue: collaboration.shared.value(),
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
        const collaboration = await getCollaboration(peerStarApp, discussionId);

        // TODO
        // await collaboration.stop();
    }
};

export const createComment = (discussionId, previousCommentId, body) => async (dispatch, getState, { peerStarApp }) => {
    if (!hasDiscussion(getState(), discussionId)) {
        throw new Error(`Discussion with id ${discussionId} does not exist`);
    }

    const user = getUser(getState());
    const sanitizedBody = sanitizeBody(body);

    if (!user || !sanitizedBody) {
        return;
    }

    const collaboration = await getCollaboration(peerStarApp, discussionId);

    const comment = {
        author: user,
        body: sanitizedBody,
        timestamp: Date.now(),
    };

    const cid = await storeComment(peerStarApp.ipfs, comment);

    dispatch({
        type: actionTypes.SET_LOADED_COMMENT,
        payload: {
            discussionId,
            cid,
            comment,
        },
    });

    collaboration.shared.create({
        id: cid,
        previousId: previousCommentId,
        cid,
    });
};

export const updateComment = (discussionId, commentId, body) => async (dispatch, getState, { peerStarApp }) => {
    const user = getUser(getState());
    const sanitizedBody = sanitizeBody(body);

    if (!user || !sanitizedBody) {
        return;
    }

    if (!hasComment(getState(), discussionId, commentId)) {
        throw new Error(`Unknown comment with id ${commentId}`);
    }

    const collaboration = await getCollaboration(peerStarApp, discussionId);

    const comment = {
        author: user,
        body,
        timestamp: Date.now(),
    };

    const cid = await storeComment(peerStarApp.ipfs, comment);

    dispatch({
        type: actionTypes.SET_LOADED_COMMENT,
        payload: {
            discussionId,
            cid,
            comment,
        },
    });

    collaboration.shared.update(commentId, cid);
};

export const removeComment = (discussionId, commentId) => async (dispatch, getState, { peerStarApp }) => {
    const user = getUser(getState());

    if (!user) {
        return;
    }

    if (!hasComment(getState(), discussionId, commentId)) {
        throw new Error(`Unknown comment with id ${commentId}`);
    }

    const collaboration = await getCollaboration(peerStarApp, discussionId);

    const comment = {
        author: user,
        body: null,
        timestamp: Date.now(),
    };

    const cid = await storeComment(peerStarApp.ipfs, comment);

    dispatch({
        type: actionTypes.SET_LOADED_COMMENT,
        payload: {
            discussionId,
            cid,
            comment,
        },
    });

    collaboration.shared.update(commentId, cid);
};

export const loadComments = (discussionId, commentIds) => async (dispatch, getState, { peerStarApp }) => {
    const state = getState();

    if (!hasDiscussion(state, discussionId)) {
        throw new Error(`Discussion with id ${discussionId} does not exist`);
    }

    const cids = commentIds
    .map((commentId) =>
        !isCommentLoading(state, discussionId, commentId) &&
        getCommentCid(state, discussionId, commentId)
    )
    .filter(Boolean);

    dispatch({
        type: actionTypes.LOAD_COMMENTS_START,
        payload: {
            discussionId,
            commentIds,
            cids,
        },
    });

    const result = await retrieveComments(peerStarApp.ipfs, cids);

    dispatch({
        type: actionTypes.LOAD_COMMENTS_DONE,
        payload: {
            discussionId,
            commentIds,
            cids,
            result,
        },
    });
};
