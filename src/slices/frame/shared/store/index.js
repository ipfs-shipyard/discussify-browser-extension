import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as sessionReducer } from './session';
import { reducer as sidebarReducer, middleware as sidebarMiddleware } from './sidebar';

const reducer = combineReducers({
    session: sessionReducer,
    sidebar: sidebarReducer,
});

const configureStore = (extensionClient) => {
    const middlewares = [
        thunkMiddleware.withExtraArgument({ extensionClient }),
        sidebarMiddleware,
    ];
    const enhancer = applyMiddleware(...middlewares);

    const store = createStore(reducer, {}, enhancer);

    extensionClient.onSliceStateChange((sliceState) => {
        console.log('slice state', sliceState);
    });

    return store;
};

export default configureStore;
