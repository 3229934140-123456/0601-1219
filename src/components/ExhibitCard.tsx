import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Exhibit } from '@/types';
import GlassCard from './GlassCard';
import { useAppStore } from '@/store/useAppStore';

interface ExhibitCardProps {
  exhibit: Exhibit;
  layout?: 'vertical' | 'horizontal';
}

const ExhibitCard: React.FC<ExhibitCardProps> = ({ exhibit, layout = 'vertical' }) => {
  const navigate = useNavigate();
  const { user, toggleCollect } = useAppStore();
  const isCollected = user.collectedExhibits.includes(exhibit.id);

  const handleClick = () => {
    navigate(`/exhibit/${exhibit.id}`);
  };

  const handleCollect = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCollect(exhibit.id);
  };

  if (layout === 'horizontal') {
    return (
      <GlassCard hover onClick={handleClick} className="flex gap-3 p-3">
        <img 
          src={exhibit.image} 
          alt={exhibit.name}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-white text-sm truncate">{exhibit.name}</h4>
            <button 
              onClick={handleCollect}
              className={cn(
                'flex-shrink-0 p-1.5 rounded-full transition-colors',
                isCollected ? 'text-gold bg-gold/10' : 'text-text-secondary hover:text-gold'
              )}
            >
              <Heart size={16} fill={isCollected ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="text-xs text-text-secondary mt-1">{exhibit.era} · {exhibit.category}</p>
          <p className="text-xs text-text-muted mt-2 line-clamp-2">{exhibit.subtitle}</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard hover onClick={handleClick} className="flex flex-col">
      <div className="relative">
        <img 
          src={exhibit.image} 
          alt={exhibit.name}
          className="w-full h-36 object-cover rounded-t-2xl"
        />
        <button 
          onClick={handleCollect}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all',
            isCollected 
              ? 'bg-gold/90 text-space-dark' 
              : 'bg-black/30 text-white hover:bg-gold/90 hover:text-space-dark'
          )}
        >
          <Heart size={16} fill={isCollected ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-white text-sm">{exhibit.name}</h4>
        <p className="text-xs text-text-secondary mt-1">{exhibit.era}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-glass text-gold-light">
            {exhibit.category}
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

export default ExhibitCard;
