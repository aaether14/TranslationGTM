/**
 * Currency conversion module for RON to EUR
 * Handles detection and conversion of Romanian Lei prices to Euros
 */

// Default exchange rate (fallback if API fails)
const DEFAULT_EXCHANGE_RATE = 0.2; // 1 RON ≈ 0.2 EUR

// Cache the exchange rate
let currentExchangeRate = DEFAULT_EXCHANGE_RATE;
let originalExchangeRate = DEFAULT_EXCHANGE_RATE;

// Get the price modifier from GTM variable
const PRICE_MODIFIER = '{{Translation Price Modifier}}';

/**
 * Apply price modifier to the exchange rate
 * @param {number} rate - The original exchange rate
 * @returns {number} - The modified exchange rate
 */
const applyPriceModifier = (rate) => {
    try {
        if (!PRICE_MODIFIER || typeof rate !== 'number') {
            return rate;
        }
        
        // Simply multiply the rate by the modifier
        const modifier = parseFloat(PRICE_MODIFIER);
        if (!isNaN(modifier)) {
            const modifiedRate = rate * modifier;
            console.log(`[CurrencyConverter] Applied price modifier: ${PRICE_MODIFIER}, Original rate: ${rate}, Modified rate: ${modifiedRate}`);
            return modifiedRate;
        }
        
        return rate;
    } catch (error) {
        console.error('[CurrencyConverter] Error applying price modifier:', error);
        return rate;
    }
};

/**
 * Initialize the exchange rate
 * @returns {Promise<number>} The exchange rate
 */
export const initializeExchangeRate = async () => {
    try {
        // First try: Use your translation backend (if it has this endpoint)
        try {
            const response = await fetch('{{Translation Backend Url}}/api/exchange-rate?from=RON&to=EUR', {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.rate) {
                    originalExchangeRate = data.rate;
                    console.log('[CurrencyConverter] Original exchange rate from backend:', originalExchangeRate);
                    
                    // Apply price modifier to the exchange rate
                    currentExchangeRate = applyPriceModifier(originalExchangeRate);
                    
                    return currentExchangeRate;
                }
            }
        } catch (backendError) {
            console.log('[CurrencyConverter] Backend exchange rate not available:', backendError.message);
        }
        
        // Second try: Use a JSONP approach with a public API that supports it
        // This is a more complex approach that would require additional code
        
        // For now, use the default rate
        originalExchangeRate = DEFAULT_EXCHANGE_RATE;
        console.log('[CurrencyConverter] Using default exchange rate:', originalExchangeRate);
        
        // Apply price modifier to the default exchange rate
        currentExchangeRate = applyPriceModifier(originalExchangeRate);
        
        return currentExchangeRate;
    } catch (error) {
        console.error('[CurrencyConverter] Error fetching exchange rate:', error);
        console.log('[CurrencyConverter] Falling back to default rate:', DEFAULT_EXCHANGE_RATE);
        
        originalExchangeRate = DEFAULT_EXCHANGE_RATE;
        currentExchangeRate = applyPriceModifier(originalExchangeRate);
        
        return currentExchangeRate;
    }
};

/**
 * Check if text contains a RON price
 * @param {string} text - The text to check
 * @returns {boolean} True if the text contains a RON price
 */
export const containsRONPrice = (text) => {
    if (!text || typeof text !== 'string') {
        return false;
    }
    
    // Match common RON price patterns
    // Examples: "123,45 Lei", "1.234,56 Lei", "123 RON"
    return /\d{1,3}(\.\d{3})*(,\d{2})?\s*(Lei|RON)/i.test(text);
};

/**
 * Format a number with thousands separators and decimal comma
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted number string
 */
const formatNumber = (value, decimals = 2) => {
    try {
        // Format with thousands separator (.) and decimal comma (,)
        const parts = value.toFixed(decimals).split('.');
        const integerPart = parts[0];
        const decimalPart = parts.length > 1 ? parts[1] : '';
        
        // Add thousands separators
        const integerWithSeparators = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        // Return with decimal comma
        return decimalPart ? `${integerWithSeparators},${decimalPart}` : integerWithSeparators;
    } catch (error) {
        console.error('[CurrencyConverter] Error formatting number:', error);
        return value.toString();
    }
};

/**
 * Convert RON prices to EUR in a text string
 * @param {string} text - The text containing RON prices
 * @returns {string} The text with RON prices converted to EUR
 */
export const convertRONtoEUR = (text) => {
    if (!text || typeof text !== 'string') {
        return text;
    }
    
    try {
        // Extract all RON prices from the text
        const ronPricePattern = /(\d{1,3}(\.\d{3})*(,\d{2})?)\s*(Lei|RON)/gi;
        
        return text.replace(ronPricePattern, (match, priceGroup) => {
            // Extract numeric value
            const numericValue = priceGroup
                .replace(/\./g, '') // Remove thousand separators
                .replace(',', '.'); // Replace decimal comma with dot
            
            // Convert to EUR using the already modified exchange rate
            const eurValue = parseFloat(numericValue) * currentExchangeRate;
            
            // Format as EUR with the same formatting as RON (thousands separators and decimal comma)
            return formatNumber(eurValue) + ' €';
        });
    } catch (error) {
        console.error('[CurrencyConverter] Error converting price:', error, text);
        return text; // Return original text if conversion fails
    }
}; 