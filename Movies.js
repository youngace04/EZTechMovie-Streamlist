// src/components/Movies.js
import { useEffect, useState } from 'react';
import { fetchPopularMovies } from '../services/tmdb';
import './Movies.css'; 

function Movies() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle'|'loading'|'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async function load() {
      setStatus('loading');
      try {
        const results = await fetchPopularMovies(1, 'en-US');
        if (!cancelled) {
          setMovies(results);
          setStatus('idle');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || String(err));
          setStatus('error');
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="movies-container">
      <h1>Popular Movies (TMDB)</h1>
      {status === 'loading' && <p>Loading…</p>}
      {status === 'error' && <p className="error">Error: {error}</p>}

      <div className="movies-grid">
        {movies.map(m => (
          <article key={m.id} className="movie-card">
            {m.poster_path ? (
              <img
                alt={m.title}
                src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                loading="lazy"
              />
            ) : (
              <div className="poster-placeholder">No Image</div>
            )}
            <div className="movie-meta">
              <h3>{m.title}</h3>
              <p className="overview">{m.overview}</p>
              <p className="subtle">Release: {m.release_date || '—'}</p>
              <p className="subtle">Rating: {m.vote_average?.toFixed(1) ?? '—'}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Movies;
