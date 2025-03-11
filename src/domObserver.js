import { collectTextNodes } from './textProcessing.js';
import { requestTranslations } from './translationManager.js';
import { getStoredLang, setStoredLang, getStoredActive, setStoredActive, setUserSelectedLanguage } from './storageManager.js';

export function setTargetLanguage(language) {
    try {
        setStoredLang(language);

        try {
            const { texts, textNodes } = collectTextNodes(document.body);
            if (texts.length > 0) {
                requestTranslations(texts, language, textNodes);
            }
        } catch (error) {
            console.error('[TranslationTag] Error collecting text nodes:', error);
        }
    } catch (error) {
        console.error('[TranslationTag] Error setting target language:', error);
    }
}

export function deactivateTranslation() {
    try {
        // Clear the active state and language
        setStoredActive(false);
        setStoredLang('');
        
        location.reload();
    } catch (error) {
        console.error('[TranslationTag] Error deactivating translation:', error);
    }
}

export function activateTranslation(language) {
    try {
        const currentActive = getStoredActive();
        const currentLang = getStoredLang();
        
        // Only refresh if we're changing state
        const needsRefresh = !currentActive || (currentLang !== language);
        
        setStoredActive(true);
        setTargetLanguage(language);
        
        if (needsRefresh) {
            console.log(`[TranslationTag] Refreshing page to activate translation: ${language}`);
            location.reload();
        } else {
            console.log(`[TranslationTag] Translation already active with language: ${language}`);
        }
    } catch (error) {
        console.error('[TranslationTag] Error activating translation:', error);
    }
}

export function observeDOMChanges() {
    try {
        let isTranslationActive = getStoredActive();
        let currentLang = getStoredLang();

        if (!isTranslationActive || !currentLang) {
            return;
        }

        try {
            const { texts, textNodes } = collectTextNodes(document.body);
            if (texts.length > 0) {
                requestTranslations(texts, currentLang, textNodes);
            }
        } catch (error) {
            console.error('[TranslationTag] Error collecting initial text nodes:', error);
        }

        const observer = new MutationObserver(mutations => { 
            try {
                let isTranslationActive = getStoredActive();
                let currentLang = getStoredLang();
            
                if (!isTranslationActive || !currentLang) { 
                    return;
                }
            
                mutations.forEach(mutation => {
                    try {
                        if (mutation.type === "childList") {
                            mutation.addedNodes.forEach(node => {
                                try {
                                    if (node.nodeType === 1) {
                                        const { texts: newTexts, textNodes: newTextNodes } = collectTextNodes(node);
                                        if (newTexts.length > 0) {
                                            requestTranslations(newTexts, currentLang, newTextNodes);
                                        }
                                    }
                                } catch (nodeError) {
                                    console.error('[TranslationTag] Error processing added node:', nodeError);
                                }
                            });
                        } else if (mutation.type === "characterData") { 
                            try {
                                const textNode = mutation.target;
                                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                                    const parent = textNode.parentNode;
                                    if (parent) {
                                        const { texts: updatedTexts, textNodes: updatedTextNodes } = collectTextNodes(parent);
                                        if (updatedTexts.length > 0) {
                                            requestTranslations(updatedTexts, currentLang, updatedTextNodes);
                                        }
                                    }
                                }
                            } catch (textError) {
                                console.error('[TranslationTag] Error processing text change:', textError);
                            }
                        }
                    } catch (mutationError) {
                        console.error('[TranslationTag] Error processing mutation:', mutationError);
                    }
                });
            } catch (observerError) {
                console.error('[TranslationTag] Error in mutation observer callback:', observerError);
            }
        });
        
        try {
            observer.observe(document.body, { 
                childList: true, 
                subtree: true,
                characterData: true 
            });
        } catch (observeError) {
            console.error('[TranslationTag] Error starting mutation observer:', observeError);
        }
    } catch (error) {
        console.error('[TranslationTag] Error setting up DOM observer:', error);
    }
}
