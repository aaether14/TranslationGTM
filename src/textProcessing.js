import { getStoredLang } from "./storageManager";
import { getTranslationMapFromAttribute } from "./translationAttributeHandler";

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
        const parentNode = textNode.parentNode;

        if (!parentNode || parentNode.nodeName === "SCRIPT") {
            continue;
        }
        const trimmedText = textNode.nodeValue.trim();
        if (!trimmedText) {
            continue;
        }

        const translationMap = getTranslationMapFromAttribute(parentNode);

        const translatedLang = parentNode.getAttribute('data-translated');
        if (translatedLang === currentLang && Object.values(translationMap).includes(trimmedText)) {
            continue;
        }

        texts.push(trimmedText);
        textNodes.push(textNode);
    }

    return { texts, textNodes };
}