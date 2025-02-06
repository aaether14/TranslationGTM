export const fetchTranslationsFromApi = async (texts, targetLang) => {
  const apiUrl = '{{Translation API Url}}';
  const payload = { texts, targetLang };

  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
      });

      const data = await response.json();
      return data?.translations || [];
  } catch (error) {
      console.error('API error:', error);
      return [];
  }
};