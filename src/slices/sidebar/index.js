import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import './index.css';
import { Modal, KeyboardOnlyOutlines } from '@discussify/styleguide';
import { ExtensionProvider } from '../../react-extension-client';
import App from './App';

const renderApp = (rootEl, extensionClient) => {
    Modal.setAppElement(rootEl);

    render(
        <ExtensionProvider extensionClient={ extensionClient }>
            <KeyboardOnlyOutlines>
                <App />
            </KeyboardOnlyOutlines>
        </ExtensionProvider>,
        rootEl
    );
};

const destroyApp = (rootEl) => {
    unmountComponentAtNode(rootEl);
};

export { renderApp, destroyApp };
