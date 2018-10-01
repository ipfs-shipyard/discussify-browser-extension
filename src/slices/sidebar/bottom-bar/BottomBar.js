import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SubmitIcon } from '@discussify/styleguide';
import Textarea from './textarea';
import styles from './BottomBar.css';

class BottomBar extends Component {
    static propTypes = {
        className: PropTypes.string,
        onNewComment: PropTypes.func.isRequired,
    };

    state = {
        commentBody: '',
    };

    render() {
        const { commentBody } = this.state;
        const { className } = this.props;

        return (
            <div className={ classNames(styles.bottomBar, className) }>
                <Textarea
                    value={ commentBody }
                    onInput={ this.handleTextareaInput }
                    ref={ this.storeTextareaNode }
                    className={ styles.textarea } />

                <SubmitIcon
                    interactive
                    onClick={ this.handleSubmit }
                    className={ styles.submitIcon } />
            </div>
        );
    }

    storeTextareaNode = (ref) => {
        this.textareaNode = findDOMNode(ref);
    };

    handleTextareaInput = (e) => {
        this.setState({ commentBody: e.currentTarget.value });
    };

    handleSubmit = () => {
        this.props.onNewComment(this.state.commentBody);
        this.setState({ commentBody: '' });
    };
}

BottomBar.propTypes = {
    className: PropTypes.string,
    onNewComment: PropTypes.func.isRequired,
};

export default BottomBar;
