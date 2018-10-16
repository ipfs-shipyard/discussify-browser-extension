import retargetEvents from 'react-shadow-dom-retarget-events';
import createExtensionClient from './extension-client';
import { renderApp, destroyApp } from './slices/main';

const context = window.__DISCUSSIFY_INJECTION_CONTEXT__;
const hostEl = document.getElementById(context.hostElementId);
const rootEl = hostEl.shadowRoot.querySelector('[data-role="root"]');

// Unlike other slices that use `extensionClient.getState`, we grab the
// state from `__DISCUSSIFY_INJECTION_CONTEXT__`
// The reason is that all this process must be sync in order for the injection errors to be detected
const extensionClient = createExtensionClient({ initialState: context.state });

hostEl.addEventListener(context.destroyEvent, () => {
    destroyApp(rootEl);
    extensionClient.destroy();
    hostEl.remove();
    context.injected = false;
});

retargetEvents(hostEl);
renderApp(rootEl, extensionClient);
context.injected = true;
