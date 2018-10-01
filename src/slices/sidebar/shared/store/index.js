import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { reducer as extensionReducer, updateState } from './extension';
import { reducer as discussionReducer } from './discussion';

const reducer = combineReducers({
    extension: extensionReducer,
    discussion: discussionReducer,
});

const configureStore = (extensionClient, initialState = {}) => {
    const middlewares = [
        thunk.withExtraArgument({ extensionClient }),
        logger,
    ];

    const store = createStore(reducer, initialState, applyMiddleware(...middlewares));

    // Update extension state whenever it changes
    extensionClient.onSliceStateChange((sliceState) => {
        console.log('onSliceStateChange', sliceState);

        store.dispatch(updateState(sliceState));
    });

    return store;
};

export default configureStore;
