import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { closeSidebar } from './shared/store/extension';
import Header from './header';
import styles from './App.css';

const App = ({ onSidebarClose }) => (
    <div className={ styles.app }>
        <Header onClose={ onSidebarClose } />
    </div>
);

App.propTypes = {
    onSidebarClose: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
    onSidebarClose: () => dispatch(closeSidebar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
