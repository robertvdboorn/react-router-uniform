import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import {
  ShieldCheckIcon,
  CreditCardIcon,
  ClockIcon,
  HeartIcon,
  StarIcon,
  GlobeAltIcon,
  BoltIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  shield: ShieldCheckIcon,
  card: CreditCardIcon,
  clock: ClockIcon,
  heart: HeartIcon,
  star: StarIcon,
  globe: GlobeAltIcon,
  bolt: BoltIcon,
  check: CheckBadgeIcon,
};

const colorMap = {
  amber: { bg: 'from-amber-500 to-amber-700', icon: 'text-white' },
  slate: { bg: 'from-slate-600 to-slate-800', icon: 'text-white' },
  emerald: { bg: 'from-emerald-500 to-emerald-700', icon: 'text-white' },
  blue: { bg: 'from-blue-500 to-blue-700', icon: 'text-white' },
  purple: { bg: 'from-purple-500 to-purple-700', icon: 'text-white' },
  rose: { bg: 'from-rose-500 to-rose-700', icon: 'text-white' },
};

export type TrustBadgeProps = ComponentProps<{
  icon?: string;
  color?: string;
  title?: string;
  description?: string;
  className?: string;
}>;

/**
 * Premium TrustBadge Component
 * 
 * Luxury trust indicator with elegant styling and refined design.
 * Features premium gradients and sophisticated hover effects.
 */
export const TrustBadge: React.FC<TrustBadgeProps> = ({
  icon,
  color = 'amber',
  className = '',
}) => {
  const IconComponent = icon ? iconMap[icon as keyof typeof iconMap] : ShieldCheckIcon;
  const colors = colorMap[color as keyof typeof colorMap] || colorMap.amber;

  return (
    <div className={`group flex flex-col items-center text-center ${className}`}>
      <div className={`relative mb-6`}>
        {/* Icon glow */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-400/30 to-amber-600/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
        
        {/* Icon container */}
        <div className={`relative w-16 h-16 bg-linear-to-br ${colors.bg} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300`}>
          <IconComponent className={`w-9 h-9 ${colors.icon}`} strokeWidth={1.5} />
        </div>
      </div>
      
      <UniformText 
        parameterId="title" 
        placeholder="Add badge title" 
        as="h3"
        className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-amber-800 transition-colors"
      />
      
      <UniformText 
        parameterId="description" 
        placeholder="Add badge description" 
        as="p"
        className="text-sm text-slate-600 font-light"
      />
    </div>
  );
};

registerUniformComponent({
  type: 'trustBadge',
  component: TrustBadge,
});

export default TrustBadge;

