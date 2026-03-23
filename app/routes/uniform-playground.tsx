import { UniformPlayground } from '@uniformdev/canvas-react';
import { ResizablePlaygroundDecorator } from '@/components/playground/ResizablePlaygroundDecorator';

/**
 * Uniform Playground Page
 * 
 * Provides an isolated preview environment for testing Uniform patterns
 * and components outside of full composition contexts.
 * 
 * Features:
 * - Component pattern preview
 * - Resizable viewport decorator
 * - Isolated component testing
 */
export default function UniformPlaygroundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UniformPlayground 
        decorators={[ResizablePlaygroundDecorator]}
        behaviorTracking="onLoad"
      />
    </div>
  );
}

