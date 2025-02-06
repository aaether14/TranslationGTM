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
    timeoutId = setTimeout(processPendingTranslations, 200);
};

const processPendingTranslations = async () => {
    const texts = Array.from(pendingTexts.keys());
    const translations = await fetchTranslations(texts, 'it');

    const translationsMap = new Map(translations.map(({ text, translation }) => [text, translation]));

    texts.forEach(text => {
        const translatedText = translationsMap.get(text);
        if (!translatedText) return; // Avoid setting undefined values

        pendingTexts.get(text).forEach(({ node }) => {
            if (node) {  // Ensure node is still valid
                node.nodeValue = translatedText;
                if (node.parentNode) node.parentNode.setAttribute('data-translated', 'true');
            }
        });

        pendingTexts.delete(text);
    });

    timeoutId = null;
};