import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { TextButton } from '@discussify/styleguide';
import styles from './CommentError.css';

const CommentError = ({ className }) => (
    <div className={ classNames(styles.commentError, className) }>
        <span className={ styles.errorText }>Unable to load comment</span>
        <TextButton variant="primary">Retry</TextButton>
    </div>
);

CommentError.propTypes = {
    className: PropTypes.string,
};

export default CommentError;
