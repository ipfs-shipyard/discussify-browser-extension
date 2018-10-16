import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import './index.css';
import App from './App';

const renderApp = (rootEl, error, extensionClient) => {
    const handleDismiss = async () => {
        await extensionClient.tab.dismissInjectionError();
        window.close();
    };

    /* eslint-disable react/jsx-no-bind */
    render(
        <App
            error={ error }
            onDismiss={ handleDismiss } />,
        rootEl
    );
    /* eslint-enable react/jsx-no-bind */
};

const destroyApp = (rootEl) => {
    unmountComponentAtNode(rootEl);
};

export { renderApp, destroyApp };
