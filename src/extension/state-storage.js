export const writeState = (state) => {
    browser.storage.local.set('state', state);
};

export const readState = () => {
    browser.storage.local.get('state');
};
