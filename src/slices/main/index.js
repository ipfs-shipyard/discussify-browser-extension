import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import './index.css';
import { KeyboardOnlyOutlines } from '@discussify/styleguide';
import { ExtensionProvider } from '../../react-extension-client';
import App from './App';

let finalize;

const setFinalizeCallback = (cb) => (finalize = cb);

const renderApp = (rootEl, extensionClient, onFinalized) => {
    render(
        <ExtensionProvider extensionClient={ extensionClient }>
            <KeyboardOnlyOutlines>
                <App onFinalized={ onFinalized } setFinalizeCallback={ setFinalizeCallback } />
            </KeyboardOnlyOutlines>
        </ExtensionProvider>,
        rootEl
    );
};

const finalizeApp = () => finalize();

const destroyApp = (rootEl) => {
    unmountComponentAtNode(rootEl);
};

export { renderApp, finalizeApp, destroyApp };
