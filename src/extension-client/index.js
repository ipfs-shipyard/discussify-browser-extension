import { messageTypes } from '../extension';

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
        setUser: (user) =>
            browser.runtime.sendMessage({
                type: messageTypes.METHOD_CALL,
                payload: {
                    name: 'setUser',
                    args: [user],
                },
            }),

        setSidebarOpen: (tabId, open) =>
            browser.runtime.sendMessage({
                type: messageTypes.METHOD_CALL,
                payload: {
                    name: 'setSidebarOpen',
                    args: [tabId, open],
                },
            }),

        onSliceStateChange: (handler) => {
            handlers.onSliceStateChange = handler;
        },

        destroy: () => {
            browser.runtime.onMessage.removeListener(handleOnMessage);
        },
    };
};

export default createExtensionClient;
