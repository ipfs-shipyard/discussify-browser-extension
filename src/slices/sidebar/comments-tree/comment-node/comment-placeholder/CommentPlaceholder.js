import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './CommentPlaceholder.css';

const CommentPlaceholder = ({ className }) => (
    <div className={ classNames(styles.commentPlaceholder, className) }>
        Loading
    </div>
);

CommentPlaceholder.propTypes = {
    className: PropTypes.string,
};

export default CommentPlaceholder;
