import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import { CheckIcon } from '@heroicons/react/24/solid';

export type PricingFeatureProps = ComponentProps<{
  text?: string;
  included?: boolean;
  className?: string;
}>;

/**
 * Pricing Feature Item Component
 * 
 * Individual feature line for pricing plans.
 * Shows checkmark and feature text.
 * 
 * Features:
 * - Inherits text color from parent PricingCard
 * - White text on featured (gradient) cards
 * - Dark text on regular white cards
 * - Checkmark icon with light background overlay
 */
export const PricingFeature: React.FC<PricingFeatureProps> = ({
  className = '',
}) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* Checkmark icon - will be white on featured (gradient) cards, amber on white cards */}
      <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-white/20">
        <CheckIcon className="w-4 h-4" />
      </div>
      
      {/* Feature text - inherits text color from parent card (white on featured, dark on regular) */}
      <span className="text-base font-light">
        <UniformText 
          parameterId="text" 
          placeholder="Add feature"
          as="span"
        />
      </span>
    </div>
  );
};

registerUniformComponent({
  type: 'pricingFeature',
  component: PricingFeature,
});

export default PricingFeature;
