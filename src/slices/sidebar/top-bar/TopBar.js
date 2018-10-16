import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CloseIcon } from '@discussify/styleguide';
import styles from './TopBar.css';

const getInfo = (metadata) => {
    const parsedUrl = new URL(metadata.canonicalUrl);
    const favicon = metadata.favicon;
    const domain = parsedUrl.host || 'N/A';

    // Use description if the title seems similar to the domain
    const overline = domain.startsWith(metadata.title) ?
        metadata.description || metadata.title :
        metadata.title || metadata.description;

    return {
        favicon,
        domain,
        overline,
    };
};

export default class TopBar extends Component {
    static propTypes = {
        metadata: PropTypes.object,
        className: PropTypes.string,
        onClose: PropTypes.func.isRequired,
    };

    state = {
        faviconLoaded: false,
    };

    render() {
        const { metadata, className, onClose } = this.props;
        const { faviconLoaded } = this.state;
        const info = metadata && getInfo(metadata);

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
