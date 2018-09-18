import serialize from 'serialize-javascript';

const DESTROY_EVENT = 'discussify/destroy';
const SUPPORTED_PROTOCOLS = ['http:', 'https:', 'ftp:'];

const assertUrlSupported = (url) => {
    // Injection of content scripts is limited to a small number of protocols,
    // see https://developer.chrome.com/extensions/match_patterns
    const { protocol } = new URL(url);
    const isSupported = SUPPORTED_PROTOCOLS.includes(protocol);

    if (!isSupported) {
        throw Object.assign(
            new Error(`Cannot load extension into "${protocol}" pages`),
            { code: 'UNSUPPORTED_PROTOCOL' }
        );
    }
};

const injectContext = async (tabId, sliceState) => {
    const context = {
        destroyEvent: DESTROY_EVENT,
        sliceState,
        injected: false,
    };

    const result = await browser.tabs.executeScript(tabId, {
        code: `
            (() => {
                if (window.__DISCUSSIFY_INJECTION_CONTEXT__) {
                    return false;
                }

                window.__DISCUSSIFY_INJECTION_CONTEXT__ = ${serialize(context, { isJSON: true })};

                return true;
            })();
        `,
    });

    if (result[0] === false) {
        throw Object.assign(
            new Error('Content script already injected'),
            { code: 'ALREADY_INJECTED' }
        );
    }

    if (!result[0]) {
        throw Object.assign(
            new Error('Content script failed to load'),
            { code: 'SCRIPT_INJECTION_FAILED' }
        );
    }
};

const executeContentScript = (tabId) =>
    browser.tabs.executeScript(tabId, {
        file: '/build/content-script.js',
    });

const executeDestroyContentScript = async (tabId) => {
    const result = await browser.tabs.executeScript(tabId, {
        code: `
        (() => {
            const rootEl = document.getElementById('discussify-host');
            const context = window.__DISCUSSIFY_INJECTION_CONTEXT__;
            let success = false;

            if (rootEl && context) {
                rootEl.dispatchEvent(new Event('${DESTROY_EVENT}'));
                success = context.injected === false;
                delete window.__DISCUSSIFY_INJECTION_CONTEXT__;
            }

            return success;
        })();`,
    });

    return result[0] === true;
};

const getContextInjectedValue = async (tabId) => {
    const result = await browser.tabs.executeScript(tabId, {
        code: `
        (() => {
            const context = window.__DISCUSSIFY_INJECTION_CONTEXT__;

            return context ? context.injected === true : false;
        })();`,
    });

    return result[0];
};

export const injectScript = async (tabId, sliceState) => {
    const tab = await browser.tabs.get(tabId);

    assertUrlSupported(tab.url);

    await injectContext(tabId, sliceState);
    await executeContentScript(tabId);

    const injected = await getContextInjectedValue(tabId);

    if (!injected) {
        throw Object.assign(
            new Error('Content script failed to load'),
            { code: 'SCRIPT_INJECTION_FAILED' }
        );
    }
};

export const removeScript = async (tabId) => {
    const success = await executeDestroyContentScript(tabId);

    if (!success) {
        throw Object.assign(
            new Error('Content script failed to unload'),
            { code: 'SCRIPT_REMOVAL_FAILED' }
        );
    }
};
