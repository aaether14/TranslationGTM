/**
 * Currency conversion module for RON to EUR
 * Handles detection and conversion of Romanian Lei prices to Euros
 */

// Default exchange rate (fallback if API fails)
const DEFAULT_EXCHANGE_RATE = 0.2; // 1 RON ≈ 0.2 EUR

// Cache the exchange rate
let currentExchangeRate = DEFAULT_EXCHANGE_RATE;

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
                    currentExchangeRate = data.rate;
                    console.log('[CurrencyConverter] Using exchange rate from backend:', currentExchangeRate);
                    return currentExchangeRate;
                }
            }
        } catch (backendError) {
            console.log('[CurrencyConverter] Backend exchange rate not available:', backendError.message);
        }
        
        // Second try: Use a JSONP approach with a public API that supports it
        // This is a more complex approach that would require additional code
        
        // For now, use the default rate
        console.log('[CurrencyConverter] Using default exchange rate:', DEFAULT_EXCHANGE_RATE);
        return DEFAULT_EXCHANGE_RATE;
    } catch (error) {
        console.error('[CurrencyConverter] Error fetching exchange rate:', error);
        console.log('[CurrencyConverter] Falling back to default rate:', DEFAULT_EXCHANGE_RATE);
        return DEFAULT_EXCHANGE_RATE;
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
            
            // Convert to EUR
            const eurValue = parseFloat(numericValue) * currentExchangeRate;
            
            // Format as EUR
            return eurValue.toFixed(2).replace('.', ',') + ' €';
        });
    } catch (error) {
        console.error('[CurrencyConverter] Error converting price:', error, text);
        return text; // Return original text if conversion fails
    }
}; 