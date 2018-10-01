import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { isAuthenticated, isSidebarOpen, openSidebar, closeSidebar } from './shared/store/extension';
import Fab from './fab';
import Sidebar from './sidebar';
import styles from './App.css';

// Timeout for the open/close animation
const TRANSITION_TIMEOUT = 850;

// Time to wait before opening the sidebar after becoming authenticated
const OPEN_DELAY = 2000;

class App extends Component {
    static propTypes = {
        authenticated: PropTypes.bool,
        sidebarOpen: PropTypes.bool,
        onSidebarOpen: PropTypes.func.isRequired,
        onSidebarClose: PropTypes.func.isRequired,
    };

    componentDidUpdate(prevProps) {
        // Open the sidebar when the user logs in this tab, with a delay
        if (!prevProps.authenticated && this.props.authenticated) {
            clearTimeout(this.openTimeout);

            if (this.authenticationOpen) {
                this.openTimeout = setTimeout(() => this.props.onSidebarOpen(), OPEN_DELAY);
            }
        } else if (prevProps.authenticated && !this.props.authenticated) {
            clearTimeout(this.openTimeout);
            this.props.onSidebarClose();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.openTimeout);
    }

    render() {
        const {
            authenticated,
            sidebarOpen,
            onSidebarOpen,
        } = this.props;

        return (
            <div className={ styles.app }>
                <CSSTransition
                    key="fab"
                    in={ !sidebarOpen }
                    appear
                    timeout={ TRANSITION_TIMEOUT }
                    classNames={ {
                        appear: styles.enter,
                        appearActive: styles.enterActive,
                        enter: styles.enter,
                        enterActive: styles.enterActive,
                        enterDone: styles.enterDone,
                        exit: styles.exit,
                        exitActive: styles.exitActive,
                        exitDone: styles.exitDone,
                    } }>
                    <Fab
                        authenticated={ authenticated }
                        onOpen={ onSidebarOpen }
                        onAuthenticationOpen={ this.handleAuthenticationOpen }
                        onAuthenticationClose={ this.handleAuthenticationClose }
                        className={ styles.fab } />
                </CSSTransition>

                <CSSTransition
                    key="sidebar"
                    in={ sidebarOpen }
                    appear
                    timeout={ TRANSITION_TIMEOUT }
                    classNames={ {
                        appear: styles.enter,
                        appearActive: styles.enterActive,
                        enter: styles.enter,
                        enterActive: styles.enterActive,
                        enterDone: styles.enterDone,
                        exit: styles.exit,
                        exitActive: styles.exitActive,
                        exitDone: styles.exitDone,
                    } }>
                    <Sidebar className={ styles.sidebar } />
                </CSSTransition>
            </div>
        );
    }

    handleAuthenticationOpen = () => {
        this.authenticationOpen = true;
    };

    handleAuthenticationClose = () => {
        this.authenticationOpen = false;
    };
}

const mapStateToProps = (state) => ({
    authenticated: isAuthenticated(state),
    sidebarOpen: isSidebarOpen(state),
});

const mapDispatchToProps = (dispatch) => ({
    onSidebarOpen: () => dispatch(openSidebar()),
    onSidebarClose: () => dispatch(closeSidebar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
