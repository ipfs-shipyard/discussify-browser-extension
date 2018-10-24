import React, { Component, createElement } from 'react';
import { pure, wrapDisplayName, hoistStatics } from 'recompose';

const createConnect = (Context) => (mapStateToProps, mapMethodsToProps) => (WrappedComponent) => {
    const PureWrappedComponent = pure(WrappedComponent);

    class Connect extends Component {
        render() {
            return (
                <Context.Consumer>
                    { ({ extensionClient, state }) => {
                        if (!state) {
                            return <span />;
                        }

                        const props = {
                            ...this.props,
                            ...mapStateToProps(state, this.props),
                            ...mapMethodsToProps(extensionClient, this.props),
                        };

                        return createElement(PureWrappedComponent, props);
                    } }
                </Context.Consumer>
            );
        }
    }

    Connect.displayName = wrapDisplayName(WrappedComponent, 'ExtensionClientConnect');
    hoistStatics(() => Connect)(WrappedComponent);

    return Connect;
};

export default createConnect;
