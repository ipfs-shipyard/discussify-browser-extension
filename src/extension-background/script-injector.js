import serialize from 'serialize-javascript';
import { PRE_DESTROY_DONE } from './message-types';

const HOST_ELEMENT_ID = window.__DISCUSSIFY_HOST_ELEMENT_ID__;
const PRE_DESTROY_EVENT = 'discussify/pre-destroy';
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

const injectContext = async (tabId, clientState) => {
    const context = {
        hostElementId: HOST_ELEMENT_ID,
        destroyEvent: DESTROY_EVENT,
        preDestroyEvent: PRE_DESTROY_EVENT,
        state: clientState,
        injected: false,
    };

    const result = await browser.tabs.executeScript(tabId, {
        code: `
            (() => {
                window.__DISCUSSIFY_INJECTION_CONTEXT__ = ${serialize(context, { isJSON: true })};

                return true;
            })();
        `,
    });

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

const preDestroyContentScript = async (tabId) => {
    const result = await browser.tabs.executeScript(tabId, {
        code: `
        (() => {
            const hostEl = document.getElementById('${HOST_ELEMENT_ID}');
            hostEl.dispatchEvent(new Event('${PRE_DESTROY_EVENT}'));

            return true;
        })();`,
    });

    if (!result[0]) {
        return false;
    }

    return new Promise((resolve) => {
        const listener = (request) => {
            if (request.type !== PRE_DESTROY_DONE) {
                return;
            }

            browser.runtime.onMessage.removeListener(listener);
            resolve(true);
        };

        browser.runtime.onMessage.addListener(listener);
    });
};

const destroyContentScript = async (tabId) => {
    const result = await browser.tabs.executeScript(tabId, {
        code: `
        (() => {
            const hostEl = document.getElementById('${HOST_ELEMENT_ID}');
            const context = window.__DISCUSSIFY_INJECTION_CONTEXT__;
            let success = false;

            if (hostEl && context) {
                hostEl.dispatchEvent(new Event('${DESTROY_EVENT}'));
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

export const injectScript = async (tabId, clientState) => {
    const tab = await browser.tabs.get(tabId);

    assertUrlSupported(tab.url);

    // Check if already injected
    let injected = await getContextInjectedValue(tabId);

    if (injected) {
        return injected;
    }

    await injectContext(tabId, clientState);
    await executeContentScript(tabId);

    injected = await getContextInjectedValue(tabId);

    if (!injected) {
        throw Object.assign(
            new Error('Content script failed to load'),
            { code: 'SCRIPT_INJECTION_FAILED' }
        );
    }
};

export const removeScript = async (tabId) => {
    let success = await preDestroyContentScript(tabId);

    success = success && await destroyContentScript(tabId);

    if (!success) {
        throw Object.assign(
            new Error('Content script failed to unload'),
            { code: 'SCRIPT_REMOVAL_FAILED' }
        );
    }
};
