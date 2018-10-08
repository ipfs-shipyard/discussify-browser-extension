import * as actionTypes from './action-types';

const comment = {
    id: '432das42432432',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    author: {
        avatar: 'https://ipfs.infura.io/ipfs/Qme2BurB5BFTLxTqmjUBu7qgsE96iCpf6iJD9MurhBRoSC',
        did: 'did:uport:2odP6zYTh8K95xztx3qpf3RishNXdUFCkH6',
        name: 'André Cruz',
    },
    createdAt: '2018-10-01T01:16:26.788Z',
};

const initialState = {
    error: null,
    loading: false,
    comments: [comment],
};

const createComment = (state, action) => ({
    ...state,
    comments: [...state.comments, action.payload.comment],
});

const removeComment = (state, action) => {
    const { id } = action.payload;

    return {
        ...state,
        comments: state.comments.map((comment) => comment.id === id ?
            {
                ...comment,
                removed: true,
            } :
            comment,
        ),
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.CREATE_COMMENT:
        return createComment(state, action);
    case actionTypes.REMOVE_COMMENT:
        return removeComment(state, action);
    default:
        return state;
    }
};

export default reducer;
