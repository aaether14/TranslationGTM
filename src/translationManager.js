import { fetchTranslations } from './cachedTranslationApi.js';

let pendingTexts = new Map();
let timeoutId = null;

export const requestTranslations = (texts, targetLang, textNodes) => {
    texts.forEach((text, index) => {
        if (!pendingTexts.has(text)) {
            pendingTexts.set(text, []);
        }
        if (textNodes[index]) { // Ensure node is valid
            pendingTexts.get(text).push({ node: textNodes[index] });
        }
    });

    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => processPendingTranslations(targetLang), 200);
};

const processPendingTranslations = async (targetLang) => {
    const texts = Array.from(pendingTexts.keys());
    const translations = await fetchTranslations(texts, targetLang);

    const translationsMap = new Map(translations.map(({ text, translation }) => [text, translation]));

    texts.forEach(text => {
        const translatedText = translationsMap.get(text);
        if (!translatedText) {
            return; // Avoid setting undefined values
        }

        pendingTexts.get(text).forEach(({ node }) => {
            if (node) {  // Ensure node is still valid
                node.nodeValue = translatedText;
                if (node.parentNode) { 
                    node.parentNode.setAttribute('data-translated', targetLang);
                    if (!node.parentNode.hasAttribute('data-original-text'))
                    {
                        node.parentNode.setAttribute('data-original-text', text);
                    }
                }
            }
        });

        pendingTexts.delete(text);
    });

    timeoutId = null;
};

export const resetTranslations = () => {
    const translatedNodes = document.querySelectorAll('[data-translated]');
    translatedNodes.forEach(node => {
        const originalText = node.getAttribute('data-original-text');
        if (originalText) {
            node.textContent = originalText;
            node.removeAttribute('data-translated');
            node.removeAttribute('data-original-text');
        }
    });
};