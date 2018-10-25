import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const createProvider = (Context) => {
    class Provider extends PureComponent {
        static propTypes = {
            extensionClient: PropTypes.object.isRequired,
            children: PropTypes.node,
        };

        state = {};

        constructor({ extensionClient }) {
            super();

            this.state = {
                value: { extensionClient, state: extensionClient.getState() },
            };
        }

        componentDidMount() {
            this.setupExtensionClient();
        }

        componentDidUpdate(prevProps) {
            if (prevProps.extensionClient !== this.props.extensionClient) {
                this.setupExtensionClient();
            }
        }

        componentWillUnmount() {
            this.offStateChange();
        }

        render() {
            const { value } = this.state;
            const { children } = this.props;

            return (
                <Context.Provider value={ value }>
                    { children }
                </Context.Provider>
            );
        }

        setupExtensionClient() {
            const { extensionClient } = this.props;

            this.offStateChange && this.offStateChange();
            this.offStateChange = extensionClient.onStateChange(this.handleStateChange);

            extensionClient.ensureState();
        }

        handleStateChange = (state) => {
            const { extensionClient } = this.props;

            this.setState({
                value: { extensionClient, state },
            });
        };
    }

    Provider.displayName = 'ExtensionClientProvider';

    return Provider;
};

export default createProvider;
