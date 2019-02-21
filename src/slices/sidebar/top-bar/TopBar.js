import React, { Component, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CloseIcon } from '@discussify/styleguide';
import PageInfo from './page-info';
import PeersInfo from './peers-info';
import styles from './TopBar.css';

const CLOSE_ICON_RESET_DURATION = 500;

export default class TopBar extends Component {
    static propTypes = {
        metadata: PropTypes.object,
        peersCount: PropTypes.number,
        className: PropTypes.string,
        onClose: PropTypes.func.isRequired,
    };

    closeIconRef = createRef();

    render() {
        const { metadata, peersCount, className } = this.props;

        return (
            <div className={ classNames(styles.topBar, className) }>
                <div className={ styles.info }>
                    <PageInfo metadata={ metadata } />

                    <PeersInfo peersCount={ peersCount } />
                </div>

                <CloseIcon
                    ref={ this.closeIconRef }
                    interactive
                    onClick={ this.handleCloseClick }
                    className={ styles.closeIcon } />
            </div>
        );
    }

    handleCloseClick = () => {
        // Ugly hack to remove hover/focus state from the icon, otherwise it will "flash"
        // when the sidebar opens again
        const node = findDOMNode(this.closeIconRef.current);

        node.blur();
        node.classList.add(styles.disabled);

        this.props.onClose();

        setTimeout(() => node.classList.remove(styles.disabled), CLOSE_ICON_RESET_DURATION);
    };
}
