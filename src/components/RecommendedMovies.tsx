"use client";
import React, { useState, useEffect, useRef } from 'react';
import { getRecommendations, getWatchedMovies } from '@/services/WatchedMovieService';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/components/MovieCard';
import { getGenreName, getImageUrl } from '@/utils/MovieUtils';
import { fetchMovieDetails } from '@/services/MovieService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RecommendedMoviesProps {
  onTrailerClick: (id: number, type: 'movie' | 'tv') => void;
}

export const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ 
  onTrailerClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
  const [baseMovieTitle, setBaseMovieTitle] = useState<string>('');
  const [hasWatchedMovies, setHasWatchedMovies] = useState<boolean>(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const watched = getWatchedMovies();
    setHasWatchedMovies(watched.length > 0);
  }, []);
  
  const checkScrollPosition = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth * 0.75,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth * 0.75,
        behavior: 'smooth'
      });
    }
  };

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
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [recommendedMovies]);

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
    <div className="mt-12 px-8 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">You might also like</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className={`bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-opacity ${
              !showLeftArrow ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!showLeftArrow}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={scrollRight}
            className={`bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-opacity ${
              !showRightArrow ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!showRightArrow}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        {/* Gradient fade effects */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
        
        <div 
          ref={containerRef}
          id="recommendedMovies"
          className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ 
            scrollbarWidth: 'none',  /* Firefox */
            msOverflowStyle: 'none',  /* IE and Edge */
          }}
        >
          {/* Hide scrollbar for Chrome, Safari and Opera */}
          <style jsx>{`
            #recommendedMovies::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {recommendedMovies.map((movie) => (
            <div key={movie.id} className="snap-start flex-shrink-0">
              <MovieCard
                item={movie}
                type="movie"
                onTrailerClick={onTrailerClick}
                getImageUrl={getImageUrl}
                getGenreName={getGenreName}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};