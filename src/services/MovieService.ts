import axios from 'axios';
import { API_BASE_URL, API_KEY, Movie, Video } from '@/utils/MovieUtils';

// API service with axios
const tmdbApi = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Data fetching functions
export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  const response = await tmdbApi.get('/trending/movie/day');
  return response.data.results;
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const response = await tmdbApi.get('/movie/popular');
  return response.data.results;
};

export const fetchTopRatedSeries = async () => {
  const response = await tmdbApi.get('/tv/top_rated');
  return response.data.results;
};

export const fetchMovieDetails = async (movieId: number | null): Promise<Movie | null> => {
  if (!movieId) return null;
  const response = await tmdbApi.get(`/movie/${movieId}`);
  return response.data;
};

export const fetchMovieVideos = async (movieId: number | null): Promise<Video[] | null> => {
  if (!movieId) return null;
  const response = await tmdbApi.get(`/movie/${movieId}/videos`);
  return response.data.results;
};

export const fetchTvVideos = async (tvId: number | null): Promise<Video[] | null> => {
  if (!tvId) return null;
  const response = await tmdbApi.get(`/tv/${tvId}/videos`);
  return response.data.results;
};