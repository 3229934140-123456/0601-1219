import React from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Hall } from '@/types';
import GlassCard from './GlassCard';

interface HallCardProps {
  hall: Hall;
  size?: 'small' | 'large';
}

const HallCard: React.FC<HallCardProps> = ({ hall, size = 'small' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/hall/${hall.id}`);
  };

  return (
    <GlassCard 
      hover 
      onClick={handleClick}
      className={`${size === 'large' ? 'h-48' : 'h-40'}`}
    >
      <div className="relative h-full w-full">
        <img 
          src={hall.coverImage} 
          alt={hall.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-space-dark/40 to-transparent" />
        {hall.isNew && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-gold/90 text-space-dark text-xs font-bold px-2 py-1 rounded-full">
            <Sparkles size={12} />
            新展
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-xs text-gold font-medium mb-1">{hall.theme}</div>
          <h3 className="text-lg font-bold text-white mb-1">{hall.name}</h3>
          <div className="text-xs text-text-secondary">
            {hall.exhibitCount} 件展品
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default HallCard;
