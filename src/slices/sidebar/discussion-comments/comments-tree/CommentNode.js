import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Comment, CommentPlaceholder, CommentError, CommentInput } from '@discussify/styleguide';
import styles from './CommentNode.css';

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

        if (comment.loading || (!comment.error && !comment.data)) {
            return (
                <CommentPlaceholder
                    className={ classNames(styles.commentNode, className) } />
            );
        }

        if (comment.error) {
            return (
                <CommentError
                    onRetry={ this.handleLoadRetry }
                    className={ classNames(styles.commentNode, className) } />
            );
        }

        const owner = !!user && user.did === comment.data.author.did;

        return (
            <Fragment>
                <Comment
                    comment={ comment.data }
                    owner={ owner }
                    onRemove={ this.handleRemove }
                    onEdit={ this.handleEditStart }
                    onReply={ this.handleReplyStart }
                    className={ classNames(styles.commentNode, editing && styles.hidden, className) } />
                { editing && (
                    <CommentInput
                        author={ comment.data.author }
                        body={ comment.data.body }
                        onSubmit={ this.handleEditSave }
                        onCancel={ this.handleEditCancel }
                        className={ classNames(styles.commentNode, className) } />
                ) }
            </Fragment>
        );
    }

    shouldLoadComment(prevProps) {
        const { comment } = this.props.commentNode;
        const { comment: previousComment } = prevProps ? prevProps.commentNode : {};

        const loadComment = !comment.loading && !comment.data && !comment.error;
        const loadPreviousComment = !!previousComment && (!previousComment.loading && !previousComment.data && !previousComment.error);

        return loadComment && !loadPreviousComment;
    }

    shouldResetEditing(prevProps) {
        const { cid } = this.props.commentNode;
        const { cid: previousCid } = prevProps ? prevProps.commentNode : {};

        return this.state.editing && cid !== previousCid;
    }

    handleEditStart = () => {
        this.setState({ editing: true });
    };

    handleEditCancel = () => {
        this.setState({ editing: false });
    };

    handleEditSave = (newBody) => {
        this.setState({ editing: false });
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
        // TODO:
        this.props.onLoadHistory(this.props.commentNode.id);
    };
}
