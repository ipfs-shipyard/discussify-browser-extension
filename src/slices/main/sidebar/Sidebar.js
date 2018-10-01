import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Iframe from '../shared/components/iframe';
import styles from './Sidebar.css';

class Sidebar extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    render() {
        const { className } = this.props;

        return (
            <div className={ classNames(styles.sidebar, className) }>
                <Iframe src={ browser.runtime.getURL('/sidebar.html') } />
            </div>
        );
    }
}

export default Sidebar;
