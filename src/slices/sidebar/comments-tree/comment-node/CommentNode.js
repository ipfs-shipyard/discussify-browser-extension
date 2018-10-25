import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentLoading from './comment-loading';
import CommentLoaded from './comment-loaded';
import CommentErrored from './comment-errored';

export default class CommentNode extends Component {
    static propTypes = {
        commentNode: PropTypes.object.isRequired,
        user: PropTypes.object,
        className: PropTypes.string,
        onUpdate: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onReply: PropTypes.func.isRequired,
        onLoad: PropTypes.func.isRequired,
        onLoadHistory: PropTypes.func.isRequired,
    };

    state = {
        editing: false,
    };

    componentDidMount() {
        if (this.shouldLoadComment()) {
            this.props.onLoad(this.props.commentNode.id);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.shouldLoadComment(prevProps)) {
            this.props.onLoad(this.props.commentNode.id);
        }

        if (this.shouldResetEditing(prevProps)) {
            this.setState({ editing: false });
        }
    }

    render() {
        const { editing } = this.state;
        const { commentNode, user, className } = this.props;
        const { comment } = commentNode;

        if (!comment.data && !comment.error) {
            return <CommentLoading className={ className } />;
        }

        if (comment.error) {
            return <CommentErrored onRetry={ this.handleLoadRetry } className={ className } />;
        }

        const myself = user ? user.did === comment.data.author.did : false;

        return (
            <CommentLoaded
                comment={ comment.data }
                myself={ myself }
                editing={ editing }
                onEditStart={ this.handleEditStart }
                onEditSave={ this.handleEditSave }
                onEditCancel={ this.handleEditCancel }
                onRemove={ this.handleRemove }
                onReply={ this.handleReplyStart }
                onLoadHistory={ this.handleLoadHistory }
                className={ className } />
        );
    }

    shouldLoadComment = (prevProps) => {
        const { comment } = this.props.commentNode;
        const { comment: previousComment } = prevProps ? prevProps.commentNode : {};

        const loadComment = !comment.loading && !comment.data && !comment.error;
        const loadPreviousComment = !!previousComment && (!previousComment.loading && !previousComment.data && !previousComment.error);

        return loadComment && !loadPreviousComment;
    };

    shouldResetEditing = (prevProps) => {
        const { cid } = this.props.commentNode;
        const { cid: previousCid } = prevProps ? prevProps.commentNode : {};

        return this.state.editing && cid !== previousCid;
    };

    handleEditStart = () => {
        this.setState({ editing: true });
    };

    handleEditCancel = () => {
        this.setState({ editing: false });
    };

    handleEditSave = (newBody) => {
        this.props.onUpdate(this.props.commentNode.id, newBody);
    };

    handleRemove = () => {
        this.props.onRemove(this.props.commentNode.id);
    };

    handleReplyStart = () => {
        // TODO:
    };

    handleLoadRetry = () => {
        this.props.onLoad(this.props.commentNode.id);
    };

    handleLoadHistory = () => {
        this.props.onLoadHistory(this.props.commentNode.id);
    };
}
