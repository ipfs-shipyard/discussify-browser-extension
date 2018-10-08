import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ConfirmModal, ModalTrigger, EditIcon, RemoveIcon } from '@discussify/styleguide';
import styles from './CommentBody.css';

const CommentBody = ({ body, owner, onEdit, onRemove, className }) => {
    const confirmModal = owner && (
        <ConfirmModal
            message="Are you sure you want to delete the comment?"
            confirmText="Yes, delete"
            cancelText="No, cancel"
            onConfirm={ onRemove } />
    );

    return (
        <div className={ classNames(styles.commentBody, className) }>
            <pre className={ styles.message }>{ body }</pre>
            { owner && (
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
};

CommentBody.propTypes = {
    body: PropTypes.string,
    owner: PropTypes.bool,
    editing: PropTypes.bool,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    className: PropTypes.string,
};

export default CommentBody;
