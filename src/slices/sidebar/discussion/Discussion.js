import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { last } from 'lodash';
import CommentsListError from './comments-list-error';
import CommentsListEmpty from './comments-list-empty';
import CommentsList from './comments-list';
import NewComment from './new-comment';
import styles from './Discussion.css';

const WAIT_COMMENTS_TIMEOUT = 12000;

export default class Discussion extends Component {
    static propTypes = {
        user: PropTypes.object,
        error: PropTypes.object,
        commentNodes: PropTypes.object,
        onCommentCreate: PropTypes.func.isRequired,
        onCommentUpdate: PropTypes.func.isRequired,
        onCommentRemove: PropTypes.func.isRequired,
        onCommentReply: PropTypes.func.isRequired,
        onCommentLoad: PropTypes.func.isRequired,
        onCommentLoadHistory: PropTypes.func.isRequired,
        className: PropTypes.string,
    };

    state = {
        waited: false,
        addedCommentId: null,
    };

    componentDidMount() {
        this.checkWaitingForComments();
    }

    componentDidUpdate() {
        this.checkWaitingForComments();
    }

    componentWillUnmount() {
        clearTimeout(this.waitingForCommentsTimeout);
    }

    render() {
        const { error, commentNodes } = this.props;

        return (
            <Fragment>
                { this.renderList() }
                <NewComment
                    disabled={ !error && !commentNodes }
                    onNewComment={ this.handleNewComment } />
            </Fragment>
        );
    }

    renderList() {
        const { waited, addedCommentId } = this.state;
        const {
            error,
            user,
            commentNodes,
            onCommentUpdate,
            onCommentRemove,
            onCommentReply,
            onCommentLoad,
            onCommentLoadHistory,
        } = this.props;

        if (error) {
            return <CommentsListError error={ error } className={ styles.commentsList } />;
        }

        if (!commentNodes) {
            return <CommentsListEmpty status="not-ready" className={ styles.commentsList } />;
        }

        if (!commentNodes.length) {
            return <CommentsListEmpty status={ waited ? 'loading-overtime' : 'loading' } className={ styles.commentsList } />;
        }

        return (
            <CommentsList
                user={ user }
                nodes={ commentNodes }
                addedId={ addedCommentId }
                onUpdate={ onCommentUpdate }
                onRemove={ onCommentRemove }
                onReply={ onCommentReply }
                onLoad={ onCommentLoad }
                className={ styles.commentsList }
                onLoadHistory={ onCommentLoadHistory } />
        );
    }

    checkWaitingForComments() {
        const { waited } = this.state;
        const { commentNodes } = this.props;

        if (!commentNodes) {
            if (waited) {
                this.waitingForCommentsTimeout = null;
                clearTimeout(this.waitingForCommentsTimeout);
                this.setState({ waited: false });
            }
        } if (commentNodes && !commentNodes.length) {
            if (!waited) {
                clearTimeout(this.waitingForCommentsTimeout);
                this.waitingForCommentsTimeout = setTimeout(() => {
                    this.waitingForCommentsTimeout = null;
                    this.setState({ waited: true });
                }, WAIT_COMMENTS_TIMEOUT);
            }
        } else if (commentNodes && commentNodes.length > 0) {
            if (!waited) {
                clearTimeout(this.waitingForCommentsTimeout);
                this.waitingForCommentsTimeout = null;
                this.setState({ waited: true });
            }
        }
    }

    handleNewComment = async (body) => {
        const { commentNodes, onCommentCreate } = this.props;

        const previousNode = last(commentNodes);
        const previousId = previousNode && previousNode.id;

        const newId = await onCommentCreate(previousId, body);

        this.setState({ addedCommentId: newId });
    };
}
