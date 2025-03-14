import { getStoredLang } from "./storageManager";
import { getTranslationMapFromAttribute } from "./translationAttributeHandler";
import { transformPrices } from "./priceTransformer";

/**
 * Determines if a text node should be included in the translation process
 * @param {Node} textNode - The text node to check
 * @returns {boolean} - Whether the node should be included
 */
export function shouldIncludeNode(textNode) {
    const parentNode = textNode.parentNode;
    const trimmedText = textNode.nodeValue.trim();

    // Skip nodes without a parent
    if (!parentNode) {
        return false;
    }

    // Skip script content
    if (parentNode.nodeName === "SCRIPT") {
        return false;
    }

    // Skip empty text nodes
    if (!trimmedText) {
        return false;
    }

    return true;
}

/**
 * Collects text nodes from the DOM for translation
 * Applies price transformation (RON to EUR) before translation
 * @param {Node} node - The root node to collect text from
 * @returns {Object} - Object containing arrays of texts and their corresponding nodes
 */
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
        
        // Skip nodes that shouldn't be included
        if (!shouldIncludeNode(textNode)) {
            continue;
        }
        
        // Get the original text
        const originalText = textNode.nodeValue.trim();
        
        // Apply price transformation (RON to EUR)
        const transformedText = transformPrices(originalText);
        
        // Skip empty text after transformation
        if (!transformedText) {
            continue;
        }

        const parentNode = textNode.parentNode;
        const translationMap = getTranslationMapFromAttribute(parentNode);

        // Skip already translated text
        const translatedLang = parentNode.getAttribute('data-translated');
        if (translatedLang === currentLang && transformedText in translationMap) {
            continue;
        }

        // Add to collection for translation
        texts.push(transformedText);
        textNodes.push(textNode);
    }

    return { texts, textNodes };
}