import { collectTextNodes } from './textProcessing.js';
import { requestTranslations, resetTranslations } from './translationManager.js';

let currentLang = 'it'; // Default language
let isTranslationActive = true;

export function setTargetLanguage(lang) {
    currentLang = lang;
    if (isTranslationActive) {
        const { texts, textNodes } = collectTextNodes(document.body);
        if (texts.length > 0) {
            requestTranslations(texts, currentLang, textNodes);
        }
    }
}

export function deactivateTranslation() {
    isTranslationActive = false;
    resetTranslations();
}

export function observeDOMChanges() {
    if (!isTranslationActive) return;

    const { texts, textNodes } = collectTextNodes(document.body);
    if (texts.length > 0) {
        requestTranslations(texts, currentLang, textNodes);
    }

    const observer = new MutationObserver(mutations => {
        if (!isTranslationActive) return;

        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const { texts: newTexts, textNodes: newTextNodes } = collectTextNodes(node);
                    if (newTexts.length > 0) {
                        requestTranslations(newTexts, currentLang, newTextNodes);
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}