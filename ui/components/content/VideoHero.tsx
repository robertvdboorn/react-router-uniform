import React from 'react';
import { UniformText, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { AssetParamValue } from '@uniformdev/assets';

export type VideoHeroProps = ComponentProps<{
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  posterImage?: AssetParamValue;
  overlayOpacity?: number;
  className?: string;
}>;

/**
 * Premium Video Hero Component
 * 
 * Luxury hero section with full-width background video and elegant overlays.
 * Creates immersive, cinematic first impressions for premium travel experiences.
 * 
 * Features:
 * - Autoplay looping background video
 * - Customizable overlay opacity
 * - Poster image fallback
 * - Responsive video handling
 * - Muted by default for autoplay
 * - Premium typography and CTAs
 * 
 * Use Cases:
 * - Homepage hero sections
 * - Destination landing pages
 * - Property showcases
 * - Experience promotions
 */
export const VideoHero: React.FC<VideoHeroProps> = ({
  videoUrl,
  overlayOpacity = 40,
  className = '',
}) => {
  const overlayClass = `bg-gradient-to-b from-black/${overlayOpacity} via-black/${Math.round(overlayOpacity * 0.6)} to-black/${overlayOpacity}`;

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Video Background */}
      {videoUrl ? (
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-amber-900" />
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClass}`} />

      {/* Content Container */}
      <div className="relative z-10 container-wide py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-tight tracking-tight"
              style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}>
            <UniformText 
              parameterId="title" 
              placeholder="Add video hero title"
              as="span"
            />
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-16 font-light leading-relaxed max-w-3xl mx-auto">
            <UniformText 
              parameterId="subtitle" 
              placeholder="Add video hero subtitle"
              as="span"
            />
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <UniformSlot name="buttons" />
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="flex flex-col items-center animate-bounce">
              <span className="text-white/60 text-sm font-light mb-3 uppercase tracking-wider">
                Discover More
              </span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                <div className="w-1 h-2 bg-white/60 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

registerUniformComponent({
  type: 'videoHero',
  component: VideoHero,
});

export default VideoHero;
