import { forIn, reduce } from 'lodash';

// State:
// {
//   ab: {
//       id: 'ab',
//       parentId: undefined, // Points to the parent entry id in case it's a reply
//       previousId: undefined, // Points to the last seen entry id, used for sorting
//       createdAt: 1539874585185, // Date of creation, used for sorting as a tiebreaker for previousId
//       updatedAt: 1539874585185, // Date of update of the entry, used to determine which entry wins when merging enntries with the same id
//       cid: 'xx' // The cid of the ipfs object for the comment
//   },
// };
//
// CID:
// {
//    author,
//    body,
//    timestamp,
// };

const compareConcurrentEntries = (id1, id2, entries) => {
    const entry1 = entries[id1];
    const entry2 = entries[id2];

    if (entry1.createdAt < entry2.createdAt) {
        return -1;
    }

    if (entry1.createdAt > entry2.createdAt) {
        return 1;
    }

    if (entry1.cid < entry2.cid) {
        return -1;
    }

    if (entry1.cid > entry2.cid) {
        return 1;
    }

    // This should not happen!
    return 0;
};

export default {
    initial: () => ({}),
    join(state, otherState) {
        state = { ...state };

        forIn(otherState, (otherEntry, id) => {
            const thisEntry = state[id];

            // Just copy the other replica's entry in case we don't have it yet
            if (!thisEntry) {
                state[id] = otherEntry;
            // Compare the dates in case the same entry was updated concurrently
            // Often dates are different but there's clock skew..
            // We fallback to compare the cid so that the result is deterministic
            } else {
                const thisTimestamp = thisEntry.updatedAt || thisEntry.createdAt;
                const otherTimestamp = otherEntry.updatedAt || otherEntry.createdAt;
                const datesDiff = thisTimestamp - otherTimestamp;

                if (datesDiff < 0 || (datesDiff === 0 && thisEntry.cid < otherEntry.cid)) {
                    state[id] = otherEntry;
                }
            }
        });

        return state;
    },

    mutators: {
        create: (id, state, entry) => {
            const commentId = entry.id;

            if (state[entry.id]) {
                throw new Error(`Comment with id ${commentId} already exists`);
            }

            return {
                [commentId]: {
                    ...entry,
                    createdAt: Date.now(),
                },
            };
        },

        update: (id, state, commentId, cid) => {
            const entry = state[commentId];

            if (!entry) {
                throw new Error(`Comment with id ${commentId} does not exist`);
            }

            return {
                [commentId]: {
                    ...entry,
                    cid,
                    updatedAt: Date.now(),
                },
            };
        },
    },
    value: (state) => {
        // Create a map of <id,[afterIds]>, where the `initial` key contains the first comment(s)
        // This temporary map will allow us to iterate by casuality
        const afterIdsMap = reduce(state, (afterIdsMap, entry, id) => {
            const previousId = entry.previousId || 'initial';

            afterIdsMap[previousId] = afterIdsMap[previousId] || [];
            afterIdsMap[previousId].push(id);

            return afterIdsMap;
        }, { initial: [] });

        // Order concurrent entries in the temporary map created above
        // The conncurrent definition here is a comment that has the same previousId as another onne
        forIn(afterIdsMap, (afterIds) => {
            afterIds.sort((id1, id2) => compareConcurrentEntries(id1, id2, state));
        });

        // Iterate over the `afterIds` by order, starting with the initial ones, in order to
        // build a an array of ids ordered by casuality
        const orderedIds = [];
        const stack = [...afterIdsMap.initial];

        while (stack.length) {
            const id = stack.shift();
            const afterIds = afterIdsMap[id] || [];

            stack.push(...afterIds);
            orderedIds.push(id);
        }

        return {
            ids: orderedIds,
            entries: state,
        };
    },
};
