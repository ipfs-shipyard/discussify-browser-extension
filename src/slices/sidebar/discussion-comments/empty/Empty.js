import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Empty.css';

const Empty = ({ waiting, className }) => (
    <div className={ classNames(styles.empty, className) }>
        <div className={ styles.title }>
            { waiting ? 'Loading comments...' : 'Still loading comments...' }
        </div>
        <div className={ styles.message }>
            { waiting ? 'No comments found yet' : 'Want to add your own?' }
        </div>
    </div>
);

Empty.propTypes = {
    waiting: PropTypes.bool,
    className: PropTypes.string,
};

export default Empty;
