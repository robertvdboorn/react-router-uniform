import React from 'react';
import { UniformText, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { AssetParamValue } from '@uniformdev/assets';
import { getResponsiveBackgroundProps } from '@/utilities/imageTransform';

export type StatsSectionProps = ComponentProps<{
  title?: string;
  subtitle?: string;
  backgroundImage?: AssetParamValue;
  className?: string;
}>;

/**
 * Premium StatsSection Component
 * 
 * Luxury statistics section with sophisticated styling and elegant animations.
 * Features refined gradients, premium typography, and polished design.
 */
export const StatsSection: React.FC<StatsSectionProps> = ({ backgroundImage, className = '' }) => {
  const bgProps = getResponsiveBackgroundProps(backgroundImage?.[0], { aspectHeight: 600 });

  return (
    <section className={`py-24 md:py-36 px-6 relative overflow-hidden ${className}`}>
      {/* Premium background */}
      <div className="absolute inset-0">
        {bgProps ? (
          <img
            src={bgProps.src}
            srcSet={bgProps.srcSet}
            sizes="100vw"
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-amber-900" />
        )}
        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-slate-800/85 to-amber-900/80" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />
        
        {/* Premium grain texture */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
        />
      </div>
      
      <div className="container-wide relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <UniformText 
            parameterId="title" 
            placeholder="Add stats section title" 
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-serif, Georgia), serif', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
          />
          <UniformText 
            parameterId="subtitle" 
            placeholder="Add stats section subtitle" 
            as="p"
            className="text-xl md:text-2xl text-white/85 max-w-4xl mx-auto font-light leading-relaxed"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
          />
        </div>
        
        {/* Premium Stats grid with dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          <UniformSlot name="stats" />
        </div>
      </div>
    </section>
  );
};

// UNIFORM REGISTRATION
registerUniformComponent({
  type: 'statsSection',
  component: StatsSection,
});

export default StatsSection;
