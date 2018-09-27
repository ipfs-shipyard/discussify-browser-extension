import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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

    render() {
        const { className, authenticated, onOpen } = this.props;
        const { authenticationOpen } = this.state;
        const finalClassName = classNames(styles.fab, className);

        if (authenticated && !authenticationOpen) {
            return (
                <div className={ finalClassName }>
                    <DiscussionFab onClick={ onOpen } />
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
            <div className={ finalClassName }>
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
                            <DiscussionFab active={ isOpen } onClick={ onClick } />
                        </div>
                    ) }
                </PopoverTrigger>
            </div>
        );
    }

    handleAuthenticationOpen = () => {
        this.setState({ authenticationOpen: true });
        this.props.onAuthenticationOpen();
    };

    handleAuthenticationClose = () => {
        this.setState({ authenticationOpen: false });
        this.props.onAuthenticationClose();
    };
}

Fab.propTypes = {
    authenticated: PropTypes.bool,
    className: PropTypes.string,
    onOpen: PropTypes.func.isRequired,
    onAuthenticationOpen: PropTypes.func.isRequired,
    onAuthenticationClose: PropTypes.func.isRequired,
};

export default Fab;
