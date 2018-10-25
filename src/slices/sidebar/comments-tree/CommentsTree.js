import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CommentNode from './comment-node';
import styles from './CommentsTree.css';

export default class CommentsTree extends Component {
    static propTypes = {
        user: PropTypes.object,
        commentsTree: PropTypes.array,
        onUpdate: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onReply: PropTypes.func.isRequired,
        onLoad: PropTypes.func.isRequired,
        onLoadHistory: PropTypes.func.isRequired,
        className: PropTypes.string,
    };

    pendingLoadIds = new Set();

    render() {
        const { user, commentsTree, onUpdate, onRemove, onReply, onLoadHistory, className } = this.props;

        return (
            <div className={ classNames(styles.commentsTree, className) }>
                { commentsTree && commentsTree.map((commentNode) => (
                    <CommentNode
                        key={ commentNode.id }
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
        );
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
