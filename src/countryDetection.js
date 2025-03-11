export const detectCountry = async () => {
    try {
        const response = await fetch('{{Translation Backend Url}}/api/country');
        if (!response.ok) {
            console.log('[TranslationTag] Country detection failed: API returned status', response.status);
            return { country: null, userIP: null };
        }
        
        const data = await response.json();
        
        // Extract country and userIP from the response
        const country = data && typeof data === 'object' && data.country ? data.country : null;
        const userIP = data && typeof data === 'object' && data.ip ? data.ip : null;
        
        return { country, userIP };
    } catch (error) {
        console.error('[TranslationTag] Country detection error:', error);
        return { country: null, userIP: null };
    }
};

export const isAllowedIP = (apiResponse) => {
    try {
        // Get the allowed IPs from GTM variable (JSON-encoded)
        const allowedIPsJson = '{{Translation Allowed IPs}}';
        
        // If allowedIPs is not properly defined or user IP is not available, return false
        if (!allowedIPsJson || !apiResponse || !apiResponse.userIP) {
            return false;
        }
        
        // Parse the JSON-encoded IP list
        let ipList;
        try {
            ipList = JSON.parse(allowedIPsJson);
            // Ensure it's an array
            if (!Array.isArray(ipList)) {
                ipList = [ipList.toString()];
            }
        } catch (parseError) {
            // Fallback: treat as a single IP if JSON parsing fails
            console.error('[TranslationTag] Error parsing allowed IPs JSON:', parseError);
            ipList = [allowedIPsJson];
        }
        
        // Check if user's IP is in the allowed list
        return ipList.includes(apiResponse.userIP);
    } catch (error) {
        console.error('[TranslationTag] Error checking allowed IPs:', error);
        return false;
    }
};

export const shouldActivateForCountry = (apiResponse) => {
    if (isAllowedIP(apiResponse)) {
        return true; // Always activate for allowed IPs
    }
    
    const country = apiResponse ? apiResponse.country : null;
    if (!country || typeof country !== 'string') return false;
    
    // Only activate for Italy or Greece
    return ['IT', 'EL'].includes(country);
};

export const getAvailableLanguagesForCountry = (apiResponse) => {
    // For allowed IPs, show all languages
    if (isAllowedIP(apiResponse)) {
        return ['it', 'el']; // Return all available languages
    }
    
    const country = apiResponse ? apiResponse.country : null;
    if (!country || typeof country !== 'string') return [];
    
    // Return specific language for each country
    if (country === 'IT') {
        return ['it']; // Italian for Italy
    } else if (country === 'EL') {
        return ['el']; // Greek for Greece
    }
    
    // No languages available for other countries
    return [];
}; 