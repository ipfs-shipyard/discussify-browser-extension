import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUrl, getMetadata, closeSidebar } from './shared/store/extension';
import { getComments, createComment, removeComment } from './shared/store/discussion';
import TopBar from './top-bar';
import BottomBar from './bottom-bar';
import CommentsList from './comments-list';
import styles from './App.css';

const App = ({ url, metadata, comments, onSidebarClose, onCommentCreate, onCommentRemove }) => (
    <div className={ styles.app }>
        <TopBar
            url={ url }
            metadata={ metadata }
            onClose={ onSidebarClose } />

        <CommentsList
            comments={ comments }
            onRemove={ onCommentRemove }
            className={ styles.commentsList } />

        <BottomBar
            onNewComment={ onCommentCreate } />
    </div>
);

App.propTypes = {
    url: PropTypes.string.isRequired,
    metadata: PropTypes.object,
    comments: PropTypes.object.isRequired,
    onSidebarClose: PropTypes.func.isRequired,
    onCommentCreate: PropTypes.func.isRequired,
    onCommentRemove: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    url: getUrl(state),
    metadata: getMetadata(state),
    comments: getComments(state),
});

const mapDispatchToProps = (dispatch) => ({
    onSidebarClose: () => dispatch(closeSidebar()),
    onCommentCreate: (body) => dispatch(createComment(body)),
    onCommentRemove: (id) => dispatch(removeComment(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
