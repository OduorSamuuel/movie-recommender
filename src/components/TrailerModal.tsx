"use client";
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
// Import videojs statically
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
// Import custom CSS for VideoJS theme
import '@/app/videojs-custom.css'; 

// VideoJS Player Type
import Player from 'video.js/dist/types/player';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerKey: string;
  isLoading: boolean;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  trailerKey,
  isLoading
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || !videoRef.current || !trailerKey) return;

    // Create YouTube URL with parameters directly in URL
    // This ensures parameters are passed correctly
    const youtubeUrl = `https://www.youtube.com/watch?v=${trailerKey}&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&enablejsapi=1`;

    // Dynamically import the YouTube plugin
    import('videojs-youtube').then(() => {
      // Create the Video.js player
      const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        techOrder: ['youtube'],
        youtube: {
          // These parameters are still included in the options
          // for the videojs-youtube plugin, but having them
          // directly in the URL above helps ensure they're applied
          ytControls: 0,
          rel: 0,
          showinfo: 0, 
          iv_load_policy: 3,
          modestbranding: 1,
          origin: window.location.origin,
          playerVars: {
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            cc_load_policy: 0,
            playsinline: 1,
            enablejsapi: 1
          }
        },
        sources: [{
          src: youtubeUrl,
          type: 'video/youtube'
        }]
      };

      // Initialize player
      if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, videoJsOptions, function onPlayerReady() {
        const player = this;
        player.addClass('vjs-theme-custom');
        
        // Try to hide YouTube info after the player loads
        const iframeEl = player.el().querySelector('iframe');
        if (iframeEl) {
          // Make sure parameters are in the iframe src as well
          const iframeSrc = iframeEl.getAttribute('src');
          if (iframeSrc && !iframeSrc.includes('modestbranding=1')) {
            iframeEl.setAttribute('src', 
              iframeSrc + (iframeSrc.includes('?') ? '&' : '?') + 
              'modestbranding=1&controls=0&showinfo=0&rel=0'
            );
          }

          // Add overlay to hide any remaining controls
          const overlayEl = document.createElement('div');
          overlayEl.className = 'youtube-control-overlay';
          iframeEl.parentNode?.insertBefore(overlayEl, iframeEl.nextSibling);
        }
      });
    }
    });


    // Clean up function
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [trailerKey]);

  // Close player when modal closes
  useEffect(() => {
    if (!isOpen && playerRef.current) {
      playerRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-4xl max-h-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white z-10"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Video.js Player */}
        {trailerKey ? (
          <div className="relative aspect-video w-full">
            <div 
              ref={playerContainerRef}
              data-vjs-player 
              className="player-container"
            >
              <video
                ref={videoRef}
                className="video-js vjs-big-play-centered"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-800 text-white">
            {isLoading ? 'Loading trailer...' : 'No trailer available'}
          </div>
        )}
      </div>
    </div>
  );
};