import { get } from 'lodash';

export const hasDiscussion = (state, discussionId) =>
    !!state.discussions[discussionId];

export const isDiscussionStarted = (state, discussionId) =>
    !!getDiscussionSharedValue(state, discussionId);

export const isDiscussionStarting = (state, discussionId) =>
    get(state.discussions, [discussionId, 'starting']);

export const getDiscussionError = (state, discussionId) =>
    get(state.discussions, [discussionId, 'error']);

export const getDiscussionSharedValue = (state, discussionId) =>
    get(state.discussions, [discussionId, 'sharedValue']);

export const getDiscussionPeersCount = (state, discussionId) =>
    get(state.discussions, [discussionId, 'peersCount']);

export const hasComment = (state, discussionId, commentId) =>
    !!get(state.discussions, [discussionId, 'sharedValue', 'entries', commentId]);

export const getCommentCid = (state, discussionId, commentId) =>
    get(state.discussions, [discussionId, 'sharedValue', 'entries', commentId, 'cid']);

export const isCommentLoading = (state, discussionId, commentId) => {
    const cid = getCommentCid(state, discussionId, commentId);

    return get(state.discussions, [discussionId, 'comments', cid, 'loading']);
};

export const getCommentError = (state, discussionId, commentId) => {
    const cid = getCommentCid(state, discussionId, commentId);

    return get(state.discussions, [discussionId, 'comments', cid, 'error']);
};

export const getCommentData = (state, discussionId, commentId) => {
    const cid = getCommentCid(state, discussionId, commentId);
    const data = get(state.discussions, [discussionId, 'comments', cid, 'data']);

    if (!cid || !data) {
        return;
    }

    const crdtEntry = get(state.discussions, [discussionId, 'sharedValue', 'entries', commentId]);

    return {
        author: data.author,
        body: data.body,
        createdAt: crdtEntry.createdAt,
        updatedAt: crdtEntry.updatedAt,
    };
};

export const getCommentNodes = (state, discussionId) => {
    const sharedValue = get(state.discussions, [discussionId, 'sharedValue']);

    if (!sharedValue) {
        return;
    }

    const { sequence, entries } = sharedValue;
    const nodesMap = new Map();
    const rootNodes = [];

    sequence.forEach((commentId) => {
        const crdtEntry = entries[commentId];

        // Construct this node
        const node = {
            id: commentId,
            cid: crdtEntry.cid,
            comment: {
                loading: isCommentLoading(state, discussionId, commentId) || false,
                error: getCommentError(state, discussionId, commentId) || null,
                data: getCommentData(state, discussionId, commentId) || null,
            },
            replyNodes: [],
        };

        nodesMap.set(commentId, node);

        // Add it to the correct parent node
        const { parentId: parentCommentId } = crdtEntry;

        if (parentCommentId) {
            const parentNode = nodesMap.get(parentCommentId);

            if (parentNode) {
                parentNode.replyNodes.push(node);
            }
        } else {
            rootNodes.push(node);
        }
    });

    return rootNodes;
};

export const getSerializedDiscussions = () => undefined;
