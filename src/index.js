import { observeDOMChanges, activateTranslation, deactivateTranslation } from './domObserver.js';

if (!window.__translationObserverLoaded) {
    window.__translationObserverLoaded = true;

    window.activateTranslation = activateTranslation;
    window.deactivateTranslation = deactivateTranslation;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            observeDOMChanges();
            waitForLangSelector();
        });
    } else {
        observeDOMChanges();
        waitForLangSelector();
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

// Wait for .language--switcher__langselector using MutationObserver
function waitForLangSelector() {
    const observer = new MutationObserver((mutations, obs) => {
        const langSelector = document.querySelector('.language--switcher__langselector');
        if (langSelector) {
            addLanguageOptions();
            obs.disconnect(); // Stop observing once found
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Function to add new language options dynamically
function addLanguageOptions() {
    const langSelector = document.querySelector('.language--switcher__langselector');
    if (!langSelector) {
        console.warn('[TranslationTag] Language switcher not found.');
        return;
    }

    function createLanguageItem(flagSrc, altText, langCode) {
        const div = document.createElement('div');
        div.className = 'language--switcher__item';

        const a = document.createElement('a');
        a.href = 'javascript:void(0);'; 
        a.addEventListener('click', () => activateTranslation(langCode));

        const img = document.createElement('img');
        img.src = flagSrc;
        img.alt = altText;

        a.appendChild(img);
        div.appendChild(a);
        return div;
    }

    // Add Italian
    langSelector.appendChild(createLanguageItem('/assets/img/flags/italy.png', 'Italian', 'it'));

    // Add Greek
    langSelector.appendChild(createLanguageItem('/assets/img/flags/greece.png', 'Greek', 'el'));

    console.log('[TranslationTag] Italian & Greek languages added.');
}