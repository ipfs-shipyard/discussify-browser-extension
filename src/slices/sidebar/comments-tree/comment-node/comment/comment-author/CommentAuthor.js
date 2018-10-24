import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Avatar } from '@discussify/styleguide';
import styles from './CommentAuthor.css';

const CommentAuthor = ({ author, owner, className }) => (
    <div className={ classNames(styles.commentAuthor, className) }>
        <Avatar name={ author.name } image={ author.avatar } />
        <span className={ styles.name }>
            { author.name }
            { owner && ' (You)' }
        </span>
    </div>
);

CommentAuthor.propTypes = {
    author: PropTypes.object.isRequired,
    owner: PropTypes.bool,
    className: PropTypes.string,
};

export default CommentAuthor;
