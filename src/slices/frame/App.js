import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { isOpen, open } from './shared/store/sidebar';
import { isAuthenticated } from './shared/store/session';
import Fab from './fab';
import Sidebar from './sidebar';
import styles from './App.css';

const ANIMATION_DURATION = 850;

const App = ({ authenticated, sidebarOpen, onSidebarOpen }) => (
    <TransitionGroup className={ styles.app }>
        { !sidebarOpen && (
            <CSSTransition
                key="fab"
                timeout={ ANIMATION_DURATION }
                classNames={ {
                    enter: styles.enter,
                    enterActive: styles.enterActive,
                    exit: styles.exit,
                    exitActive: styles.exitActive,
                } }>
                <Fab
                    initialAuthenticated={ authenticated }
                    onClick={ onSidebarOpen }
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
};

const mapStateToProps = (state) => ({
    authenticated: isAuthenticated(state),
    sidebarOpen: isOpen(state),
});

const mapDispatchToProps = (dispatch) => ({
    onSidebarOpen: () => dispatch(open()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
