import { observeDOMChanges, activateTranslation, deactivateTranslation } from './domObserver.js';
import { initializeLanguageOptions } from './custom/languageOptions.js';
import { setupEventListenerOverride } from './custom/eventListenerOverride.js';

if (!window.__translationTag) {
    window.__translationTag = true;

    window.activateTranslation = activateTranslation;
    window.deactivateTranslation = deactivateTranslation;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            observeDOMChanges();
            initializeLanguageOptions();
            setupEventListenerOverride();
        });
    } else {
        observeDOMChanges();
        initializeLanguageOptions();
        setupEventListenerOverride();
    }

    console.log('[TranslationTag] Initialized.');
}