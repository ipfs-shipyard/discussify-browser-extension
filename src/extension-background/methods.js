import getClientState from './util/client-state';
import { authenticate, unauthenticate, cancelAuthenticate } from './store/session';
import { getTabDiscussionId, dismissTabInjectionError, openSidebar, closeSidebar } from './store/tabs';
import { createComment } from './store/discussions';

const createMethods = (store) => ({
    getState: (tabId) => getClientState(store.getState(), tabId),

    session: {
        authenticate: async () => {
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
        createComment: async (tabId, comment) => {
            const discussionId = getTabDiscussionId(store.getState(), tabId);

            store.dispatch(createComment(discussionId, comment));
        },
        removeComment: (tabId, commentId) => {

        },
        updateComment: (tabId, commentId, body) => {

        },
    },
});

export default createMethods;
