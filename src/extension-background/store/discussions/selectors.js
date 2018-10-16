import { get } from 'lodash';

export const hasDiscussion = (state, discussionId) => !!state.discussions[discussionId];

export const isDependantOnDiscussion = (state, discussionId, tabId) =>
    state[discussionId] && state[discussionId].dependants.includes(tabId);

export const getDiscussionDependantsCount = (state, discussionId) =>
    get(state.discussions, [discussionId, 'dependants'], []).length;

export const getComments = (state, discussionId) =>
    get(state.discussions, [discussionId, 'comments']);

export const getSerializedDiscussions = () => {};
