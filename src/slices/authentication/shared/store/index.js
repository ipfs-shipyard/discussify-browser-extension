import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './reducer';

const configureStore = (extensionClient) => {
    const middlewares = [
        thunk.withExtraArgument({ extensionClient }),
        logger,
    ];

    return createStore(
        reducer,
        undefined,
        applyMiddleware(...middlewares),
    );
};

export default configureStore;

export * from './actions';
export * from './selectors';
