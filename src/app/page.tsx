"use client";
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Featured } from '@/components/Featured';
import { ContentCarousel } from '@/components/ContentCarousel';
import { RecommendedMovies } from '@/components/RecommendedMovies';
import { 
  getGenreName, 
  getImageUrl, 
  Movie
} from '@/utils/MovieUtils';
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchTopRatedSeries,
  fetchMovieDetails,
  fetchMovieVideos,
  fetchTvVideos
} from '@/services/MovieService';
import { TrailerModal } from '@/components/TrailerModal';
import { Header } from '@/components/Header';
import { getWatchedMovies } from '@/services/WatchedMovieService';

function Home() {
  // State for selected featured movie ID
  const [featuredMovieId, setFeaturedMovieId] = useState<number | null>(null);
  // State for trailer modal
  const [trailerOpen, setTrailerOpen] = useState<boolean>(false);
  const [selectedTrailerKey, setSelectedTrailerKey] = useState<string>('');
  const [trailerType, setTrailerType] = useState<'movie' | 'tv'>('movie');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  // Track when watch history changes
  const [watchHistoryUpdated, setWatchHistoryUpdated] = useState<number>(Date.now());

  // Set up an event listener for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setWatchHistoryUpdated(Date.now());
    };

    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Fetch trending movies for hero section
  const { data: trendingMovies, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: fetchTrendingMovies,
  });

  // Fetch popular movies for "Recent Releases" section
  const { data: popularMovies, isLoading: isPopularLoading } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: fetchPopularMovies,
  });

  // Fetch top-rated TV series for "Featured Series" section
  const { data: topRatedSeries, isLoading: isSeriesLoading } = useQuery({
    queryKey: ['topRatedSeries'],
    queryFn: fetchTopRatedSeries,
  });

  // Once we have trending movies, use the first one as featured movie
  React.useEffect(() => {
    if (trendingMovies && trendingMovies.length > 0) {
      // Check watch history to possibly feature a recently watched movie
      const watched = getWatchedMovies();
      if (watched.length > 0) {
        // Get the most recently watched movie
        const mostRecent = [...watched].sort((a, b) => b.watchedAt - a.watchedAt)[0];
        if (mostRecent.type === 'movie') {
          setFeaturedMovieId(mostRecent.id);
        } else {
          setFeaturedMovieId(trendingMovies[0].id);
        }
      } else {
        setFeaturedMovieId(trendingMovies[0].id);
      }
    }
  }, [trendingMovies, watchHistoryUpdated]);

  // Fetch detailed information for the featured movie
  const { data: featuredMovie, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['movie', featuredMovieId],
    queryFn: () => fetchMovieDetails(featuredMovieId),
    enabled: !!featuredMovieId,
  });

  // Fetch videos for the selected item (movie or TV)
  const { data: videos, isLoading: isVideosLoading } = useQuery({
    queryKey: ['videos', trailerType, selectedItemId],
    queryFn: () => 
      trailerType === 'movie' 
        ? fetchMovieVideos(selectedItemId)
        : fetchTvVideos(selectedItemId),
    enabled: !!selectedItemId,
  });

  // Handle opening the trailer modal
  const openTrailer = async (id: number, type: 'movie' | 'tv' = 'movie') => {
    setSelectedItemId(id);
    setTrailerType(type);
    setTrailerOpen(true);
    
    // Trigger UI update for watched status after watching
    setTimeout(() => {
      setWatchHistoryUpdated(Date.now());
    }, 500);
  };

  // Watch for videos data and set the trailer key
  React.useEffect(() => {
    if (videos && videos.length > 0) {
      // Find the first trailer or teaser
      const trailer = videos.find(
        video => 
          video.site === 'YouTube' && 
          (video.type === 'Trailer' || video.type === 'Teaser')
      );
      
      if (trailer) {
        setSelectedTrailerKey(trailer.key);
      } else if (videos.length > 0 && videos[0].site === 'YouTube') {
        // If no trailer/teaser found, use the first YouTube video
        setSelectedTrailerKey(videos[0].key);
      }
    }
  }, [videos]);

  // Close trailer modal
  const closeTrailer = () => {
    setTrailerOpen(false);
    setSelectedTrailerKey('');
  };

  // Loading state
  const isLoading = isTrendingLoading || isPopularLoading || isSeriesLoading || isFeaturedLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Component */}
      <Header username="John" />

      {/* Hero Section - Featured Movie Component */}
      {featuredMovie && (
        <Featured 
          featuredMovie={featuredMovie} 
          openTrailer={openTrailer} 
          getImageUrl={getImageUrl} 
        />
      )}
      
      {/* Recommended Movies Section - based on watch history */}
      <RecommendedMovies onTrailerClick={openTrailer} />

      {/* Recent Releases Section - ContentCarousel Component */}
      {popularMovies && (
        <ContentCarousel
          id="recentReleases"
          title="Recent Releases"
          items={popularMovies}
          type="movie"
          onTrailerClick={openTrailer}
          getImageUrl={getImageUrl}
          getGenreName={getGenreName}
        />
      )}

      {/* Featured Series Section - ContentCarousel Component */}
      {topRatedSeries && (
        <ContentCarousel
          id="featuredSeries"
          title="Featured Series"
          items={topRatedSeries}
          type="tv"
          onTrailerClick={openTrailer}
          getImageUrl={getImageUrl}
          getGenreName={getGenreName}
        />
      )}

      {/* Trailer Modal Component */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={closeTrailer}
        trailerKey={selectedTrailerKey}
        isLoading={isVideosLoading}
      />
    </div>
  );
}

export default Home;