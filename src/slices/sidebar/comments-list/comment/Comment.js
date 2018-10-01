import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Avatar, TimeAgo, TextButton, EditIcon, RemoveIcon, ReplyIcon } from '@discussify/styleguide';
import styles from './Comment.css';

class Comment extends Component {
    state = {
        editing: false,
    };

    render() {
        const { comment, canEdit, canReply, className } = this.props;
        const { editing } = this.state;

        return (
            <div className={ classNames(styles.comment, className) }>
                <div className={ styles.content }>
                    <pre className={ styles.body }>{ comment.body }</pre>
                    <div className={ styles.actions }>
                        <EditIcon interactive className={ styles.icon } />
                        <RemoveIcon interactive className={ styles.icon } />
                    </div>
                </div>

                <div className={ styles.bottomBar }>
                    <div className={ styles.author }>
                        <Avatar name={ comment.author.name } image={ comment.author.avatar } />
                        <span className={ styles.name }>
                            { comment.author.name }
                            { canEdit && ' (You)' }
                        </span>
                    </div>

                    <div className={ styles.date }>
                        <TimeAgo
                            date={ comment.createdAt }
                            format="tiny"
                            className={ styles.date } />
                        <span className={ styles.separator }>•</span>
                    </div>

                    { (canReply || editing) && (
                        <div className={ styles.actions }>
                            { (canReply && !editing) && (
                                <TextButton
                                    icon={ <ReplyIcon /> }
                                    className={ styles.button }>
                                    Reply
                                </TextButton>
                            ) }
                            { editing && (
                                <TextButton
                                    className={ styles.button }>
                                    Save
                                </TextButton>
                            ) }
                        </div>
                    ) }
                </div>
            </div>
        );
    }
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    canEdit: PropTypes.boolean,
    canReply: PropTypes.boolean,
    className: PropTypes.string,
};

export default Comment;
