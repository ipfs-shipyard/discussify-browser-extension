import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import reducer, { initialState } from './reducer';

const configureStore = (initialState) =>
    createStore(
        reducer,
        initialState,
        applyMiddleware(logger),
    );

export default configureStore;

export { initialState };
export * from './actions';
export * from './selectors';
