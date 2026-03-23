import React from 'react';
import { UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type PageProps = ComponentProps<{
  className?: string;
}>;

/**
 * Page Component
 * 
 * The root composition component that serves as the page container.
 * All page content is added to the 'content' slot.
 */
export const Page: React.FC<PageProps> = ({ className = '' }) => {
  return (
    <main className={className}>
      <UniformSlot name="content" />
    </main>
  );
};

// Register component with Uniform
registerUniformComponent({
  type: 'page',
  component: Page,
});

export default Page;

