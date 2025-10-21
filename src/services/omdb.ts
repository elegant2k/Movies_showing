export interface OMDBMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'demo'; // OMDb has a free tier
const OMDB_BASE_URL = 'https://www.omdbapi.com';

export const omdbService = {
  // Get movie details by IMDB ID
  getMovieByImdbId: async (imdbId: string): Promise<OMDBMovie | null> => {
    try {
      const response = await fetch(
        `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=short`
      );

      if (!response.ok) {
        console.error('Failed to fetch from OMDB');
        return null;
      }

      const data = await response.json();

      if (data.Response === 'False') {
        console.error('OMDB Error:', data.Error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching OMDB data:', error);
      return null;
    }
  },

  // Extract Rotten Tomatoes score from ratings
  getRottenTomatoesScore: (omdbMovie: OMDBMovie | null): string | null => {
    if (!omdbMovie || !omdbMovie.Ratings) return null;

    const rtRating = omdbMovie.Ratings.find(
      (rating) => rating.Source === 'Rotten Tomatoes'
    );

    return rtRating ? rtRating.Value : null;
  },

  // Get IMDB rating
  getImdbRating: (omdbMovie: OMDBMovie | null): string | null => {
    if (!omdbMovie || !omdbMovie.imdbRating) return null;
    return omdbMovie.imdbRating !== 'N/A' ? omdbMovie.imdbRating : null;
  },

  // Get Metascore
  getMetascore: (omdbMovie: OMDBMovie | null): string | null => {
    if (!omdbMovie || !omdbMovie.Metascore) return null;
    return omdbMovie.Metascore !== 'N/A' ? omdbMovie.Metascore : null;
  }
};
