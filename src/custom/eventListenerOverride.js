import { deactivateTranslation } from '../domObserver.js';
import { setUserSelectedLanguage } from '../storageManager.js';

export function setupEventListenerOverride() {
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (type === 'click' && 
            this instanceof Element &&
            this.matches('.language--switcher__item a')) {
            const modifiedListener = function (event) {
                setUserSelectedLanguage(true);
                deactivateTranslation();
                return listener.apply(this, arguments);
            };

            return originalAddEventListener.call(this, type, modifiedListener, options);
        }

        return originalAddEventListener.call(this, type, listener, options);
    };

    console.log('[TranslationTag] Event listener override applied.');
}