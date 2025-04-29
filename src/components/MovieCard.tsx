"use client";
import React, { useState, useEffect } from 'react';
import { Play, CheckCircle } from 'lucide-react';
import { Movie } from '@/utils/MovieUtils';
import { isWatched, addToWatched } from '@/services/WatchedMovieService';

interface MovieCardProps {
  item: Movie | any; // Using any for TV series compatibility
  type: 'movie' | 'tv';
  onTrailerClick: (id: number, type: 'movie' | 'tv') => void;
  getImageUrl: (path: string | null, size?: string) => string;
  getGenreName: (genreId: number) => string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  item,
  type,
  onTrailerClick,
  getImageUrl,
  getGenreName
}) => {
  const [watched, setWatched] = useState<boolean>(false);
  const title = type === 'movie' ? item.title : item.name;
  
  // Check if this movie/show has been watched
  useEffect(() => {
    setWatched(isWatched(item.id, type));
  }, [item.id, type]);
  
  // Handle trailer click and mark as watched
  const handleTrailerClick = () => {
    // Add to watched history
    addToWatched(item, type);
    setWatched(true);
    
    // Open trailer
    onTrailerClick(item.id, type);
  };
  
  return (
    <div className="flex-none w-64">
      <div 
        className="relative rounded-lg overflow-hidden group cursor-pointer"
        onClick={handleTrailerClick}
      >
        <div className="aspect-w-16 aspect-h-9 w-full h-36">
          <img 
            src={getImageUrl(item.backdrop_path, 'w500')} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Watched indicator */}
          {watched && (
            <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div>
            <h3 className="text-white font-bold">{title}</h3>
            <p className="text-gray-300 text-sm">{item.overview?.substring(0, 60) || ''}...</p>
            <button className="mt-2 bg-red-600/80 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md flex items-center text-xs">
              <Play className="mr-1 h-3 w-3" />
              {watched ? 'Watch Again' : 'Watch Trailer'}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-gray-400 uppercase">
          {item.genre_ids?.map((id: number) => getGenreName(id)).join(', ')}
        </p>
      </div>
    </div>
  );
};