import { getUser, getError, getQrCodeUri } from '../store/session';
import { isTabSidebarOpen, getTabDiscussionId, getTabMetadata } from '../store/tabs';
import { getDiscussionError, getCommentNodes, getDiscussionPeersCount } from '../store/discussions';

const getClientState = (state, tabId) => {
    const discussionId = getTabDiscussionId(state, tabId);

    return {
        session: {
            user: getUser(state),
            error: getError(state),
            qrCodeUri: getQrCodeUri(state),
        },
        tab: {
            sidebarOpen: isTabSidebarOpen(state, tabId),
            metadata: getTabMetadata(state, tabId),
        },
        discussion: {
            id: discussionId,
            error: getDiscussionError(state, discussionId),
            commentNodes: getCommentNodes(state, discussionId),
            peersCount: getDiscussionPeersCount(state, discussionId),
        },
    };
};

export default getClientState;
