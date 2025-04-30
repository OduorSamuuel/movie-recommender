"use client";
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from '@/components/MovieCard';

interface ContentCarouselProps {
  id: string;
  title: string;
  items: any[];
  type: 'movie' | 'tv';
  onTrailerClick: (id: number, type: 'movie' | 'tv') => void;
  getImageUrl: (path: string | null, size?: string) => string;
  getGenreName: (genreId: number) => string;
}

export const ContentCarousel: React.FC<ContentCarouselProps> = ({
  id,
  title,
  items,
  type,
  onTrailerClick,
  getImageUrl,
  getGenreName
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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
  }, [items]);

  return (
    <div className="mt-12 px-8 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
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
          id={id}
          className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ 
            scrollbarWidth: 'none',  /* Firefox */
            msOverflowStyle: 'none',  /* IE and Edge */
          }}
        >
          {/* Hide scrollbar for Chrome, Safari and Opera */}
          <style jsx>{`
            #${id}::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {items.map((item) => (
            <div key={item.id} className="snap-start flex-shrink-0">
              <MovieCard
                item={item}
                type={type}
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