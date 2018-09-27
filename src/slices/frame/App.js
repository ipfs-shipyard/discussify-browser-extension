import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { isOpen, open, setPendingOpen } from './shared/store/sidebar';
import { isAuthenticated } from './shared/store/extension';
import Fab from './fab';
import Sidebar from './sidebar';
import styles from './App.css';

const ANIMATION_DURATION = 850;

const App = ({
    authenticated,
    sidebarOpen,
    onSidebarOpen,
    onAuthenticationOpen,
    onAuthenticationClose,
}) => (
    <TransitionGroup className={ styles.app }>
        { !sidebarOpen && (
            <CSSTransition
                key="fab"
                timeout={ ANIMATION_DURATION }
                appear
                classNames={ {
                    appear: styles.enter,
                    appearActive: styles.enterActive,
                    enter: styles.enter,
                    enterActive: styles.enterActive,
                    exit: styles.exit,
                    exitActive: styles.exitActive,
                } }>
                <Fab
                    authenticated={ authenticated }
                    onOpen={ onSidebarOpen }
                    onAuthenticationOpen={ onAuthenticationOpen }
                    onAuthenticationClose={ onAuthenticationClose }
                    className={ styles.fab } />
            </CSSTransition>
        ) }
        { sidebarOpen && (
            <CSSTransition
                key="sidebar"
                timeout={ ANIMATION_DURATION }
                classNames={ {
                    enter: styles.enter,
                    enterActive: styles.enterActive,
                    exit: styles.exit,
                    exitActive: styles.exitActive,
                } }>
                <Sidebar className={ styles.sidebar } />
            </CSSTransition>
        ) }
    </TransitionGroup>
);

App.propTypes = {
    authenticated: PropTypes.bool,
    sidebarOpen: PropTypes.bool,
    onSidebarOpen: PropTypes.func.isRequired,
    onAuthenticationOpen: PropTypes.func.isRequired,
    onAuthenticationClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    authenticated: isAuthenticated(state),
    sidebarOpen: isOpen(state),
});

const mapDispatchToProps = (dispatch) => ({
    onSidebarOpen: () => dispatch(open()),
    onAuthenticationOpen: () => dispatch(setPendingOpen(true)),
    onAuthenticationClose: () => dispatch(setPendingOpen(false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
