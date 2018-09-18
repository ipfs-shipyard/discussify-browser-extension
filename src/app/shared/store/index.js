import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as sessionReducer } from './session';
import { reducer as sidebarReducer, middleware as sidebarMiddleware } from './sidebar';

const reducers = {
    session: sessionReducer,
    sidebar: sidebarReducer,
};

const middlewares = [
    thunkMiddleware,
    sidebarMiddleware,
];

const enhancers = [
    applyMiddleware(...middlewares),
];

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :
    compose;

const configureStore = (initialState = {}) => {
    const reducer = combineReducers(reducers);
    const enhancer = composeEnhancers(...enhancers);

    return createStore(reducer, initialState, enhancer);
};

export default configureStore;
