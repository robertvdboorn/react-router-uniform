import React from 'react';
import { UniformText, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type PricingCardProps = ComponentProps<{
  title?: string;
  price?: string;
  period?: string;
  description?: string;
  featured?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  className?: string;
}>;

/**
 * PricingCard Component
 * 
 * A pricing card for travel packages with features list.
 * Supports a featured/highlighted state with enhanced styling.
 * 
 * Features:
 * - Large price display
 * - Feature list via slot
 * - Featured card variant with gradient border
 * - CTA button
 * - Hover effects
 * 
 * Use Cases:
 * - Travel package pricing
 * - Tour options
 * - Membership tiers
 * - Service plans
 */
export const PricingCard: React.FC<PricingCardProps> = ({
  featured = false,
  buttonUrl = '#',
  className = '',
}) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Gradient glow for featured card */}
      {featured && (
        <div className="absolute -inset-1 bg-linear-to-r from-primary-500 to-accent-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
      )}
      
      {/* Card */}
      <div className={`relative rounded-3xl p-8 transition-all duration-300 ${
        featured 
          ? 'bg-linear-to-br from-primary-600 to-accent-600 text-white shadow-2xl scale-105 hover:scale-110' 
          : 'bg-white shadow-lg hover:shadow-2xl border border-gray-100 hover:-translate-y-2'
      }`}>
        {/* Featured badge */}
        {featured && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-secondary-500 text-white rounded-full text-sm font-bold shadow-lg">
            ⭐ Most Popular
          </div>
        )}
        
        {/* Title */}
        <UniformText 
          parameterId="title" 
          placeholder="Package Name" 
          as="h3"
          className={`text-2xl font-bold mb-4 ${featured ? 'text-white' : 'text-gray-900'}`}
        />
        
        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <UniformText 
              parameterId="price" 
              placeholder="$999" 
              as="span"
              className={`text-5xl font-bold ${featured ? 'text-white' : 'text-gray-900'}`}
            />
            <UniformText 
              parameterId="period" 
              placeholder="per person" 
              as="span"
              className={`text-lg ${featured ? 'text-white/80' : 'text-gray-600'}`}
            />
          </div>
        </div>
        
        {/* Description */}
        <UniformText 
          parameterId="description" 
          placeholder="Perfect for adventurous travelers" 
          as="p"
          className={`mb-8 ${featured ? 'text-white/90' : 'text-gray-600'}`}
        />
        
        {/* Features list slot */}
        <div className="mb-8 space-y-3">
          <UniformSlot name="features" />
        </div>
        
        {/* CTA Button */}
        <a
          href={buttonUrl}
          className={`block w-full text-center px-6 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
            featured
              ? 'bg-white text-primary-600 hover:bg-gray-100 shadow-xl'
              : 'bg-linear-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-lg'
          }`}
        >
          <UniformText parameterId="buttonText" placeholder="Book Now" as="span" />
        </a>
      </div>
    </div>
  );
};

// UNIFORM REGISTRATION
registerUniformComponent({
  type: 'pricingCard',
  component: PricingCard,
});

export default PricingCard;

