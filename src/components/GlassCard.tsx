import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hover = false,
  glow = false,
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card relative overflow-hidden',
        hover && 'card-hover cursor-pointer',
        glow && 'glow-effect',
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
