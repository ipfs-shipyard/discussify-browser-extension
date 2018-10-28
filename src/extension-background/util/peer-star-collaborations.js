import PeerStarApp from 'peer-star-app';

const collaborations = new Map();

export const getCollaboration = (name) => collaborations.get(name);

export const hasCollaboration = (name) => !!getCollaboration(name);

export const startCollaboration = async (peerStarApp, name, ...args) => {
    let collaboration = await getCollaboration(name);

    if (collaboration) {
        return collaboration;
    }

    const collaborationPromise = (async () => {
        await peerStarApp.start();

        return peerStarApp.collaborate(name, ...args);
    })();

    collaborations.set(name, collaborationPromise);

    collaboration = await collaborationPromise;
    collaboration.on('stopped', () => collaborations.delete(name));

    return collaboration;
};

export const stopCollaboration = async (peerStarApp, name) => {
    const collaboration = await getCollaboration(name);

    // Calling stop will trigger the 'stop' event, which in turn
    // will remove any the collaboration from the internal state
    return collaboration && collaboration.stop();
};

export const registerCollaborationType = (name, crdt) =>
    PeerStarApp.collaborationTypes.define(name, crdt);
