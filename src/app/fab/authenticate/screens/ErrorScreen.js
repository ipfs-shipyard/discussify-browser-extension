import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '@discussify/styleguide';
import styles from './ErrorScreen.css';

const ErrorScreen = ({ onRetry, className }) => (
    <div className={ classNames(styles.errorScreen, className) }>
        <div className={ styles.message }>Oops, we were unable to log you in.</div>
        <Button
            variant="primary"
            fullWidth
            onClick={ onRetry }>
            Retry
        </Button>
    </div>
);

ErrorScreen.propTypes = {
    onRetry: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default ErrorScreen;
