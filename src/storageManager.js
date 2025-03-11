const STORAGE_KEY_LANG = 'translationLang';
const STORAGE_KEY_ACTIVE = 'translationActive';
const STORAGE_KEY_USER_SELECTED = 'translationUserSelected';

export function getStoredLang() {
    try {
        return localStorage.getItem(STORAGE_KEY_LANG) || '';
    } catch (error) {
        console.error('[TranslationTag] Error getting stored language:', error);
        return '';
    }
}

export function setStoredLang(lang) {
    try {
        localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (error) {
        console.error('[TranslationTag] Error setting stored language:', error);
    }
}

export function getStoredActive() {
    try {
        return localStorage.getItem(STORAGE_KEY_ACTIVE) === 'true';
    } catch (error) {
        console.error('[TranslationTag] Error getting stored active state:', error);
        return false;
    }
}

export function setStoredActive(isActive) {
    try {
        localStorage.setItem(STORAGE_KEY_ACTIVE, isActive ? 'true' : 'false');
    } catch (error) {
        console.error('[TranslationTag] Error setting stored active state:', error);
    }
}

export function isUserSelectedLanguage() {
    try {
        return localStorage.getItem(STORAGE_KEY_USER_SELECTED) === 'true';
    } catch (error) {
        console.error('[TranslationTag] Error getting user selected flag:', error);
        return false;
    }
}

export function setUserSelectedLanguage(isUserSelected) {
    try {
        localStorage.setItem(STORAGE_KEY_USER_SELECTED, isUserSelected ? 'true' : 'false');
    } catch (error) {
        console.error('[TranslationTag] Error setting user selected flag:', error);
    }
}