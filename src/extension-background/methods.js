import getClientState from './util/client-state';
import { authenticate, unauthenticate, cancelAuthenticate } from './store/session';
import { getTabDiscussionId, dismissTabInjectionError, openSidebar, closeSidebar } from './store/tabs';
import { createComment, updateComment, removeComment, loadComment } from './store/discussions';

const createMethods = (store) => ({
    getState: (tabId) => getClientState(store.getState(), tabId),

    session: {
        authenticate: () => {
            store.dispatch(authenticate());
        },
        cancelAuthenticate: () => {
            store.dispatch(cancelAuthenticate());
        },
        unauthenticate: () => {
            store.dispatch(unauthenticate());
        },
    },

    tab: {
        openSidebar: (tabId) => {
            store.dispatch(openSidebar(tabId));
        },
        closeSidebar: (tabId) => {
            store.dispatch(closeSidebar(tabId));
        },
        dismissInjectionError: (tabId) => {
            store.dispatch(dismissTabInjectionError(tabId));
        },
    },

    discussion: {
        createComment: (tabId, previousCommentId, body) => {
            const discussionId = getTabDiscussionId(store.getState(), tabId);

            store.dispatch(createComment(discussionId, previousCommentId, body));
        },
        updateComment: (tabId, commentId, body) => {
            const discussionId = getTabDiscussionId(store.getState(), tabId);

            store.dispatch(updateComment(discussionId, commentId, body));
        },
        removeComment: (tabId, commentId) => {
            const discussionId = getTabDiscussionId(store.getState(), tabId);

            store.dispatch(removeComment(discussionId, commentId));
        },
        loadComment: (tabId, commentId) => {
            const discussionId = getTabDiscussionId(store.getState(), tabId);

            store.dispatch(loadComment(discussionId, commentId));
        },
        loadCommentHistory: (tabId, commentId) => {
            const discussionId = getTabDiscussionId(store.getState(), tabId);

            // store.dispatch(loadCommentHistory(discussionId, commentId));
        },
    },
});

export default createMethods;
