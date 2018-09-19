import { UPDATE_STATE, isAuthenticated } from '../extension';
import { open, close } from './actions';

const OPEN_DELAY = 2000;

const middleware = (store) => {
    let openTimeout;

    return (next) => (action) => {
        if (action.type !== UPDATE_STATE) {
            return next(action);
        }

        const previousAuthenticated = isAuthenticated(store.getState());
        const ret = next(action);
        const authenticated = isAuthenticated(store.getState());

        // Open the sidebar when the user logs in
        if (!previousAuthenticated && authenticated) {
            clearTimeout(openTimeout);
            openTimeout = setTimeout(() => store.dispatch(open()), OPEN_DELAY);
        // Close sidebar when the user logs out
        } else if (previousAuthenticated && !authenticated) {
            clearTimeout(openTimeout);
            store.dispatch(close());
        }

        return ret;
    };
};

export default middleware;
