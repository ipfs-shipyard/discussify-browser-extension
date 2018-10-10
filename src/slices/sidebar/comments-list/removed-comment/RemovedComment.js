import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { RemoveIcon, TextButton } from '@discussify/styleguide';
import styles from './RemovedComment.css';

const RemovedComment = ({ className }) => (
    <div className={ classNames(styles.removedComment, className) }>
        <RemoveIcon className={ styles.removeIcon } />
        <span className={ styles.deletedText }>Deleted by the author</span>
        <TextButton variant="primary">See history</TextButton>
    </div>
);

RemovedComment.propTypes = {
    className: PropTypes.string,
};

export default RemovedComment;
