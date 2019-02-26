import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import Iframe from '../shared/components/iframe';
import styles from './Sidebar.css';

class Sidebar extends Component {
    static propTypes = {
        in: PropTypes.oneOf(['fade-in', 'fade-out']),
        className: PropTypes.string,
        onAnimationEnd: PropTypes.func,
    };

    static defaultProps = {
        rootRef: noop,
        onAnimationEnd: noop,
    };

    render() {
        const { className, in: in_ } = this.props;
        const finalClassName = classNames(
            styles.sidebar,
            {
                [styles.fadeIn]: in_ === 'fade-in',
                [styles.fadeOut]: in_ === 'fade-out',
            },
            className
        );

        return (
            <div ref={ this.setRef } className={ finalClassName }>
                <Iframe src={ browser.runtime.getURL('/sidebar.html') } />
            </div>
        );
    }

    setRef = (ref) => {
        const { onAnimationEnd } = this.props;

        ref && ref.addEventListener('animationend', onAnimationEnd);
    };
}

export default Sidebar;
