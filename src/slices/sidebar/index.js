import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { Modal } from '@discussify/styleguide';
import configureStore from './shared/store';
import './index.css';
import App from './App';

const renderApp = (rootEl, store) => {
    Modal.setAppElement(rootEl);

    render(
        <Provider store={ store }>
            <App />
        </Provider>,
        rootEl
    );
};

const destroyApp = (rootEl) => {
    unmountComponentAtNode(rootEl);
};

export { renderApp, destroyApp, configureStore };
