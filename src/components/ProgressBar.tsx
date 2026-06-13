import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  color?: 'gold' | 'teal' | 'gray';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'gold',
  size = 'medium',
  showLabel = false,
  label
}) => {
  const colorClasses = {
    gold: 'bg-gradient-to-r from-gold-dark via-gold to-gold-light',
    teal: 'bg-gradient-to-r from-teal to-teal-light',
    gray: 'bg-text-secondary',
  };

  const sizeClasses = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3',
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-text-secondary">{label}</span>
          <span className="text-xs text-gold font-medium">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={cn(
        'w-full rounded-full bg-glass overflow-hidden',
        sizeClasses[size]
      )}>
        <div 
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
