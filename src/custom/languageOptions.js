import { activateTranslation } from '../domObserver.js';
import { getStoredActive, getStoredLang } from '../storageManager.js';

const flagPaths = {
    it: { src: '/assets/img/flags/italy.png', alt: 'Italy' },
    el: { src: '/assets/img/flags/greece.png', alt: 'Greece' }
};

export function initializeLanguageOptions() {
    waitForSelector();
    waitForLangSelector();
}

function waitForSelector() {
    const observer = new MutationObserver((mutations, obs) => {
        const flagSelector = document.querySelector('.language--switcher__selector img');
        if (flagSelector) {
            updateFlagAfterReload();

            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function waitForLangSelector() {
    const observer = new MutationObserver((mutations, obs) => {
        const langSelector = document.querySelector('.language--switcher__langselector');
        if (langSelector) {
            addLanguageOptions(langSelector);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function addLanguageOptions(langSelector) {
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

    langSelector.appendChild(createLanguageItem(flagPaths.it.src, flagPaths.it.alt, 'it'));
    langSelector.appendChild(createLanguageItem(flagPaths.el.src, flagPaths.el.alt, 'el'));

    console.log('[TranslationTag] Language options added.');
}

function updateFlagAfterReload() {
    if (!getStoredActive())
    {
        return;
    }

    const selectedLanguage = getStoredLang(); 
    if (selectedLanguage && flagPaths[selectedLanguage]) {
        const flagImg = document.querySelector('.language--switcher__selector img');
        if (flagImg) {
            flagImg.src = flagPaths[selectedLanguage].src;
            flagImg.alt = flagPaths[selectedLanguage].alt
            console.log(`[TranslationTag] Flag updated to ${selectedLanguage}`);
        }
    }
}