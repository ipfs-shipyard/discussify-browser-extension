import React from 'react';
import PropTypes from 'prop-types';
import { connectExtension } from '../../react-extension-client';
import TopBar from './top-bar';
import BottomBar from './bottom-bar';
import CommentsList from './comments-list';
import styles from './App.css';

const App = ({
    user,
    metadata,
    comments,
    onSidebarClose,
    onCommentCreate,
    onCommentUpdate,
    onCommentRemove,
}) => (
    <div className={ styles.app }>
        <TopBar
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
    metadata: PropTypes.object.isRequired,
    comments: PropTypes.object.isRequired,
    onSidebarClose: PropTypes.func.isRequired,
    onCommentCreate: PropTypes.func.isRequired,
    onCommentUpdate: PropTypes.func.isRequired,
    onCommentRemove: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.session.user,
    metadata: state.tab.metadata,
    comments: state.discussion.comments,
});

const mapMethodsToProps = (methods) => ({
    onSidebarClose: () => methods.tab.closeSidebar(),
    onCommentCreate: (body) => methods.discussion.createComment(body),
    onCommentUpdate: (id, body) => methods.discussion.updateComment(id, body),
    onCommentRemove: (id) => methods.discussion.removeComment(id),
});

export default connectExtension(mapStateToProps, mapMethodsToProps)(App);
