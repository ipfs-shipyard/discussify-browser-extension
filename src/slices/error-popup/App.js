import React from 'react';
import PropTypes from 'prop-types';
import { TextButton } from '@discussify/styleguide';
import styles from './App.css';

const App = ({ error, onDismiss }) => {
    const { message, code } = error;

    return (
        <div className={ styles.app }>
            <div className={ styles.headline }>
                An error occurred while loading the extension:
            </div>

            <div className={ styles.error }>
                <div className={ styles.message }>{ message }</div>
                { code && <div className={ styles.code }>{ code }</div> }
            </div>

            <TextButton variant="primary" onClick={ onDismiss }>Dismiss</TextButton>
        </div>
    );
};

App.propTypes = {
    error: PropTypes.shape({
        message: PropTypes.string.isRequired,
        code: PropTypes.string,
    }).isRequired,
    onDismiss: PropTypes.func.isRequired,
};

export default App;
