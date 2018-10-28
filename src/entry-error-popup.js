import queryString from 'query-string';
import createExtensionClient from './extension-client';
import { renderApp } from './slices/error-popup';

const { message, code, tabId } = queryString.parse(location.search);
const rootEl = document.getElementById('root');
const extensionClient = createExtensionClient({ tabId });

renderApp(rootEl, { message, code }, extensionClient);
