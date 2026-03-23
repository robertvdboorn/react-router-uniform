import React from 'react';
import { UniformText, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { AssetParamValue } from '@uniformdev/assets';
import { getResponsiveBackgroundProps } from '@/utilities/imageTransform';

export type CallToActionProps = ComponentProps<{
  title?: string;
  description?: string;
  badge?: string;
  backgroundImage?: AssetParamValue;
  className?: string;
}>;

/**
 * Premium CallToAction Component
 * 
 * Luxury CTA section with elegant overlays and refined typography.
 * Features sophisticated gradients, premium animations, and polished design.
 */
export const CallToAction: React.FC<CallToActionProps> = ({
  backgroundImage,
  className = '',
}) => {
  const bgProps = getResponsiveBackgroundProps(backgroundImage?.[0], { aspectHeight: 1080 });

  return (
    <section className={`py-24 md:py-36 relative overflow-hidden ${className}`}>
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
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/85 via-amber-900/70 to-slate-900/90" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 via-transparent to-transparent" />
      </div>
      
      {/* Premium content container */}
      <div className="max-w-5xl mx-auto text-center relative z-10 px-6 sm:px-8">
        {/* Luxury Badge */}
        <UniformText 
          parameterId="badge" 
          placeholder="Add badge text (optional)" 
          as="div"
          className="inline-flex items-center gap-2 mb-8 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.2em] shadow-2xl"
        />
        
        {/* Premium Title */}
        <UniformText 
          parameterId="title" 
          placeholder="Add CTA title" 
          as="h2"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-8 text-white leading-[1.15] tracking-tight"
          style={{ fontFamily: 'var(--font-serif, Georgia), serif', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        />
        
        {/* Refined Description */}
        <UniformText 
          parameterId="description" 
          placeholder="Add CTA description" 
          as="p"
          className="text-xl sm:text-2xl text-white/85 mb-12 leading-relaxed max-w-3xl mx-auto font-light"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
        />
        
        {/* Premium Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <UniformSlot name="buttons" />
        </div>
        
        {/* Subtle decorative element */}
        <div className="mt-16 flex items-center justify-center gap-2">
          <div className="w-12 h-px bg-white/20"></div>
          <svg className="w-4 h-4 text-white/40" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          <div className="w-12 h-px bg-white/20"></div>
        </div>
      </div>
    </section>
  );
};

// Register component with Uniform
registerUniformComponent({
  type: 'callToAction',
  component: CallToAction,
});

export default CallToAction;
