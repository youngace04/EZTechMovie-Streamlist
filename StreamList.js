
// src/components/StreamList.js
import { useEffect, useMemo, useState } from 'react';
import './StreamList.css';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  searchMovies,
  fetchTopRatedMovies,
  fetchNowPlayingMovies,
} from '../services/tmdb';

const BRAND_TAGS = [
  { key: 'popular',   label: 'Popular',     color: '#2563eb' }, // blue
  { key: 'topRated',  label: 'Top Rated',   color: '#f59e0b' }, // amber
  { key: 'nowPlaying',label: 'Now Playing', color: '#ef4444' }, // red
  { key: 'upcoming',  label: 'Upcoming',    color: '#22c55e' }, // green
  { key: 'trending',  label: 'Trending',    color: '#06b6d4' }, // cyan
];

function StreamList() {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('popular');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [watchlist, setWatchlist] = useLocalStorage('stream.watchlist', []);

  // Featured rails
  const [featuredA, setFeaturedA] = useState([]);
  const [featuredB, setFeaturedB] = useState([]);

  // Fetch results (search or by tag)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await searchMovies(query, activeTag);
        if (isMounted) setResults(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('[StreamList] search error', e);
        if (isMounted) setResults([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [query, activeTag]);

  // Featured rails: Top Rated + Now Playing
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const a = await fetchTopRatedMovies();
        const b = await fetchNowPlayingMovies();
        if (isMounted) {
          setFeaturedA(a?.slice(0, 10) || []);
          setFeaturedB(b?.slice(0, 10) || []);
        }
      } catch (e) {
        console.error('[StreamList] featured error', e);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const addToWatchlist = (item) => {
    if (!item || !item.id) return;
    const exists = watchlist.some(w => w.id === item.id);
    if (exists) return;
    setWatchlist(prev => [{ ...item, addedAt: new Date().toISOString() }, ...prev]);
  };

  const heroBg = useMemo(() => {
    const pick = featuredA[0] || featuredB[0];
    const url = pick?.backdrop_path ? `https://image.tmdb.org/t/p/w1280${pick.backdrop_path}` : null;
    return url;
  }, [featuredA, featuredB]);

  return (
    <div className="stream-home container">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: heroBg ? `url(${heroBg})` : 'none' }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Discover & Save Your Next Watch</h1>
          <p className="hero-subtitle">
            Browse trending movies, top picks, and what’s playing—add favorites to your Watchlist.
          </p>

          {/* Search */}
          <div className="hero-search">
            <input
              className="input hero-input"
              type="text"
              placeholder="Search movies…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary hero-btn">Search</button>
          </div>

          {/* Quick Filters */}
          <div className="tag-row">
            {BRAND_TAGS.map(tag => (
              <button
                key={tag.key}
                className={`chip ${activeTag === tag.key ? 'chip-active' : ''}`}
                style={{ '--chip-color': tag.color }}
                onClick={() => setActiveTag(tag.key)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="section">
        <div className="section-header">
          <h2>Results</h2>
          <div className="section-subtitle">
            {loading ? 'Loading…' :
              (results?.length ? `${results.length} found` : 'No results yet')}
          </div>
        </div>

        <div className="grid">
          {results?.map((m) => (
            <article key={m.id} className="card movie-card">
              <div className="card-banner"
                   style={{ background: 'linear-gradient(90deg, var(--brand-red), var(--brand-red-hover))' }} />
              <img
                className="movie-image"
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
                    : '/images/subscriptions-fallback.jpg'
                }
                alt={m.title || m.name}
              />
              <div className="card-body stack-12">
                <h3 className="card-title">{m.title || m.name}</h3>
                <p className="card-meta">
                  {m.release_date || m.first_air_date || '—'} • ⭐ {m.vote_average?.toFixed(1) ?? 'N/A'}
                </p>
                <div className="row-12">
                  <button className="btn btn-primary" onClick={() => addToWatchlist(m)}>
                    + Watchlist
                  </button>
                  <a
                    className="btn btn-secondary"
                    href={`https://www.themoviedb.org/movie/${m.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Details
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURED ROWS */}
      <section className="section">
        <div className="section-header">
          <h2>Top Rated Picks</h2>
          <div className="section-subtitle">Highly reviewed titles</div>
        </div>
        <div className="rail">
          {featuredA?.map((m) => (
            <div key={m.id} className="rail-card">
              <img
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w185${m.poster_path}`
                    : '/images/subscriptions-fallback.jpg'
                }
                alt={m.title || m.name}
              />
              <div className="rail-title">{m.title || m.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Now Playing</h2>
          <div className="section-subtitle">In theaters and fresh</div>
        </div>
        <div className="rail rail-alt">
          {featuredB?.map((m) => (
            <div key={m.id} className="rail-card">
              <img
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w185${m.poster_path}`
                    : '/images/subscriptions-fallback.jpg'
                }
                alt={m.title || m.name}
              />
              <div className="rail-title">{m.title || m.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND ACCENTS */}
      <section className="section">
        <div className="brand-blocks">
          <div className="brand-card brand-blue">
            <h3>Make it Yours</h3>
            <p>Save and organize your watchlist by genre, mood, or night themes.</p>
          </div>
          <div className="brand-card brand-amber">
            <h3>Curated Highlights</h3>
            <p>From award winners to hidden gems—discover curated sets.</p>
          </div>
          <div className="brand-card brand-cyan">
            <h3>Fresh & Trending</h3>
            <p>See what’s making waves right now on the big screen.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StreamList;
