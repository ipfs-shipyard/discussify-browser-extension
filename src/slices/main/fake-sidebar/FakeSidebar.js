import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './FakeSidebar.css';

const FakeSidebar = ({ children, fadeDirection, setRef }) => {
    const className = classNames(
        styles.sidebar,
        {
            [styles.fadeIn]: fadeDirection === 'in',
            [styles.fadeOut]: fadeDirection === 'out',
        }
    );

    return (
        <div ref={ setRef } className={ className }>
            { children }
        </div>
    );
};

FakeSidebar.propTypes = {
    children: PropTypes.node.isRequired,
    fadeDirection: PropTypes.oneOf(['in', 'out']),
    setRef: PropTypes.func.isRequired,
};

export default FakeSidebar;
