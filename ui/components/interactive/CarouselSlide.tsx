import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { AssetParamValue } from '@uniformdev/assets';
import { getTransformedImageUrl } from '../../utilities/imageTransform';

export type CarouselSlideProps = ComponentProps<{
  image?: AssetParamValue;
  title?: string;
  description?: string;
  showOverlay?: boolean;
  className?: string;
}>;

/**
 * Premium CarouselSlide Component
 * 
 * Individual slide for the Carousel component.
 * Supports background image with optional text overlay.
 */
export const CarouselSlide: React.FC<CarouselSlideProps> = ({
  image,
  showOverlay = true,
  className = '',
}) => {
  const imageAssets = image ?? [];
  const [firstAsset] = imageAssets;
  const focalPoint = firstAsset?.fields?.focalPoint?.value;
  
  const imageUrl = getTransformedImageUrl(firstAsset, {
    width: 1600,
    height: 700,
    fit: 'cover',
    focal: focalPoint || 'center',
    quality: 85,
  });

  const imageAlt = firstAsset?.fields?.description?.value || 
    firstAsset?.fields?.title?.value || 
    'Carousel slide';

  return (
    <div className={`shrink-0 w-full relative ${className}`}>
      {/* Image */}
      <div className="relative h-[600px] overflow-hidden bg-slate-100">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
            {showOverlay && (
              <div className="absolute inset-0 bg-linear-to-br from-slate-900/60 via-slate-900/40 to-amber-900/50" />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-200 to-amber-50 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-20 h-20 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-slate-500">Add slide image</p>
            </div>
          </div>
        )}

        {/* Text Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl px-6">
              <UniformText 
                parameterId="title" 
                placeholder="Add slide title" 
                as="h3"
                className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight drop-shadow-2xl"
                style={{ fontFamily: 'var(--font-serif, Georgia), serif', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
              />
              
              <UniformText 
                parameterId="description" 
                placeholder="Add slide description" 
                as="p"
                className="text-xl md:text-2xl text-white/90 leading-relaxed font-light"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

registerUniformComponent({
  type: 'carouselSlide',
  component: CarouselSlide,
});

export default CarouselSlide;
