import React from 'react';
import PropTypes from 'prop-types';
import { CloseIcon } from '@discussify/styleguide';
import styles from './Header.css';

const Header = ({ onClose }) => (
    <div className={ styles.header }>
        <CloseIcon className={ styles.closeIcon } onClick={ onClose } />

        <div className={ styles.siteInfo }>
            <div className={ styles.url }>theverge.com</div>
            <div className={ styles.description }>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </div>
    </div>
);

Header.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default Header;
