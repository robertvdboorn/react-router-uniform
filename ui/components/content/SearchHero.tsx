import React, { useState } from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { AssetParamValue } from '@uniformdev/assets';
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { getResponsiveBackgroundProps } from '@/utilities/imageTransform';

export type SearchHeroProps = ComponentProps<{
  title?: string;
  subtitle?: string;
  backgroundImage?: AssetParamValue;
  className?: string;
}>;

/**
 * Premium SearchHero Component
 * 
 * Luxury hero section with integrated search functionality.
 * Perfect for travel booking and destination search.
 */
export const SearchHero: React.FC<SearchHeroProps> = ({ backgroundImage, className = '' }) => {
  const bgProps = getResponsiveBackgroundProps(backgroundImage?.[0], { aspectHeight: 1080 });

  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className={`relative min-h-[80vh] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Premium background */}
      <div className="absolute inset-0">
        {bgProps ? (
          <img
            src={bgProps.src}
            srcSet={bgProps.srcSet}
            sizes="100vw"
            alt=""
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="sync"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-amber-900" />
        )}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/70 via-slate-900/50 to-amber-900/60" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 max-w-6xl mx-auto w-full">
        <UniformText 
          parameterId="title" 
          placeholder="Add hero title" 
          as="h1"
          className="text-5xl sm:text-6xl md:text-7xl font-light mb-6 text-white leading-[1.1] tracking-tight drop-shadow-2xl"
          style={{ fontFamily: 'var(--font-serif, Georgia), serif', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        />
        
        <UniformText 
          parameterId="subtitle" 
          placeholder="Add hero subtitle" 
          as="p"
          className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-12 font-light"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
        />
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-3xl p-4 shadow-2xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="relative">
              <label htmlFor="destination" className="block text-left text-sm font-medium text-slate-700 mb-2">
                Destination
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to?"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="relative">
              <label htmlFor="dates" className="block text-left text-sm font-medium text-slate-700 mb-2">
                Dates
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="dates"
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="Select dates"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="relative">
              <label htmlFor="guests" className="block text-left text-sm font-medium text-slate-700 mb-2">
                Guests
              </label>
              <div className="relative">
                <UsersIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition-colors appearance-none bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Popular Destinations */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-white/80 text-sm">
          <span className="font-light">Popular:</span>
          {['Paris', 'Tokyo', 'Bali', 'Maldives', 'New York'].map((dest) => (
            <button
              key={dest}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              {dest}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

registerUniformComponent({
  type: 'searchHero',
  component: SearchHero,
});

export default SearchHero;
