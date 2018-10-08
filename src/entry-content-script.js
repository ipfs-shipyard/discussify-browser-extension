import retargetEvents from 'react-shadow-dom-retarget-events';
import createExtensionClient from './extension-client';
import { renderApp, destroyApp, configureStore } from './slices/main';

const context = window.__DISCUSSIFY_INJECTION_CONTEXT__;
const hostEl = document.getElementById(context.hostElementId);
const rootEl = hostEl.shadowRoot.querySelector('[data-role="root"]');
const extensionClient = createExtensionClient();

// Unlike other slices that use `extensionClient.getSliceState`, we grab the
// state from `__DISCUSSIFY_INJECTION_CONTEXT__`
// The reason is that all this process must be sync in order for the injection errors to be detected
const store = configureStore(extensionClient, { extension: context.sliceState });

hostEl.addEventListener(context.destroyEvent, () => {
    destroyApp(rootEl);
    extensionClient.destroy();
    hostEl.remove();
    context.injected = false;
});

retargetEvents(hostEl);
renderApp(rootEl, store);
context.injected = true;
