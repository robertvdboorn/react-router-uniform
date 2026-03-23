import React from 'react';
import { UniformText, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type FeatureGridProps = ComponentProps<{
  title?: string;
  subtitle?: string;
  columns?: string;
  className?: string;
}>;

/**
 * FeatureGrid Component
 * 
 * A container component that displays feature cards in a responsive grid layout.
 * Child components (like FeatureCard) are added to the 'features' slot.
 * 
 * Features:
 * - Responsive grid (1-4 columns)
 * - Optional title and subtitle
 * - Flexible slot for feature cards
 * - Configurable column count
 */
export const FeatureGrid: React.FC<FeatureGridProps> = ({
  columns = '3',
  className = '',
}) => {
  const gridClasses = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  };

  const gridClass = gridClasses[columns as keyof typeof gridClasses] || gridClasses['3'];

  return (
    <section className={`py-24 md:py-32 px-6 bg-linear-to-br from-slate-50 via-white to-amber-50/30 ${className}`}>
      <div className="container-wide relative">
        <div className="text-center mb-20">
          <UniformText 
            parameterId="title" 
            placeholder="Add section title" 
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-slate-900 leading-tight"
            style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}
          />
          
          <UniformText 
            parameterId="subtitle" 
            placeholder="Add section subtitle" 
            as="p"
            className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light"
          />
        </div>
        
        <div className={`grid grid-cols-1 ${gridClass} gap-8 lg:gap-10`}>
          <UniformSlot name="features" />
        </div>
      </div>
    </section>
  );
};

// Register component with Uniform
registerUniformComponent({
  type: 'featureGrid',
  component: FeatureGrid,
});

export default FeatureGrid;

