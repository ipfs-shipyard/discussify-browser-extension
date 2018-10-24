import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CommentNode from './comment-node';
import styles from './CommentsTree.css';

const CommentsTree = ({ user, commentsTree, onUpdate, onRemove, onLoad, onLoadHistory, className }) => (
    <div className={ classNames(styles.commentsTree, className) }>
        { commentsTree && commentsTree.map((commentNode) => (
            <CommentNode
                key={ commentNode.id }
                commentNode={ commentNode }
                user={ user }
                onRemove={ onRemove }
                onUpdate={ onUpdate }
                onLoad={ onLoad }
                onLoadHistory={ onLoadHistory }
                className={ styles.node } />
        )) }
    </div>
);

CommentsTree.propTypes = {
    user: PropTypes.object,
    commentsTree: PropTypes.array,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onReply: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    onLoadHistory: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default CommentsTree;
