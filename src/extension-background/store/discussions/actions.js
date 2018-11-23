import * as actionTypes from './action-types';
import { getUser } from '../session';
import { hasDiscussion, isDiscussionStarted, isDiscussionStarting, getCommentCid, getCommentData, isCommentLoading } from './selectors';
import { getCommentsCollaborationName } from './util/collaboration-names';
import { getCollaboration, startCollaboration, stopCollaboration, registerCollaborationType } from '../../util/peer-star-collaborations';
import commentsCrdt from './util/comments-crdt';
import { retrieveComments, storeComment } from './util/comments-store';
import sanitizeBody from './util/sanitize-body';

const COMMENTS_CRDT_TYPE = 'discussify-comments';
const STOP_COLLABORATION_TIMEOUT = 30000;

registerCollaborationType(COMMENTS_CRDT_TYPE, commentsCrdt);

export const createDiscussion = (discussionId, tabId) => async (dispatch, getState, { peerStarApp }) => {
    dispatch({
        type: actionTypes.CREATE_DISCUSSION,
        payload: {
            discussionId,
            tabId,
        },
    });

    // Skip if the discussion is already started (or starting)
    if (isDiscussionStarted(getState(), discussionId) || isDiscussionStarting(getState(), discussionId)) {
        return;
    }

    // Create the collaboration, starting the discussion
    dispatch({
        type: actionTypes.START_DISCUSSION_START,
        payload: {
            discussionId,
        },
    });

    let collaboration;

    try {
        collaboration = await startCollaboration(
            peerStarApp,
            getCommentsCollaborationName(discussionId),
            COMMENTS_CRDT_TYPE
        );
    } catch (error) {
        dispatch({
            type: actionTypes.START_DISCUSSION_ERROR,
            payload: {
                discussionId,
                error,
            },
        });

        throw error;
    }

    dispatch({
        type: actionTypes.START_DISCUSSION_OK,
        payload: {
            discussionId,
            sharedValue: collaboration.shared.value(),
            peersCount: collaboration.peers().size,
        },
    });

    // Listen to when the state changes
    collaboration.on('state changed', () => {
        dispatch({
            type: actionTypes.UPDATE_SHARED_VALUE,
            payload: {
                discussionId,
                sharedValue: collaboration.shared.value(),
            },
        });
    });

    // Listen to when the peers change
    collaboration.on('membership changed', () => {
        dispatch({
            type: actionTypes.UPDATE_PEERS_COUNT,
            payload: {
                discussionId,
                peersCount: collaboration.peers().size,
            },
        });
    });
};

export const destroyDiscussion = (discussionId, tabId) => (dispatch, getState) => {
    dispatch({
        type: actionTypes.DESTROY_DISCUSSION,
        payload: {
            discussionId,
            tabId,
        },
    });

    // Destroy the collaboration if the discussion is gone
    if (!hasDiscussion(getState(), discussionId)) {
        setTimeout(() => {
            if (!hasDiscussion(getState(), discussionId)) {
                stopCollaboration(getCommentsCollaborationName(discussionId));
            }
        }, STOP_COLLABORATION_TIMEOUT);
    }
};

export const createComment = (discussionId, previousCommentId, body) => async (dispatch, getState, { peerStarApp }) => {
    const user = getUser(getState());
    const sanitizedBody = sanitizeBody(body);

    if (!user || !sanitizedBody) {
        return;
    }

    // The entropy guarantees that the comment id will be unique (cid),
    // even if the same auther types the same text
    const comment = {
        author: user,
        body: sanitizedBody,
        entropy: Math.round(Math.random() * (10 ** 15)).toString(36),
    };

    const cid = await storeComment(peerStarApp.ipfs, comment);

    dispatch({
        type: actionTypes.SET_COMMENT,
        payload: {
            discussionId,
            cid,
            comment,
        },
    });

    const collaboration = await getCollaboration(getCommentsCollaborationName(discussionId));

    collaboration && collaboration.shared.create(previousCommentId, cid);

    // Return the CID so that the clients can scroll to the new comment
    return cid;
};

export const updateComment = (discussionId, commentId, body) => async (dispatch, getState, { peerStarApp }) => {
    const user = getUser(getState());
    const originalComment = getCommentData(getState(), discussionId, commentId);
    const sanitizedBody = sanitizeBody(body);

    if (!originalComment) {
        throw new Error(`Comment with id ${commentId} does not exist`);
    }

    if (!user || !sanitizedBody || sanitizedBody === originalComment.body) {
        return;
    }

    const comment = {
        author: user,
        body: sanitizedBody,
    };

    const cid = await storeComment(peerStarApp.ipfs, comment);

    dispatch({
        type: actionTypes.SET_COMMENT,
        payload: {
            discussionId,
            cid,
            comment,
        },
    });

    const collaboration = await getCollaboration(getCommentsCollaborationName(discussionId));

    collaboration && collaboration.shared.update(commentId, cid);

    // Return the CID so that the clients can react to the updated comment
    return cid;
};

export const removeComment = (discussionId, commentId) => async (dispatch, getState, { peerStarApp }) => {
    const user = getUser(getState());

    if (!user) {
        return;
    }

    const comment = {
        author: user,
        body: null,
    };

    const cid = await storeComment(peerStarApp.ipfs, comment);

    dispatch({
        type: actionTypes.SET_COMMENT,
        payload: {
            discussionId,
            cid,
            comment,
        },
    });

    const collaboration = await getCollaboration(getCommentsCollaborationName(discussionId));

    collaboration && collaboration.shared.update(commentId, cid);

    // Return the CID so that the clients can react to the removed comment
};

export const replyToComment = (discussionId, parentCommentId, previousCommentId, body) => async (dispatch, getState, { peerStarApp }) => {
    const user = getUser(getState());
    const sanitizedBody = sanitizeBody(body);

    if (!user || !sanitizedBody) {
        return;
    }

    // The entropy guarantees that the comment id will be unique (cid),
    // even if the same auther types the same text
    const comment = {
        author: user,
        body: sanitizedBody,
        entropy: Math.round(Math.random() * (10 ** 15)).toString(36),
    };

    const cid = await storeComment(peerStarApp.ipfs, comment);

    dispatch({
        type: actionTypes.SET_COMMENT,
        payload: {
            discussionId,
            cid,
            comment,
        },
    });

    const collaboration = await getCollaboration(getCommentsCollaborationName(discussionId));

    collaboration && collaboration.shared.reply(parentCommentId, previousCommentId, cid);

    // Return the CID so that the clients can scroll to the new comment
    return cid;
};

export const loadComments = (discussionId, commentIds) => async (dispatch, getState, { peerStarApp }) => {
    const state = getState();

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
