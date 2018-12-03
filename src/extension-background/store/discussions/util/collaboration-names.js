/* global DATA_VERSIONS */

// We are appending DATA_VERSIONS to collaboration name so that discussions are reset every time data structure changes
export const getCommentsCollaborationName = (discussionId) => `discussion-comments-${discussionId}-${DATA_VERSIONS.discussions}`;
