import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export type PackageFeatureProps = ComponentProps<{
  text?: string;
  className?: string;
}>;

/**
 * PackageFeature Component
 * 
 * Individual feature item for TravelPackageCard.
 * Displays a checkmark and feature text.
 */
export const PackageFeature: React.FC<PackageFeatureProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <CheckCircleIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <UniformText 
        parameterId="text" 
        placeholder="Add feature" 
        as="span"
        className="text-sm text-slate-600"
      />
    </div>
  );
};

registerUniformComponent({
  type: 'packageFeature',
  component: PackageFeature,
});

export default PackageFeature;
