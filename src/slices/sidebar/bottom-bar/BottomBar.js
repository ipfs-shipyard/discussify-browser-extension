import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextareaAutosize, SubmitIcon } from '@discussify/styleguide';
import styles from './BottomBar.css';

// TODO: focus textarea should make submit icon visible

export default class BottomBar extends Component {
    static propTypes = {
        className: PropTypes.string,
        onNewComment: PropTypes.func.isRequired,
    };

    render() {
        const { className } = this.props;

        // Note that `required` + `pattern` is just for being able to style the textarea when not empty
        // See https://stackoverflow.com/a/38636426
        return (
            <div className={ classNames(styles.bottomBar, className) }>
                <TextareaAutosize
                    ref={ this.storeTextareaAutosizeRef }
                    placeholder="Add comment..."
                    maxRows={ 10 }
                    required
                    pattern=".*?\S.*"
                    className={ styles.textarea } />

                <button className={ styles.submit } onClick={ this.handleSubmitClick }>
                    <SubmitIcon className={ styles.submitIcon } />
                </button>
            </div>
        );
    }

    storeTextareaAutosizeRef = (ref) => {
        this.textareaAutosize = ref;
    };

    handleSubmitClick = () => {
        const textareaNode = findDOMNode(this.textareaAutosize);

        this.props.onNewComment(textareaNode.value);
        textareaNode.value = '';
    };
}
