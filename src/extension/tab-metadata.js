import { get } from 'lodash';

const getTabMetadata = async (tabId) => {
    const tab = await browser.tabs.get(tabId);

    const result = await browser.tabs.executeScript(tabId, {
        code: `
            (() => {
                const getMetaContent = (name) => {
                    const element = document.head.querySelector(\`meta[name="\${name}"]\`);

                    return element ? element.getAttribute('content') : null;
                }

                return {
                    title: document.title,
                    description: getMetaContent('description') ||
                                 getMetaContent('og:description') ||
                                 getMetaContent('twitter:description') ||
                                 null,
                };
            })();
        `,
    });

    return {
        title: get(result, '0.title') || null,
        description: get(result, '0.description') || null,
        favicon: tab.favIconUrl || null,
    };
};

export default getTabMetadata;
