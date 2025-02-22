import { getStoredLang } from "./storageManager";
import { getTranslationMapFromAttribute } from "./translationAttributeHandler";
import { shouldIncludeNode } from "./nodeFilter";

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
        if (!shouldIncludeNode(textNode)) {
            continue;
        }
        
        const trimmedText = textNode.nodeValue.trim();
        if (!trimmedText) {
            continue;
        }

        const parentNode = textNode.parentNode;
        const translationMap = getTranslationMapFromAttribute(parentNode);

        const translatedLang = parentNode.getAttribute('data-translated');
        if (translatedLang === currentLang)
        {
            if (trimmedText in translationMap)
            {
                // text already translated.
                continue;
            }
        }

        texts.push(trimmedText);
        textNodes.push(textNode);
    }

    return { texts, textNodes };
}