import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Badge } from '@/types';
import GlassCard from './GlassCard';

interface BadgeItemProps {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

const rarityBorders = {
  common: 'border-gray-500/50',
  rare: 'border-blue-500/50',
  epic: 'border-purple-500/50',
  legendary: 'border-yellow-500/50',
};

const rarityNames = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

const BadgeItem: React.FC<BadgeItemProps> = ({ badge, size = 'medium', showName = true }) => {
  const sizeClasses = {
    small: 'w-12 h-12 text-2xl',
    medium: 'w-16 h-16 text-3xl',
    large: 'w-24 h-24 text-5xl',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <GlassCard 
        className={cn(
          'flex items-center justify-center rounded-full border-2',
          sizeClasses[size],
          rarityBorders[badge.rarity],
          badge.isUnlocked ? 'bg-gradient-to-br ' + rarityColors[badge.rarity] + ' bg-opacity-20' : 'bg-space-light/50'
        )}
      >
        {badge.isUnlocked ? (
          <span className={badge.rarity === 'legendary' ? 'animate-pulse-glow' : ''}>
            {badge.icon}
          </span>
        ) : (
          <Lock size={size === 'large' ? 28 : size === 'medium' ? 20 : 16} className="text-text-muted" />
        )}
      </GlassCard>
      {showName && (
        <div className="text-center">
          <p className={cn(
            'text-sm font-medium',
            badge.isUnlocked ? 'text-white' : 'text-text-muted'
          )}>
            {badge.name}
          </p>
          <p className="text-xs text-text-muted">
            {rarityNames[badge.rarity]}
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgeItem;
