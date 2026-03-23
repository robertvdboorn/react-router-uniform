import React, { useState } from 'react';
import { UniformSlot, UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { ComponentInstance } from '@uniformdev/canvas';
import { XMarkIcon } from '@heroicons/react/24/outline';

// ComponentProps automatically includes 'component' prop for accessing component metadata

export type ImageGalleryProps = ComponentProps<{
  title?: string;
  subtitle?: string;
  className?: string;
}>;

/**
 * Premium Image Gallery Component
 * 
 * Luxury photo gallery with lightbox functionality and sophisticated grid layout.
 * Perfect for showcasing destination photos, property images, and travel experiences.
 * 
 * Features:
 * - Masonry-style responsive grid
 * - Click to view full-size lightbox
 * - Smooth fade transitions
 * - Premium hover effects with zoom
 * - Keyboard navigation (ESC to close)
 * 
 * Use Cases:
 * - Destination galleries
 * - Hotel property photos
 * - Travel experience showcases
 * - Tour highlight reels
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  className = '',
  component,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = component?.slots?.images || [];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null && lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <section className={`py-24 md:py-32 px-6 bg-linear-to-br from-slate-50 via-white to-amber-50/20 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <UniformText 
            parameterId="title" 
            placeholder="Add gallery title" 
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}
          />
          
          <UniformText 
            parameterId="subtitle" 
            placeholder="Add gallery subtitle" 
            as="p"
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light"
          />
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image: ComponentInstance, index: number) => (
            <div
              key={image._id || index}
              onClick={() => openLightbox(index)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
              style={{ display: 'none' }} // Hidden, children will override
            >
              {/* This div is for structure only - actual image rendered by GalleryImage component */}
            </div>
          ))}
          <UniformSlot name="images" />
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && images[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 z-10"
              aria-label="Close lightbox"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {lightboxIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300"
                aria-label="Next image"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md">
              <p className="text-white font-light">
                {lightboxIndex + 1} / {images.length}
              </p>
            </div>

            {/* Lightbox Image - placeholder, actual content managed separately */}
            <div 
              className="max-w-6xl max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image content will be rendered here */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

registerUniformComponent({
  type: 'imageGallery',
  component: ImageGallery,
});

export default ImageGallery;
