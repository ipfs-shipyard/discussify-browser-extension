// import { UNAUTHENTICATE, AUTHENTICATE_OK } from '../session';
import { open, close } from './actions';

const OPEN_DELAY = 2000;

const middleware = (store) => {
    let openTimeout;

    return (next) => (action) => {
        const ret = next(action);

        // // Open the sidebar when the user logs in
        // if (action.type === AUTHENTICATE_OK) {
        //     openTimeout = setTimeout(() => {
        //         store.dispatch(open());
        //     }, OPEN_DELAY);
        // }
        //
        // // Close sidebar when the user logs out
        // if (action.type === UNAUTHENTICATE) {
        //     clearTimeout(openTimeout);
        //     store.dispatch(close());
        // }

        return ret;
    };
};

export default middleware;
