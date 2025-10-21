import { Movie, MovieDetails, TMDBResponse } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbService = {
  // Get now playing movies (currently in theaters)
  getNowPlaying: async (region: string = 'NO', page: number = 1): Promise<TMDBResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=no-NO&region=${region}&page=${page}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch now playing movies');
    }
    return response.json();
  },

  // Get upcoming movies
  getUpcoming: async (region: string = 'NO', page: number = 1): Promise<TMDBResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=no-NO&region=${region}&page=${page}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming movies');
    }
    return response.json();
  },

  // Get movie details including videos (trailers)
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=no-NO&append_to_response=videos,external_ids`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    return response.json();
  },

  // Get movie external IDs (IMDB, etc.)
  getExternalIds: async (movieId: number): Promise<any> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/external_ids?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch external IDs');
    }
    return response.json();
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<TMDBResponse> => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=no-NO&query=${encodeURIComponent(query)}&page=${page}`
    );
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    return response.json();
  },

  // Helper functions for images
  getPosterUrl: (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder-poster.png';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getBackdropUrl: (path: string | null, size: string = 'w1280'): string => {
    if (!path) return '/placeholder-backdrop.png';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  // Get YouTube trailer URL
  getTrailerUrl: (videos?: { results: any[] }): string | null => {
    if (!videos || !videos.results || videos.results.length === 0) {
      return null;
    }

    // Find official trailer
    const trailer = videos.results.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube' && v.official
    ) || videos.results.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    );

    if (trailer) {
      return `https://www.youtube.com/watch?v=${trailer.key}`;
    }

    return null;
  },

  // Calculate days in theaters (estimate based on release date)
  getDaysInTheaters: (releaseDate: string): number | null => {
    if (!releaseDate) return null;
    const release = new Date(releaseDate);
    const today = new Date();
    const diffTime = today.getTime() - release.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  },

  // Estimate days remaining (typical theatrical run is 4-8 weeks)
  getDaysRemaining: (releaseDate: string): number | null => {
    const daysInTheaters = tmdbService.getDaysInTheaters(releaseDate);
    if (daysInTheaters === null) return null;

    // Assume average theatrical run of 6 weeks (42 days)
    const averageRun = 42;
    const remaining = averageRun - daysInTheaters;
    return remaining > 0 ? remaining : 0;
  }
};
