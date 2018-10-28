import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Error.css';

// TODO: Render error message

const Error = ({ className }) => (
    <div className={ classNames(styles.error, className) }>
        <div className={ styles.title }>
            Error loading comments :(
        </div>
    </div>
);

Error.propTypes = {
    className: PropTypes.string,
};

export default Error;
