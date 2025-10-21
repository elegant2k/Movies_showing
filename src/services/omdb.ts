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
      console.log(`🎬 Fetching OMDB data for IMDB ID: ${imdbId}`);
      console.log(`📡 OMDB API Key configured: ${OMDB_API_KEY ? `Yes (${OMDB_API_KEY.substring(0, 4)}...)` : 'No - using "demo"'}`);

      const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=short`;
      console.log(`🌐 OMDB Request URL: ${url.replace(OMDB_API_KEY, '***')}`);

      const response = await fetch(url);

      if (!response.ok) {
        console.error('❌ OMDB HTTP Error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      console.log('📦 OMDB Response:', data);

      if (data.Response === 'False') {
        console.error('❌ OMDB API Error:', data.Error);
        if (data.Error === 'Invalid API key!') {
          console.error('🔑 Please get a valid API key from: http://www.omdbapi.com/apikey.aspx');
        }
        return null;
      }

      console.log('✅ OMDB Data received successfully');
      console.log('📊 Available ratings:', data.Ratings);
      console.log('⭐ IMDB Rating:', data.imdbRating);
      console.log('🎭 Metascore:', data.Metascore);

      return data;
    } catch (error) {
      console.error('❌ Error fetching OMDB data:', error);
      return null;
    }
  },

  // Extract Rotten Tomatoes score from ratings
  getRottenTomatoesScore: (omdbMovie: OMDBMovie | null): string | null => {
    if (!omdbMovie) {
      console.log('🍅 No OMDB data available for Rotten Tomatoes');
      return null;
    }

    if (!omdbMovie.Ratings || omdbMovie.Ratings.length === 0) {
      console.log('🍅 No ratings array in OMDB data');
      return null;
    }

    console.log('🍅 Searching for Rotten Tomatoes in:', omdbMovie.Ratings);

    const rtRating = omdbMovie.Ratings.find(
      (rating) => rating.Source === 'Rotten Tomatoes'
    );

    if (rtRating) {
      console.log('✅ Found Rotten Tomatoes score:', rtRating.Value);
    } else {
      console.log('❌ Rotten Tomatoes score not available for this movie');
    }

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
