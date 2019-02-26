import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import styles from './SidebarTransition.css';

class SidebarTransition extends Component {
    static propTypes = {
        destroy: PropTypes.bool.isRequired,
        onDestroy: PropTypes.func.isRequired,
        sidebarOpen: PropTypes.bool.isRequired,
        children: PropTypes.element.isRequired,
    };

    state = {
        fabIn: 'bounce-in',
        fabScaleAmount: 1,
        sidebarIn: null,
    };

    componentDidUpdate(prevProps) {
        const { sidebarOpen, destroy } = this.props;
        const { sidebarOpen: prevSidebarOpen, destroy: prevDestroy } = prevProps;
        const isSidebarOpening = sidebarOpen && !prevSidebarOpen;
        const isSidebarClosing = !sidebarOpen && prevSidebarOpen;
        const isDestroying = destroy && !prevDestroy;

        if (isSidebarOpening) {
            return this.setState({ sidebarIn: 'fade-in', fabIn: 'scale-up', fabScaleAmount: this.fabScaleUpAmount });
        }

        if (isSidebarClosing || (isDestroying && sidebarOpen)) {
            return this.setState({ sidebarIn: 'fade-out', fabIn: 'scale-down', fabScaleAmount: 1 });
        }

        if (isDestroying) {
            return this.setState({ fabIn: 'bounce-out' });
        }
    }

    render() {
        const { children } = this.props;
        const { fabIn, sidebarIn, fabScaleAmount } = this.state;
        const { onFabAnimationEnd, onSidebarAnimationEnd } = this;

        return (
            <div className={ styles.container }>
                { children({
                    fabIn,
                    sidebarIn,
                    fabScaleAmount,
                    onFabAnimationEnd,
                    onSidebarAnimationEnd,
                    fabRef: this.setFabRef,
                    sidebarRef: this.setSidebarRef,
                }) }
            </div>
        );
    }

    onFabAnimationEnd = () => {
        const { onDestroy, destroy } = this.props;
        const { fabIn } = this.state;

        fabIn === 'bounce-out' && onDestroy();
        fabIn === 'scale-down' && destroy && this.setState({ fabIn: 'bounce-out' });
    };

    onSidebarAnimationEnd = () => {};

    setFabRef = (ref) => (this.fabRef = findDOMNode(ref));
    setSidebarRef = (ref) => (this.sidebarRef = findDOMNode(ref));

    get fabScaleUpAmount() {
        const { fabRef, sidebarRef } = this;

        if (!fabRef || !sidebarRef) {
            return 1;
        }

        const sidebarHeight = sidebarRef.offsetHeight;
        const sidebarWidth = sidebarRef.offsetWidth;
        const fabRadius = (fabRef.offsetWidth) / 2;
        const cathetusRight = sidebarHeight - (fabRadius + 40);
        const cathetusTop = sidebarWidth - (fabRadius + 40);
        const finalRadius = Math.sqrt((cathetusRight ** 2) + (cathetusTop ** 2));

        return Math.ceil(finalRadius / fabRadius);
    }
}

export default SidebarTransition;
