import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Iframe from '../shared/components/iframe';
import styles from './Sidebar.css';

class Sidebar extends Component {
    static propTypes = {
        className: PropTypes.string,
        onAnimationEnd: PropTypes.func.isRequired,
    };

    render() {
        const { className } = this.props;

        return (
            <div ref={ this.setRef } className={ classNames(styles.sidebar, className) }>
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
