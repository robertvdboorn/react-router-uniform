import React from 'react';
import { type ComponentProps, UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import { LinkParamValue } from '@uniformdev/canvas';

export type NavigationLinkProps = ComponentProps<{
  label?: string;
  url?: LinkParamValue;
  variant?: string;
  className?: string;
}>;

/**
 * Premium NavigationLink Component
 * 
 * Refined navigation link with subtle animations and luxury styling.
 * Features elegant hover states and premium typography.
 */
export const NavigationLink: React.FC<NavigationLinkProps> = ({
  url,
  variant = 'default',
  className = '',
}) => {
  // Extract href from link parameter
  const href = url?.path || '#';

  const variantStyles = {
    default: 'relative text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:bg-amber-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300',
    button: 'bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl hover:from-slate-900 hover:to-slate-950 transition-all duration-300 transform hover:scale-105',
    highlight: 'bg-amber-50 text-amber-900 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-100 transition-all duration-300 shadow-sm hover:shadow-md',
  };

  const style = variantStyles[variant as keyof typeof variantStyles] || variantStyles.default;

  return (
    <a
      href={href}
      className={`inline-flex items-center ${style} ${className}`}
    >
      <span>
        <UniformText parameterId="label" placeholder="Add link text" as="span" />
      </span>
    </a>
  );
};

// UNIFORM REGISTRATION
registerUniformComponent({
  type: 'navigationLink',
  component: NavigationLink,
});

export default NavigationLink;

