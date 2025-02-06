import { observeDOMChanges, setTargetLanguage, deactivateTranslation } from './domObserver.js';

if (!window.__translationObserverLoaded) {
    window.__translationObserverLoaded = true;

    // Expose control functions to the global scope
    window.setTargetLanguage = setTargetLanguage;
    window.deactivateTranslation = deactivateTranslation;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeDOMChanges);
    } else {
        observeDOMChanges();
    }
}