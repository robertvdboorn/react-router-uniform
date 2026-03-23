import React, { useState, useEffect } from 'react';
import { UniformText, UniformSlot, registerUniformComponent, useUniformContextualEditingState } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { ComponentInstance } from '@uniformdev/canvas';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// ComponentProps automatically includes 'component' prop for accessing component metadata

export type CarouselProps = ComponentProps<{
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
  interval?: number;
  className?: string;
}>;

/**
 * Premium Carousel Component
 * 
 * Luxury carousel with smooth transitions, navigation, and auto-play.
 * Perfect for showcasing destinations, testimonials, or featured content.
 * 
 * Canvas Editor Integration:
 * - Auto-navigates to selected slide when clicked in Canvas component tree
 */
export const Carousel: React.FC<CarouselProps> = ({ 
  autoplay = false,
  className = '',
  component,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = component?.slots?.slides || [];
  const totalSlides = slides.length;
  const { selectedComponentReference } = useUniformContextualEditingState();

  const goToSlide = (index: number) => {
    setCurrentSlide((index + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-navigate to selected slide in Canvas editor
  useEffect(() => {
    const selectedId = selectedComponentReference?.id;
    
    if (selectedId && slides.length > 0) {
      // Find if selected component is a slide
      const selectedSlideIndex = slides.findIndex((slide: ComponentInstance) => {
        const slideId = slide._id;
        // Handle both simple IDs and composite IDs (pattern|component)
        return slideId === selectedId ||
               (typeof slideId === 'string' && typeof selectedId === 'string' && (
                 slideId.split('|')[0] === selectedId.split('|')[0]
               ));
      });

      if (selectedSlideIndex !== -1) {
        setCurrentSlide(selectedSlideIndex);
      }
    }
  }, [selectedComponentReference, slides]);

  // Auto-play functionality
  useEffect(() => {
    if (autoplay && totalSlides > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [autoplay, totalSlides, currentSlide]);

  if (totalSlides === 0) {
    return (
      <section className={`py-24 md:py-32 px-6 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500">Add slides to the carousel</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-24 md:py-32 px-6 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <UniformText 
            parameterId="title" 
            placeholder="Add carousel title" 
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}
          />
          
          <UniformText 
            parameterId="subtitle" 
            placeholder="Add carousel subtitle" 
            as="p"
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light"
          />
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Slides */}
          <div className="relative overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-700 ease-out *:shrink-0 *:w-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              <UniformSlot name="slides" />
            </div>
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="w-7 h-7 text-slate-900" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="w-7 h-7 text-slate-900" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              {slides.map((_: ComponentInstance, index: number) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'w-12 h-3 bg-amber-600'
                      : 'w-3 h-3 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

registerUniformComponent({
  type: 'carousel',
  component: Carousel,
});

export default Carousel;
