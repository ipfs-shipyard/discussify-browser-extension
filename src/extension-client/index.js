import { messageTypes } from '../extension';

const sendMethodCallMessage = (name, args) =>
    browser.runtime.sendMessage({
        type: messageTypes.METHOD_CALL,
        payload: {
            name,
            args,
        },
    });

const createExtensionClient = () => {
    const handlers = {
        onSliceStateChange: () => {},
    };

    const methods = {
        setSliceState: (state) => handlers.onSliceStateChange(state),
    };

    const handleOnMessage = (request) => {
        if (request.type === messageTypes.METHOD_CALL) {
            const { name, args } = request.payload;

            console.log('exec method', name, args);

            if (methods[name]) {
                methods[name](...args);
            } else {
                throw Object.assign(
                    new Error(`Unknown method: ${name}`),
                    { code: 'UNKNOWN_METHOD' }
                );
            }
        }
    };

    browser.runtime.onMessage.addListener(handleOnMessage);

    return {
        setUser: (user) => sendMethodCallMessage('setUser', [user]),

        setSidebarOpen: (tabId, open) => sendMethodCallMessage('setSidebarOpen', [tabId, open]),

        onSliceStateChange: (handler) => {
            handlers.onSliceStateChange = handler;
        },

        destroy: () => {
            browser.runtime.onMessage.removeListener(handleOnMessage);
        },
    };
};

export default createExtensionClient;
