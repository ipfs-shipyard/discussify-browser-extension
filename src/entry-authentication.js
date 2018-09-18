import createExtensionClient from './extension-client';
import { renderApp, configureStore } from './slices/authentication';

const rootEl = document.getElementById('root');
const extensionClient = createExtensionClient();
const store = configureStore(extensionClient);

renderApp(rootEl, store);

console.log('ok authentication!');
