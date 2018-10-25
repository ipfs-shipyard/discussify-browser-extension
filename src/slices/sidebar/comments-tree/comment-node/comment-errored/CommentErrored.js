import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { TextButton } from '@discussify/styleguide';
import styles from './CommentErrored.css';

const CommentErrored = ({ onRetry, className }) => (
    <div className={ classNames(styles.commentErrored, className) }>
        <span className={ styles.errorText }>Unable to load comment</span>
        <TextButton variant="primary" onClick={ onRetry }>Retry</TextButton>
    </div>
);

CommentErrored.propTypes = {
    onRetry: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default CommentErrored;
