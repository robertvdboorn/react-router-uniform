import { useState } from 'react';
import type { UniformPlaygroundDecorator } from '@uniformdev/canvas-react';
import { IS_RENDERED_BY_UNIFORM_ATTRIBUTE } from '@uniformdev/canvas';

// Component types that should render at specific default sizes
type ComponentType =
  // Layout Components
  | 'navigation'
  | 'page'
  | 'footer'
  | 'footerLink'
  // Content Components - Full Width
  | 'hero'
  | 'searchHero'
  | 'videoHero'
  | 'callToAction'
  | 'contentSection'
  | 'imageSection'
  | 'imageGallery'
  | 'newsletter'
  | 'statsSection'
  | 'dealBanner'
  | 'faqSection'
  | 'trustBadges'
  | 'featureGrid'
  | 'carousel'
  | 'socialProofBanner'
  | 'pricingComparison'
  // Content Components - Large
  | 'textBlock'
  | 'testimonial'
  | 'carouselSlide'
  // Content Components - Medium
  | 'statItem'
  | 'faqItem'
  | 'trustBadge'
  | 'galleryImage'
  // Card Components
  | 'featureCard'
  | 'destinationCard'
  | 'travelPackageCard'
  | 'pricingCard'
  | 'pricingFeature'
  | 'packageFeature'
  | 'pricingPlan'
  | 'blogPostCard'
  // Interactive Components
  | 'buttonLink'
  | 'navigationLink';

const sizes = {
  'Full Width': '100%',
  '2XL': '1536px',
  'XL': '1280px',
  'LG': '1024px',
  'MD': '768px',
  'SM': '640px',
  'XS': '480px',
  '2XS': '320px',
};

// Map component types to their default preview sizes
const defaultSizes: Record<ComponentType, keyof typeof sizes> = {
  // Layout Components
  navigation: 'Full Width',
  page: 'Full Width',
  footer: 'Full Width',
  footerLink: 'SM',
  
  // Content Components - Full Width
  hero: 'Full Width',
  searchHero: 'Full Width',
  videoHero: 'Full Width',
  callToAction: 'Full Width',
  contentSection: 'Full Width',
  imageSection: 'Full Width',
  imageGallery: 'Full Width',
  newsletter: 'Full Width',
  statsSection: 'Full Width',
  dealBanner: 'Full Width',
  faqSection: 'Full Width',
  trustBadges: 'Full Width',
  featureGrid: 'Full Width',
  carousel: 'Full Width',
  socialProofBanner: 'Full Width',
  pricingComparison: 'Full Width',
  
  // Content Components - Large
  textBlock: 'LG',
  testimonial: 'LG',
  carouselSlide: 'LG',
  
  // Content Components - Medium
  statItem: 'MD',
  faqItem: 'MD',
  trustBadge: 'MD',
  galleryImage: 'MD',
  
  // Card Components
  featureCard: 'MD',
  destinationCard: 'MD',
  travelPackageCard: 'MD',
  packageFeature: 'SM',
  pricingCard: 'MD',
  pricingFeature: 'SM',
  pricingPlan: 'MD',
  blogPostCard: 'MD',
  
  // Interactive Components
  buttonLink: 'SM',
  navigationLink: 'SM',
};

/**
 * Resizable Playground Decorator
 * 
 * Wraps component patterns with a resizable container and size selector.
 * Allows testing components at different viewport sizes.
 * 
 * Features:
 * - Multiple preset viewport sizes
 * - Smooth transitions between sizes
 * - Component-specific default sizes
 * - Apple-style UI design
 */
export const ResizablePlaygroundDecorator: UniformPlaygroundDecorator = ({ children, data }) => {
  const componentType = data.type as ComponentType;
  const defaultSize = defaultSizes[componentType] || 'LG';
  const [selectedSize, setSelectedSize] = useState<keyof typeof sizes>(defaultSize);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      {/* Size Selector */}
      <div
        className="mb-6 flex items-center justify-center gap-2 flex-wrap"
        {...{ [IS_RENDERED_BY_UNIFORM_ATTRIBUTE]: '' }}
      >
        <span className="text-sm font-medium text-gray-600 mr-2">Preview Size:</span>
        {Object.entries(sizes).map(([label, _]) => (
          <button
            key={label}
            onClick={() => setSelectedSize(label as keyof typeof sizes)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedSize === label
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            {...{ [IS_RENDERED_BY_UNIFORM_ATTRIBUTE]: '' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Component Info */}
      <div
        className="mb-4 text-center"
        {...{ [IS_RENDERED_BY_UNIFORM_ATTRIBUTE]: '' }}
      >
        <p className="text-sm text-gray-600">
          Component: <span className="font-semibold text-gray-900">{componentType}</span>
          {' • '}
          Width: <span className="font-semibold text-primary-600">{sizes[selectedSize]}</span>
        </p>
      </div>

      {/* Resizable Container */}
      <div className="flex justify-center">
        <div
          className="transition-all duration-300 ease-in-out"
          style={{ 
            maxWidth: sizes[selectedSize],
            width: '100%',
          }}
        >
          {/* Pattern Preview Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {children}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div
        className="mt-8 text-center text-sm text-gray-500"
        {...{ [IS_RENDERED_BY_UNIFORM_ATTRIBUTE]: '' }}
      >
        <p>Use the size selector above to test component responsiveness</p>
      </div>
    </div>
  );
};

export default ResizablePlaygroundDecorator;

