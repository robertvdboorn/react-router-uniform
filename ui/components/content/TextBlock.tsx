import React from 'react';
import { UniformRichText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type TextBlockProps = ComponentProps<{
  content?: JSON;
  className?: string;
}>;

/**
 * Premium TextBlock Component
 * 
 * Luxury rich text container with refined typography and elegant styling.
 * Perfect for detailed content, articles, and long-form text.
 */
export const TextBlock: React.FC<TextBlockProps> = ({ className = '' }) => {
  return (
    <div className={`prose prose-lg md:prose-xl max-w-none prose-slate prose-headings:font-serif prose-headings:font-light prose-h2:text-4xl prose-h3:text-3xl prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-amber-700 prose-a:no-underline hover:prose-a:text-amber-800 prose-strong:text-slate-900 prose-strong:font-semibold ${className}`}>
      <UniformRichText parameterId="content" placeholder="Add content" />
    </div>
  );
};

// Register component with Uniform
registerUniformComponent({
  type: 'textBlock',
  component: TextBlock,
});

export default TextBlock;

