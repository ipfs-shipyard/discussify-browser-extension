import { createContext } from 'react';
import createConnect from './connect';
import createProvider from './provider';

const Context = createContext('discussify/EXTENSION_CLIENT');

Context.Consumer.displayName = 'ExtensionClientStateConsumer';
Context.Provider.displayName = 'ExtensionClientStateProvider';

const connect = createConnect(Context);
const Provider = createProvider(Context);

export { Provider as ExtensionProvider, connect as connectExtension };
