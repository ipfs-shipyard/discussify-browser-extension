import createExtensionClient from './extension/client';

console.log('consumer');

const consumer = createExtensionClient((state) => {
    console.log('state changed', state);
});

consumer.setUser('foo');
