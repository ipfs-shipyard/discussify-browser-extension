import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Comment from './comment';
import styles from './CommentsList.css';

const CommentsList = ({ comments, className }) => (
    <div className={ classNames(styles.commentsList, className) }>
        { comments.map((comment) => (
            <Comment
                key={ comment.id }
                comment={ comment }
                canEdit
                canReply
                className={ styles.comment } />
        )) }
    </div>
);

CommentsList.propTypes = {
    comments: PropTypes.array.isRequired,
    className: PropTypes.string,
};

export default CommentsList;
