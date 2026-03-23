import React, { useState } from 'react';
import { UniformText, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type NavigationProps = ComponentProps<{
  logoText?: string;
  className?: string;
}>;

/**
 * Premium Navigation Component
 * 
 * Luxury navigation bar with refined glassmorphism and elegant interactions.
 * 
 * Features:
 * - Elegant serif logo with compass icon and tagline
 * - Centered navigation links with proper spacing
 * - Dark slate CTA button with animated shine effect
 * - Fixed-width logo and CTA (48 units each) for perfect centering
 * - Sophisticated backdrop blur and scroll effects
 * - Responsive mobile menu with matching styling
 * 
 * Layout:
 * [Logo: 48 units] [Centered Nav Links: flex-1] [CTA: 48 units]
 */
export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Add scroll effect for premium feel
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-2xl shadow-xl py-3' 
        : 'bg-white/70 backdrop-blur-xl shadow-lg py-5'
    } ${className}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Premium Logo - Fixed width for proper centering */}
          <div className="w-48 flex-shrink-0">
            <a 
              href="/" 
              className="group inline-flex items-center gap-2.5"
            >
              {/* Elegant compass icon */}
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-amber-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <UniformText 
                parameterId="logoText" 
                placeholder="Voyager" 
                as="span"
                className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-amber-700 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}
              />
            </a>
          </div>

          {/* Desktop Navigation - Centered Premium styling */}
          <div className="hidden md:flex items-center justify-center space-x-1 lg:space-x-2 flex-1">
            <UniformSlot name="links" />
          </div>
          
          {/* Premium CTA Button - Fixed width to match logo */}
          <div className="w-48 flex-shrink-0 flex justify-end">
            <button className="group relative px-7 py-2.5 bg-slate-900 text-white rounded-full font-medium text-sm hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden">
              {/* Animated shine effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-2">
                Book Now
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>

          {/* Premium Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-all duration-300 group active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 text-slate-900 group-hover:text-amber-700 group-hover:rotate-90 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-slate-900 group-hover:text-amber-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Premium Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-6 pb-4 space-y-1 animate-fade-in-up border-t border-slate-100 pt-4">
            <UniformSlot name="links" />
            
            {/* Mobile CTA - Matches desktop styling */}
            <button className="w-full mt-4 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Book Your Journey
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// UNIFORM REGISTRATION
registerUniformComponent({
  type: 'navigation',
  component: Navigation,
});

export default Navigation;
