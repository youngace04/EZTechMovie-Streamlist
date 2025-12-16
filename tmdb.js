// src/services/tmdb.js
const API_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Debug (optional): confirm the key is loaded — remove after verifying
// Only warn if API key missing; avoid logging key or request details in production
if (!API_KEY) {
  console.warn('[TMDB] Missing REACT_APP_TMDB_API_KEY; movie features will be disabled.');
}

export async function fetchPopularMovies(page = 1, language = 'en-US') {
  if (!API_KEY) {
    throw new Error('Missing REACT_APP_TMDB_API_KEY in .env');
  }

  // IMPORTANT: real ampersand '&', not '&amp;'
  const url = `${API_BASE}/movie/popular?language=${encodeURIComponent(language)}&page=${page}&api_key=${API_KEY}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  // Check response status; detailed logging removed to reduce verbosity

  if (!res.ok) {
    const text = await safeText(res);
    console.warn('[TMDB] Error body:', text);
    throw new Error(`TMDB popular failed: ${res.status} ${res.statusText} — ${text}`);
  }

  const data = await res.json();
  return Array.isArray(data.results) ? data.results : [];
}

async function safeText(res) {
  try { return await res.text(); } catch { return ''; }
}
