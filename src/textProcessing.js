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

export function replaceTextWithTranslation(textNodes, translations) {
    console.log(JSON.stringify(translations));
    textNodes.forEach((node, index) => {
        if (translations[index]) {
            node.nodeValue = translations[index]['translation'];
            if (node.parentNode) {
                node.parentNode.setAttribute('data-translated', 'true');
            }
        }
    });
}