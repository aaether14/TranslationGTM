/**
 * Main entry point for the translation and price conversion system
 * Initializes all components and sets up the translation environment
 */
import { observeDOMChanges, activateTranslation, deactivateTranslation } from './domObserver.js';
import { initializeLanguageOptions } from './custom/languageOptions.js';
import { setupEventListenerOverride } from './custom/eventListenerOverride.js';
import { detectCountry, shouldActivateForCountry } from './countryDetection.js';
import { initializePriceTransformer } from './priceTransformer.js';
import { initializeCartInterceptor } from './cartInterceptor.js';

// Ensure we only initialize once
if (!window.__translationTag) {
    window.__translationTag = true;

    // Expose public functions to the global scope
    try {
        window.activateTranslation = activateTranslation;
        window.deactivateTranslation = deactivateTranslation;
    } catch (error) {
        console.error('[TranslationTag] Error exposing translation functions:', error);
    }

    /**
     * Initialize the translation and price conversion system
     */
    const initializeTranslation = async () => {
        try {
            // Detect user's country
            const apiResponse = await detectCountry();
            
            // Check if we should activate for this country
            if (!shouldActivateForCountry(apiResponse)) {
                console.log(`[TranslationTag] Not initializing for country: ${apiResponse.country || 'unknown'} and ip: ${apiResponse.userIP || 'unknown'}`);
                return;
            }
            
            console.log(`[TranslationTag] Initializing for country: ${apiResponse.country} and ip: ${apiResponse.userIP || 'unknown'}`);
            
            // Initialize price transformer (RON to EUR conversion)
            try {
                await initializePriceTransformer();
                console.log('[TranslationTag] Price transformer initialized');
            } catch (error) {
                console.error('[TranslationTag] Error initializing price transformer:', error);
            }
            
            // Set up DOM observer for translations
            try {
                observeDOMChanges();
            } catch (error) {
                console.error('[TranslationTag] Error initializing DOM observer:', error);
            }
            
            // Initialize language options
            try {
                initializeLanguageOptions(apiResponse);
            } catch (error) {
                console.error('[TranslationTag] Error initializing language options:', error);
            }
            
            // Set up event listener override
            try {
                setupEventListenerOverride();
            } catch (error) {
                console.error('[TranslationTag] Error setting up event listener override:', error);
            }
            
            // Initialize cart interceptor
            try {
                initializeCartInterceptor();
                console.log('[TranslationTag] Cart interceptor initialized');
            } catch (error) {
                console.error('[TranslationTag] Error initializing cart interceptor:', error);
            }
            
            console.log('[TranslationTag] Initialization complete');
        } catch (error) {
            console.error('[TranslationTag] Initialization error:', error);
        }
    };

    // Initialize when the DOM is ready
    try {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeTranslation);
        } else {
            initializeTranslation();
        }
    } catch (error) {
        console.error('[TranslationTag] Error setting up initialization:', error);
    }
}