import React from 'react';
import { UniformText, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type PricingPlanProps = ComponentProps<{
  planName?: string;
  price?: string;
  period?: string;
  description?: string;
  featured?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  className?: string;
}>;

/**
 * Pricing Plan Card Component
 * 
 * Individual pricing tier for the PricingComparison component.
 * Displays plan details, pricing, features, and CTA.
 */
export const PricingPlan: React.FC<PricingPlanProps> = ({
  featured = false,
  className = '',
}) => {
  return (
    <div className={`relative rounded-3xl ${
      featured 
        ? 'bg-linear-to-br from-amber-600 to-amber-800 text-white shadow-2xl scale-105 border-4 border-amber-400' 
        : 'bg-white text-slate-900 shadow-lg border border-slate-200'
    } p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${className}`}>
      
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-linear-to-r from-white to-amber-50 rounded-full shadow-lg">
          <span className="text-sm font-semibold text-amber-900 uppercase tracking-wider">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8 pb-8 border-b border-current/10">
        <h3 className={`text-2xl font-semibold mb-4 ${featured ? 'text-white' : 'text-slate-900'}`}>
          <UniformText 
            parameterId="planName" 
            placeholder="Add plan name"
            as="span"
          />
        </h3>

        <div className="mb-4">
          <span className="text-5xl md:text-6xl font-light" style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}>
            <UniformText 
              parameterId="price" 
              placeholder="$999"
              as="span"
            />
          </span>
          <span className={`text-lg ml-2 ${featured ? 'text-white/80' : 'text-slate-600'}`}>
            <UniformText 
              parameterId="period" 
              placeholder="/person"
              as="span"
            />
          </span>
        </div>

        <p className={`text-base ${featured ? 'text-white/90' : 'text-slate-600'} font-light`}>
          <UniformText 
            parameterId="description" 
            placeholder="Add plan description"
            as="span"
          />
        </p>
      </div>

      {/* Features List */}
      <div className="mb-8 space-y-4">
        <UniformSlot name="features" />
      </div>

      {/* CTA Button */}
      <button className={`w-full py-4 px-8 rounded-xl font-semibold transition-all duration-300 ${
        featured
          ? 'bg-white text-amber-900 hover:bg-amber-50 shadow-lg hover:shadow-xl'
          : 'bg-linear-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg'
      }`}>
        <UniformText 
          parameterId="buttonText" 
          placeholder="Choose Plan"
          as="span"
        />
      </button>
    </div>
  );
};

registerUniformComponent({
  type: 'pricingPlan',
  component: PricingPlan,
});

export default PricingPlan;
