import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { TimeAgo, TextButton, ReplyIcon } from '@discussify/styleguide';
import CommentAuthor from './comment-author';
import CommentBody, { TEXTAREA_TRANSITION_DURATION } from './comment-body';
import styles from './Comment.css';

export default class Comment extends Component {
    static propTypes = {
        comment: PropTypes.object.isRequired,
        owner: PropTypes.bool,
        className: PropTypes.string,
        onReply: PropTypes.func.isRequired,
        onUpdate: PropTypes.func,
        onRemove: PropTypes.func, // TODO: import requiredIf from 'react-required-if';
    };

    state = {
        editing: false,
    };

    componentWillUnmount() {
        clearTimeout(this.triggerClickTimeout);
    }

    render() {
        const { comment, owner, className } = this.props;
        const { editing } = this.state;

        return (
            <div className={ classNames(styles.comment, className) }>
                <CommentBody
                    ref={ this.storeCommentBodyRef }
                    body={ comment.body }
                    owner={ owner }
                    editing={ editing }
                    onEdit={ this.handleBodyEdit }
                    onRemove={ this.handleBodyRemove } />

                <div className={ styles.bottomBar }>
                    <CommentAuthor
                        author={ comment.author }
                        owner={ owner }
                        className={ styles.author } />

                    { !editing && (
                        <div className={ styles.date }>
                            <TimeAgo
                                date={ comment.createdAt }
                                format="tiny"
                                className={ styles.date } />
                            <span className={ styles.separator }>•</span>
                        </div>

                    ) }

                    <div className={ styles.actions }>
                        { !editing && (
                            <TextButton
                                variant="primary"
                                icon={ <ReplyIcon /> }
                                className={ styles.button }>
                                Reply
                            </TextButton>
                        ) }
                        { editing && (
                            <Fragment>
                                <TextButton
                                    variant="secondary"
                                    onMouseDown={ this.handleActionMouseDown }
                                    onClick={ this.handleCancelClick }
                                    className={ styles.button }>
                                    Cancel
                                </TextButton>
                                <TextButton
                                    variant="primary"
                                    onMouseDown={ this.handleActionMouseDown }
                                    onClick={ this.handleSaveClick }
                                    className={ styles.button }>
                                    Save
                                </TextButton>
                            </Fragment>
                        ) }
                    </div>
                </div>
            </div>
        );
    }

    storeCommentBodyRef = (ref) => {
        this.commentBody = ref;
    };

    handleBodyEdit = () => {
        this.setState({ editing: true });
    };

    handleBodyRemove = () => {
        this.props.onRemove && this.props.onRemove(this.props.comment.id);
    };

    handleActionMouseDown = (event) => {
        // Because the textarea height is shorthened when blurred, the "click" event
        // on the button never fires because the mouse is no longer in the action button
        // To circunvent this issue, we fire the "click" event manually after the animation ends
        const button = event.currentTarget;
        const textareaFocused = document.activeElement && document.activeElement.matches(`.${styles.comment} textarea`);

        if (!textareaFocused) {
            return;
        }

        clearTimeout(this.triggerClickTimeout);
        this.triggerClickTimeout = setTimeout(() => {
            const buttonFocused = document.activeElement === button;

            buttonFocused && button.click();
        }, TEXTAREA_TRANSITION_DURATION + 25);
    };

    handleCancelClick = () => {
        clearTimeout(this.triggerClickTimeout);
        this.setState({ editing: false });
    };

    handleSaveClick = () => {
        clearTimeout(this.triggerClickTimeout);
        this.setState({ editing: false });

        const newBody = this.commentBody.getTextareaValue();

        this.props.onUpdate && this.props.onUpdate(this.props.comment.id, newBody);
    };
}
