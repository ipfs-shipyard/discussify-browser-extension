import React, { Component, PureComponent } from 'react';
import { findLastIndex } from 'lodash';
import Observer from '@researchgate/react-intersection-observer';
import PropTypes from 'prop-types';

// This search is made in reverse to be fast, mainly because comments order are from oldest to recent
const findCommentIndexById = (nodes, id) => findLastIndex(nodes, (comment) => comment.id === id);

export default class ViewMore extends PureComponent {
    static propTypes = {
        nodes: PropTypes.array.isRequired,
        children: PropTypes.func.isRequired,
        perPage: PropTypes.number,
        initialPerPage: PropTypes.number,
    };

    static defaultProps = {
        perPage: 10,
        initialPerPage: 10,
    };

    constructor(props) {
        super(props);

        this.state = this.computeInitialState(props);
    }

    componentDidUpdate(prevProps) {
        if (this.props.nodes !== prevProps.nodes) {
            if (!this.state.lastVisibleId) {
                this.setState(this.computeInitialState(this.props));
            } else {
                this.recomputeVisibleNodes();
            }
        }
    }

    render() {
        const { nodes } = this.props;
        const { lastVisibleId, visibleNodes } = this.state;

        return this.props.children({
            visibleNodes,
            scrollKey: lastVisibleId,
            totalCount: nodes.length,
            viewMoreCount: nodes.length - visibleNodes.length,
            onViewMore: this.handleViewMore,
        });
    }

    computeInitialState(props) {
        const { nodes, initialPerPage } = props;

        const visibleNodes = initialPerPage <= 0 ? [] : nodes.slice(-initialPerPage);

        return {
            lastVisibleId: visibleNodes[0] ? visibleNodes[0].id : null,
            visibleNodes,
        };
    }

    recomputeVisibleNodes() {
        const { nodes } = this.props;
        const { lastVisibleId, visibleNodes } = this.state;

        if (!visibleNodes.length) {
            return;
        }

        let lastVisibleIndex = findCommentIndexById(nodes, lastVisibleId);

        if (lastVisibleIndex === -1) {
            lastVisibleIndex = nodes.length - visibleNodes.length;
        }

        this.setState({
            visibleNodes: nodes.slice(lastVisibleIndex),
        });
    }

    handleViewMore = () => {
        const { nodes, perPage } = this.props;
        const { lastVisibleId } = this.state;

        const lastVisibleIndex = lastVisibleId ? findCommentIndexById(nodes, lastVisibleId) : nodes.length;
        const newLastVisibleIndex = lastVisibleIndex !== -1 ? Math.max(lastVisibleIndex - perPage, 0) : -1;

        if (newLastVisibleIndex !== -1 && lastVisibleIndex !== newLastVisibleIndex) {
            this.setState({
                lastVisibleId: nodes[newLastVisibleIndex].id,
                visibleNodes: nodes.slice(newLastVisibleIndex),
            });
        }
    };
}

export class Monitor extends Component {
    static propTypes = {
        threshold: PropTypes.number,
        onViewMore: PropTypes.func.isRequired,
    };

    static defaultProps = {
        threshold: 3 * 120, // 3 comments
    };

    render() {
        const { threshold } = this.props;

        return (
            <Observer onChange={ this.handleChange }>
                <div style={ { position: 'absolute', width: '100%', height: 3, background: 'red', top: threshold, left: 0 } } />
            </Observer>
        );
    }

    handleChange = ({ isIntersecting }) => {
        if (isIntersecting) {
            this.props.onViewMore();
        }
    };
}
