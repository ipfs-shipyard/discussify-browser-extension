import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CommentNode from './CommentNode';
import styles from './CommentsTree.css';

export default class CommentsTree extends Component {
    static propTypes = {
        user: PropTypes.object,
        commentsTree: PropTypes.array,
        scrollToCommentId: PropTypes.string,
        onUpdate: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onReply: PropTypes.func.isRequired,
        onLoad: PropTypes.func.isRequired,
        onLoadHistory: PropTypes.func.isRequired,
        className: PropTypes.string,
    };

    pendingLoadIds = new Set();

    componentDidMount() {
        this.maybeScrollToBottomInitially();
    }

    componentDidUpdate(prevProps) {
        this.maybeScrollToBottomInitially(prevProps);
    }

    componentWillUnmount() {
        clearTimeout(this.pendingLoadIdsTimeout);
    }

    render() {
        const {
            user,
            commentsTree,
            scrollToCommentId,
            onUpdate,
            onRemove,
            onReply,
            onLoadHistory,
            className,
        } = this.props;

        return (
            <div className={ classNames(styles.commentsTree, className) } ref={ this.storeListNode }>
                <div className={ styles.wrapper }>
                    { commentsTree && commentsTree.map((commentNode) => (
                        <CommentNode
                            key={ commentNode.id }
                            ref={ commentNode.id === scrollToCommentId && this.scrollToCommentNodeRef }
                            commentNode={ commentNode }
                            user={ user }
                            onUpdate={ onUpdate }
                            onRemove={ onRemove }
                            onReply={ onReply }
                            onLoad={ this.handleLoad }
                            onLoadHistory={ onLoadHistory }
                            className={ styles.node } />
                    )) }
                </div>
            </div>
        );
    }

    storeListNode = (ref) => {
        this.listNode = ref;
    };

    maybeScrollToBottomInitially(prevProps) {
        const commentsCount = this.props.commentsTree ? this.props.commentsTree.length : 0;
        const prevCommentsCount = prevProps && prevProps.commentsTree ? prevProps.commentsTree.length : 0;

        if (commentsCount && !prevCommentsCount) {
            this.listNode.scrollTop = this.listNode.scrollHeight;
        }
    }

    scrollToCommentNodeRef(ref) {
        const domNode = findDOMNode(ref);

        if (domNode) {
            domNode.scrollIntoView();
        }
    }

    handleLoad = (id) => {
        this.pendingLoadIds.add(id);

        clearTimeout(this.pendingLoadIdsTimeout);
        this.pendingLoadIdsTimeout = setTimeout(() => {
            const ids = Array.from(this.pendingLoadIds);

            this.pendingLoadIds.clear();
            this.props.onLoad(ids);
        }, 25);
    };
}
