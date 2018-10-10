import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ConfirmModal, ModalTrigger, TextareaAutosize, EditIcon, RemoveIcon } from '@discussify/styleguide';
import styles from './CommentBody.css';

const TEXTAREA_TRANSITION_DURATION = 200; // Update this value if the textarea transition changes in the CSS

export default class CommentBody extends Component {
    static propTypes = {
        body: PropTypes.string,
        owner: PropTypes.bool,
        editing: PropTypes.bool,
        onEdit: PropTypes.func,
        onRemove: PropTypes.func,
        className: PropTypes.string,
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.editing && this.props.editing) {
            this.focusTextarea();
        }
    }

    render() {
        const { body, owner, editing, onEdit, onRemove, className } = this.props;

        const confirmModal = owner && (
            <ConfirmModal
                message="Are you sure you want to delete the comment?"
                confirmText="Yes, delete"
                cancelText="No, cancel"
                onConfirm={ onRemove } />
        );

        return (
            <div className={ classNames(styles.commentBody, className) }>
                { owner && editing ?
                    <TextareaAutosize
                        ref={ this.storeTextareaAutosizeRef }
                        defaultValue={ body }
                        maxRows={ 10 }
                        className={ styles.textarea } /> :
                    <pre className={ styles.message }>{ body }</pre>
                }
                { owner && !editing && (
                    <div className={ styles.actions }>
                        <EditIcon
                            interactive
                            onClick={ onEdit }
                            className={ styles.icon } />
                        <ModalTrigger modal={ confirmModal }>
                            <RemoveIcon interactive className={ styles.icon } />
                        </ModalTrigger>
                    </div>
                ) }
            </div>
        );
    }

    getTextareaValue() {
        const textareaNode = findDOMNode(this.textareaAutosize);

        return textareaNode ? textareaNode.value : '';
    }

    focusTextarea() {
        const textareaNode = findDOMNode(this.textareaAutosize);

        textareaNode && textareaNode.focus();
    }

    storeTextareaAutosizeRef = (ref) => {
        this.textareaAutosize = ref;
    };
}

export { TEXTAREA_TRANSITION_DURATION };
