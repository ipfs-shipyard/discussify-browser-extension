import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { TimeAgo, ReplyIcon, TextButton } from '@discussify/styleguide';
import CommentAuthor from '../comment-author';
import styles from './BottomBar.css';

export default class BottomBar extends Component {
    static propTypes = {
        comment: PropTypes.object.isRequired,
        myself: PropTypes.bool,
        editing: PropTypes.bool,
        getMockEditClickDelay: PropTypes.func,
        onEditSave: PropTypes.func.isRequired,
        onEditCancel: PropTypes.func.isRequired,
        onReply: PropTypes.func.isRequired,
        className: PropTypes.string,
    };

    componentWillUnmount() {
        clearTimeout(this.triggereEditClickTimeout);
    }

    render() {
        const { comment, myself, editing, onReply, className } = this.props;

        return (
            <div className={ classNames(styles.commentBottomBar, className) }>
                <CommentAuthor
                    author={ comment.author }
                    myself={ myself }
                    className={ styles.author } />

                { !editing && (
                    <div className={ styles.info }>
                        { comment.body == null &&
                            <span className={ styles.status }>(Removed)</span> }
                        { comment.body != null && comment.updatedAt != null &&
                            <span className={ styles.status }>(Edited)</span> }

                        <TimeAgo date={ comment.createdAt } format="tiny" />

                        <span className={ styles.separator }>•</span>
                    </div>
                ) }

                <div className={ styles.actions }>
                    { !editing && (
                        <TextButton
                            variant="secondary"
                            icon={ <ReplyIcon /> }
                            onClick={ onReply }
                            className={ styles.button }>
                            Reply
                        </TextButton>
                    ) }
                    { editing && (
                        <Fragment>
                            <TextButton
                                variant="secondary"
                                onMouseDown={ this.handleEditMouseDown }
                                onClick={ this.handleEditCancelClick }
                                className={ styles.button }>
                                Cancel
                            </TextButton>
                            <TextButton
                                variant="primary"
                                onMouseDown={ this.handleEditMouseDown }
                                onClick={ this.handleEditSaveClick }
                                className={ styles.button }>
                                Save
                            </TextButton>
                        </Fragment>
                    ) }
                </div>
            </div>
        );
    }

    handleEditMouseDown = (event) => {
        const clickDelay = this.props.getMockEditClickDelay && this.props.getMockEditClickDelay();

        if (!clickDelay) {
            return;
        }

        const button = event.currentTarget;

        clearTimeout(this.triggereEditClickTimeout);
        this.triggereEditClickTimeout = setTimeout(() => {
            this.triggereEditClickTimeout = null;
            document.activeElement === button && button.click();
        }, clickDelay);
    };

    handleEditCancelClick = () => {
        !this.triggereEditClickTimeout && this.props.onEditCancel();
    };

    handleEditSaveClick = () => {
        !this.triggereEditClickTimeout && this.props.onEditSave();
    };
}
