import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Error from './error';
import Empty from './empty';
import CommentsTree from './comments-tree';

const WAIT_COMMENTS_TIMEOUT = 12000;

export default class DiscussionComments extends Component {
    static propTypes = {
        user: PropTypes.object,
        error: PropTypes.object,
        commentsTree: PropTypes.object,
        scrollToCommentId: PropTypes.string,
        onUpdate: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onReply: PropTypes.func.isRequired,
        onLoad: PropTypes.func.isRequired,
        onLoadHistory: PropTypes.func.isRequired,
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
        const { error, commentsTree, className, ...rest } = this.props;

        if (commentsTree && !commentsTree.length) {
            return <Empty waiting={ !waited } className={ className } />;
        }

        if (error) {
            return <Error error={ error } className={ className } />;
        }

        return <CommentsTree commentsTree={ commentsTree } { ...rest } className={ className } />;
    }

    checkWaitingForComments() {
        const { waited } = this.state;
        const { commentsTree } = this.props;

        if (!commentsTree) {
            if (waited) {
                this.waitingForCommentsTimeout = null;
                clearTimeout(this.waitingForCommentsTimeout);
                this.setState({ waited: false });
            }
        } if (commentsTree && !commentsTree.length) {
            if (!waited) {
                clearTimeout(this.waitingForCommentsTimeout);
                this.waitingForCommentsTimeout = setTimeout(() => {
                    this.waitingForCommentsTimeout = null;
                    this.setState({ waited: true });
                }, WAIT_COMMENTS_TIMEOUT);
            }
        } else if (commentsTree && commentsTree.length > 0) {
            if (!waited) {
                clearTimeout(this.waitingForCommentsTimeout);
                this.waitingForCommentsTimeout = null;
                this.setState({ waited: true });
            }
        }
    }
}
