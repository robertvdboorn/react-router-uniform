import React, { useState, useEffect } from 'react';
import { UniformText, UniformSlot, registerUniformComponent, useUniformContextualEditingState } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import type { ComponentInstance } from '@uniformdev/canvas';
import * as Accordion from '@radix-ui/react-accordion';

// ComponentProps automatically includes 'component' prop for accessing component metadata

export type FAQSectionProps = ComponentProps<{
  title?: string;
  subtitle?: string;
  className?: string;
}>;

/**
 * UNIFORM: FAQ Accordion with Canvas Editor Auto-Expansion
 * 
 * WHY PARENT STATE: Enables auto-expand when clicking child FAQItems in Canvas tree.
 * Uniform's useUniformContextualEditingState() tracks selected component in editor.
 */
export const FAQSection: React.FC<FAQSectionProps> = ({ className = '', component }) => {
  const [expandedItem, setExpandedItem] = useState<string>("");
  const { selectedComponentReference } = useUniformContextualEditingState();
  
  // UNIFORM CANVAS: Auto-expand selected FAQ item in editor
  useEffect(() => {
    const selectedId = selectedComponentReference?.id;
    
    if (selectedId && component?.slots?.items) {
      const childItems = component.slots.items;
      const selectedChild = childItems.find((item: ComponentInstance) => {
        const itemId = item._id;
        // Pattern IDs are composite: "pattern-id|component-id"
        return itemId === selectedId || 
               (itemId && selectedId.includes(itemId)) || 
               (itemId && selectedId && itemId.includes(selectedId));
      });
      
      if (selectedChild && selectedChild._id) {
        setExpandedItem(selectedChild._id);
      }
    }
  }, [selectedComponentReference, component]);

  return (
    <section className={`py-24 md:py-32 px-6 bg-linear-to-br from-white via-slate-50 to-amber-50/30 ${className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <UniformText 
            parameterId="title" 
            placeholder="Add FAQ section title" 
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}
          />
          
          <UniformText 
            parameterId="subtitle" 
            placeholder="Add FAQ section subtitle" 
            as="p"
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed"
          />
        </div>
        
        {/* FAQ Items with parent-managed accordion state */}
        <Accordion.Root
          type="single"
          collapsible
          value={expandedItem}
          onValueChange={setExpandedItem}
          className="space-y-5"
        >
          <UniformSlot name="items" />
        </Accordion.Root>
      </div>
    </section>
  );
};

registerUniformComponent({
  type: 'faqSection',
  component: FAQSection,
});

export default FAQSection;

