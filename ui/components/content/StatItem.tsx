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

export type StatItemProps = ComponentProps<{
  number?: string;
  label?: string;
  icon?: string;
  className?: string;
}>;

/**
 * Premium StatItem Component
 * 
 * Luxury statistic card with elegant styling and refined animations.
 * Features sophisticated hover effects and premium typography.
 */
export const StatItem: React.FC<StatItemProps> = ({ icon, className = '' }) => {
  const IconComponent = icon ? iconMap[icon as keyof typeof iconMap] : null;

  return (
    <div className={`group relative text-center border-r border-white/10 last:border-r-0 ${className}`}>
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-linear-to-b from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:via-amber-500/5 group-hover:to-amber-500/0 transition-all duration-500" />
      
      <div className="relative p-10 md:p-12 transition-all duration-500 group-hover:-translate-y-2">
        {/* Premium Icon */}
        {IconComponent && (
          <div className="mb-6 inline-block relative">
            {/* Icon glow */}
            <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon container */}
            <div className="relative w-16 h-16 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group-hover:border-amber-500/30 group-hover:bg-white/10 transition-all duration-500 group-hover:scale-110">
              <IconComponent className="w-9 h-9 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" strokeWidth={1.5} />
            </div>
          </div>
        )}
        
        {/* Premium Number */}
        <UniformText 
          parameterId="number" 
          placeholder="250+" 
          as="div"
          className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 group-hover:text-amber-100 transition-colors duration-300 leading-none"
          style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}
        />
        
        {/* Refined Label */}
        <UniformText 
          parameterId="label" 
          placeholder="Destinations" 
          as="div"
          className="text-base md:text-lg text-white/70 group-hover:text-white/90 transition-colors duration-300 font-light tracking-wide uppercase"
        />
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-linear-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/80 transition-all duration-500 rounded-full" />
      </div>
    </div>
  );
};

// UNIFORM REGISTRATION
registerUniformComponent({
  type: 'statItem',
  component: StatItem,
});

export default StatItem;
