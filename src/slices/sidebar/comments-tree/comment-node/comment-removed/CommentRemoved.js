import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { RemoveIcon, TextButton } from '@discussify/styleguide';
import styles from './CommentRemoved.css';

const CommentRemoved = ({ className, onLoadHistory }) => (
    <div className={ classNames(styles.commentRemoved, className) }>
        <RemoveIcon className={ styles.removeIcon } />
        <span className={ styles.deletedText }>Deleted by the author</span>
        <TextButton variant="primary" onClick={ onLoadHistory }>See history</TextButton>
    </div>
);

CommentRemoved.propTypes = {
    className: PropTypes.string,
    onLoadHistory: PropTypes.func.isRequired,
};

export default CommentRemoved;
