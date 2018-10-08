import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CloseIcon } from '@discussify/styleguide';
import styles from './TopBar.css';

const getInfo = (url, metadata) => {
    if (!metadata) {
        return null;
    }

    let parsedUrl;

    try {
        parsedUrl = new URL(url);
    } catch (err) {
        console.warn('Failed to parse metadata URL', metadata.url);

        return null;
    }

    return {
        favicon: metadata.favicon,
        domain: parsedUrl.host || 'N/A',
        overline: metadata.title || metadata.description,
    };
};

export default class TopBar extends Component {
    static propTypes = {
        url: PropTypes.string,
        metadata: PropTypes.object,
        className: PropTypes.string,
        onClose: PropTypes.func.isRequired,
    };

    state = {
        faviconLoaded: false,
    };

    render() {
        const { url, metadata, className, onClose } = this.props;
        const { faviconLoaded } = this.state;
        const info = getInfo(url, metadata);

        return (
            <div className={ classNames(styles.topBar, className) }>
                <CloseIcon
                    interactive
                    onClick={ onClose }
                    className={ styles.closeIcon } />

                { info && <div className={ styles.info }>
                    <div
                        className={ classNames(styles.top, faviconLoaded && styles.faviconLoaded) }>
                        { info.favicon && (
                            <img
                                src={ info.favicon }
                                alt=""
                                onLoad={ this.handleFaviconLoaded }
                                className={ styles.favicon } />
                        ) }
                        <span className={ styles.domain }>{ info.domain }</span>
                    </div>

                    { info.overline && <div className={ styles.overline }>{ info.overline }</div> }
                </div> }
            </div>
        );
    }

    handleFaviconLoaded = () => {
        this.setState({ faviconLoaded: true });
    };
}
