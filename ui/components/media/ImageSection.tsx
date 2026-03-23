import React from 'react';
import { UniformText, UniformRichText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type ImageSectionProps = ComponentProps<{
  title?: string;
  content?: JSON;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: string;
  className?: string;
}>;

/**
 * ImageSection Component
 * 
 * A flexible content section with an image and text content side-by-side.
 * Image can be positioned on the left or right.
 * 
 * Features:
 * - Responsive layout (stacks on mobile)
 * - Configurable image position (left/right)
 * - Rich text content support
 * - Accessibility-friendly alt text
 */
export const ImageSection: React.FC<ImageSectionProps> = ({
  imageUrl,
  imageAlt = 'Section image',
  imagePosition = 'left',
  className = '',
}) => {
  const isImageLeft = imagePosition === 'left';

  return (
    <section className={`py-16 sm:py-20 md:py-28 lg:py-36 px-4 sm:px-6 ${className}`}>
      <div className="container-wide">
        <div className={`flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center`}>
          {/* Image - Premium styling */}
          <div className="flex-1 w-full">
            {imageUrl ? (
              <div className="relative group">
                {/* Main image container with overflow for zoom effect */}
                <div className="overflow-hidden rounded-3xl shadow-2xl hover-lift">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                </div>
                
                {/* Gradient overlays for depth */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-primary-600/20 via-transparent to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-transparent to-black/30 opacity-50 group-hover:opacity-20 transition-opacity duration-500" />
                
                {/* Decorative corner frame */}
                <div className="absolute top-4 right-4 w-16 h-16 md:w-20 md:h-20 border-t-4 border-r-4 border-white/40 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute bottom-4 left-4 w-16 h-16 md:w-20 md:h-20 border-b-4 border-l-4 border-white/40 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer rounded-3xl" />
              </div>
            ) : (
              <div className="w-full aspect-video bg-linear-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-primary-300 hover-lift">
                <div className="text-center p-8">
                  <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-semibold text-primary-700">Add a captivating image</p>
                  <p className="text-sm text-primary-600 mt-2">Upload in Uniform Canvas</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Content - Enhanced typography */}
          <div className="flex-1">
            <UniformText 
              parameterId="title" 
              placeholder="Enter section title" 
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 text-gray-900 leading-tight tracking-tight"
            />
            
            <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed">
              <UniformRichText 
                parameterId="content" 
                placeholder="Enter section content" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Register component with Uniform
registerUniformComponent({
  type: 'imageSection',
  component: ImageSection,
});

export default ImageSection;
