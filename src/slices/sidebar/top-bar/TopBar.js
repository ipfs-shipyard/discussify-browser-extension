import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CloseIcon } from '@discussify/styleguide';
import styles from './TopBar.css';

const TopBar = ({ className, onClose }) => (
    <div className={ classNames(styles.topBar, className) }>
        <CloseIcon
            interactive
            onClick={ onClose }
            className={ styles.closeIcon } />

        <div className={ styles.siteInfo }>
            <div className={ styles.url }>theverge.com</div>
            <div className={ styles.description }>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </div>
    </div>
);

TopBar.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default TopBar;
