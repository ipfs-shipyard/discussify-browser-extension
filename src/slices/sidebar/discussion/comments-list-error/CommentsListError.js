import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './CommentsListError.css';

const CommentsListError = ({ className }) => (
    <div className={ classNames(styles.commentsListError, className) }>
        <div className={ styles.title }>
            Error loading comments :(
        </div>
    </div>
);

CommentsListError.propTypes = {
    className: PropTypes.string,
};

export default CommentsListError;
