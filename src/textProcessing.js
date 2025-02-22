import { getStoredLang } from "./storageManager";
import { getTranslationMapFromAttribute } from "./translationAttributeHandler";

export function containsQuotes(text) {
    return /['"]/.test(text);
}

export function collectTextNodes(node) {
    const currentLang = getStoredLang();

    const texts = [];
    const textNodes = [];
    const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT
    );

    while (walker.nextNode()) {
        const textNode = walker.currentNode;
        if (!textNode.parentNode) continue;

        const parentNode = textNode.parentNode;
        const translatedLang = parentNode.getAttribute('data-translated');
        const trimmedText = textNode.nodeValue.trim();

        if (!trimmedText || containsQuotes(trimmedText)) continue;

        const translationMap = getTranslationMapFromAttribute(parentNode);
        let originalText = trimmedText;

        if (Object.keys(translationMap).length > 0) {
            for (const [key, value] of Object.entries(translationMap)) {
                if (value === trimmedText) {
                    originalText = key;
                    break;
                }
            }
        }

        if (translatedLang === currentLang) continue;

        texts.push(originalText);
        textNodes.push(textNode);
    }

    return { texts, textNodes };
}