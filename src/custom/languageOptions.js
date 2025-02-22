import { activateTranslation } from './../domObserver.js';

export function initializeLanguageOptions() {
    waitForLangSelector();
}

function waitForLangSelector() {
    const observer = new MutationObserver((mutations) => {
        const langSelector = document.querySelector('.language--switcher__langselector');
        if (langSelector) {
            // Add language options if they haven't been added already
            addLanguageOptions(langSelector);

            // Inject custom code for existing languages
            injectCustomCodeForLanguages(langSelector);
        }
    });

    // Observe the entire document for the language selector
    observer.observe(document.body, { childList: true, subtree: true });
}

function addLanguageOptions(langSelector) {
    // Check if the options have already been added
    if (langSelector.querySelector('.language--switcher__item[data-custom-lang="it"]')) {
        return;
    }

    function createLanguageItem(flagSrc, altText, langCode) {
        const div = document.createElement('div');
        div.className = 'language--switcher__item';
        div.setAttribute('data-custom-lang', langCode);

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

function injectCustomCodeForLanguages(langSelector) {
    const existingLanguages = langSelector.querySelectorAll('.language--switcher__item:not([data-custom-lang])');
    existingLanguages.forEach(langItem => {
        const langCode = langItem.querySelector('a')?.getAttribute('data-lang-code');
        if (langCode) {
            // Inject custom code for existing languages
            langItem.querySelector('a').addEventListener('click', () => {
                console.log(`[TranslationTag] Custom code injected for ${langCode}`);
                // Add your custom code here
            });
        }
    });
}