import { get } from 'lodash';

export const hasDiscussion = (state, discussionId) => !!state.discussions[discussionId];

export const isDependantOnDiscussion = (state, discussionId, tabId) =>
    get(state.discussions, [discussionId], []).includes(tabId);

export const getDiscussionDependantsCount = (state, discussionId) =>
    get(state.discussions, [discussionId, 'dependants'], []).length;

export const hasComment = (state, discussionId, commentId) =>
    !!get(state.discussions, [discussionId, 'crdtValue', 'entries', commentId]);

export const getCommentCid = (state, discussionId, commentId) =>
    get(state.discussions, [discussionId, 'crdtValue', 'entries', commentId, 'cid']);

export const isCommentLoading = (state, discussionId, commentId) => {
    const cid = getCommentCid(state, discussionId, commentId);

    return get(state.discussions, [discussionId, 'comments', cid, 'loading']);
};

export const getCommentError = (state, discussionId, commentId) => {
    const cid = getCommentCid(state, discussionId, commentId);

    return get(state.discussions, [discussionId, 'comments', cid, 'error']);
};

export const getCommentData = (state, discussionId, commentId) => {
    const crdtEntry = get(state.discussions, [discussionId, 'crdtValue', 'entries', commentId]);
    const data = crdtEntry && get(state.discussions, [discussionId, 'comments', crdtEntry.cid, 'data']);

    if (!crdtEntry || !data) {
        return;
    }

    return {
        author: data.author,
        body: data.body,
        createdAt: crdtEntry.createdAt,
        updatedAt: crdtEntry.updatedAt,
    };
};

export const getCommentsTree = (state, discussionId) => {
    const crdtValue = get(state.discussions, [discussionId, 'crdtValue']);

    if (!crdtValue) {
        return;
    }

    const { ids, entries } = crdtValue;
    const nodesMap = new Map();
    const rootNode = [];

    ids.forEach((commentId) => {
        const crdtEntry = entries[commentId];

        // Construct this tree node
        const node = {
            id: commentId,
            cid: crdtEntry.cid,
            comment: {
                loading: isCommentLoading(state, discussionId, commentId) || false,
                error: getCommentError(state, discussionId, commentId) || null,
                data: getCommentData(state, discussionId, commentId) || null,
            },
            children: [],
        };

        nodesMap.set(commentId, node);

        // Add it to the correct parent node
        const { parentId } = crdtEntry;

        if (parentId) {
            const parentNode = nodesMap.get(parentId);

            if (parentNode) {
                parentNode.children.push(node);
            }
        } else {
            rootNode.push(node);
        }
    });

    return rootNode;
};

export const getSerializedDiscussions = () => {};
