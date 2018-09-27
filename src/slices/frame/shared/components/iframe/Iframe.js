import React, { Component } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { CircularLoader } from '@discussify/styleguide';
import styles from './Iframe.css';

const LOADER_FADE_OUT_TRANSITION_DURATION = 350;

class Iframe extends Component {
    state = {
        loaded: false,
    };

    render() {
        const { loaded } = this.state;
        const { className, ...rest } = this.props;

        return (
            <div className={ classNames(styles.iframe, className) }>
                <CSSTransition
                    in={ !loaded }
                    unmountOnExit
                    timeout={ LOADER_FADE_OUT_TRANSITION_DURATION }
                    classNames={ {
                        exit: styles.exit,
                    } }>
                    <CircularLoader
                        className={ styles.loader } />
                </CSSTransition>
                <iframe
                    { ...rest }
                    className={ classNames(loaded && styles.enter) }
                    onLoad={ this.handleLoad } />
            </div>
        );
    }

    handleLoad = () => this.setState({ loaded: true });
}

export default Iframe;
