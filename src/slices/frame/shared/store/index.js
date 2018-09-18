import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
// import { reducer as sessionReducer } from './session';
import { reducer as sidebarReducer, middleware as sidebarMiddleware } from './sidebar';

const reducer = combineReducers({
    // Session: sessionReducer,
    sidebar: sidebarReducer,
});

const configureStore = (extensionClient) => {
    const middlewares = [
        thunkMiddleware.withExtraArgument({ extensionClient }),
        sidebarMiddleware,
    ];
    const enhancer = applyMiddleware(...middlewares);

    const store = createStore(reducer, {}, enhancer);

    extensionClient.onSliceStateChange(() => {
        // TODO:
    });

    return store;
};

export default configureStore;
