import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextareaAutosize, SubmitIcon } from '@discussify/styleguide';
import styles from './BottomBar.css';

export default class BottomBar extends Component {
    static propTypes = {
        className: PropTypes.string,
        onNewComment: PropTypes.func.isRequired,
    };

    render() {
        const { className } = this.props;

        return (
            <div className={ classNames(styles.bottomBar, className) }>
                <div className={ styles.textareaWrapper } onClick={ this.handleTextareaWrapperClick }>
                    <TextareaAutosize
                        ref={ this.storeTextareaAutosizeRef }
                        placeholder="Add comment..."
                        maxRows={ 10 }
                        className={ styles.textarea } />
                </div>

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

    handleTextareaWrapperClick = () => {
        findDOMNode(this.textareaAutosize).focus();
    };
}
