import React from 'react';
import { UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type ContentSectionProps = ComponentProps<{
  title?: string;
  className?: string;
}>;

/**
 * Premium ContentSection Component
 * 
 * Clean luxury content container with flexible slot for child components.
 * Pure content wrapper without any title to avoid conflicts.
 */
export const ContentSection: React.FC<ContentSectionProps> = ({ className = '' }) => {
  return (
    <section className={`py-24 md:py-32 px-6 ${className}`}>
      <div className="container-wide">
        {/* Slot for child components with refined spacing */}
        <div className="space-y-16 md:space-y-20">
          <UniformSlot name="content" />
        </div>
      </div>
    </section>
  );
};

// Register component with Uniform
registerUniformComponent({
  type: 'contentSection',
  component: ContentSection,
});

export default ContentSection;

