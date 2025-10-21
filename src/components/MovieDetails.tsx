import { useEffect, useState } from 'react';
import type { MovieDetails as MovieDetailsType } from '../types/movie';
import { tmdbService } from '../services/tmdb';
import { omdbService, type OMDBMovie } from '../services/omdb';

interface MovieDetailsProps {
  movieId: number;
  onClose: () => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [omdbData, setOmdbData] = useState<OMDBMovie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const details = await tmdbService.getMovieDetails(movieId);
        setMovie(details);

        // Fetch OMDB data if IMDB ID is available
        if (details.imdb_id) {
          console.log('Fetching OMDB data for IMDB ID:', details.imdb_id);
          const omdbMovie = await omdbService.getMovieByImdbId(details.imdb_id);
          console.log('OMDB data received:', omdbMovie);
          setOmdbData(omdbMovie);
        } else {
          console.log('No IMDB ID available for this movie');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content loading">
          <p>Laster...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const trailerUrl = tmdbService.getTrailerUrl(movie.videos);
  const imdbRating = omdbService.getImdbRating(omdbData);
  const rtScore = omdbService.getRottenTomatoesScore(omdbData);
  const metascore = omdbService.getMetascore(omdbData);
  const daysInTheaters = tmdbService.getDaysInTheaters(movie.release_date);
  const daysRemaining = tmdbService.getDaysRemaining(movie.release_date);

  console.log('Ratings:', { imdbRating, rtScore, metascore, tmdbRating: movie.vote_average });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        {movie.backdrop_path && (
          <div className="movie-backdrop">
            <img
              src={tmdbService.getBackdropUrl(movie.backdrop_path)}
              alt={movie.title}
            />
          </div>
        )}

        <div className="movie-details-content">
          <div className="movie-header">
            <h1>{movie.title}</h1>
            {movie.tagline && <p className="tagline">{movie.tagline}</p>}
          </div>

          <div className="movie-meta">
            <div className="meta-item">
              <strong>Utgivelse:</strong>{' '}
              {new Date(movie.release_date).toLocaleDateString('no-NO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            {movie.runtime && (
              <div className="meta-item">
                <strong>Varighet:</strong> {movie.runtime} minutter
              </div>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <div className="meta-item">
                <strong>Sjanger:</strong> {movie.genres.map((g) => g.name).join(', ')}
              </div>
            )}
          </div>

          {/* Theater duration info */}
          {daysInTheaters !== null && daysInTheaters > 0 && (
            <div className="theater-duration">
              <div className="duration-item">
                <span className="duration-label">Tid på kino:</span>
                <span className="duration-value">
                  {daysInTheaters} {daysInTheaters === 1 ? 'dag' : 'dager'}
                </span>
              </div>
              {daysRemaining !== null && daysRemaining > 0 && (
                <div className="duration-item">
                  <span className="duration-label">Estimert tid igjen:</span>
                  <span className="duration-value">
                    {daysRemaining} {daysRemaining === 1 ? 'dag' : 'dager'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Ratings - Minimalist Icons */}
          <div className="ratings-compact">
            {/* TMDB */}
            <div className="rating-badge tmdb-badge" title={`TMDB: ${movie.vote_average.toFixed(1)}/10 (${movie.vote_count} stemmer)`}>
              <span className="rating-icon">⭐</span>
              <span className="rating-text">
                <span className="rating-label">TMDB</span>
                <span className="rating-score">{movie.vote_average.toFixed(1)}</span>
              </span>
            </div>

            {/* IMDB */}
            {imdbRating && (
              <a
                href={movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="rating-badge imdb-badge"
                title={`IMDB: ${imdbRating}/10`}
              >
                <span className="rating-icon imdb-icon">IMDb</span>
                <span className="rating-text">
                  <span className="rating-score">{imdbRating}</span>
                </span>
              </a>
            )}

            {/* Rotten Tomatoes */}
            {rtScore && (
              <div className="rating-badge rt-badge" title={`Rotten Tomatoes: ${rtScore}`}>
                <span className="rating-icon">🍅</span>
                <span className="rating-text">
                  <span className="rating-score">{rtScore}</span>
                </span>
              </div>
            )}

            {/* Metascore */}
            {metascore && (
              <div className="rating-badge meta-badge" title={`Metascore: ${metascore}/100`}>
                <span className="rating-icon meta-icon">M</span>
                <span className="rating-text">
                  <span className="rating-score">{metascore}</span>
                </span>
              </div>
            )}
          </div>

          {/* Trailer */}
          {trailerUrl && (
            <div className="trailer-section">
              <h3>Trailer</h3>
              <a
                href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="trailer-button"
              >
                ▶️ Se trailer på YouTube
              </a>
            </div>
          )}

          {/* Overview */}
          <div className="overview">
            <h3>Beskrivelse</h3>
            <p>{movie.overview || 'Ingen beskrivelse tilgjengelig.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
