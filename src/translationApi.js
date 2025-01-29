import { replaceTextWithTranslation } from './textProcessing.js';

export const fetchTranslations = async (texts, targetLang, textNodes) => {
  const apiUrl = '{{Translation API Url}}';
  const payload = { texts, targetLang };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data?.translations && Array.isArray(data.translations)) {
      replaceTextWithTranslation(textNodes, data.translations);
    } else {
      console.error('Invalid API response format:', data);
    }
  } catch (error) {
    console.error('Error with API call:', error);
  }
};