import { Connect, SimpleSigner as simpleSigner } from 'uport-connect';
import qrImage from 'qr-image';
import * as actionTypes from './action-types';

const uport = new Connect('Discussify - satazor test', {
    clientId: '2oepKFE2PXRQ82KWzachUW5nDJomaEDhXop',
    network: 'rinkeby',
    signer: simpleSigner('2b9ec2cc378f70baa1069d0be13d77484edee0df5912cde4467ff081a1af230f'),
});

export const authenticate = () => async (dispatch, getState, { extensionClient }) => {
    const uriHandler = (data, cancelPrompt) => {
        const pngBuffer = qrImage.imageSync(data, { type: 'png', margin: 0 });

        dispatch({
            type: actionTypes.AUTHENTICATE_PROMPT,
            payload: {
                cancelPrompt,
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

        await extensionClient.setUser(user);
    } catch (error) {
        // Ignore cancelation error which may be triggered by resetAuthenticate()
        if (/cancell?ed/i.test(error.message)) {
            return;
        }

        dispatch({
            type: actionTypes.AUTHENTICATE_ERROR,
            payload: { error },
        });

        throw error;
    }

    dispatch({
        type: actionTypes.AUTHENTICATE_OK,
        payload: { user },
    });
};

export const resetAuthenticate = () => (dispatch, getState) => {
    const { cancelPrompt } = getState();

    // Cancel uport requestCredentials, if any
    cancelPrompt && cancelPrompt();

    dispatch({ type: actionTypes.RESET_AUTHENTICATE });
};

export const unauthenticate = () => ({
    type: actionTypes.UNAUTHENTICATE,
});
