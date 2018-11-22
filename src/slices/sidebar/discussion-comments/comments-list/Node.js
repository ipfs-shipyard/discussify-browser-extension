import React, { PureComponent, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { last } from 'lodash';
import {
    Comment,
    CommentPlaceholder,
    CommentError,
    CommentInput,
    CommentFrame,
} from '@discussify/styleguide';
import ViewMore from './ViewMore';
import styles from './Node.css';

export default class Node extends PureComponent {
    static propTypes = {
        user: PropTypes.object,
        node: PropTypes.object.isRequired,
        parentNode: PropTypes.object,
        depth: PropTypes.number,
        maxDepth: PropTypes.number,
        preloadAvatarImage: PropTypes.bool,
        onUpdate: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onReply: PropTypes.func.isRequired,
        onLoad: PropTypes.func.isRequired,
        onLoadHistory: PropTypes.func.isRequired,
        className: PropTypes.string,
    };

    static defaultProps = {
        preloadAvatarImage: true,
        depth: 0,
        maxDepth: 2,
    };

    state = {
        editing: false,
        replying: false,
        replyId: null,
    };

    replyCommentInputRef = createRef();

    componentDidMount() {
        this.maybeLoadComment();
    }

    componentDidUpdate(prevProps) {
        this.maybeLoadComment(prevProps);
        this.maybeResetEditing(prevProps);
        this.maybeResetReplying(prevProps);
    }

    render() {
        const { node, parentNode, depth, maxDepth, className } = this.props;

        return (
            <div className={ classNames(styles.node, className) }>
                <ViewMore
                    nodes={ node.replyNodes }
                    initialPerPage={ depth + 1 >= maxDepth ? 0 : 2 }>
                    { ({ visibleNodes, totalCount, viewMoreCount, onViewMore }) => (
                        <Fragment>
                            <CommentFrame
                                reply={ !!parentNode }
                                replyTo={ parentNode && parentNode.comment.data && parentNode.comment.data.author }
                                replies={ totalCount > 0 }
                                repliesCount={ { total: totalCount, viewMore: viewMoreCount } }
                                onViewMoreReplies={ onViewMore }
                                className={ styles.commentFrame }>
                                { this.renderComment() }
                            </CommentFrame>

                            { this.renderReplies(visibleNodes) }
                        </Fragment>
                    ) }
                </ViewMore>
            </div>
        );
    }

    renderComment() {
        const { editing } = this.state;
        const { node: { comment }, user, preloadAvatarImage } = this.props;

        if (comment.loading || (!comment.error && !comment.data)) {
            return <CommentPlaceholder />;
        }

        if (comment.error) {
            return <CommentError onRetry={ this.handleLoadRetry } />;
        }

        const owner = !!user && user.did === comment.data.author.did;

        return (
            <Fragment>
                <Comment
                    comment={ comment.data }
                    owner={ owner }
                    preloadAvatarImage={ preloadAvatarImage }
                    onRemove={ this.handleRemove }
                    onEdit={ this.handleEditStart }
                    onReply={ this.handleReplyStart }
                    className={ classNames(editing && styles.hidden) } />

                { editing && (
                    <CommentInput
                        type="edit"
                        author={ comment.data.author }
                        body={ comment.data.body }
                        preloadAvatarImage={ false }
                        onSubmit={ this.handleEditSave }
                        onCancel={ this.handleEditCancel } />
                ) }
            </Fragment>
        );
    }

    renderReplies(visibleNodes) {
        const { replying, replyId } = this.state;
        const { node: parentNode, user, depth: parentDeth, maxDepth, ...rest } = this.props;

        if (!visibleNodes.length && !replying) {
            return null;
        }

        const depth = parentDeth + 1;
        const maxDepthExceeded = depth >= maxDepth;

        return (
            <div className={ classNames(!maxDepthExceeded && styles.repliesIndent) }>
                { visibleNodes.map((node) => (
                    <Node
                        { ...rest }
                        key={ node.id }
                        node={ node }
                        parentNode={ parentNode }
                        user={ user }
                        depth={ depth }
                        maxDepth={ maxDepth }
                        preloadAvatarImage={ node.id !== replyId } />

                )) }

                { replying && (
                    <CommentFrame
                        reply
                        replyTo={ parentNode.comment.data && parentNode.comment.data.author }
                        className={ styles.commentFrame }>
                        <CommentInput
                            ref={ this.replyCommentInputRef }
                            type="reply"
                            author={ user }
                            onSubmit={ this.handleReplySubmit }
                            onCancel={ this.handleReplyCancel } />
                    </CommentFrame>
                ) }
            </div>
        );
    }

    maybeLoadComment(prevProps) {
        const { comment, id } = this.props.node;
        const { comment: previousComment } = prevProps ? prevProps.node : {};

        const loadComment = !comment.loading && !comment.data && !comment.error;
        const prevLoadComment = !!previousComment && (!previousComment.loading && !previousComment.data && !previousComment.error);

        if (loadComment && !prevLoadComment) {
            this.props.onLoad(id);
        }
    }

    maybeResetEditing(prevProps) {
        const { cid } = this.props.node;
        const { cid: previousCid } = prevProps ? prevProps.node : {};

        if (this.state.editing && cid !== previousCid) {
            this.setState({ editing: false });
        }
    }

    maybeResetReplying() {
        const { replyNodes } = this.props.node;
        const foundReplyComment = this.pendingReplyId &&
            replyNodes.some((node) => node.id === this.pendingReplyId);

        if (foundReplyComment) {
            this.setState({ replying: false, replyId: this.pendingReplyId });
            this.pendingReplyId = null;
        }
    }

    handleEditStart = () => {
        this.setState({ editing: true });
    };

    handleEditCancel = () => {
        this.setState({ editing: false });
    };

    handleEditSave = async (newBody) => {
        const cid = await this.props.onUpdate(this.props.node.id, newBody);

        if (!cid) {
            this.setState({ editing: false });
        }
    };

    handleRemove = () => {
        this.props.onRemove(this.props.node.id);
    };

    handleReplyStart = () => {
        if (this.state.replying) {
            this.replyCommentInputRef.current.focus();
        } else {
            this.setState({ replying: true, replyId: null });
        }
    };

    handleReplySubmit = async (body) => {
        const { node } = this.props;

        const parentId = node.id;
        const previousNode = last(node.replyNodes);
        const previousId = previousNode ? previousNode.id : node.id;

        this.pendingReplyId = await this.props.onReply(parentId, previousId, body);
    };

    handleReplyCancel = () => {
        this.setState({ replying: false, replyId: null });
    };

    handleLoadRetry = () => {
        this.props.onLoad(this.props.node.id);
    };

    handleLoadHistory = () => {
        // TODO:
        this.props.onLoadHistory(this.props.node.id);
    };
}
