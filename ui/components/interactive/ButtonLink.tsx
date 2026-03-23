import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { LinkParamValue } from '@uniformdev/canvas';

export type ButtonLinkProps = ComponentProps<{
  text?: string;
  url?: LinkParamValue;
  variant?: string;
  size?: string;
  className?: string;
}>;

/**
 * Premium ButtonLink Component
 * 
 * Luxury button component with refined variants and elegant animations.
 * Features sophisticated gradients, shadows, and premium interactions.
 */
export const ButtonLink: React.FC<ButtonLinkProps> = ({
  url,
  variant = 'primary',
  size = 'medium',
  className = '',
}) => {
  // Extract href from link parameter
  const href = url?.path || '#';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-xl hover:shadow-2xl hover:shadow-amber-500/30',
    secondary: 'bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-slate-950 shadow-xl hover:shadow-2xl',
    outline: 'bg-transparent border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-50 font-medium hover:text-slate-900',
    'cta-light': 'bg-white text-slate-900 hover:bg-slate-50 shadow-2xl hover:shadow-white/20 font-semibold',
    'cta-dark': 'bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 shadow-2xl',
    luxury: 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 shadow-2xl hover:shadow-amber-500/50 font-semibold',
  };

  const sizeStyles = {
    small: 'px-6 py-2.5 text-sm',
    medium: 'px-10 py-4 text-base',
    large: 'px-14 py-5 text-lg',
  };

  const variantClass = variantStyles[variant as keyof typeof variantStyles] || variantStyles.primary;
  const sizeClass = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.medium;

  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${variantClass} ${sizeClass} ${className}`}
    >
      <span>
        <UniformText parameterId="text" placeholder="Add button text" as="span" />
      </span>
      {(variant === 'primary' || variant === 'cta-light' || variant === 'luxury') && (
        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      )}
    </a>
  );
};

// Register component with Uniform
registerUniformComponent({
  type: 'buttonLink',
  component: ButtonLink,
});

export default ButtonLink;
