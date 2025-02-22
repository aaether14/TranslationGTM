const pricePattern = /\d{1,3}(\.\d{3})*(,\d{2})?/i;
const priceClasses = ['cart__value', '.product__main-price', '.detail__price-value', '.detail__price-table-col'];

export function shouldIncludeNode(textNode) {
    const parentNode = textNode.parentNode;
    const trimmedText = textNode.nodeValue.trim();

    if (!parentNode)
    {
        return false;
    }

    if (parentNode.nodeName === "SCRIPT") {
        return false;
    }

    if (priceClasses.some(c => parentNode.closest(c))
        && pricePattern.test(trimmedText))
    {
        return false;
    }

    return true;
}