import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentPlaceholder from './comment-placeholder';
import CommentError from './comment-error';
import CommentRemoved from './comment-removed';
import Comment from './comment';

const shouldLoadComment = (commentNode) => {
    const { loading, data, error } = commentNode.comment;

    return !loading && !data && !error;
};

export default class CommentNode extends Component {
    static propTypes = {
        commentNode: PropTypes.object.isRequired,
        user: PropTypes.object,
        className: PropTypes.string,
        onReply: PropTypes.func.isRequired,
        onUpdate: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onLoad: PropTypes.func.isRequired,
        onLoadHistory: PropTypes.func.isRequired,
    };

    componentDidMount() {
        if (shouldLoadComment(this.props.commentNode)) {
            this.props.onLoad(this.props.commentNode.id);
        }
    }

    componentDidUpdate(prevProps) {
        if (shouldLoadComment(this.props.commentNode) && !shouldLoadComment(prevProps.commentNode)) {
            this.props.onLoad(this.props.commentNode.id);
        }
    }

    render() {
        const { commentNode, user, onReply, onUpdate, onRemove, onLoadHistory, className } = this.props;
        const { comment } = commentNode;

        if (!comment.data && !comment.error) {
            return <CommentPlaceholder className={ className } />;
        }

        if (comment.error) {
            return <CommentError className={ className } />;
        }

        if (!comment.data.body) {
            return <CommentRemoved onLoadHistory={ onLoadHistory } className={ className } />;
        }

        const owner = user ? user.did === comment.data.author.did : false;

        return (
            <Comment
                comment={ comment.data }
                owner={ owner }
                onReply={ onReply }
                onUpdate={ onUpdate }
                onRemove={ onRemove }
                className={ className } />
        );
    }
}
