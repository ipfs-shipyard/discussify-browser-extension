import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './reducer';

const configureStore = (extensionClient) => {
    const middlewares = [
        thunk.withExtraArgument({ extensionClient }),
        logger,
    ];

    const store = createStore(
        reducer,
        undefined,
        applyMiddleware(...middlewares),
    );

    extensionClient.onSliceStateChange((sliceState) => {
        console.log('sliceState', sliceState);
    });

    return store;
};

export default configureStore;

export * from './actions';
export * from './selectors';
