// API configuration
export const API_KEY = '84ab4390fce28aa5b0ca970656c7998c';
export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// Types
export interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path?: string;
  overview: string;
  release_date: string;
  genre_ids?: number[];
  adult?: boolean;
  runtime?: number;
  genres?: {
    id: number;
    name: string;
  }[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Genre {
  id: number;
  name: string;
}

// Genres mapping
export const genres: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Helper to build image URL
export const getImageUrl = (path: string | null, size = 'original'): string => {
  if (!path) return '/api/placeholder/1920/1080';
  return `${IMAGE_BASE_URL}${size}${path}`;
};

// Format movie duration from minutes to hours and minutes
export const formatRuntime = (minutes?: number): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} hr ${mins} min`;
};

// Get genre name from genre ID
export const getGenreName = (genreId: number): string => {
  return genres[genreId] || 'Unknown';
};