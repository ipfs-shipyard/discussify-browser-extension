import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Error from './error';
import Empty from './empty';
import CommentsList from './comments-list';

const WAIT_COMMENTS_TIMEOUT = 12000;

export default class DiscussionComments extends Component {
    static propTypes = {
        user: PropTypes.object,
        error: PropTypes.object,
        commentNodes: PropTypes.object,
        addedCommentId: PropTypes.string,
        onCommentUpdate: PropTypes.func.isRequired,
        onCommentRemove: PropTypes.func.isRequired,
        onCommentReply: PropTypes.func.isRequired,
        onCommentLoad: PropTypes.func.isRequired,
        onCommentLoadHistory: PropTypes.func.isRequired,
        className: PropTypes.string,
    };

    state = {
        waited: false,
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
        const { waited } = this.state;
        const {
            error,
            user,
            commentNodes,
            addedCommentId,
            onCommentUpdate,
            onCommentRemove,
            onCommentReply,
            onCommentLoad,
            onCommentLoadHistory,
            className,
        } = this.props;

        if (error) {
            return <Error error={ error } className={ className } />;
        }

        if (!commentNodes) {
            return <Empty status="not-ready" className={ className } />;
        }

        if (!commentNodes.length) {
            return <Empty status={ waited ? 'loading-overtime' : 'loading' } className={ className } />;
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
                onLoadHistory={ onCommentLoadHistory }
                className={ className } />
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
}
