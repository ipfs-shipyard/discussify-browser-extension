import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Textarea.css';

const TRANSITION_TIMEOUT = 350;
const MAX_ROWS = 4;

class Textarea extends Component {
    componentWillUnmount() {
        clearTimeout(this.applyOverflowTimeout);
    }

    render() {
        const { className, ...rest } = this.props;

        return (
            <TextareaAutosize
                ref={ this.storeNode }
                { ...rest }
                rows={ 1 }
                maxRows={ MAX_ROWS }
                placeholder="Add comment..."
                onHeightChange={ this.handleHeightChange }
                className={ classNames(styles.textarea, className) } />
        );
    }

    storeNode = (ref) => {
        this.node = findDOMNode(ref);
    };

    handleHeightChange = (height, instance) => {
        clearTimeout(this.applyOverflowTimeout);
        this.applyOverflowTimeout = setTimeout(() => {
            this.node.style.overflow = instance.rowCount >= MAX_ROWS ? 'auto' : 'hidden';
        }, TRANSITION_TIMEOUT);
    };
}

Textarea.propTypes = {
    className: PropTypes.string,
};

export default Textarea;
