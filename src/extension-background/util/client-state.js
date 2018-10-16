import { getUser, getError, getQrCodeUri } from '../store/session';
import { isTabSidebarOpen, getTabDiscussionId, getTabMetadata } from '../store/tabs';
import { getComments } from '../store/discussions';

const buildClientState = (state, tabId) => {
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
            comments: getComments(state, discussionId),
        },
    };
};

export default buildClientState;
