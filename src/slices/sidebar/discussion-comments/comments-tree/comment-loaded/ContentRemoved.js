import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { RemoveIcon } from '@discussify/styleguide';
import styles from './ContentRemoved.css';

const ContentRemoved = ({ className }) => (
    <div className={ classNames(styles.contentRemoved, className) }>
        <RemoveIcon className={ styles.removeIcon } />
        <span className={ styles.deletedText }>This comment is no longer available</span>
    </div>
);

ContentRemoved.propTypes = {
    className: PropTypes.string,
};
export default ContentRemoved;
