import * as actionTypes from './action-types';

export const open = () => ({
    type: actionTypes.OPEN,
});

export const close = () => ({
    type: actionTypes.CLOSE,
});

export const setPendingOpen = (pendingOpen) => ({
    type: actionTypes.SET_PENDING_OPEN,
    payload: {
        pendingOpen,
    },
});
