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
    static getDerivedStateFromProps(props, state) {
        const authenticated = state.authenticated != null ?
            state.authenticated :
            props.initialAuthenticated;

        return {
            authenticated,
        };
    }

    state = {};

    render() {
        const { className, onClick } = this.props;
        const { authenticated } = this.state;
        const finalClassName = classNames(styles.fab, className);

        if (authenticated) {
            return (
                <div className={ finalClassName }>
                    <DiscussionFab onClick={ onClick } />
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
            <PopoverTrigger popover={ popover }>
                { ({
                    isOpen,
                    close,
                    ref,
                    defaultEventProps: { onClick },
                }) => (
                    // The overlay above makes the click on outside even if the click target was an iframe
                    <div ref={ ref } className={ finalClassName }>
                        { isOpen && <div className={ styles.overlay } onClick={ close } /> }
                        <DiscussionFab active={ isOpen } onClick={ onClick } />
                    </div>
                ) }
            </PopoverTrigger>
        );
    }
}

Fab.propTypes = {
    initialAuthenticated: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default Fab;
