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
        createComment: (previousId, body) => callBackgroundMethod(tabId, 'discussion.createComment', previousId, body),
        updateComment: (id, body) => callBackgroundMethod(tabId, 'discussion.updateComment', id, body),
        removeComment: (id) => callBackgroundMethod(tabId, 'discussion.removeComment', id),
        replyToComment: (parentId, previousId, body) => callBackgroundMethod(tabId, 'discussion.replyToComment', parentId, previousId, body),
        loadComments: (ids) => callBackgroundMethod(tabId, 'discussion.loadComments', ids),
        loadCommentHistory: (id) => callBackgroundMethod(tabId, 'discussion.loadCommentHistory', id),
    },
});

export default createMethods;
