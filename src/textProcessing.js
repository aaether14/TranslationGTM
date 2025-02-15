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
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (textNode) => {
                if (!textNode.parentNode) {
                    return NodeFilter.FILTER_ACCEPT;
                }

                const parentNode = textNode.parentNode;
                const translatedLang = parentNode.getAttribute('data-translated');
                const trimmedText = textNode.nodeValue.trim();

                if (!trimmedText || containsQuotes(trimmedText)) {
                    return NodeFilter.FILTER_ACCEPT;
                }

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

                if (translatedLang === currentLang) {
                    return NodeFilter.FILTER_ACCEPT;
                }

                texts.push(originalText);
                textNodes.push(textNode);

                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );

    while (walker.nextNode()) { } // Traverse the tree
    return { texts, textNodes };
}