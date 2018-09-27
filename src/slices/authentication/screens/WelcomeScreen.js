import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Avatar } from '@discussify/styleguide';
import styles from './WelcomeScreen.css';

const WelcomeScreen = ({ user, className }) => (
    <div className={ classNames(styles.welcomeScreen, className) }>
        <Avatar name={ user.name } image={ user.avatar } className={ styles.avatar } />
        <div className={ styles.welcomeMessage }>Welcome, { user.name }!</div>
        <div className={ styles.loadingMessage }>Opening the discussion..</div>
    </div>
);

WelcomeScreen.propTypes = {
    user: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default WelcomeScreen;
