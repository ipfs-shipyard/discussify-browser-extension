import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { reducer as extensionReducer, updateState } from './extension';
import { reducer as sidebarReducer, middleware as sidebarMiddleware } from './sidebar';

const reducer = combineReducers({
    extension: extensionReducer,
    sidebar: sidebarReducer,
});

const configureStore = (extensionClient) => {
    const middlewares = [
        thunk.withExtraArgument({ extensionClient }),
        sidebarMiddleware,
        logger,
    ];

    const store = createStore(reducer, {}, applyMiddleware(...middlewares));

    // Update extension state whenever it changes
    extensionClient.onSliceStateChange((sliceState) => {
        console.log('slice state change', sliceState);
        store.dispatch(updateState(sliceState));
    });

    return store;
};

export default configureStore;
