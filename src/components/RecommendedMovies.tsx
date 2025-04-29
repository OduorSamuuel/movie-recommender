"use client";
import React, { useState, useEffect } from 'react';
import { getRecommendations, getWatchedMovies } from '@/services/WatchedMovieService';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/components/MovieCard';
import { getGenreName, getImageUrl } from '@/utils/MovieUtils';
import { fetchMovieDetails } from '@/services/MovieService';

interface RecommendedMoviesProps {
  onTrailerClick: (id: number, type: 'movie' | 'tv') => void;
}

export const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ 
  onTrailerClick 
}) => {
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
  const [baseMovieTitle, setBaseMovieTitle] = useState<string>('');
  const [hasWatchedMovies, setHasWatchedMovies] = useState<boolean>(false);

  useEffect(() => {
    const watched = getWatchedMovies();
    setHasWatchedMovies(watched.length > 0);
  }, []);

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: getRecommendations,
    enabled: hasWatchedMovies,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const fetchRecommendedMovieDetails = async () => {
      // Add proper null checks
      if (!recommendations || !('results' in recommendations) || !Array.isArray(recommendations.results)) {
        return;
      }
      
      // Set a default base title or get it from somewhere else
      setBaseMovieTitle("Your watched movies");
      
      // Use recommendations.results instead of recommendations.recommendations
      const movieDetailsPromises = recommendations.results.map(
        async (movie) => {
          try {
            // Since we already have movie details in the results, we might not need to fetch again
            // But if you need more details, use the movie.id instead of searching by title
            if (movie.id) {
              return await fetchMovieDetails(movie.id);
            }
            return null;
          } catch (err) {
            console.error(`Error fetching details for ${movie.title}:`, err);
            return null;
          }
        }
      );
      
      const moviesWithDetails = await Promise.all(movieDetailsPromises);
      setRecommendedMovies(moviesWithDetails.filter(Boolean));
    };

    fetchRecommendedMovieDetails();
  }, [recommendations]);

  if (!hasWatchedMovies) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mt-12 px-8">
        <h2 className="text-2xl font-bold mb-4">Loading recommendations...</h2>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!recommendations || recommendedMovies.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 px-8">
      <h2 className="text-2xl font-bold mb-4">
        Because you watched: {baseMovieTitle}
      </h2>
      
      <div 
        id="recommendedMovies"
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
      >
        {recommendedMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            item={movie}
            type="movie"
            onTrailerClick={onTrailerClick}
            getImageUrl={getImageUrl}
            getGenreName={getGenreName}
          />
        ))}
      </div>
    </div>
  );
};