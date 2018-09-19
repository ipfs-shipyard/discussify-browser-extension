import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import reducer from './reducer';

const configureStore = (initialState) =>
    createStore(
        reducer,
        initialState,
        applyMiddleware(logger),
    );

export default configureStore;

export * from './reducer';
export * from './actions';
export * from './selectors';
