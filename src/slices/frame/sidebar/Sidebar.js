import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './Sidebar.css';

class Sidebar extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    render() {
        const { className } = this.props;

        return (
            <div className={ classNames(styles.sidebar, className) }>
                sidebar
            </div>
        );
    }
}

export default Sidebar;
