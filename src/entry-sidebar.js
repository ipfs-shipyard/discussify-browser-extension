import createExtensionClient from './extension-client';
import { renderApp, configureStore } from './slices/sidebar';

const rootEl = document.getElementById('root');
const extensionClient = createExtensionClient();
const store = configureStore(extensionClient);

renderApp(rootEl, store);
