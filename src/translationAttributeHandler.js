export const addTranslationToAttribute = (parentNode, translatedText, originalText) => {
    let translationMap = {};
    if (parentNode.hasAttribute('data-original-text')) {
        translationMap = JSON.parse(parentNode.getAttribute('data-original-text'));
    }
    translationMap[translatedText] = originalText;
    parentNode.setAttribute('data-original-text', JSON.stringify(translationMap));
};

export const getTranslationMapFromAttribute = (parentNode) => {
    if (parentNode.hasAttribute('data-original-text')) {
        return JSON.parse(parentNode.getAttribute('data-original-text'));
    }
    return {};
};