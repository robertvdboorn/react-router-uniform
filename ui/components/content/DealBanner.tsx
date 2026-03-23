import React from 'react';
import { UniformText, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import { SparklesIcon } from '@heroicons/react/24/outline';

export type DealBannerProps = ComponentProps<{
  title?: string;
  description?: string;
  badge?: string;
  className?: string;
}>;

/**
 * Premium DealBanner Component
 * 
 * Luxury promotional banner with elegant styling and premium animations.
 * Perfect for highlighting special offers and limited-time deals.
 */
export const DealBanner: React.FC<DealBannerProps> = ({ className = '' }) => {
  return (
    <section className={`py-12 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-linear-to-r from-amber-600 via-amber-700 to-amber-800 rounded-3xl p-10 md:p-14 overflow-hidden shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-900/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
                <SparklesIcon className="w-5 h-5 text-white" />
                <UniformText 
                  parameterId="badge" 
                  placeholder="Add badge text" 
                  as="span"
                  className="text-sm font-semibold text-white uppercase tracking-widest"
                />
              </div>
              
              {/* Premium Title */}
              <UniformText 
                parameterId="title" 
                placeholder="Add deal title" 
                as="h2"
                className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}
              />
              
              {/* Description */}
              <UniformText 
                parameterId="description" 
                placeholder="Add deal description" 
                as="p"
                className="text-lg md:text-xl text-white/90 font-light leading-relaxed"
              />
            </div>
            
            {/* CTA */}
            <div className="shrink-0">
              <UniformSlot name="cta" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

registerUniformComponent({
  type: 'dealBanner',
  component: DealBanner,
});

export default DealBanner;

