import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="text-2xl sm:text-4xl font-bold text-gray-900">FlappyBird</div> {/* Adjusted font size */}

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/game" className="text-gray-700 hover:text-gray-900 text-xl sm:text-2xl">Game</Link> {/* Adjusted font size */}
            <Link to="/leaderboard" className="text-gray-700 hover:text-gray-900 text-xl sm:text-2xl">Leaderboard</Link> {/* Adjusted font size */}
            <Link to="/about" className="text-gray-700 hover:text-gray-900 text-xl sm:text-2xl">About</Link> {/* Adjusted font size */}
        
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 text-gray-700"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 bg-white rounded-lg shadow-lg mt-2 bg-opacity-70 ">
            <div className="flex flex-col space-y-4 pl-4 ml-2">
              <Link to="/game" className="text-gray-700 hover:text-gray-900 text-xl">Game</Link> {/* Adjusted font size */}
              <Link to="/leaderboard" className="text-gray-700 hover:text-gray-900 text-xl">Leaderboard</Link> {/* Adjusted font size */}
              <Link to="/about" className="text-gray-700 hover:text-gray-900 text-xl">About</Link> {/* Adjusted font size */}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
