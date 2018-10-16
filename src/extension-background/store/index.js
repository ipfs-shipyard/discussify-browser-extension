import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { reducer as sessionReducer } from './session';
import { reducer as tabsReducer } from './tabs';
import { reducer as discussionsReducer } from './discussions';

const reducer = combineReducers({
    session: sessionReducer,
    tabs: tabsReducer,
    discussions: discussionsReducer,
});

const configureStore = (peerStarApp, initialState) => {
    const middlewares = [
        thunk.withExtraArgument({ peerStarApp }),
        logger,
    ];

    return createStore(reducer, initialState, applyMiddleware(...middlewares));
};

export default configureStore;
