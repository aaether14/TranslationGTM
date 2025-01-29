import { collectTextNodes } from './textProcessing.js';
import { fetchTranslations } from './translationApi.js';

export function observeDOMChanges() {
    const { texts, textNodes } = collectTextNodes(document.body);
    if (texts.length > 0) {
        fetchTranslations(texts, 'it', textNodes);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const { texts: newTexts, textNodes: newTextNodes } = collectTextNodes(node);
                    if (newTexts.length > 0) {
                        fetchTranslations(newTexts, 'it', newTextNodes);
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
}