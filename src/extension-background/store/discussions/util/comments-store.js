export const retrieveComment = async (peerStarApp, cid) => {
    const data = await peerStarApp.object.data(cid);

    return JSON.parse(data.toString());
};

export const retrieveComments = async (ipfs, cids) => {
    const result = {};

    await Promise.all(cids.map(async (cid) => {
        try {
            const comment = await retrieveComment(ipfs, cid);

            result[cid] = { type: 'ok', comment };
        } catch (error) {
            result[cid] = { type: 'error', error };
        }
    }));

    return result;
};

export const storeComment = async (ipfs, comment) => {
    const data = Buffer.from(JSON.stringify(comment));
    const result = await ipfs.object.put(data);

    return result.toJSON().multihash;
};
