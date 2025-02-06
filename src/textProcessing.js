export function containsQuotes(text) {
    return /['"]/.test(text);
}

export function collectTextNodes(node) {
    let texts = [];
    let textNodes = [];
    let walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (textNode) => {
                let trimmedText = textNode.nodeValue.trim();
                if (trimmedText && !containsQuotes(trimmedText) && textNode.parentNode && !textNode.parentNode.hasAttribute('data-translated')) {
                    texts.push(trimmedText);
                    textNodes.push(textNode);
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );

    while (walker.nextNode()) { }  // Ensure processing of all nodes
    return { texts, textNodes };
}