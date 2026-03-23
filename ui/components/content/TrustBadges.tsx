import React from 'react';
import { UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type TrustBadgesProps = ComponentProps<{
  className?: string;
}>;

/**
 * Premium TrustBadges Component
 * 
 * Luxury trust indicators with sophisticated styling.
 * Builds customer confidence with elegant design.
 */
export const TrustBadges: React.FC<TrustBadgesProps> = ({ className = '' }) => {
  return (
    <section className={`py-16 px-6 bg-linear-to-r from-slate-50 to-white border-y border-slate-100 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <UniformSlot name="badges" />
        </div>
      </div>
    </section>
  );
};

registerUniformComponent({
  type: 'trustBadges',
  component: TrustBadges,
});

export default TrustBadges;

