
// src/services/tmdb.js
// CRA uses REACT_APP_* env vars:
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Base URLs
const API_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

/**
 * Build a full TMDB image URL for a given path.
 * @param {string} path
 * @param {'w92'|'w154'|'w185'|'w342'|'w500'|'w780'|'original'} size
 */
export function imageUrl(path, size = 'w500') {
  return path ? `${IMG_BASE}/${size}${path}` : '';
}

/**
 * Internal helper to call TMDB v3.
 * Ensures api_key is present and returns JSON.
 * Throws on non-OK responses.
 */
async function get(path, params = {}) {
  if (!API_KEY) {
    throw new Error('Missing REACT_APP_TMDB_API_KEY in .env');
  }
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set('api_key', API_KEY);

  // Allow common params like page, language, query, region, etc.
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`TMDB ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

/** Normalize a TMDB list response to an array of results */
function toArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

/**
 * POPULAR — matches Movies.js usage: fetchPopularMovies(page, language)
 * Returns an array of movies.
 */
export async function fetchPopularMovies(page = 1, language = 'en-US') {
  const data = await get('/movie/popular', { page, language });
  return toArray(data);
}

/**
 * TOP RATED — used by StreamList.js featured rail
 */
export async function fetchTopRatedMovies(page = 1, language = 'en-US') {
  const data = await get('/movie/top_rated', { page, language });
  return toArray(data);
}

/**
 * NOW PLAYING — used by StreamList.js featured rail
 */
export async function fetchNowPlayingMovies(page = 1, language = 'en-US') {
  const data = await get('/movie/now_playing', { page, language });
  return toArray(data);
}

/**
 * UPCOMING — for tag support if you use 'upcoming' in StreamList filters
 */
export async function fetchUpcomingMovies(page = 1, language = 'en-US') {
  const data = await get('/movie/upcoming', { page, language });
  return toArray(data);
}

/**
 * TRENDING — for 'trending' tag (day/week)
 */
export async function fetchTrendingMovies(window = 'day') {
  const data = await get(`/trending/movie/${window}`);
  return toArray(data);
}

/**
 * SEARCH — StreamList.js calls searchMovies(query, activeTag)
 * If query is non-empty → search endpoint.
 * If query is empty → route by activeTag ('popular' | 'topRated' | 'nowPlaying' | 'upcoming' | 'trending').
 * Returns an array in all cases.
 */
export async function searchMovies(query = '', activeTag = 'popular', page = 1, language = 'en-US') {
  const q = String(query || '').trim();

  if (q.length > 0) {
    const data = await get('/search/movie', { query: q, page, language });
    return toArray(data);
  }

  // No query: decide by activeTag
  switch (activeTag) {
    case 'popular':
      return fetchPopularMovies(page, language);
    case 'topRated':
      return fetchTopRatedMovies(page, language);
    case 'nowPlaying':
      return fetchNowPlayingMovies(page, language);
    case 'upcoming':
      return fetchUpcomingMovies(page, language);
    case 'trending':
      return fetchTrendingMovies('day');
    default:
      // Fallback to popular
      return fetchPopularMovies(page, language);
  }
}

/**
 * DETAILS — if you need it elsewhere
 */
export async function fetchMovieDetails(id, language = 'en-US') {
  const data = await get(`/movie/${id}`, { language });
  return data; // details page needs the object
}

/** Optional consolidated API object */
export const tmdb = {
  imageUrl,
  get,

  popular: fetchPopularMovies,
  topRated: fetchTopRatedMovies,
  nowPlaying: fetchNowPlayingMovies,
  upcoming: fetchUpcomingMovies,
  trending: fetchTrendingMovies,

  searchMovies,
  movieDetails: fetchMovieDetails,
};
