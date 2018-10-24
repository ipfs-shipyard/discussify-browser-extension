export const retrieveComment = async (peerStarApp, cid) => {
    const data = await peerStarApp.object.data(cid);

    return JSON.parse(data.toString());
};

export const storeComment = async (peerStarApp, comment) => {
    const data = Buffer.from(JSON.stringify(comment));
    const result = await peerStarApp.object.put(data);

    return result.toJSON().multihash;
};
