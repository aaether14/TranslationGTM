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

                // Skip if the text is empty, contains quotes, or is already translated to the current language
                if (!trimmedText || containsQuotes(trimmedText) || translatedLang === currentLang) {
                    return NodeFilter.FILTER_ACCEPT;
                }

                // Retrieve the translation map from the parent node
                const translationMap = getTranslationMapFromAttribute(parentNode);

                // Determine the original text
                let originalText = trimmedText;
                if (translationMap[trimmedText]) {
                    originalText = translationMap[trimmedText];
                }

                // Add the original text and text node to the results
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