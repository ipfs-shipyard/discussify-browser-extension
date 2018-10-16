import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '@discussify/styleguide';
import styles from './ErrorScreen.css';

const ErrorScreen = ({ error, className, onRetry }) => (
    <div className={ classNames(styles.errorScreen, className) }>
        <div className={ styles.message }>
            <div className={ styles.text }>Oops, we were unable to log you in.</div>
            { error && error.message && <div className={ styles.errorText }>{ error.message }</div> }
        </div>

        <Button
            variant="primary"
            fullWidth
            onClick={ onRetry }>
            Retry
        </Button>
    </div>
);

ErrorScreen.propTypes = {
    error: PropTypes.object,
    onRetry: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default ErrorScreen;
