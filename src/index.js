import { observeDOMChanges, setTargetLanguage, deactivateTranslation } from './domObserver.js';
import { resetTranslations } from './translationManager.js';

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

    console.log('[TranslationTag] Translation Observer loaded.');
}

if (!window.__addEventListenerLoaded) {
    window.__translationObserverLoaded = true;

    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (type === 'click' && this.matches('.language--switcher__item a')) {
            console.log(`Intercepted click event listener on: ${this.outerHTML}`);

            // Wrap the original listener to modify its behavior
            const modifiedListener = function (event) {
                deactivateTranslation();
                // Call the original event listener
                return listener.apply(this, arguments);
            };

            // Attach the modified event listener instead
            return originalAddEventListener.call(this, type, modifiedListener, options);
        }

        // Default behavior for other elements
        return originalAddEventListener.call(this, type, listener, options);
    };

    console.log('[TranslationTag] Add Event Listener loaded.');
}