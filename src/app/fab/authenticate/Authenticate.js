import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {
    getUser,
    getPromptError,
    getPromptQrCodeUri,
    authenticate,
    resetAuthenticate,
} from '../../shared/store/session';
import { PromptScreen, ScanScreen, ErrorScreen, WelcomeScreen } from './screens';
import styles from './Authenticate.css';

const SCREEN_ANIMATION_DURATION = 350;

export class Authenticate extends Component {
    static propTypes = {
        user: PropTypes.object,
        qrCodeUri: PropTypes.string,
        error: PropTypes.object,
        onAuthenticate: PropTypes.func,
        onResetAuthenticate: PropTypes.func,
    };

    static getDerivedStateFromProps(props) {
        const { user, error, qrCodeUri } = props;
        let step;

        if (user) {
            step = 'welcome';
        } else if (error) {
            step = 'qrCodeUri';
        } else if (qrCodeUri) {
            step = 'scan';
        } else {
            step = 'prompt';
        }

        return {
            step,
        };
    }

    state = {};

    componentWillUnmount() {
        this.props.onResetAuthenticate();
    }

    render() {
        const { step } = this.state;

        return (
            <TransitionGroup className={ styles.authenticate }>
                <CSSTransition
                    key={ step }
                    timeout={ SCREEN_ANIMATION_DURATION }
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
        const { user, qrCodeUri, onAuthenticate } = this.props;

        switch (step) {
        case 'welcome':
            return (
                <WelcomeScreen user={ user } className={ styles.screen } />
            );
        case 'error':
            return (
                <ErrorScreen onRetry={ onAuthenticate } className={ styles.screen } />
            );
        case 'scan':
            return (
                <ScanScreen qrCodeUri={ qrCodeUri } className={ styles.screen } />
            );
        default:
            return (
                <PromptScreen onAuthenticate={ onAuthenticate } className={ styles.screen } />
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: getUser(state),
    qrCodeUri: getPromptQrCodeUri(state),
    error: getPromptError(state),
});

const mapDispatchToProps = (dispatch) => ({
    onAuthenticate: () => dispatch(authenticate()),
    onResetAuthenticate: () => dispatch(resetAuthenticate()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
