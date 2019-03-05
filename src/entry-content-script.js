import retargetEvents from 'react-shadow-dom-retarget-events';
import createExtensionClient from './extension-client';
import { renderApp, preDestroyApp, destroyApp } from './slices/main';
import { PRE_DESTROY_DONE } from './extension-background/message-types';

const context = window.__DISCUSSIFY_INJECTION_CONTEXT__;
const hostEl = document.getElementById(context.hostElementId);
const rootEl = hostEl.shadowRoot.querySelector('[data-role="root"]');

// Unlike other slices that use `extensionClient.getState`, we grab the
// state from `__DISCUSSIFY_INJECTION_CONTEXT__`
// The reason is that all this process must be sync in order for the injection errors to be detected
const extensionClient = createExtensionClient({ initialState: context.state });

const appLifecycleArgs = [
    rootEl,
    extensionClient,
    () => browser.runtime.sendMessage({ type: PRE_DESTROY_DONE }),
];

hostEl.addEventListener(context.preDestroyEvent, () => preDestroyApp(...appLifecycleArgs));

hostEl.addEventListener(context.destroyEvent, () => {
    destroyApp(rootEl);
    extensionClient.destroy();
    hostEl.remove();
    context.injected = false;
});

retargetEvents(hostEl);
renderApp(...appLifecycleArgs);
context.injected = true;
