import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';
import { pure } from 'recompose';
import { DiscussionFab, PopoverTrigger, Popover } from '@discussify/styleguide';
import { default as Iframe_ } from '../shared/components/iframe';
import styles from './Fab.css';

// The the iframe will be inside the popover, which will be rendered several
// because of its animation
// Making it pure improves the performance
const Iframe = pure(Iframe_);

class Fab extends Component {
    state = {
        authenticationOpen: false,
    };

    componentDidUpdate(prevProps) {
        const { authenticated, onOpen } = this.props;
        const { authenticated: prevAuthenticated } = prevProps;

        if (authenticated && !prevAuthenticated) {
            onOpen();
        }
    }

    render() {
        const { authenticated, onOpen } = this.props;

        if (authenticated) {
            return (
                <div ref={ this.setRef } className={ this.className } style={ this.inlineStyle }>
                    <DiscussionFab onClick={ onOpen } logoClassName={ this.logoClassName } />
                </div>
            );
        }

        const popover = (
            <Popover
                placement="top"
                viewportPadding={ 40 }
                boundariesElement="viewport"
                contentClassName={ styles.popoverContent }>
                <Iframe src={ browser.runtime.getURL('/authentication.html') } />
            </Popover>
        );

        return (
            <div ref={ this.setRef } className={ this.className } style={ this.inlineStyle }>
                <PopoverTrigger
                    popover={ popover }
                    onOpen={ this.handleAuthenticationOpen }
                    onClose={ this.handleAuthenticationClose }>
                    { ({
                        isOpen,
                        close,
                        ref,
                        defaultEventProps: { onClick },
                    }) => (
                        // The overlay above makes the click on outside even if the click target was an iframe
                        <div ref={ ref }>
                            { isOpen && <div className={ styles.overlay } onClick={ close } /> }
                            <DiscussionFab active={ isOpen } onClick={ onClick } logoClassName={ this.logoClassName } />
                        </div>
                    ) }
                </PopoverTrigger>
            </div>
        );
    }

    get className() {
        const { className, in: in_ } = this.props;

        return classNames(
            styles.fab,
            {
                [styles.bounceIn]: in_ === 'bounce-in',
                [styles.bounceOut]: in_ === 'bounce-out',
                [styles.scaleUp]: in_ === 'scale-up',
                [styles.scaleDown]: in_ === 'scale-down',
            },
            className
        );
    }

    get logoClassName() {
        const { in: in_ } = this.props;

        return classNames({
            [styles.fadeOutLogo]: in_ === 'scale-up',
            [styles.fadeInLogo]: in_ === 'scale-down',
        });
    }

    get inlineStyle() {
        const { scaleAmount } = this.props;

        return { ...scaleAmount && { transform: `scale(${scaleAmount})` } };
    }

    setRef = (ref) => {
        if (ref) {
            ref.addEventListener('animationend', this.onAnimationEnd);
            ref.addEventListener('transitionend', this.onAnimationEnd);
        }
    };

    onAnimationEnd = (e) => {
        const { onAnimationEnd, in: in_ } = this.props;
        const didFabScaleDown = in_ === 'scale-down' && e.propertyName === 'transform';

        // Ignore events we do not care about for 'transitionend' event type, in particular bubbled up events
        // This method captures opacity transition of fab's logo
        if (e.type === 'transitionend' && !['opacity', 'transform'].includes(e.propertyName)) {
            return;
        }

        // When scaling down, this method is called twice at:
        // 1. The end of scale transition
        // 2. The end of logo's fade in transition, which always takes place after scale down
        // We only callback when the logo finishes fading in
        if (didFabScaleDown) {
            return;
        }

        onAnimationEnd();
    };

    handleAuthenticationOpen = () => {
        this.setState({ authenticationOpen: true });
        this.props.onAuthenticationOpen();
    };

    handleAuthenticationClose = () => {
        this.setState({ authenticationOpen: false });
        this.props.onAuthenticationClose();
    };
}

Fab.defaultProps = {
    in: 'bounce-in',
    onAnimationEnd: noop,
};

Fab.propTypes = {
    in: PropTypes.oneOf(['bounce-in', 'scale-up', 'scale-down', 'bounce-out']),
    scaleAmount: PropTypes.number,
    authenticated: PropTypes.bool,
    className: PropTypes.string,
    onOpen: PropTypes.func.isRequired,
    onAuthenticationOpen: PropTypes.func.isRequired,
    onAuthenticationClose: PropTypes.func.isRequired,
    onAnimationEnd: PropTypes.func,
};

export default Fab;
