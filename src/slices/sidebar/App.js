import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { last } from 'lodash';
import { connectExtension } from '../../react-extension-client';
import TopBar from './top-bar';
import BottomBar from './bottom-bar';
import CommentsTree from './comments-tree';
import styles from './App.css';

class App extends Component {
    static propTypes = {
        user: PropTypes.object,
        metadata: PropTypes.object.isRequired,
        commentsTree: PropTypes.object.isRequired,
        onSidebarClose: PropTypes.func.isRequired,
        onCommentCreate: PropTypes.func.isRequired,
        onCommentUpdate: PropTypes.func.isRequired,
        onCommentRemove: PropTypes.func.isRequired,
        onCommentReply: PropTypes.func.isRequired,
        onCommentLoad: PropTypes.func.isRequired,
        onCommentLoadHistory: PropTypes.func.isRequired,
    };

    render() {
        const {
            user,
            metadata,
            commentsTree,
            onSidebarClose,
            onCommentUpdate,
            onCommentRemove,
            onCommentReply,
            onCommentLoad,
            onCommentLoadHistory,
        } = this.props;

        return (
            <div className={ styles.app }>
                <TopBar
                    metadata={ metadata }
                    onClose={ onSidebarClose } />

                <CommentsTree
                    user={ user }
                    commentsTree={ commentsTree }
                    onRemove={ onCommentRemove }
                    onUpdate={ onCommentUpdate }
                    onReply={ onCommentReply }
                    onLoad={ onCommentLoad }
                    onLoadHistory={ onCommentLoadHistory }
                    className={ styles.commentsList } />

                <BottomBar
                    onNewComment={ this.handleNewComment } />
            </div>
        );
    }

    handleNewComment = (body) => {
        const lastComment = last(this.props.commentsTree);
        const previousId = lastComment && lastComment.id;

        this.props.onCommentCreate(previousId, body);
    };
}

const mapStateToProps = (state) => ({
    user: state.session.user,
    metadata: state.tab.metadata,
    commentsTree: state.discussion.commentsTree,
});

const mapMethodsToProps = (methods) => ({
    onSidebarClose: () => methods.tab.closeSidebar(),
    onCommentCreate: (previousId, body) => methods.discussion.createComment(previousId, body),
    onCommentUpdate: (id, body) => methods.discussion.updateComment(id, body),
    onCommentRemove: (id) => methods.discussion.removeComment(id),
    onCommentReply: (parentId, previousId, comment) => methods.discussion.replyComment(parentId, previousId, comment),
    onCommentLoad: (id) => methods.discussion.loadComment(id),
    onCommentLoadHistory: (id) => methods.discussion.loadCommentHistory(id),
});

export default connectExtension(mapStateToProps, mapMethodsToProps)(App);
