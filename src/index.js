import { observeDOMChanges, activateTranslation, deactivateTranslation } from './domObserver.js';
import { initializeLanguageOptions } from './custom/languageOptions.js';
import { setupEventListenerOverride } from './custom/eventListenerOverride.js';
import { detectCountry, shouldActivateForCountry } from './countryDetection.js';

if (!window.__translationTag) {
    window.__translationTag = true;

    // Expose these functions safely
    try {
        window.activateTranslation = activateTranslation;
        window.deactivateTranslation = deactivateTranslation;
    } catch (error) {
        console.error('[TranslationTag] Error exposing translation functions:', error);
    }

    const initializeTranslation = async () => {
        try {
            const apiResponse = await detectCountry();
            
            if (!shouldActivateForCountry(apiResponse)) {
                console.log(`[TranslationTag] Not initializing for country: ${apiResponse.country || 'unknown'}`);
                return;
            }
            
            console.log(`[TranslationTag] Initializing for country: ${apiResponse.country}`);
            
            try {
                observeDOMChanges();
            } catch (error) {
                console.error('[TranslationTag] Error initializing DOM observer:', error);
            }
            
            try {
                initializeLanguageOptions(apiResponse);
            } catch (error) {
                console.error('[TranslationTag] Error initializing language options:', error);
            }
            
            try {
                setupEventListenerOverride();
            } catch (error) {
                console.error('[TranslationTag] Error setting up event listener override:', error);
            }
            
            console.log('[TranslationTag] Initialized.');
        } catch (error) {
            console.error('[TranslationTag] Initialization error:', error);
        }
    };

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