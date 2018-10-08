import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Comment from './comment';
import RemovedComment from './removed-comment';
import styles from './CommentsList.css';

const CommentsList = ({ comments, onRemove, className }) => (
    <div className={ classNames(styles.commentsList, className) }>
        { comments.map((comment) => (
            comment.removed ?
                <RemovedComment
                    key={ comment.id }
                    className={ styles.comment } /> :
                (
                    <Comment
                        key={ comment.id }
                        comment={ comment }
                        owner
                        onRemove={ onRemove }
                        className={ styles.comment } />
                )
        )) }
    </div>
);

CommentsList.propTypes = {
    comments: PropTypes.array.isRequired,
    onRemove: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default CommentsList;
