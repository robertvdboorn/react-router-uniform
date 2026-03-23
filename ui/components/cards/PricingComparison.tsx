import React from 'react';
import { UniformText, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type PricingComparisonProps = ComponentProps<{
  title?: string;
  subtitle?: string;
  className?: string;
}>;

/**
 * Premium Pricing Comparison Component
 * 
 * Luxury pricing table for comparing travel packages side-by-side.
 * Features sophisticated design and clear value proposition display.
 * 
 * Features:
 * - Up to 3 pricing tiers
 * - Feature comparison list
 * - Popular/featured plan highlighting
 * - Premium card design with hover effects
 * - Clear CTA buttons
 * 
 * Use Cases:
 * - Travel package comparisons
 * - Membership tier displays
 * - Service level comparisons
 * - Tour package options
 */
export const PricingComparison: React.FC<PricingComparisonProps> = ({
  className = '',
}) => {
  return (
    <section className={`py-24 md:py-32 px-6 bg-linear-to-br from-white via-slate-50 to-amber-50/30 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <UniformText 
            parameterId="title" 
            placeholder="Add pricing title" 
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}
          />
          
          <UniformText 
            parameterId="subtitle" 
            placeholder="Add pricing subtitle" 
            as="p"
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light"
          />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UniformSlot name="plans" />
        </div>
      </div>
    </section>
  );
};

registerUniformComponent({
  type: 'pricingComparison',
  component: PricingComparison,
});

export default PricingComparison;
