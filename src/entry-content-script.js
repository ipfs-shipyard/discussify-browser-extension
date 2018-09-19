import retargetEvents from 'react-shadow-dom-retarget-events';
import createExtensionClient from './extension-client';
import { renderApp, destroyApp, configureStore } from './slices/frame';

const context = window.__DISCUSSIFY_INJECTION_CONTEXT__;

const hostEl = document.getElementById(context.hostElementId);
const rootEl = hostEl.shadowRoot.querySelector('[data-role="root"]');
const extensionClient = createExtensionClient();
const store = configureStore(extensionClient);

hostEl.addEventListener(context.destroyEvent, () => {
    destroyApp(rootEl);
    extensionClient.destroy();
    hostEl.remove();
    context.injected = false;
});

retargetEvents(hostEl);
renderApp(rootEl, store);
context.injected = true;
