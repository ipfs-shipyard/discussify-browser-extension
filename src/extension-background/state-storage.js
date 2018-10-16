import { getSerializedSession } from './store/session';
import { initialTabState, getSerializedTabs } from './store/tabs';
import { getSerializedDiscussions } from './store/discussions';

// TODO: Add versioning support
// TODO: Review "syncStateWithBrowserTabs"
// TODO: Remove tabIds from discussions

const syncStateWithBrowserTabs = async (state) => {
    const browserTabs = await browser.tabs.query({});

    // Sync the tabs state
    state.tabs = browserTabs.reduce((tabs, browserTab) => {
        tabs[browserTab.id] = {
            ...initialTabState,
            ...state.tabs[browserTab.id],
            ready: browserTab.status === 'complete',
            url: browserTab.url,
            // Remove injection status & errors because they might become out-of-sync,
            // e.g.: user disabled extension and navigated to a supported protocol
            injectionStatus: null,
            injectionError: null,
            // The same goes for the metadata..
            metadata: null,
        };

        return tabs;
    }, {});
};

export const writeState = (state) => {
    const serializedState = {
        session: getSerializedSession(state),
        tabs: getSerializedTabs(state),
        discussions: getSerializedDiscussions(state),
    };

    return browser.storage.local.set({
        state: serializedState,
    });
};

export const readState = async () => {
    const results = await browser.storage.local.get(['state']);
    const { state } = results;

    // Sync the stored tabs with the ones currently in the browser
    if (state) {
        await syncStateWithBrowserTabs(state);
    }

    return state;
};
