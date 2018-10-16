import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ExtensionProvider } from '../../react-extension-client';
import './index.css';
import App from './App';

const renderApp = (rootEl, extensionClient) => {
    render(
        <ExtensionProvider extensionClient={ extensionClient }>
            <App />
        </ExtensionProvider>,
        rootEl
    );
};

const destroyApp = (rootEl) => {
    unmountComponentAtNode(rootEl);
};

export { renderApp, destroyApp };
