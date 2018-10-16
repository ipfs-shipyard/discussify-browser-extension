import { get } from 'lodash';
import normalizeUrl from 'normalize-url';
import md5 from 'nano-md5';

const buildTabMetadata = async (tabId) => {
    const tab = await browser.tabs.get(tabId);

    const result = await browser.tabs.executeScript(tabId, {
        code: `
            (() => {
                const getMetaContent = (name) => {
                    const element = document.head.querySelector(\`meta[name="\${name}"]\`);

                    return element ? element.getAttribute('content') : null;
                }

                const getLinkHref = (rel) => {
                    const element = document.head.querySelector(\`link[rel="\${rel}"]\`);

                    return element ? element.getAttribute('href') : null;
                }

                return {
                    title: document.title,
                    description: getMetaContent('description') ||
                                 getMetaContent('og:description') ||
                                 getMetaContent('twitter:description'),
                    canonicalUrl: getLinkHref('canonical'),
                };
            })();
        `,
    });

    const canonicalUrl = normalizeUrl(get(result, '0.canonicalUrl') || tab.url);

    return {
        title: get(result, '0.title') || null,
        description: get(result, '0.description') || null,
        favicon: tab.favIconUrl || null,
        canonicalUrl: normalizeUrl(get(result, '0.canonicalUrl') || tab.url),
        discussionId: md5(canonicalUrl),
    };
};

export default buildTabMetadata;
