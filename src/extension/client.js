import * as messageTypes from './modules/message-types';

const createExtensionClient = (onStateChange) => {
    chrome.runtime.onMessage.addListener((request) => {
        if (request.type === messageTypes.STATE_CHANGE) {
            onStateChange(request.payload);
        }
    });

    const sendMethodCallMessage = (name, args) => {
        chrome.runtime.sendMessage({
            type: messageTypes.METHOD_CALL,
            payload: {
                name,
                args,
            },
        });
    };

    return {
        setUser: (user) => sendMethodCallMessage('setUser', [user]),

        setSidebarOpen: (tabId, open) => sendMethodCallMessage('setSidebarOpen', [tabId, open]),
    };
};

export default createExtensionClient;
