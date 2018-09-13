import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import '@discussify/styleguide/styles/index.css';
import configureStore from './shared/store';
import App from './App';

const renderApp = (rootEl) => {
    render(
        <Provider store={ configureStore() }>
            <App />
        </Provider>,
        rootEl
    );
};

export default renderApp;
