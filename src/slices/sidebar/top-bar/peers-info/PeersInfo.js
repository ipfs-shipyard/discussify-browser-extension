import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './PeersInfo.css';

const PeersInfo = ({ peersCount, className }) => {
    const connected = peersCount > 1;

    return (
        <div className={ classNames(styles.peersInfo, className) }>
            <div className={ classNames(styles.dot, connected && styles.connected) } />
            <div className={ styles.text }>
                { connected ? `${peersCount - 1} peers online` : 'No peers online' }
            </div>
        </div>
    );
};

PeersInfo.defaultProps = {
    peersCount: 1,
};

PeersInfo.propTypes = {
    peersCount: PropTypes.number,
    className: PropTypes.string,
};

export default PeersInfo;
