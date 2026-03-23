import React from 'react';
import { registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { AssetParamValue } from '@uniformdev/assets';
import { getTransformedImageUrl } from '@/utilities/imageTransform';

export type GalleryImageProps = ComponentProps<{
  image?: AssetParamValue;
  caption?: string;
  className?: string;
}>;

/**
 * Gallery Image Component
 * 
 * Individual image for the ImageGallery component.
 * Handles image display, optimization, and hover effects.
 */
export const GalleryImage: React.FC<GalleryImageProps> = ({
  image,
  className = '',
}) => {
  const imageAssets = image ?? [];
  const [firstAsset] = imageAssets;
  const focalPoint = firstAsset?.fields?.focalPoint?.value;
  
  const imageUrl = getTransformedImageUrl(firstAsset, {
    width: 600,
    height: 600,
    fit: 'cover',
    focal: focalPoint || 'center',
    quality: 85,
  });

  const imageAlt = firstAsset?.fields?.description?.value || 
                   firstAsset?.fields?.title?.value || 
                   'Gallery image';

  if (!imageUrl) {
    return (
      <div className="aspect-square bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
        <p className="text-slate-400 text-sm font-light">Add image</p>
      </div>
    );
  }

  return (
    <div className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}>
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Zoom Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

registerUniformComponent({
  type: 'galleryImage',
  component: GalleryImage,
});

export default GalleryImage;
