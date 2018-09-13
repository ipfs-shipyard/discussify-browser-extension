import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DiscussionFab, PopoverTrigger, Popover } from '@discussify/styleguide';
import Authenticate from './authenticate';
import styles from './Fab.css';

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
                    <DiscussionFab
                        onClick={ onClick } />
                </div>
            );
        }

        const popover = (
            <Popover
                placement="top"
                viewportPadding={ 40 }
                boxClassName={ styles.popoverBox }
                contentClassName={ styles.popoverContent }>
                <Authenticate />
            </Popover>
        );

        return (
            <div className={ finalClassName }>
                <PopoverTrigger popover={ popover }>
                    { ({
                        isOpen,
                        ref,
                        defaultEventProps: { onClick },
                    }) => (
                        <div ref={ ref }>
                            <DiscussionFab
                                active={ isOpen }
                                onClick={ onClick } />
                        </div>
                    ) }
                </PopoverTrigger>
            </div>
        );
    }
}

Fab.propTypes = {
    initialAuthenticated: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default Fab;
