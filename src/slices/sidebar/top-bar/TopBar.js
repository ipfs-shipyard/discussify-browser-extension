import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CloseIcon } from '@discussify/styleguide';
import PageInfo from './page-info';
import PeersInfo from './peers-info';
import styles from './TopBar.css';

const TopBar = ({ metadata, peersCount, onClose, className }) => (
    <div className={ classNames(styles.topBar, className) }>
        <div className={ styles.info }>
            <PageInfo metadata={ metadata } />

            <PeersInfo peersCount={ peersCount } />
        </div>

        <CloseIcon
            interactive
            onClick={ onClose }
            className={ styles.closeIcon } />
    </div>
);

TopBar.propTypes = {
    metadata: PropTypes.object,
    peersCount: PropTypes.number,
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default TopBar;
