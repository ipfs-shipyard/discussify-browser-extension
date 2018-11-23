import React, { PureComponent, Fragment, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ViewMore, { Monitor as ViewMoreMonitor } from './ViewMore';
import Node from './Node';
import styles from './CommentsList.css';

export default class CommentsList extends PureComponent {
    static propTypes = {
        user: PropTypes.object,
        nodes: PropTypes.array,
        addedId: PropTypes.string,
        onUpdate: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onReply: PropTypes.func.isRequired,
        onLoad: PropTypes.func.isRequired,
        onLoadHistory: PropTypes.func.isRequired,
        className: PropTypes.string,
    };

    pendingLoadIds = new Set();
    commentsListRef = createRef();

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
            nodes,
            addedId,
            onUpdate,
            onRemove,
            onReply,
            onLoadHistory,
            className,
        } = this.props;

        return (
            <div className={ classNames(styles.commentsList, className) } ref={ this.commentsListRef }>
                <div className={ styles.listWrapper }>
                    <ViewMore nodes={ nodes }>
                        { ({ visibleNodes, scrollKey, onViewMore }) => (
                            <Fragment>
                                <ViewMoreMonitor key={ scrollKey } onViewMore={ onViewMore } />
                                { visibleNodes.map((node) => (
                                    <Node
                                        key={ node.id }
                                        ref={ node.id === addedId && this.scrollToAddedComment }
                                        node={ node }
                                        user={ user }
                                        onUpdate={ onUpdate }
                                        onRemove={ onRemove }
                                        onReply={ onReply }
                                        onLoad={ this.handleLoad }
                                        onLoadHistory={ onLoadHistory }
                                        className={ styles.node } />
                                )) }
                            </Fragment>
                        ) }
                    </ViewMore>
                </div>
            </div>
        );
    }

    maybeScrollToBottomInitially(prevProps) {
        const commentsCount = this.props.nodes ? this.props.nodes.length : 0;
        const prevCommentsCount = prevProps && prevProps.nodes ? prevProps.nodes.length : 0;

        if (commentsCount && !prevCommentsCount) {
            this.commentsListRef.current.scrollTop = this.commentsListRef.current.scrollHeight;
        }
    }

    scrollToAddedComment(ref) {
        const domNode = findDOMNode(ref);

        if (domNode) {
            domNode.scrollIntoView({
                block: 'end',
            });
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
