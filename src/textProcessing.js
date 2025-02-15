import { getStoredLang } from "./storageManager";

export function containsQuotes(text) {
    return /['"]/.test(text);
}

export function collectTextNodes(node) {
    let currentLang = getStoredLang();

    let texts = [];
    let textNodes = [];
    let walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (textNode) => {
                if (!textNode.parentNode)
                {
                    return NodeFilter.FILTER_ACCEPT;
                }

                let originalTextLang = textNode.parentNode.getAttribute('data-translated');
                let originalText = textNode.parentNode.getAttribute('data-original-text');
                let trimmedText = textNode.nodeValue.trim();

                if (trimmedText && 
                    !containsQuotes(trimmedText) &&
                    originalTextLang !== currentLang) {
                    texts.push(originalText || trimmedText);
                    textNodes.push(textNode);
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );

    while (walker.nextNode()) { } 
    return { texts, textNodes };
}