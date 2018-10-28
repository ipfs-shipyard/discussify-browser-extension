import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Content, { TEXTAREA_TRANSITION_DURATION } from './Content';
import ContentRemoved from './ContentRemoved';
import BottomBar from './BottomBar';
import styles from './CommentLoaded.css';

export default class CommentLoaded extends Component {
    static propTypes = {
        comment: PropTypes.object.isRequired,
        myself: PropTypes.bool,
        editing: PropTypes.bool,
        onEditStart: PropTypes.func.isRequired,
        onEditSave: PropTypes.func.isRequired,
        onEditCancel: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onReply: PropTypes.func.isRequired,
        className: PropTypes.string,
    };

    componentWillUnmount() {
        clearTimeout(this.triggerClickTimeout);
    }

    render() {
        const { comment, myself, editing, onEditStart, onEditCancel, onRemove, onReply, className } = this.props;

        return (
            <div className={ classNames(styles.commentLoaded, className) }>
                { comment.body != null ?
                    (
                        <Content
                            ref={ this.storeCommentContentRef }
                            comment={ comment }
                            myself={ myself }
                            editing={ editing }
                            onEdit={ onEditStart }
                            onRemove={ onRemove } />
                    ) : (
                        <ContentRemoved />
                    )
                }

                <BottomBar
                    comment={ comment }
                    myself={ myself }
                    editing={ editing }
                    onEditSave={ this.handleEditSave }
                    onEditCancel={ onEditCancel }
                    getMockEditClickDelay={ this.getMockEditClickDelay }
                    onReply={ onReply }
                    className={ styles.bottomBar } />
            </div>
        );
    }

    storeCommentContentRef = (ref) => {
        this.commentBody = ref;
    };

    getMockEditClickDelay = () => {
        const textareaFocused = document.activeElement &&
                                document.activeElement.matches(`.${styles.commentLoaded} textarea`);

        return textareaFocused ? TEXTAREA_TRANSITION_DURATION + 25 : 0;
    };

    handleEditSave = () => {
        const body = this.props.comment.body;
        const newBody = this.commentBody.getTextareaValue();

        if (body !== newBody) {
            this.props.onEditSave(newBody);
        } else {
            this.props.onEditCancel();
        }
    };
}
