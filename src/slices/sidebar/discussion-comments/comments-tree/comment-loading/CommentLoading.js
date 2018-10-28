import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './CommentLoading.css';

const dummyText = '\n\n';

const CommentLoading = ({ className }) => (
    <div className={ classNames(styles.commentLoading, className) }>
        <div className={ styles.content }>
            <pre>{ dummyText }</pre>

            <div className={ `${styles.dummyText} ${styles.dummyTextLine1}` } />
            <div className={ `${styles.dummyText} ${styles.dummyTextLine2}` } />
        </div>
        <div className={ styles.bottomBar }>
            <div className={ styles.author }>
                <div className={ styles.dummyAvatar } />
                <div className={ `${styles.dummyText} ${styles.dummyNameText}` } />
            </div>
            <div className={ styles.info }>
                <div className={ `${styles.dummyText} ${styles.dummyDateText}` } />
                <div className={ styles.dummySeparator } />
            </div>
            <div className={ styles.actions }>
                <div className={ `${styles.dummyText} ${styles.dummyActionsText}` } />
            </div>
        </div>
    </div>
);

CommentLoading.propTypes = {
    className: PropTypes.string,
};

export default CommentLoading;
