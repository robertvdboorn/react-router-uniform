import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import * as Accordion from '@radix-ui/react-accordion';

// ComponentProps automatically includes 'component' prop for accessing component metadata

export type FAQItemProps = ComponentProps<{
  question?: string;
  answer?: string;
  className?: string;
}>;

/**
 * Premium FAQItem Component
 * 
 * Luxury accordion item with elegant animations and sophisticated styling.
 * Features smooth expand/collapse with premium hover effects.
 * 
 * Important: State is managed by parent FAQSection component to enable
 * auto-expansion when selecting items in the Uniform Canvas editor.
 */
export const FAQItem: React.FC<FAQItemProps> = ({ className = '', component }) => {
  const componentId = component?._id || `item-${Math.random()}`;

  return (
    <Accordion.Item 
      value={componentId}
      className={`group bg-white rounded-2xl shadow-lg border border-slate-100 hover:border-amber-200/50 overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <Accordion.Trigger className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
        <UniformText 
          parameterId="question" 
          placeholder="Add FAQ question" 
          as="h3"
          className="text-xl font-semibold text-slate-900 pr-6 group-hover:text-amber-800 transition-colors"
        />
        
        <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-amber-600 flex items-center justify-center transition-all duration-300 group-data-[state=open]:rotate-180">
          <ChevronDownIcon 
            className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors"
          />
        </div>
      </Accordion.Trigger>
      
      <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="px-8 pb-6 pt-2">
          <UniformText 
            parameterId="answer" 
            placeholder="Add FAQ answer" 
            as="p"
            className="text-lg text-slate-600 leading-relaxed font-light"
          />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

registerUniformComponent({
  type: 'faqItem',
  component: FAQItem,
});

export default FAQItem;

