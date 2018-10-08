import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { TimeAgo, TextButton, ReplyIcon } from '@discussify/styleguide';
import CommentAuthor from './comment-author';
import CommentBody from './comment-body';
import styles from './Comment.css';

class Comment extends Component {
    state = {
        editing: false,
    };

    render() {
        const { comment, owner, className } = this.props;
        const { editing } = this.state;

        return (
            <div className={ classNames(styles.comment, className) }>
                <CommentBody
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
                                    className={ styles.button }
                                    onClick={ this.handleCancelClick }>
                                    Cancel
                                </TextButton>
                                <TextButton
                                    variant="primary"
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

    handleBodyEdit = () => {
        this.setState({ editing: true });
    };

    handleBodyRemove = () => {
        const { onRemove, comment } = this.props;

        onRemove && onRemove(comment.id);
    };

    handleCancelClick = () => {
        this.setState({ editing: false });
    };
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    owner: PropTypes.bool,
    className: PropTypes.string,
    onReply: PropTypes.func,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func, // TODO: import requiredIf from 'react-required-if';
};

export default Comment;
