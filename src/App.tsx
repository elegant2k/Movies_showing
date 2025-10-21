import { useState, useEffect } from 'react';
import type { Movie } from './types/movie';
import { tmdbService } from './services/tmdb';
import { norwegianCities } from './data/cities';
import { MovieCard } from './components/MovieCard';
import { MovieDetails } from './components/MovieDetails';
import { ApiStatus } from './components/ApiStatus';
import './App.css';

function App() {
  const [selectedCity, setSelectedCity] = useState('Oslo');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'now-playing' | 'upcoming'>('now-playing');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [selectedCity, activeTab]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response =
        activeTab === 'now-playing'
          ? await tmdbService.getNowPlaying('NO')
          : await tmdbService.getUpcoming('NO');
      setMovies(response.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchMovies();
      return;
    }

    try {
      setLoading(true);
      const response = await tmdbService.searchMovies(searchQuery);
      setMovies(response.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.id);
  };

  const handleCloseDetails = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 Kino Finder</h1>
        <p>Finn filmer som vises på kino i Norge</p>
      </header>

      <ApiStatus />

      <div className="controls">
        <div className="city-selector">
          <label htmlFor="city-select">Velg by:</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {norwegianCities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name} ({city.region})
              </option>
            ))}
          </select>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Søk etter filmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Søk</button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                fetchMovies();
              }}
            >
              Nullstill
            </button>
          )}
        </form>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'now-playing' ? 'active' : ''}`}
          onClick={() => setActiveTab('now-playing')}
        >
          Nå på kino
        </button>
        <button
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Kommer snart
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <p>Laster filmer...</p>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.length === 0 ? (
            <p className="no-results">Ingen filmer funnet.</p>
          ) : (
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
            ))
          )}
        </div>
      )}

      {selectedMovieId && (
        <MovieDetails movieId={selectedMovieId} onClose={handleCloseDetails} />
      )}

      <footer className="app-footer">
        <p>Data fra The Movie Database (TMDB) og OMDb API</p>
        <p>
          For å bruke denne appen, trenger du API-nøkler fra{' '}
          <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer">
            TMDB
          </a>{' '}
          og{' '}
          <a href="http://www.omdbapi.com/apikey.aspx" target="_blank" rel="noopener noreferrer">
            OMDb
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
