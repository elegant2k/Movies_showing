import type { Movie } from '../types/movie';
import { tmdbService } from '../services/tmdb';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const daysInTheaters = tmdbService.getDaysInTheaters(movie.release_date);
  const daysRemaining = tmdbService.getDaysRemaining(movie.release_date);

  return (
    <div
      className="movie-card"
      onClick={() => onClick(movie)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') onClick(movie);
      }}
    >
      <div className="movie-poster">
        <img
          src={tmdbService.getPosterUrl(movie.poster_path)}
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-rating">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-release">
          {new Date(movie.release_date).toLocaleDateString('no-NO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {daysInTheaters !== null && daysInTheaters > 0 && (
          <div className="movie-theater-info">
            <p className="days-showing">
              🎬 Vist i {daysInTheaters} {daysInTheaters === 1 ? 'dag' : 'dager'}
            </p>
            {daysRemaining !== null && daysRemaining > 0 && (
              <p className="days-remaining">
                ⏳ Ca. {daysRemaining} {daysRemaining === 1 ? 'dag' : 'dager'} igjen
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
