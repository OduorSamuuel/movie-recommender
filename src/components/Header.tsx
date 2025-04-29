"use client";
import React from 'react';
import { Search, User } from 'lucide-react';

interface HeaderProps {
  username?: string;
}

export const Header: React.FC<HeaderProps> = ({ username = 'John' }) => {
  return (
    <header className="w-full bg-gray-900 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-12">
        <div className="text-3xl font-bold text-white">
          <a href="/" className="flex items-center">
            <span className="font-bold text-white">M-Movies</span>
          </a>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-white hover:text-gray-300">Home</a>
          <a href="/movies" className="text-gray-400 hover:text-white">Movies</a>
          <a href="/series" className="text-gray-400 hover:text-white">Series</a>
          <a href="/podcasts" className="text-gray-400 hover:text-white">Podcasts</a>
          <a href="/watchlist" className="text-gray-400 hover:text-white">Watchlist</a>
          <div className="relative group">
            <button className="text-gray-400 hover:text-white flex items-center">
              More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 pr-10" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <User className="h-6 w-6 text-gray-800" />
          </div>
          <span className="text-white">{username}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
};