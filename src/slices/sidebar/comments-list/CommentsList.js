import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Comment from './comment';
import RemovedComment from './removed-comment';
import styles from './CommentsList.css';

const CommentsList = ({ user, comments, onUpdate, onRemove, className }) => (
    <div className={ classNames(styles.commentsList, className) }>
        { comments && comments.map((comment) => (
            comment.removed ?
                <RemovedComment
                    key={ comment.id }
                    className={ styles.comment } /> :
                (
                    <Comment
                        key={ comment.id }
                        comment={ comment }
                        owner={ user && user.did === comment.author.did }
                        onRemove={ onRemove }
                        onUpdate={ onUpdate }
                        className={ styles.comment } />
                )
        )) }
    </div>
);

CommentsList.propTypes = {
    user: PropTypes.object,
    comments: PropTypes.array,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default CommentsList;
