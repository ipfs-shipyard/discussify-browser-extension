import React, { Component, Fragment } from 'react';
import { connectExtension } from '../../react-extension-client';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import SidebarTransition from './sidebar-transition';
import Fab from './fab';
import Sidebar from './sidebar';
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
        onDestroy: PropTypes.func.isRequired,
        destroy: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        destroy: false,
    };

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
        }
    }

    componentWillUnmount() {
        clearTimeout(this.openTimeout);
    }

    render() {
        const { authenticated, sidebarOpen, onSidebarOpen, destroy, onDestroy } = this.props;

        return (
            <div className={ styles.app }>
                <SidebarTransition sidebarOpen={ sidebarOpen } destroy={ destroy } onDestroy={ onDestroy }>
                    { ({ fabIn, fabScaleAmount, sidebarIn, onFabAnimationEnd, onSidebarAnimationEnd, fabRef, sidebarRef }) => (
                        <Fragment>
                            <Fab
                                ref={ fabRef }
                                in={ fabIn }
                                scaleAmount={ fabScaleAmount }
                                authenticated={ authenticated }
                                onOpen={ onSidebarOpen }
                                onAnimationEnd={ onFabAnimationEnd }
                                onAuthenticationOpen={ this.handleAuthenticationOpen }
                                onAuthenticationClose={ this.handleAuthenticationClose }
                                className={ styles.fab } />
                            <Sidebar
                                ref={ sidebarRef }
                                in={ sidebarIn }
                                className={ styles.sidebar }
                                onAnimationEnd={ onSidebarAnimationEnd } />
                        </Fragment>
                    ) }
                </SidebarTransition>

            </div>
        );
    }

    handleAuthenticationOpen = () => {
        this.authenticationOpen = true;
    };

    handleAuthenticationClose = () => {
        this.authenticationOpen = false;
        !this.props.authenticated && this.props.onCancelAuthenticate();
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
