import { collectTextNodes } from './textProcessing.js';
import { requestTranslations, resetTranslations } from './translationManager.js';
import { getStoredLang, setStoredLang, getStoredActive, setStoredActive } from './storageManager.js';

export function setTargetLanguage(language) {
    setStoredLang(language);

    const { texts, textNodes } = collectTextNodes(document.body);
    if (texts.length > 0) {
        requestTranslations(texts, language, textNodes);
    }
}

export function deactivateTranslation() {
    setStoredActive(false);
    resetTranslations();
}

export function activateTranslation(language) {
    setStoredActive(true);
    setTargetLanguage(language);
    location.reload(true);
}

export function observeDOMChanges() {
    let isTranslationActive = getStoredActive();
    let currentLang = getStoredLang();

    if (!isTranslationActive) {
        return;
    }

    const { texts, textNodes } = collectTextNodes(document.body);
    if (texts.length > 0) {
        requestTranslations(texts, currentLang, textNodes);
    }

    const observer = new MutationObserver(mutations => { 
        let isTranslationActive = getStoredActive();
        let currentLang = getStoredLang();

        if (!isTranslationActive) { 
            return;
        }

        mutations.forEach(mutation => {
            if (mutation.type === "characterData")
            {
                console.log('character data')
            }
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
