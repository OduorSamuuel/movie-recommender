"use client";
import React from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

// Define TypeScript interfaces
interface FeaturedProps {
    featuredMovie: Movie;
    openTrailer: (id: number, type?: 'movie' | 'tv') => void;
    getImageUrl: (path: string, size?: string) => string;
  }

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path?: string;
  overview: string;
  release_date: string;
  adult?: boolean;
  runtime?: number;
  genres?: {
    id: number;
    name: string;
  }[];
}

// Format movie duration from minutes to hours and minutes
const formatRuntime = (minutes?: number): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} hr ${mins} min`;
};

export const Featured: React.FC<FeaturedProps> = ({ 
  featuredMovie, 
  openTrailer, 
  getImageUrl 
}) => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
      
      {/* Background image - FIXED to cover the entire width */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${getImageUrl(featuredMovie.backdrop_path)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          width: '100%',
          height: '100%'
        }}
      ></div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-end pb-16">
        <div className="max-w-2xl">
          <span className="inline-block bg-gray-800 text-white px-2 py-1 text-xs rounded mb-4">
            {featuredMovie.adult ? 'R' : 'PG-13'}
          </span>
          <h1 className="text-6xl font-bold mb-4 text-white">{featuredMovie.title}</h1>
          <div className="flex items-center space-x-4 mb-4 text-sm text-white">
            <span>{new Date(featuredMovie.release_date).getFullYear()}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <span>{formatRuntime(featuredMovie.runtime)}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <span>{featuredMovie.genres?.map(genre => genre.name).join(', ') || ''}</span>
          </div>
          <p className="text-lg mb-8 text-gray-200">{featuredMovie.overview}</p>
          <button
            onClick={() => openTrailer(featuredMovie.id, 'movie')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md flex items-center"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Trailer
          </button>
        </div>
      </div>
      
      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        <button className="w-2 h-2 rounded-full bg-white"></button>
        <button className="w-2 h-2 rounded-full bg-gray-500"></button>
        <button className="w-2 h-2 rounded-full bg-gray-500"></button>
      </div>
      
      {/* Navigation arrows */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
        <button className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70">
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
        <button className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70">
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>
    </section>
  );
};