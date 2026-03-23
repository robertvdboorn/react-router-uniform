import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { AssetParamValue } from '@uniformdev/assets';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { getTransformedImageUrl } from '../../utilities/imageTransform';

export type DestinationCardProps = ComponentProps<{
  name?: string;
  location?: string;
  image?: AssetParamValue;
  price?: string;
  rating?: string;
  reviews?: string;
  className?: string;
}>;

/**
 * DestinationCard Component
 * 
 * A card component for showcasing travel destinations with image, name, location,
 * price, and rating information.
 * 
 * Features:
 * - Beautiful image with focal point support
 * - Multi-CDN support (Uniform, Unsplash, Cloudinary)
 * - Location with map pin icon
 * - Star rating display
 * - Price information
 * - Hover effects
 * - Responsive design
 */
export const DestinationCard: React.FC<DestinationCardProps> = ({
  image,
  className = '',
}) => {
  // Extract asset from array
  const imageAssets = image ?? [];
  const [firstAsset] = imageAssets;
  
  // Get focal point from asset
  const focalPoint = firstAsset?.fields?.focalPoint?.value;
  
  // Transform image with focal point
  const imageUrl = getTransformedImageUrl(firstAsset, {
    width: 600,
    height: 400,
    fit: 'cover',
    focal: focalPoint || 'center',
    quality: 85,
  });

  // Extract alt text for accessibility
  const imageAlt = firstAsset?.fields?.description?.value || 
    firstAsset?.fields?.title?.value || 
    'Destination';

  return (
    <div className={`group cursor-pointer ${className}`}>
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-slate-100">
        {/* Premium Image Container */}
        <div className="relative h-72 overflow-hidden bg-slate-100">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full bg-linear-to-br from-slate-200 via-slate-100 to-amber-50 flex items-center justify-center">
              <MapPinIcon className="w-20 h-20 text-slate-300" />
            </div>
          )}
          
          {/* Luxury Rating Badge */}
          <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2 shadow-2xl ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-300">
            <StarIcon className="w-5 h-5 text-amber-500" />
            <UniformText 
              parameterId="rating" 
              placeholder="4.9" 
              as="span"
              className="text-base font-bold text-slate-900"
            />
          </div>

          {/* Premium hover overlay with "View Details" */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/95 backdrop-blur-md px-8 py-3 rounded-full text-slate-900 font-semibold shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Details →
            </div>
          </div>
        </div>
        
        {/* Premium Content */}
        <div className="p-7">
          {/* Location with refined styling */}
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <MapPinIcon className="w-4 h-4 text-amber-600" />
            <UniformText 
              parameterId="location" 
              placeholder="Add location" 
              as="span"
              className="text-sm font-medium tracking-wide"
            />
          </div>
          
          {/* Name with premium typography */}
          <UniformText 
            parameterId="name" 
            placeholder="Add destination name" 
            as="h3"
            className="text-2xl font-semibold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors duration-300 leading-tight"
          />
          
          {/* Reviews with subtle styling */}
          <UniformText 
            parameterId="reviews" 
            placeholder="Add review count" 
            as="p"
            className="text-sm text-slate-500 mb-5 font-light"
          />
          
          {/* Premium Price Display */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">From</span>
              <UniformText 
                parameterId="price" 
                placeholder="$599" 
                as="span"
                className="text-3xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors"
              />
              <span className="text-sm text-slate-500 font-light">/ person</span>
            </div>
            
            {/* Premium arrow */}
            <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-amber-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Premium shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
};

registerUniformComponent({
  type: 'destinationCard',
  component: DestinationCard,
});

export default DestinationCard;
