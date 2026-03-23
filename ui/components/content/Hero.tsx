import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { AssetParamValue } from '@uniformdev/assets';
import { getResponsiveBackgroundProps } from '@/utilities/imageTransform';

export type HeroProps = ComponentProps<{
  badge?: string;
  title?: string;
  subtitle?: string;
  backgroundImage?: AssetParamValue;
  className?: string;
}>;

/**
 * Premium Hero Component
 * 
 * Luxury hero section with elegant gradients and premium typography.
 * Features parallax effect, sophisticated overlays, and refined animations.
 */
export const Hero: React.FC<HeroProps> = ({ backgroundImage, className = '' }) => {
  const bgProps = getResponsiveBackgroundProps(backgroundImage?.[0], { aspectHeight: 1080 });

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
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
        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/60 via-slate-900/40 to-amber-900/50" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
        
        {/* Premium grain texture */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
        />
      </div>
      
      {/* Premium content */}
      <div className="relative z-10 text-center px-6 sm:px-8 max-w-6xl mx-auto">
        {/* Luxury badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-light tracking-widest uppercase">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
          <UniformText 
            parameterId="badge" 
            placeholder="Add badge text" 
            as="span"
          />
        </div>
        
        <UniformText 
          parameterId="title" 
          placeholder="Add hero title" 
          as="h1"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light mb-8 text-white leading-[1.1] tracking-tight drop-shadow-2xl"
          style={{ fontFamily: 'var(--font-serif, Georgia), serif', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        />
        
        <UniformText 
          parameterId="subtitle" 
          placeholder="Add hero subtitle" 
          as="p"
          className="text-xl sm:text-2xl md:text-3xl text-white/90 leading-relaxed max-w-4xl mx-auto font-light tracking-wide"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
        />
        
        {/* Premium CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group px-10 py-4 bg-white text-slate-900 rounded-full font-medium text-lg hover:bg-amber-50 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-amber-500/20">
            <span className="flex items-center gap-2">
              Explore Destinations
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
          <button className="px-10 py-4 bg-transparent text-white border-2 border-white/30 rounded-full font-medium text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
            View Luxury Collection
          </button>
        </div>
      </div>
      
      {/* Elegant scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <div className="w-7 h-12 border-2 border-white/40 rounded-full flex items-center justify-center p-2 backdrop-blur-sm mx-auto mb-2">
          <div className="w-1.5 h-3 bg-white/80 rounded-full" />
        </div>
        <p className="text-white/60 text-xs tracking-widest uppercase">Scroll</p>
      </div>
    </section>
  );
};

// Register component with Uniform
registerUniformComponent({
  type: 'hero',
  component: Hero,
});

export default Hero;
