import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './PageInfo.css';

const getInfo = (metadata) => {
    const favicon = metadata.favicon;

    return {
        favicon,
    };
};

export default class PageInfo extends Component {
    static propTypes = {
        metadata: PropTypes.object,
        className: PropTypes.string,
        onClose: PropTypes.func.isRequired,
    };

    state = {
        faviconLoaded: false,
    };

    render() {
        const { metadata, className } = this.props;
        const { faviconLoaded } = this.state;
        const info = metadata && getInfo(metadata);

        return info && (
            <div className={ classNames(styles.pageInfo, className) }>
                <div className={ classNames(styles.top, faviconLoaded && styles.faviconLoaded) }>
                    { info.favicon && (
                        <img
                            src={ info.favicon }
                            alt=""
                            onLoad={ this.handleFaviconLoaded }
                            className={ styles.favicon } />
                    ) }
                </div>
            </div>
        );
    }

    handleFaviconLoaded = () => {
        this.setState({ faviconLoaded: true });
    };
}
