import React, { PureComponent, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isWhitespace from 'is-whitespace';
import { TextareaAutosize, SubmitIcon } from '@discussify/styleguide';
import styles from './BottomBar.css';

const isBodyEmpty = (body) => !body || isWhitespace(body);

export default class BottomBar extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        disabled: PropTypes.bool,
        onNewComment: PropTypes.func.isRequired,
    };

    textareaAutosizeRef = createRef();

    state = {
        empty: true,
    };

    render() {
        const { disabled, className } = this.props;
        const { empty } = this.state;

        const finalClassName = classNames(
            styles.bottomBar,
            {
                [styles.disabled]: disabled,
                [styles.empty]: empty,
            },
            className
        );

        return (
            <div className={ finalClassName }>
                <TextareaAutosize
                    ref={ this.textareaAutosizeRef }
                    placeholder="Add comment..."
                    maxRows={ 10 }
                    disabled={ disabled }
                    submitOnEnter
                    onSubmit={ this.handleSubmitClick }
                    onChange={ this.handleChange }
                    className={ styles.textarea } />

                <button
                    className={ styles.submit }
                    disabled={ disabled }
                    onMouseDown={ this.handleSubmitMouseDown }
                    onClick={ this.handleSubmitClick }>
                    <SubmitIcon className={ styles.submitIcon } />
                </button>
            </div>
        );
    }

    handleChange = (event) => {
        const body = event.target.value;

        this.setState({ empty: isBodyEmpty(body) });
    };

    handleSubmitMouseDown = (e) => {
        // Prevent textarea from loosing focus if text is empty
        const textareaNode = findDOMNode(this.textareaAutosizeRef.current);
        const body = textareaNode && textareaNode.value;

        if (isBodyEmpty(body)) {
            e.preventDefault();
        }
    };

    handleSubmitClick = () => {
        const textareaNode = findDOMNode(this.textareaAutosizeRef.current);
        const body = textareaNode && textareaNode.value;

        if (!isBodyEmpty(body)) {
            textareaNode.value = '';
            this.setState({ empty: true });

            this.props.onNewComment(body);
        }
    };
}
