import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './CommentsListEmpty.css';

const getTitle = (status) => {
    switch (status) {
    case 'not-ready':
        return 'Starting...';
    case 'loading':
        return 'Loading comments...';
    case 'loading-overtime':
        return 'Still loading comments...';
    default:
        return '';
    }
};

const getMessage = (status) => {
    switch (status) {
    case 'not-ready':
        return 'Please wait while we warm up';
    case 'loading':
        return 'No comments found yet';
    case 'loading-overtime':
        return 'Want to add your own?';
    default:
        return '';
    }
};

const CommentsListEmpty = ({ status, className }) => (
    <div className={ classNames(styles.commentsListEmpty, className) }>
        <div className={ styles.title }>
            { getTitle(status) }
        </div>
        <div className={ styles.message }>
            { getMessage(status) }
        </div>
    </div>
);

CommentsListEmpty.propTypes = {
    status: PropTypes.oneOf(['not-ready', 'loading', 'loading-overtime']),
    className: PropTypes.string,
};

export default CommentsListEmpty;
