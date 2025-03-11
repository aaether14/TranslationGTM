import { activateTranslation } from '../domObserver.js';
import { getStoredActive, getStoredLang, setStoredLang } from '../storageManager.js';
import { getAvailableLanguagesForCountry } from '../countryDetection.js';

const flagPaths = {
    it: { src: '{{Translation Backend Url}}/images/italy.png', alt: 'Italy' },
    el: { src: '{{Translation Backend Url}}/images/greece.png', alt: 'Greece' }
};

let userCountry = null;
let availableLanguages = [];

export function initializeLanguageOptions(apiResponse) {
    try {
        userCountry = apiResponse.country;
        availableLanguages = getAvailableLanguagesForCountry(apiResponse);
        
        // Set default language based on country
        if (availableLanguages.length > 0 && !getStoredLang()) {
            try {
                const defaultLang = availableLanguages[0];
                setStoredLang(defaultLang);
            } catch (error) {
                console.error('[TranslationTag] Error setting default language:', error);
            }
        }
        
        waitForSelector();
        waitForLangSelector();
    } catch (error) {
        console.error('[TranslationTag] Error initializing language options:', error);
    }
}

function waitForSelector() {
    try {
        const observer = new MutationObserver((mutations, obs) => {
            try {
                const flagSelector = document.querySelector('.language--switcher__selector img');
                if (flagSelector) {
                    try {
                        updateFlagAfterReload();
                    } catch (error) {
                        console.error('[TranslationTag] Error updating flag after reload:', error);
                    }
                    obs.disconnect();
                }
            } catch (error) {
                console.error('[TranslationTag] Error in flag selector observer callback:', error);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    } catch (error) {
        console.error('[TranslationTag] Error setting up flag selector observer:', error);
    }
}

function waitForLangSelector() {
    try {
        const observer = new MutationObserver((mutations, obs) => {
            try {
                const langSelector = document.querySelector('.language--switcher__langselector');
                if (langSelector) {
                    try {
                        addLanguageOptions(langSelector);
                    } catch (error) {
                        console.error('[TranslationTag] Error adding language options:', error);
                    }
                }
            } catch (error) {
                console.error('[TranslationTag] Error in language selector observer callback:', error);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    } catch (error) {
        console.error('[TranslationTag] Error setting up language selector observer:', error);
    }
}

function addLanguageOptions(langSelector) {
    try {
        // Check if we've already added our custom language options
        if (langSelector.querySelector('.language--switcher__item[data-custom-lang]')) {
            return;
        }
        
        // If no available languages for this country, don't add any options
        if (!availableLanguages || availableLanguages.length === 0) {
            console.log('[TranslationTag] No language options available for country:', userCountry);
            return;
        }

        function createLanguageItem(flagSrc, altText, langCode) {
            try {
                const div = document.createElement('div');
                div.className = 'language--switcher__item';
                div.setAttribute('data-custom-lang', langCode);

                const a = document.createElement('a');
                a.href = 'javascript:void(0);'; 
                
                try {
                    a.addEventListener('click', () => {
                        try {
                            activateTranslation(langCode);
                        } catch (error) {
                            console.error('[TranslationTag] Error activating translation from language selector:', error);
                        }
                    });
                } catch (error) {
                    console.error('[TranslationTag] Error adding click event listener:', error);
                }

                const img = document.createElement('img');
                img.src = flagSrc;
                img.alt = altText;

                a.appendChild(img);
                div.appendChild(a);
                return div;
            } catch (error) {
                console.error('[TranslationTag] Error creating language item:', error);
                return null;
            }
        }

        // Only add language options that are available for this country
        availableLanguages.forEach(langCode => {
            try {
                if (flagPaths[langCode]) {
                    const item = createLanguageItem(flagPaths[langCode].src, flagPaths[langCode].alt, langCode);
                    if (item) {
                        langSelector.appendChild(item);
                    }
                }
            } catch (error) {
                console.error(`[TranslationTag] Error adding language option for ${langCode}:`, error);
            }
        });

        console.log(`[TranslationTag] Added language options for country ${userCountry}:`, availableLanguages);
    } catch (error) {
        console.error('[TranslationTag] Error in addLanguageOptions:', error);
    }
}

function updateFlagAfterReload() {
    try {
        if (!getStoredActive()) {
            return;
        }

        const selectedLanguage = getStoredLang(); 
        
        // Only update flag if the selected language is available for this country
        if (selectedLanguage && 
            flagPaths[selectedLanguage] && 
            availableLanguages.includes(selectedLanguage)) {
            
            const flagImg = document.querySelector('.language--switcher__selector img');
            if (flagImg) {
                try {
                    flagImg.src = flagPaths[selectedLanguage].src;
                    flagImg.alt = flagPaths[selectedLanguage].alt;
                    console.log(`[TranslationTag] Flag updated to ${selectedLanguage}`);
                } catch (error) {
                    console.error('[TranslationTag] Error updating flag image:', error);
                }
            }
        }
    } catch (error) {
        console.error('[TranslationTag] Error in updateFlagAfterReload:', error);
    }
}