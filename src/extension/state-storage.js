import { initialTabState } from './store';

// TODO: Add versioning support

const syncStateWithBrowserTabs = async (state) => {
    const browserTabs = await browser.tabs.query({});

    state.tabs = browserTabs.reduce((tabs, browserTab) => {
        tabs[browserTab.id] = {
            ...initialTabState,
            ...state.tabs[browserTab.id],
            ready: browserTab.status === 'complete',
            // Remove injection status & errors because they might become out-of-sync,
            // e.g.: user disabled extension and navigated to a supported protocol
            injectionStatus: null,
            injectionError: null,
        };

        return tabs;
    }, {});

    console.log(state.tabs);
};

export const writeState = (state) => browser.storage.local.set({ state });

export const readState = async () => {
    const { state } = await browser.storage.local.get(['state']);

    // Sync the stored tabs with the ones currently in the browser
    await syncStateWithBrowserTabs(state);

    return state;
};
