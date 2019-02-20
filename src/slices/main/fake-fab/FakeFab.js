import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './FakeFab.css';

class FakeFab extends Component {
    render() {
        const { scaleDirection, scaleAmount } = this.props;
        const className = classNames(
            styles.fab,
            {
                [styles.scaleUp]: scaleDirection === 'up',
                [styles.scaleDown]: scaleDirection === 'down',
            }
        );
        const style = { ...scaleDirection && { transform: `scale(${scaleAmount})` } };

        return (
            <div ref={ this.setRef } className={ className } style={ style } />
        );
    }

    setRef = (ref) => {
        const { setRef, onTransitionEnd } = this.props;

        ref && ref.addEventListener('transitionend', onTransitionEnd);

        setRef(ref);
    };
}

FakeFab.propTypes = {
    scaleDirection: PropTypes.oneOf(['up', 'down']),
    scaleAmount: PropTypes.number.isRequired,
    setRef: PropTypes.func.isRequired,
    onTransitionEnd: PropTypes.func.isRequired,
};

export default FakeFab;
