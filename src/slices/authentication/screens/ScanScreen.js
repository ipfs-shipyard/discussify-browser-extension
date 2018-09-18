import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './ScanScreen.css';

const ScanScreen = ({ qrCodeUri, className }) => (
    <div className={ classNames(styles.scanScreen, className) }>
        <div className={ styles.instructions }>
            Scan QR code with <a href="https://www.uport.me/" target="_blank" rel="noopener noreferrer">uPort</a> Mobile App
        </div>
        <div className={ styles.qrCode }>
            <img src={ qrCodeUri } alt="QR Code" />
        </div>
    </div>
);

ScanScreen.propTypes = {
    qrCodeUri: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default ScanScreen;
