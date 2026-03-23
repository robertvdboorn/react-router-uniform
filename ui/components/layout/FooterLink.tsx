import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { LinkParamValue } from '@uniformdev/canvas';

export type FooterLinkProps = ComponentProps<{
  label?: string;
  url?: LinkParamValue;
  className?: string;
}>;

/**
 * FooterLink Component
 * 
 * Individual link for use in Footer component slots.
 */
export const FooterLink: React.FC<FooterLinkProps> = ({ url, className = '' }) => {
  const href = url?.path || '#';

  return (
    <a
      href={href}
      className={`block py-2 text-slate-300 hover:text-amber-400 transition-colors duration-300 font-light ${className}`}
    >
      <UniformText parameterId="label" placeholder="Add link text" as="span" />
    </a>
  );
};

registerUniformComponent({
  type: 'footerLink',
  component: FooterLink,
});

export default FooterLink;
