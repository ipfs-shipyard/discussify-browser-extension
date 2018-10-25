import { CALL_BACKGROUND_METHOD } from '../extension-background/message-types';

const callBackgroundMethod = (tabId, name, ...args) => (
    browser.runtime.sendMessage({
        type: CALL_BACKGROUND_METHOD,
        payload: {
            name,
            args,
            tabId,
        },
    })
);

const createMethods = (tabId) => ({
    getState: () => callBackgroundMethod(tabId, 'getState'),

    user: {
        set: (user) => callBackgroundMethod(tabId, 'user.set', user),
    },

    session: {
        authenticate: () => callBackgroundMethod(tabId, 'session.authenticate'),
        cancelAuthenticate: () => callBackgroundMethod(tabId, 'session.cancelAuthenticate'),
        unauthenticate: () => callBackgroundMethod(tabId, 'session.unauthenticate'),
    },

    tab: {
        openSidebar: () => callBackgroundMethod(tabId, 'tab.openSidebar'),
        closeSidebar: () => callBackgroundMethod(tabId, 'tab.closeSidebar'),
        dismissInjectionError: () => callBackgroundMethod(tabId, 'tab.dismissInjectionError'),
    },

    discussion: {
        createComment: (previousCommentId, body) => callBackgroundMethod(tabId, 'discussion.createComment', previousCommentId, body),
        updateComment: (commentId, body) => callBackgroundMethod(tabId, 'discussion.updateComment', commentId, body),
        removeComment: (commentId) => callBackgroundMethod(tabId, 'discussion.removeComment', commentId),
        loadComments: (commentIds) => callBackgroundMethod(tabId, 'discussion.loadComments', commentIds),
        loadCommentHistory: (commentId) => callBackgroundMethod(tabId, 'discussion.loadCommentHistory', commentId),
    },
});

export default createMethods;
