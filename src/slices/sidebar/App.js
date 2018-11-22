import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { last } from 'lodash';
import { connectExtension } from '../../react-extension-client';
import TopBar from './top-bar';
import BottomBar from './bottom-bar';
import DiscussionComments from './discussion-comments';
import styles from './App.css';

class App extends Component {
    static propTypes = {
        user: PropTypes.object,
        metadata: PropTypes.object.isRequired,
        discussion: PropTypes.object.isRequired,
        onSidebarClose: PropTypes.func.isRequired,
        onCommentCreate: PropTypes.func.isRequired,
        onCommentUpdate: PropTypes.func.isRequired,
        onCommentRemove: PropTypes.func.isRequired,
        onCommentReply: PropTypes.func.isRequired,
        onCommentLoad: PropTypes.func.isRequired,
        onCommentLoadHistory: PropTypes.func.isRequired,
    };

    state = {
        addedCommentId: null,
    };

    render() {
        const { addedCommentId } = this.state;
        const {
            user,
            metadata,
            discussion,
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
                    peersCount={ discussion.peersCount }
                    onClose={ onSidebarClose } />

                <DiscussionComments
                    key={ discussion.id }
                    user={ user }
                    error={ discussion.error }
                    commentNodes={ discussion.commentNodes }
                    addedCommentId={ addedCommentId }
                    onCommentUpdate={ onCommentUpdate }
                    onCommentRemove={ onCommentRemove }
                    onCommentReply={ onCommentReply }
                    onCommentLoad={ onCommentLoad }
                    onCommentLoadHistory={ onCommentLoadHistory }
                    className={ styles.discussionComments } />

                <BottomBar
                    disabled={ !discussion.error && !discussion.commentNodes }
                    onNewComment={ this.handleNewComment } />
            </div>
        );
    }

    handleNewComment = async (body) => {
        const previousNode = last(this.props.discussion.commentNodes);
        const previousId = previousNode && previousNode.id;

        const newId = await this.props.onCommentCreate(previousId, body);

        this.setState({ addedCommentId: newId });
    };
}

const mapStateToProps = (state) => ({
    user: state.session.user,
    metadata: state.tab.metadata,
    discussion: state.discussion,
});

const mapMethodsToProps = (methods) => ({
    onSidebarClose: () => methods.tab.closeSidebar(),
    onCommentCreate: (previousId, body) => methods.discussion.createComment(previousId, body),
    onCommentUpdate: (id, body) => methods.discussion.updateComment(id, body),
    onCommentRemove: (id) => methods.discussion.removeComment(id),
    onCommentReply: (parentId, previousId, comment) => methods.discussion.replyToComment(parentId, previousId, comment),
    onCommentLoad: (ids) => methods.discussion.loadComments(ids),
    onCommentLoadHistory: (id) => methods.discussion.loadCommentHistory(id),
});

export default connectExtension(mapStateToProps, mapMethodsToProps)(App);
