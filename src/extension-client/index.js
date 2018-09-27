import { messageTypes } from '../extension';

const getCurrentTabId = async () => {
    const tab = await browser.tabs.getCurrent();

    return tab.id;
};

const createExtensionClient = (tabId) => {
    const handlers = {
        onSliceStateChange: () => {},
    };

    const methods = {
        setSliceState: (state) => handlers.onSliceStateChange(state),
    };

    const getTabId = async () => {
        if (tabId == null) {
            tabId = await getCurrentTabId();
        }

        return tabId;
    };

    const handleOnMessage = (request) => {
        if (request.type === messageTypes.CALL_CLIENT_METHOD) {
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
                type: messageTypes.CALL_BACKGROUND_METHOD,
                payload: {
                    name: 'setUser',
                    args: [user],
                },
            }),

        dismissInjectionError: async () => {
            const tabId = await getTabId();

            return browser.runtime.sendMessage({
                type: messageTypes.CALL_BACKGROUND_METHOD,
                payload: {
                    name: 'dismissInjectionError',
                    args: [tabId],
                },
            });
        },

        onSliceStateChange: (handler) => {
            handlers.onSliceStateChange = handler;
        },

        destroy: () => {
            browser.runtime.onMessage.removeListener(handleOnMessage);
        },
    };
};

export default createExtensionClient;
