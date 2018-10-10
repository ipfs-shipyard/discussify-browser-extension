import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUser, getUrl, getMetadata, closeSidebar } from './shared/store/extension';
import { getComments, createComment, updateComment, removeComment } from './shared/store/discussion';
import TopBar from './top-bar';
import BottomBar from './bottom-bar';
import CommentsList from './comments-list';
import styles from './App.css';

const App = ({
    user,
    url,
    metadata,
    comments,
    onSidebarClose,
    onCommentCreate,
    onCommentUpdate,
    onCommentRemove,
}) => (
    <div className={ styles.app }>
        <TopBar
            url={ url }
            metadata={ metadata }
            onClose={ onSidebarClose } />

        <CommentsList
            user={ user }
            comments={ comments }
            onRemove={ onCommentRemove }
            onUpdate={ onCommentUpdate }
            className={ styles.commentsList } />

        <BottomBar
            onNewComment={ onCommentCreate } />
    </div>
);

App.propTypes = {
    user: PropTypes.object,
    url: PropTypes.string.isRequired,
    metadata: PropTypes.object,
    comments: PropTypes.object.isRequired,
    onSidebarClose: PropTypes.func.isRequired,
    onCommentCreate: PropTypes.func.isRequired,
    onCommentUpdate: PropTypes.func.isRequired,
    onCommentRemove: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: getUser(state),
    url: getUrl(state),
    metadata: getMetadata(state),
    comments: getComments(state),
});

const mapDispatchToProps = (dispatch) => ({
    onSidebarClose: () => dispatch(closeSidebar()),
    onCommentCreate: (body) => dispatch(createComment(body)),
    onCommentUpdate: (id, body) => dispatch(updateComment(id, body)),
    onCommentRemove: (id) => dispatch(removeComment(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
