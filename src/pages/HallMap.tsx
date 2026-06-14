import React, { useState } from 'react';
import { MapPin, Navigation, Layers, Search, ChevronDown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { halls, hallCategories } from '@/data/halls';
import { getExhibitsByHall } from '@/data/exhibits';
import { cn } from '@/lib/utils';

const HallMap: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedHallId = searchParams.get('hall');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoute, setShowRoute] = useState(false);

  const filteredHalls = halls.filter(hall => {
    const matchCategory = selectedCategory === 'all' || hall.category === selectedCategory;
    const matchSearch = hall.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleHallClick = (hallId: string) => {
    navigate(`/map?hall=${hallId}`);
  };

  const handleEnterHall = (hallId: string) => {
    const hallExhibits = getExhibitsByHall(hallId);
    if (hallExhibits.length > 0) {
      navigate(`/exhibit/${hallExhibits[0].id}?hall=${hallId}`);
    } else {
      navigate(`/exhibit/exhibit-1?hall=${hallId}`);
    }
  };

  return (
    <div className="page-container">
      <div className="stars-bg opacity-50" />
      
      {/* 顶部栏 */}
      <header className="relative z-10 px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-gold-gradient text-center mb-4">
          展厅地图
        </h1>
        
        {/* 搜索栏 */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="搜索展厅或展品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-11 pr-4 rounded-full bg-glass border border-glass-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </header>

      <div className="page-content">
        {/* 分类标签 */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {hallCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 transition-all',
                  selectedCategory === cat.id
                    ? 'bg-gold text-space-dark'
                    : 'bg-glass text-text-secondary hover:bg-glass-border'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 地图视图 */}
        <div className="px-4 mb-6">
          <GlassCard className="relative h-64 overflow-hidden">
            {/* 地图背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-space-medium to-space-dark">
              {/* 网格线 */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              />
              
              {/* 展厅位置标记 */}
              {halls.map((hall) => (
                <button
                  key={hall.id}
                  onClick={() => handleHallClick(hall.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${hall.position.x}%`, top: `${hall.position.y}%` }}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                    selectedHallId === hall.id
                      ? 'bg-gold text-space-dark scale-125 shadow-glow-gold'
                      : 'bg-glass border border-gold/30 text-gold hover:bg-gold/20'
                  )}>
                    <MapPin size={18} />
                  </div>
                  <div className={cn(
                    'absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-xs font-medium transition-opacity',
                    selectedHallId === hall.id ? 'text-gold opacity-100' : 'text-text-secondary opacity-0 group-hover:opacity-100'
                  )}>
                    {hall.name}
                  </div>
                  {hall.isNew && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      新
                    </span>
                  )}
                </button>
              ))}

              {/* 当前位置 */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-teal rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-teal rounded-full animate-ping opacity-50" />
                </div>
                <p className="text-xs text-teal text-center mt-1">我的位置</p>
              </div>

              {/* 导航路线（动画） */}
              {showRoute && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 50% 85% Q 35% 60% 25% 30%"
                    stroke="#00D4AA"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10 5"
                    className="animate-pulse"
                  />
                </svg>
              )}
            </div>

            {/* 图层控制 */}
            <button className="absolute top-3 right-3 p-2 rounded-lg bg-glass backdrop-blur-md text-text-secondary hover:text-white transition-colors">
              <Layers size={18} />
            </button>
          </GlassCard>
        </div>

        {/* 导航控制 */}
        <div className="px-4 mb-6">
          <div className="flex gap-3">
            <button 
              onClick={() => setShowRoute(!showRoute)}
              className={cn(
                'flex-1 btn-ghost flex items-center justify-center gap-2',
                showRoute && 'bg-gold/20 border-gold/50 text-gold'
              )}
            >
              <Navigation size={16} />
              开始导航
            </button>
            <button className="flex-1 btn-ghost flex items-center justify-center gap-2">
              <ChevronDown size={16} />
              路线规划
            </button>
          </div>
        </div>

        {/* 展厅列表 */}
        <div className="px-4 mb-8">
          <h2 className="text-base font-semibold text-white mb-3">
            全部展厅 ({filteredHalls.length})
          </h2>
          <div className="space-y-3">
            {filteredHalls.map((hall, index) => (
              <div key={hall.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                <GlassCard 
                  hover 
                  onClick={() => handleEnterHall(hall.id)}
                  className="flex gap-4 p-3"
                >
                  <img 
                    src={hall.coverImage} 
                    alt={hall.name}
                    className="w-24 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{hall.name}</h4>
                      {hall.isNew && (
                        <span className="text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gold mb-1">{hall.theme}</p>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                      {hall.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span>🎨 {hall.exhibitCount} 件展品</span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallMap;
