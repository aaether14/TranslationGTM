const STORAGE_KEY_LANG = 'translationLang';
const STORAGE_KEY_ACTIVE = 'translationActive';

export function getStoredLang() {
    return localStorage.getItem(STORAGE_KEY_LANG) || 'it';
}

export function setStoredLang(lang) {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
}

export function getStoredActive() {
    return localStorage.getItem(STORAGE_KEY_ACTIVE) === 'true';
}

export function setStoredActive(isActive) {
    localStorage.setItem(STORAGE_KEY_ACTIVE, isActive ? 'true' : 'false');
}