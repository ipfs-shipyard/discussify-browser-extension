import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { closeSidebar } from './shared/store/extension';
import { getComments, addComment } from './shared/store/discussion';
import TopBar from './top-bar';
import BottomBar from './bottom-bar';
import CommentsList from './comments-list';
import styles from './App.css';

const App = ({ comments, onSidebarClose, onAddComment }) => (
    <div className={ styles.app }>
        <TopBar
            onClose={ onSidebarClose } />

        <CommentsList
            comments={ comments }
            className={ styles.commentsList } />

        <BottomBar
            onNewComment={ onAddComment } />
    </div>
);

App.propTypes = {
    comments: PropTypes.object.isRequired,
    onSidebarClose: PropTypes.func.isRequired,
    onAddComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    comments: getComments(state),
});

const mapDispatchToProps = (dispatch) => ({
    onSidebarClose: () => dispatch(closeSidebar()),
    onAddComment: (body) => dispatch(addComment(body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
