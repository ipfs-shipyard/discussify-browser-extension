import createExtensionClient from './extension-client';
import { renderApp, destroyApp, configureStore } from './slices/frame';

const context = window.__DISCUSSIFY_INJECTION_CONTEXT__;

console.log('context', window.__DISCUSSIFY_INJECTION_CONTEXT__);

const extensionEl = document.getElementById('discussify-host');
const rootEl = extensionEl.shadowRoot.querySelector('[data-role="root"]');
const extensionClient = createExtensionClient();
const store = configureStore(extensionClient);

rootEl.addEventListener(context.destroyEvent, () => {
    destroyApp(rootEl);
    extensionClient.destroy();
    extensionEl.remove();
    context.injected = false;
});

renderApp(rootEl, store);
context.injected = true;

console.log('ok!');
