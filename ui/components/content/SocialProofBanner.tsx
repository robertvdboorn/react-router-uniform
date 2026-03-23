import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import { UserGroupIcon, GlobeAltIcon, StarIcon, HeartIcon } from '@heroicons/react/24/solid';

export type SocialProofBannerProps = ComponentProps<{
  travelersCount?: string;
  destinationsCount?: string;
  reviewsCount?: string;
  satisfactionRate?: string;
  className?: string;
}>;

/**
 * Premium Social Proof Banner Component
 * 
 * Luxury statistics banner displaying impressive travel metrics.
 * Features animated counters and premium iconography.
 * 
 * Features:
 * - Four key metrics with icons
 * - Subtle animations
 * - Elegant design
 * - Trust-building stats
 * 
 * Use Cases:
 * - Homepage trust indicators
 * - Above-the-fold social proof
 * - Conversion optimization
 * - Brand credibility
 */
export const SocialProofBanner: React.FC<SocialProofBannerProps> = ({
  className = '',
}) => {
  return (
    <section className={`py-16 md:py-20 px-6 bg-linear-to-r from-amber-600 via-amber-700 to-amber-800 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Travelers Served */}
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300">
              <UserGroupIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}>
              <UniformText 
                parameterId="travelersCount" 
                placeholder="50K+"
                as="span"
              />
            </div>
            <p className="text-sm md:text-base text-white/80 font-light uppercase tracking-wider">
              Happy Travelers
            </p>
          </div>

          {/* Destinations */}
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300">
              <GlobeAltIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}>
              <UniformText 
                parameterId="destinationsCount" 
                placeholder="100+"
                as="span"
              />
            </div>
            <p className="text-sm md:text-base text-white/80 font-light uppercase tracking-wider">
              Destinations
            </p>
          </div>

          {/* Reviews */}
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300">
              <StarIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}>
              <UniformText 
                parameterId="reviewsCount" 
                placeholder="10K+"
                as="span"
              />
            </div>
            <p className="text-sm md:text-base text-white/80 font-light uppercase tracking-wider">
              5-Star Reviews
            </p>
          </div>

          {/* Satisfaction */}
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300">
              <HeartIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}>
              <UniformText 
                parameterId="satisfactionRate" 
                placeholder="99%"
                as="span"
              />
            </div>
            <p className="text-sm md:text-base text-white/80 font-light uppercase tracking-wider">
              Satisfaction
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

registerUniformComponent({
  type: 'socialProofBanner',
  component: SocialProofBanner,
});

export default SocialProofBanner;
