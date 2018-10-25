import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { RemoveIcon } from '@discussify/styleguide';
import styles from './ContentRemoved.css';

export default class ContentRemoved extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    render() {
        const { className } = this.props;

        return (
            <div className={ classNames(styles.contentRemoved, className) }>
                <RemoveIcon className={ styles.removeIcon } />
                <span className={ styles.deletedText }>This comment is no longer available</span>
            </div>
        );
    }
}
