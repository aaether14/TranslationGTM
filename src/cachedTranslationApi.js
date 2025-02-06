import { fetchTranslationsFromApi } from './translationApi.js';

const CACHE_KEY = 'translationCache';

const loadCache = () => JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
const saveCache = (cache) => localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

export const fetchTranslations = async (texts, targetLang) => {
    const cache = loadCache();
    let uncachedTexts = [];
    let cachedTranslations = [];

    texts.forEach(text => {
        const key = `${targetLang}:${text}`;
        if (cache[key]) {
            cachedTranslations.push({ text, translation: cache[key] });
        } else {
            uncachedTexts.push(text);
        }
    });

    if (uncachedTexts.length > 0) {
        const freshTranslations = await fetchTranslationsFromApi(uncachedTexts, targetLang);
        freshTranslations.forEach((t, i) => {
            const key = `${targetLang}:${uncachedTexts[i]}`;
            cache[key] = t.translation;
            cachedTranslations.push({ text: uncachedTexts[i], translation: t.translation });
        });
        saveCache(cache);
    }

    return cachedTranslations;
};