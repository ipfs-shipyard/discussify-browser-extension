import createExtensionClient from './extension-client';
import { renderApp, configureStore } from './slices/sidebar';

const rootEl = document.getElementById('root');
const extensionClient = createExtensionClient();

extensionClient.getSliceState()
.then((sliceState) => {
    const store = configureStore(extensionClient, { extension: sliceState });

    renderApp(rootEl, store);
});
