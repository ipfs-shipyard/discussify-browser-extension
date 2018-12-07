import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './PeersInfo.css';

const PeersInfo = ({ peersCount, className }) => {
    const otherPeersCount = peersCount - 1;

    return (
        <div className={ classNames(styles.peersInfo, className) }>
            <div className={ classNames(styles.dot, otherPeersCount > 0 && styles.connected) } />
            <div className={ styles.text }>
                { otherPeersCount > 0 ?
                    `Peers: ${otherPeersCount}` :
                    'No Peers :(' }
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
