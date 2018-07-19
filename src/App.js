import React, { Component } from 'react';
import logoSvg from './logo.svg';
import styles from './App.css';
import { TypingIndicator, Icon } from '@discussify/styleguide';

class App extends Component {
    render() {
        return (
            <div className={ styles.app }>
                <header className={ styles.header }>
                    <Icon svg={ logoSvg } className={ styles.logo } />
                    <h1 className={ styles.title }>Welcome to React</h1>
                </header>
                <p className={ styles.intro }>
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <div>
                    <TypingIndicator />
                </div>
            </div>
        );
    }
}

export default App;
