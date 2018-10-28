import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { connectExtension } from '../../react-extension-client';
import { InitialScreen, ScanScreen, ErrorScreen, WelcomeScreen } from './screens';
import styles from './App.css';

const SCREEN_TRANSITION_TIMEOUT = 350;

export class App extends Component {
    static propTypes = {
        user: PropTypes.object,
        qrCodeUri: PropTypes.string,
        error: PropTypes.object,
        onAuthenticate: PropTypes.func,
    };

    static getDerivedStateFromProps(props) {
        const { user, error, qrCodeUri } = props;
        let step;

        if (user) {
            step = 'welcome';
        } else if (error) {
            step = 'error';
        } else if (qrCodeUri) {
            step = 'scan';
        } else {
            step = 'initial';
        }

        return {
            step,
        };
    }

    state = {};

    render() {
        const { step } = this.state;

        return (
            <TransitionGroup className={ styles.app }>
                <CSSTransition
                    key={ step }
                    timeout={ SCREEN_TRANSITION_TIMEOUT }
                    classNames={ {
                        enter: styles.enter,
                        enterActive: styles.enterActive,
                        exit: styles.exit,
                        exitActive: styles.exitActive,
                    } }>
                    { this.renderScreen() }
                </CSSTransition>
            </TransitionGroup>
        );
    }

    renderScreen() {
        const { step } = this.state;
        const { user, error, qrCodeUri, onAuthenticate } = this.props;

        switch (step) {
        case 'welcome':
            return (
                <WelcomeScreen user={ user } className={ styles.screen } />
            );
        case 'error':
            return (
                <ErrorScreen error={ error } onRetry={ onAuthenticate } className={ styles.screen } />
            );
        case 'scan':
            return (
                <ScanScreen qrCodeUri={ qrCodeUri } className={ styles.screen } />
            );
        default:
            return (
                <InitialScreen onAuthenticate={ onAuthenticate } className={ styles.screen } />
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.session.user,
    qrCodeUri: state.session.qrCodeUri,
    error: state.session.error,
});

const mapMethodsToProps = (methods) => ({
    onAuthenticate: () => methods.session.authenticate(),
});

export default connectExtension(mapStateToProps, mapMethodsToProps)(App);
