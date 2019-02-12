import React, { Component } from 'react';
import { connectExtension } from '../../react-extension-client';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Fab from './fab';
import Sidebar from './sidebar';
import FakeSidebar from './fake-sidebar';
import FakeFab from './fake-fab';
import styles from './App.css';

// Time to wait before opening the sidebar after becoming authenticated
const OPEN_DELAY = 2000;

class App extends Component {
    static propTypes = {
        authenticated: PropTypes.bool,
        sidebarOpen: PropTypes.bool,
        onSidebarOpen: PropTypes.func.isRequired,
        onSidebarClose: PropTypes.func.isRequired,
        onCancelAuthenticate: PropTypes.func.isRequired,
        onFinalized: PropTypes.func.isRequired,
        setFinalizeCallback: PropTypes.func.isRequired,
    };

    state = {
        finalize: false,
        fakeFabScaleDirection: null,
        sidebarFadeDirection: null,
    };

    constructor({ setFinalizeCallback }) {
        super();

        setFinalizeCallback(() => this.setState({ finalize: true }));
    }

    componentDidUpdate(prevProps) {
        // Open the sidebar when the user logs in this tab, with a delay
        if (!prevProps.authenticated && this.props.authenticated) {
            clearTimeout(this.openTimeout);

            if (this.authenticationOpen) {
                this.openTimeout = setTimeout(() => this.props.onSidebarOpen(), OPEN_DELAY);
            }

            return;
        }

        if (prevProps.authenticated && !this.props.authenticated) {
            clearTimeout(this.openTimeout);
            this.props.onSidebarClose();

            return;
        }

        if (!prevProps.sidebarOpen && this.props.sidebarOpen) {
            this.setState({ fakeFabScaleDirection: 'up' });
        }

        if (prevProps.sidebarOpen && !this.props.sidebarOpen) {
            this.setState({ sidebarFadeDirection: 'out' });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.openTimeout);
    }

    render() {
        const { authenticated, onSidebarOpen } = this.props;
        const { fakeFabScaleDirection, sidebarFadeDirection, finalize } = this.state;
        const fakeFabScaleAmount = fakeFabScaleDirection === 'up' ? this.fakeFabScaleUpAmount : 1;
        const fabClassName = classNames(
            styles.fab,
            {
                [styles.hidden]: this.shouldHideFab,
                [styles.bounceOut]: finalize,
            });
        const sidebarClassName = classNames(
            styles.sidebar,
            {
                [styles.fadeIn]: sidebarFadeDirection === 'in',
                [styles.fadeOut]: sidebarFadeDirection === 'out',
            }
        );

        return (
            <div className={ styles.app }>
                <Fab
                    setRef={ this.setFabRef }
                    authenticated={ authenticated }
                    onOpen={ onSidebarOpen }
                    onAnimationEnd={ this.handleFabAnimationEnd }
                    onAuthenticationOpen={ this.handleAuthenticationOpen }
                    onAuthenticationClose={ this.handleAuthenticationClose }
                    className={ fabClassName } />
                <Sidebar
                    className={ sidebarClassName }
                    onAnimationEnd={ this.handleSidebarFadeTransitionEnd } />
                <FakeSidebar
                    setRef={ this.setFakeSidebarRef }
                    fadeDirection={ this.fakeSideBarFadeDirection }>
                    <FakeFab
                        setRef={ this.setFakeFabRef }
                        scaleAmount={ fakeFabScaleAmount }
                        scaleDirection={ fakeFabScaleDirection }
                        onTransitionEnd={ this.handleFakeFabScaleTransitionEnd } />
                </FakeSidebar>
            </div>
        );
    }

    setFakeSidebarRef = (ref) => (this.fakeSidebarRef = ref);
    setFakeFabRef = (ref) => (this.fakeFabRef = ref);
    setFabRef = (ref) => (this.fabRef = ref);

    get shouldHideFab() {
        const { sidebarOpen } = this.props;
        const { fakeFabScaleDirection, sidebarFadeDirection } = this.state;

        return sidebarOpen || sidebarFadeDirection === 'out' || fakeFabScaleDirection === 'down';
    }

    get fakeSideBarFadeDirection() {
        const { sidebarOpen } = this.props;
        const { fakeFabScaleDirection, sidebarFadeDirection } = this.state;

        if (sidebarOpen || sidebarFadeDirection === 'out') {
            return 'in';
        }

        if (fakeFabScaleDirection === 'down') {
            return 'out';
        }

        return null;
    }

    get fakeFabScaleUpAmount() {
        const { fakeFabRef, fakeSidebarRef } = this;

        if (!fakeFabRef || !fakeSidebarRef) {
            return 1;
        }

        const fakeSidebarHeight = fakeSidebarRef.offsetHeight;
        const fakeSidebarWidth = fakeSidebarRef.offsetWidth;
        const fabRadius = (fakeFabRef.offsetWidth) / 2;
        const cathetusRight = fakeSidebarHeight - (fabRadius + 40);
        const cathetusTop = fakeSidebarWidth - (fabRadius + 40);
        const finalRadius = Math.sqrt((cathetusRight ** 2) + (cathetusTop ** 2));

        return Math.ceil(finalRadius / fabRadius);
    }

    handleAuthenticationOpen = () => {
        this.authenticationOpen = true;
    };

    handleAuthenticationClose = () => {
        this.authenticationOpen = false;
        !this.props.authenticated && this.props.onCancelAuthenticate();
    };

    handleFakeFabScaleTransitionEnd = () => {
        const { fakeFabScaleDirection } = this.state;

        fakeFabScaleDirection === 'up' && this.setState({ sidebarFadeDirection: 'in' });
        fakeFabScaleDirection === 'down' && this.setState({ fakeFabScaleDirection: null });
    };

    handleSidebarFadeTransitionEnd = () => {
        const { sidebarFadeDirection } = this.state;

        sidebarFadeDirection === 'out' && this.setState({ fakeFabScaleDirection: 'down', sidebarFadeDirection: null });
    };

    handleFabAnimationEnd = () => {
        const { onFinalized } = this.props;
        const { finalize } = this.state;

        finalize && onFinalized();
    };
}

const mapStateToProps = (state) => ({
    authenticated: !!state.session.user,
    sidebarOpen: state.tab.sidebarOpen,
});

const mapMethodsToProps = (methods) => ({
    onSidebarOpen: () => methods.tab.openSidebar(),
    onSidebarClose: () => methods.tab.closeSidebar(),
    onCancelAuthenticate: () => methods.session.cancelAuthenticate(),
});

export default connectExtension(mapStateToProps, mapMethodsToProps)(App);
