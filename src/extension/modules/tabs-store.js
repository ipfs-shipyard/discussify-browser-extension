const createTabsStore = (onChange) => {
    let commonState = {
        user: null,
    };
    const tabsState = new Map();

    const notifyChangeAll = () => {
        const keys = Array.from(tabsState.keys());

        keys.forEach((tabId) => notifyChange(tabId));
    };

    const notifyChange = (tabId) => {
        const tabState = tabsState.get(tabId);

        if (tabState) {
            onChange(tabId, {
                ...commonState,
                tab: tabState,
            });
        }
    };

    const changeTabState = (tabId, fn) => {
        let tabState = tabsState.get(tabId);

        if (!tabState) {
            tabState = fn(tabState, tabId);
            tabsState.set(tabId, tabState);
        }
    };

    const changeTabStateAll = (fn) => {
        const keys = Array.from(tabsState.keys());

        keys.forEach((tabId) => changeTabState(tabId, fn));
    };

    return {
        addTab: (tabId) => {
            tabsState.set(tabId, {
                ready: false,
                active: false,
                sidebarOpen: false,
            });

            console.log('add tab', tabId);
            notifyChange(tabId);
        },

        setTabReady: (tabId, ready) => {
            changeTabState(tabId, (tabState) => ({
                ...tabState,
                ready,
            }));
        },

        setActiveTab: (tabId) => {
            changeTabStateAll((tabState, tabId_) => ({
                ...tabState,
                active: tabId === tabId_,
            }));

            notifyChangeAll();
        },

        handleTabReplaced: (addedTabId, removedTabId) => {

        },

        handleTabRemoved: (tabId) => {

        },

        setUser: (user) => {
            commonState = {
                ...commonState,
                user,
            };

            notifyChangeAll();
        },

        setSidebarOpen: (tabId, open) => {
            changeTabState(tabId, (tabState) => ({
                ...tabState,
                open,
            }));

            notifyChange(tabId);
        },
    };
};

export default createTabsStore;
