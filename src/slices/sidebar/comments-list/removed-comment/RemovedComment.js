import React from 'react';
import { RemoveIcon, TextButton } from '@discussify/styleguide';
import styles from './RemovedComment.css';

const RemovedComment = () => (
    <div className={ styles.removedComment }>
        <RemoveIcon className={ styles.removeIcon } />
        <span className={ styles.deletedText }>Deleted by the author</span>
        <TextButton variant="primary">See history</TextButton>
    </div>
);

export default RemovedComment;
