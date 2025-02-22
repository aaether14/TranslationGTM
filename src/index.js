import { observeDOMChanges, activateTranslation, deactivateTranslation } from './domObserver.js';
import { initializeLanguageOptions } from './custom/languageOptions.js';

if (!window.__translationObserverLoaded) {
    window.__translationObserverLoaded = true;

    window.activateTranslation = activateTranslation;
    window.deactivateTranslation = deactivateTranslation;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            observeDOMChanges();
            initializeLanguageOptions();
        });
    } else {
        observeDOMChanges();
        initializeLanguageOptions();
    }

    console.log('[TranslationTag] Translation Observer loaded.');
}

if (!window.__addEventListenerLoaded) {
    window.__addEventListenerLoaded = true;

    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (type === 'click' && 
            this instanceof Element &&
            this.matches('.language--switcher__item a')) {
            const modifiedListener = function (event) {
                deactivateTranslation();
                return listener.apply(this, arguments);
            };

            return originalAddEventListener.call(this, type, modifiedListener, options);
        }

        return originalAddEventListener.call(this, type, listener, options);
    };

    console.log('[TranslationTag] Add Event Listener loaded.');
}