import { Connect, SimpleSigner as simpleSigner } from 'uport-connect';
import qrImage from 'qr-image';
import * as actionTypes from './action-types';
import { isAuthenticating, getTimeoutId, getCancelFn } from './selectors';

const uport = new Connect('Discussify - satazor test', {
    clientId: '2oepKFE2PXRQ82KWzachUW5nDJomaEDhXop',
    network: 'rinkeby',
    signer: simpleSigner('2b9ec2cc378f70baa1069d0be13d77484edee0df5912cde4467ff081a1af230f'),
});

const AUTHENTICATE_TIMEOUT = 5 * 60 * 1000;

export const authenticate = () => async (dispatch, getState) => {
    // Skip if already authenticating
    const alreadyAuthenticating = isAuthenticating(getState());

    if (alreadyAuthenticating) {
        return;
    }

    // Cancel the process after a certain timeout
    const timeoutId = setTimeout(() => {
        const cancelFn = getCancelFn(getState());

        cancelFn && cancelFn();

        const error = Object.assign(
            new Error('The process timedout'),
            { code: 'TIMEDOUT' }
        );

        dispatch({
            type: actionTypes.AUTHENTICATE_ERROR,
            payload: { error },
        });
    }, AUTHENTICATE_TIMEOUT);

    // Signal the start of the process
    dispatch({
        type: actionTypes.AUTHENTICATE_START,
        payload: {
            timeoutId,
        },
    });

    // Call uport!
    const uriHandler = (data, cancelFn) => {
        const pngBuffer = qrImage.imageSync(data, { type: 'png', margin: 0 });

        dispatch({
            type: actionTypes.AUTHENTICATE_PROMPT,
            payload: {
                cancelFn,
                qrCodeUri: `data:image/png;charset=utf-8;base64, ${pngBuffer.toString('base64')}`,
            },
        });
    };

    let user;

    try {
        const profile = await uport.requestCredentials({
            requested: ['name', 'avatar'],
        }, uriHandler);

        user = {
            did: `did:uport:${profile.did}`,
            name: profile.name,
            avatar: profile.avatar && profile.avatar.uri,
        };
    } catch (error) {
        // Ignore cancelation error which may be triggered when dispatching the cancelAuthenticate action
        if (/cancell?ed/i.test(error.message)) {
            return;
        }

        dispatch({
            type: actionTypes.AUTHENTICATE_ERROR,
            payload: { error },
        });

        throw error;
    } finally {
        clearTimeout(timeoutId);
    }

    dispatch({
        type: actionTypes.AUTHENTICATE_OK,
        payload: { user },
    });
};

export const cancelAuthenticate = () => (dispatch, getState) => {
    const timeoutId = getTimeoutId(getState());
    const cancelFn = getCancelFn(getState());

    // Cancel the prompt timeout
    clearTimeout(timeoutId);

    // Cancel uport requestCredentials, if any
    cancelFn && cancelFn();

    dispatch({ type: actionTypes.CANCEL_AUTHENTICATE });
};

export const unauthenticate = () => ({
    type: actionTypes.UNAUTHENTICATE,
});
