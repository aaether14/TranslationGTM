import { fetchTranslations } from './cachedTranslationApi.js';
import { addTranslationToAttribute, getTranslationMapFromAttribute } from './translationAttributeHandler.js';

let pendingTexts = new Map();
let timeoutId = null;

export const requestTranslations = (texts, targetLang, textNodes) => {
    texts.forEach((text, index) => {
        if (!pendingTexts.has(text)) {
            pendingTexts.set(text, []);
        }
        if (textNodes[index]) { 
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
            return; 
        }

        pendingTexts.get(text).forEach(({ node }) => {
            if (node && node.parentNode) {  
                addTranslationToAttribute(node.parentNode, translatedText, text);
                node.parentNode.setAttribute('data-translated', targetLang);
                node.nodeValue = translatedText;
            }
        });

        pendingTexts.delete(text);
    });

    timeoutId = null;
};

export const resetTranslations = () => {
    const translatedNodes = document.querySelectorAll('[data-translated]');
    translatedNodes.forEach(parentNode => {
        const translationMap = getTranslationMapFromAttribute(parentNode);
        parentNode.childNodes.forEach(childNode => {
            if (childNode.nodeType === Node.TEXT_NODE) {
                const translatedText = childNode.nodeValue;
                if (translationMap[translatedText]) {
                    childNode.nodeValue = translationMap[translatedText];
                }
            }
        });
        parentNode.removeAttribute('data-translated');
        parentNode.removeAttribute('data-original-text');
    });
};