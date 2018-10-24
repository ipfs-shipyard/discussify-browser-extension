import PeerStarApp from 'peer-star-app';
import { random } from 'lodash';
import * as actionTypes from './action-types';
import { getUser } from '../session';
import { getDiscussionDependantsCount, hasDiscussion, getCommentCid, hasComment, isCommentLoading } from './selectors';
import sanitizeBody from './util/sanitize-body';
import commentsCrdt from './util/comments-crdt';
import { retrieveComment, storeComment } from './util/comments-store';

PeerStarApp.collaborationTypes.define('discussify-comments', commentsCrdt);

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

    const cid = await storeComment(peerStarApp.ipfs, {
        author: user,
        body: sanitizedBody,
        timestamp: Date.now(),
        nonce: random(0, 10 ** 20),
    });

    collaboration.shared.create({
        id: cid,
        previousId: previousCommentId,
        cid,
    });
};

export const updateComment = (discussionId, commentId, body) => async (dispatch, getState, { peerStarApp }) => {
    const user = getUser(getState());

    if (!user) {
        return;
    }

    if (!hasComment(getState(), discussionId, commentId)) {
        throw new Error(`Unknown comment with id ${commentId}`);
    }

    const collaboration = await getCollaboration(peerStarApp, discussionId);

    const cid = await storeComment(peerStarApp.ipfs, {
        author: user,
        body,
        timestamp: Date.now(),
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

    const cid = await storeComment(peerStarApp.ipfs, {
        author: user,
        body: null,
        timestamp: Date.now(),
    });

    collaboration.shared.update(commentId, cid);
};

export const loadComment = (discussionId, commentId) => async (dispatch, getState, { peerStarApp }) => {
    if (!hasComment(getState(), discussionId, commentId)) {
        throw new Error(`Unknown comment with id ${commentId}`);
    }

    if (isCommentLoading(getState(), discussionId, commentId)) {
        return;
    }

    const cid = getCommentCid(getState(), discussionId, commentId);

    // TODO: timeout
    dispatch({
        type: actionTypes.LOAD_COMMENT_START,
        payload: {
            discussionId,
            cid,
        },
    });

    let comment;

    try {
        await peerStarApp.start();

        comment = await retrieveComment(peerStarApp.ipfs, cid);
    } catch (error) {
        dispatch({
            type: actionTypes.LOAD_COMMENT_ERROR,
            payload: {
                discussionId,
                cid,
                error,
            },
        });

        throw error;
    }

    dispatch({
        type: actionTypes.LOAD_COMMENT_OK,
        payload: {
            discussionId,
            cid,
            comment,
        },
    });
};
