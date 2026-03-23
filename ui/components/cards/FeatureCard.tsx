import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import {
  GlobeAltIcon,
  MapPinIcon,
  SparklesIcon,
  TrophyIcon,
  HeartIcon,
  StarIcon,
  UsersIcon,
  ShieldCheckIcon,
  BoltIcon,
  SunIcon,
  CameraIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  globe: GlobeAltIcon,
  map: MapPinIcon,
  sparkles: SparklesIcon,
  trophy: TrophyIcon,
  heart: HeartIcon,
  star: StarIcon,
  users: UsersIcon,
  shield: ShieldCheckIcon,
  bolt: BoltIcon,
  sun: SunIcon,
  camera: CameraIcon,
  trending: ArrowTrendingUpIcon,
};

export type FeatureCardProps = ComponentProps<{
  title?: string;
  description?: string;
  icon?: string;
  className?: string;
}>;

/**
 * FeatureCard Component
 * 
 * A card component for displaying features or benefits.
 * Includes an optional icon from Heroicons, title, and description.
 * 
 * Features:
 * - Clean card design with hover effects
 * - Professional icon library (Heroicons)
 * - Editable title and description
 * - Responsive layout
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  className = '',
}) => {
  const IconComponent = icon ? iconMap[icon as keyof typeof iconMap] : null;

  return (
    <div className={`relative group ${className}`}>
      {/* Premium glow effect on hover */}
      <div className="absolute -inset-1 bg-linear-to-br from-amber-500/20 to-amber-700/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Premium Card */}
      <div className="relative bg-white rounded-3xl p-10 shadow-xl border border-slate-100 group-hover:border-amber-200/50 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3">
        {IconComponent && (
          <div className="relative mb-8">
            {/* Icon glow */}
            <div className="absolute inset-0 bg-linear-to-br from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            
            {/* Icon container */}
            <div className="relative w-20 h-20 flex items-center justify-center bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
              <IconComponent className="w-11 h-11 text-amber-700 group-hover:text-amber-800 transition-colors duration-300" strokeWidth={1.5} />
            </div>
          </div>
        )}
        
        <UniformText 
          parameterId="title" 
          placeholder="Add feature title" 
          as="h3"
          className="text-2xl font-semibold mb-5 text-slate-900 group-hover:text-amber-800 transition-colors duration-300 leading-tight"
        />
        
        <UniformText 
          parameterId="description" 
          placeholder="Add feature description" 
          as="p"
          className="text-slate-600 leading-relaxed text-lg font-light"
        />
        
        {/* Premium bottom border accent */}
        <div className="absolute bottom-0 left-8 right-8 h-1 bg-linear-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/100 transition-all duration-500 rounded-full" />
      </div>
    </div>
  );
};

// Register component with Uniform
registerUniformComponent({
  type: 'featureCard',
  component: FeatureCard,
});

export default FeatureCard;
