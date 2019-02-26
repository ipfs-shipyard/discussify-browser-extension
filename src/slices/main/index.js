import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import './index.css';
import { KeyboardOnlyOutlines } from '@discussify/styleguide';
import { ExtensionProvider } from '../../react-extension-client';
import App from './App';

const renderApp = (rootEl, extensionClient, onDestroy, props = {}) => {
    render(
        <ExtensionProvider extensionClient={ extensionClient }>
            <KeyboardOnlyOutlines>
                <App onDestroy={ onDestroy } { ...props } />
            </KeyboardOnlyOutlines>
        </ExtensionProvider>,
        rootEl
    );
};

const preDestroyApp = (...args) => renderApp(...args, { destroy: true });

const destroyApp = (rootEl) => unmountComponentAtNode(rootEl);

export { renderApp, preDestroyApp, destroyApp };
