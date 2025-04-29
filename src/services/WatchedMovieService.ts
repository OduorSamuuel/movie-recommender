import axios from 'axios';
import { Movie } from '@/utils/MovieUtils';

const WATCHED_MOVIES_KEY = 'watched_movies';
const RECOMMENDATION_API_URL = 'http://localhost:8000/api/recommend'; 

// Type for watched movie entries
export interface WatchedMovie {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  watchedAt: number; // timestamp
  posterPath?: string | null;
}

// Type for recommendation results
export interface MovieRecommendation {
  title: string;
  score: number;
}

export interface RecommendationResponse {
  movie: string;
  recommendations: MovieRecommendation[];
}

export interface ApiError {
  message: string;
  suggestedMovies?: string[];
}

/**
 * Add a movie/show to watched history
 */
export const addToWatched = (item: Movie | any, type: 'movie' | 'tv'): void => {
  try {
    // Get current watched list
    const watched = getWatchedMovies();
    
    // Create new entry
    const newEntry: WatchedMovie = {
      id: item.id,
      title: type === 'movie' ? item.title : item.name,
      type,
      watchedAt: Date.now(),
      posterPath: item.poster_path
    };
    
    // Check if already exists
    const existingIndex = watched.findIndex(movie => 
      movie.id === item.id && movie.type === type
    );
    
    // If exists, update timestamp, otherwise add new
    if (existingIndex >= 0) {
      watched[existingIndex].watchedAt = Date.now();
    } else {
      watched.push(newEntry);
    }
    
    // Store in localStorage (keep last 20 items)
    localStorage.setItem(
      WATCHED_MOVIES_KEY, 
      JSON.stringify(watched.slice(-20))
    );
  } catch (error) {
    console.error('Error adding to watched history:', error);
  }
};

/**
 * Get all watched movies from localStorage
 */
export const getWatchedMovies = (): WatchedMovie[] => {
  try {
    const data = localStorage.getItem(WATCHED_MOVIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting watched movies:', error);
    return [];
  }
};

/**
 * Check if a movie is in the watched list
 */
export const isWatched = (id: number, type: 'movie' | 'tv'): boolean => {
  const watched = getWatchedMovies();
  return watched.some(movie => movie.id === id && movie.type === type);
};

/**
 * Get movie recommendations based on most recently watched movie
 */
export const getRecommendations = async (): Promise<RecommendationResponse | ApiError | null> => {
  try {
    const watched = getWatchedMovies();
    
    // No watched movies to base recommendations on
    if (watched.length === 0) {
      return null;
    }
    
    // Sort by most recently watched
    const sortedWatched = [...watched].sort((a, b) => b.watchedAt - a.watchedAt);
    const mostRecent = sortedWatched[0];
    
    // Only handle movie recommendations for now (since our API is for movies)
    if (mostRecent.type !== 'movie') {
      return { message: 'TV show recommendations are not supported yet' };
    }
    
    // Call the recommendation API
    const response = await axios.get(RECOMMENDATION_API_URL, {
      params: {
        title: mostRecent.title,
        count: 10
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error getting recommendations:', error);
    
    // Check if it's an API error with details
    if (error.response && error.response.status === 404) {
      // Handle the movie not found error
      const errorDetail = error.response.data.detail;
      
      // Extract suggested movies if available
      const suggestedMoviesMatch = errorDetail.match(/Did you mean one of these: (.*?)\?/);
      let suggestedMovies: string[] | undefined;
      
      if (suggestedMoviesMatch && suggestedMoviesMatch[1]) {
        suggestedMovies = suggestedMoviesMatch[1].split(', ');
      }
      
      return {
        message: 'Movie not found in recommendation database',
        suggestedMovies
      };
    }
    
    // Return a generic error message
    return { 
      message: 'Failed to get recommendations. Please try again later.' 
    };
  }
};

/**
 * Get recommendations for a specific movie title
 */
export const getRecommendationsForTitle = async (title: string): Promise<RecommendationResponse | ApiError> => {
  try {
    const response = await axios.get(RECOMMENDATION_API_URL, {
      params: {
        title,
        count: 10
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error(`Error getting recommendations for "${title}":`, error);
    
    // Check if it's an API error with details
    if (error.response && error.response.status === 404) {
      // Handle the movie not found error
      const errorDetail = error.response.data.detail;
      
      // Extract suggested movies if available
      const suggestedMoviesMatch = errorDetail.match(/Did you mean one of these: (.*?)\?/);
      let suggestedMovies: string[] | undefined;
      
      if (suggestedMoviesMatch && suggestedMoviesMatch[1]) {
        suggestedMovies = suggestedMoviesMatch[1].split(', ');
      }
      
      return {
        message: `Movie "${title}" not found in recommendation database`,
        suggestedMovies
      };
    }
    
    // Return a generic error message
    return { 
      message: 'Failed to get recommendations. Please try again later.' 
    };
  }
};

/**
 * Clear all watched history
 */
export const clearWatchedHistory = (): void => {
  localStorage.removeItem(WATCHED_MOVIES_KEY);
};