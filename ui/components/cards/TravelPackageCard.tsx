import React from 'react';
import { UniformText, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { AssetParamValue } from '@uniformdev/assets';
import { ClockIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import { getTransformedImageUrl } from '../../utilities/imageTransform';

export type TravelPackageCardProps = ComponentProps<{
  name?: string;
  location?: string;
  duration?: string;
  groupSize?: string;
  price?: string;
  image?: AssetParamValue;
  badge?: string;
  className?: string;
}>;

/**
 * Premium TravelPackageCard Component
 * 
 * Luxury travel package card showcasing tours, packages, and experiences.
 * Features premium styling, detailed information, and elegant hover effects.
 */
export const TravelPackageCard: React.FC<TravelPackageCardProps> = ({
  image,
  className = '',
}) => {
  const imageAssets = image ?? [];
  const [firstAsset] = imageAssets;
  const focalPoint = firstAsset?.fields?.focalPoint?.value;
  
  const imageUrl = getTransformedImageUrl(firstAsset, {
    width: 700,
    height: 500,
    fit: 'cover',
    focal: focalPoint || 'center',
    quality: 85,
  });

  const imageAlt = firstAsset?.fields?.description?.value || 
    firstAsset?.fields?.title?.value || 
    'Travel Package';

  return (
    <div className={`group cursor-pointer ${className}`}>
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-slate-100">
        {/* Badge */}
        <div className="absolute top-5 left-5 z-20">
          <UniformText 
            parameterId="badge" 
            placeholder="" 
            as="div"
            className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-full shadow-lg"
          />
        </div>

        {/* Image */}
        <div className="relative h-80 overflow-hidden bg-slate-100">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-linear-to-br from-slate-200 to-amber-50 flex items-center justify-center">
              <MapPinIcon className="w-20 h-20 text-slate-300" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-8">
          {/* Location */}
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <MapPinIcon className="w-4 h-4 text-amber-600" />
            <UniformText 
              parameterId="location" 
              placeholder="Add location" 
              as="span"
              className="text-sm font-medium"
            />
          </div>
          
          {/* Name */}
          <UniformText 
            parameterId="name" 
            placeholder="Add package name" 
            as="h3"
            className="text-2xl font-semibold text-slate-900 mb-4 group-hover:text-amber-700 transition-colors duration-300 leading-tight"
          />
          
          {/* Package Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500">Duration</div>
                <UniformText 
                  parameterId="duration" 
                  placeholder="Add duration" 
                  as="div"
                  className="text-sm font-semibold text-slate-900"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500">Group Size</div>
                <UniformText 
                  parameterId="groupSize" 
                  placeholder="Add group size" 
                  as="div"
                  className="text-sm font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>
          
          {/* Features Slot */}
          <div className="mb-6">
            <UniformSlot name="features" />
          </div>
          
          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="text-sm text-slate-500 mb-1">From</div>
              <UniformText 
                parameterId="price" 
                placeholder="Add price" 
                as="div"
                className="text-3xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors"
              />
            </div>
            
            <button className="px-6 py-3 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

registerUniformComponent({
  type: 'travelPackageCard',
  component: TravelPackageCard,
});

export default TravelPackageCard;
