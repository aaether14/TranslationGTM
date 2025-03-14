/**
 * Price Transformer Module
 * Handles the transformation of RON prices to EUR in the application
 */
import { containsRONPrice, convertRONtoEUR } from './currencyConverter.js';

// CSS selectors for elements that might contain prices
const priceSelectors = [
    '.cart__value', 
    '.product__main-price', 
    '.detail__price-value', 
    '.detail__price-table-col',
    '.price',
    '.total',
    '.subtotal',
    '.amount'
];

/**
 * Check if text contains a price that should be converted
 * @param {string} text - The text to check
 * @returns {boolean} True if the text contains a convertible price
 */
export function shouldConvertPrice(text) {
    return containsRONPrice(text);
}

/**
 * Transform prices in text from RON to EUR
 * @param {string} text - The text that may contain prices
 * @returns {string} The text with prices transformed
 */
export function transformPrices(text) {
    if (!text || typeof text !== 'string') {
        return text;
    }
    
    if (shouldConvertPrice(text)) {
        return convertRONtoEUR(text);
    }
    
    return text;
}

/**
 * Check if an element is likely to contain a price
 * @param {Element} element - The DOM element to check
 * @returns {boolean} True if the element likely contains a price
 */
export function isPriceElement(element) {
    if (!element) return false;
    
    // Check if the element matches any of the price selectors
    return priceSelectors.some(selector => {
        try {
            return element.matches(selector) || element.closest(selector);
        } catch (e) {
            return false;
        }
    });
}

/**
 * Initialize the price transformer
 * @returns {Promise<boolean>} True if initialization was successful
 */
export async function initializePriceTransformer() {
    try {
        // Import and initialize the exchange rate for price conversion
        const { initializeExchangeRate } = await import('./currencyConverter.js');
        await initializeExchangeRate();
        
        console.log('[PriceTransformer] Initialized with RON to EUR conversion');
        return true;
    } catch (error) {
        console.error('[PriceTransformer] Initialization error:', error);
        return false;
    }
} 