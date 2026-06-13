import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, ZoomIn, RotateCw, Volume2, Subtitles, MessageCircle, Bookmark } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExhibitById, getExhibitsByHall } from '@/data/exhibits';
import AudioPlayer from '@/components/AudioPlayer';
import GlassCard from '@/components/GlassCard';
import ExhibitCard from '@/components/ExhibitCard';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const ExhibitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, toggleCollect, updateSettings } = useAppStore();
  const [isZoomed, setIsZoomed] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(user.settings.subtitleEnabled);
  const [activeTab, setActiveTab] = useState<'detail' | 'related'>('detail');
  const [rotation, setRotation] = useState(0);

  const exhibit = getExhibitById(id || 'exhibit-1');
  const relatedExhibits = exhibit 
    ? getExhibitsByHall(exhibit.hallId).filter(e => e.id !== exhibit.id).slice(0, 3)
    : [];

  const isCollected = exhibit ? user.collectedExhibits.includes(exhibit.id) : false;

  if (!exhibit) {
    return (
      <div className="page-container flex items-center justify-center">
        <p className="text-text-secondary">展品不存在</p>
      </div>
    );
  }

  const handleRotate = () => {
    setRotation(prev => prev + 90);
  };

  const toggleSubtitles = () => {
    const newValue = !showSubtitles;
    setShowSubtitles(newValue);
    updateSettings({ subtitleEnabled: newValue });
  };

  return (
    <div className="page-container">
      {/* 顶部栏 */}
      <header className="absolute top-0 left-0 right-0 z-20 px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSubtitles}
              className={cn(
                'w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors',
                showSubtitles ? 'bg-gold text-space-dark' : 'bg-black/30 text-white'
              )}
            >
              <Subtitles size={18} />
            </button>
            <button 
              onClick={() => toggleCollect(exhibit.id)}
              className={cn(
                'w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors',
                isCollected ? 'bg-gold text-space-dark' : 'bg-black/30 text-white'
              )}
            >
              <Heart size={18} fill={isCollected ? 'currentColor' : 'none'} />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="page-content">
        {/* 展品图片区 */}
        <div className={`relative h-96 transition-transform duration-500 ${isZoomed ? 'h-screen' : ''}`}>
          <img 
            src={exhibit.image} 
            alt={exhibit.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isZoomed ? 'object-contain bg-space-dark' : ''}`}
            style={{ transform: `rotate(${rotation}deg) scale(${isZoomed ? 1.5 : 1})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent" />
          
          {/* 放大/旋转控制 */}
          <div className="absolute bottom-24 right-4 flex flex-col gap-3">
            <button 
              onClick={() => setIsZoomed(!isZoomed)}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white"
            >
              <ZoomIn size={18} />
            </button>
            <button 
              onClick={handleRotate}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white"
            >
              <RotateCw size={18} />
            </button>
          </div>

          {/* 无障碍字幕 */}
          {showSubtitles && (
            <div className="absolute bottom-4 left-4 right-4">
              <GlassCard className="p-3">
                <p className="text-sm text-white leading-relaxed">
                  {exhibit.subtitle}
                </p>
              </GlassCard>
            </div>
          )}
        </div>

        {/* 展品信息 */}
        <div className="px-4 -mt-8 relative z-10">
          <GlassCard className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs px-2 py-1 rounded-full bg-gold/20 text-gold mb-2 inline-block">
                  {exhibit.category}
                </span>
                <h1 className="text-xl font-bold text-white font-display">
                  {exhibit.name}
                </h1>
              </div>
              <button className="p-2 rounded-full bg-glass text-gold">
                <Bookmark size={20} />
              </button>
            </div>

            {/* 基本信息 */}
            <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-glass-border">
              <div className="text-center">
                <p className="text-xs text-text-secondary mb-1">年代</p>
                <p className="text-sm text-white font-medium">{exhibit.era}</p>
              </div>
              <div className="text-center border-x border-glass-border">
                <p className="text-xs text-text-secondary mb-1">材质</p>
                <p className="text-sm text-white font-medium">{exhibit.material}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-secondary mb-1">尺寸</p>
                <p className="text-xs text-white font-medium line-clamp-2">{exhibit.size}</p>
              </div>
            </div>

            {/* 语音导览 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 size={16} className="text-gold" />
                <span className="text-sm font-medium text-white">语音导览</span>
              </div>
              <AudioPlayer 
                exhibitId={exhibit.id}
                duration={exhibit.audioDuration}
              />
            </div>

            {/* 详情/相关 Tab */}
            <div className="flex gap-4 border-b border-glass-border mb-4">
              <button
                onClick={() => setActiveTab('detail')}
                className={cn(
                  'pb-2 text-sm font-medium transition-colors relative',
                  activeTab === 'detail' ? 'text-gold' : 'text-text-secondary'
                )}
              >
                展品介绍
                {activeTab === 'detail' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('related')}
                className={cn(
                  'pb-2 text-sm font-medium transition-colors relative',
                  activeTab === 'related' ? 'text-gold' : 'text-text-secondary'
                )}
              >
                相关展品
                {activeTab === 'related' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
                )}
              </button>
            </div>

            {/* Tab 内容 */}
            {activeTab === 'detail' && (
              <div className="text-sm text-text-secondary leading-relaxed">
                <p className="mb-3">{exhibit.description}</p>
                <p className="text-text-muted text-xs">
                  点击放大按钮可查看展品细节，支持双指缩放操作。
                </p>
              </div>
            )}

            {activeTab === 'related' && (
              <div className="grid grid-cols-2 gap-3">
                {relatedExhibits.map(related => (
                  <ExhibitCard key={related.id} exhibit={related} />
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* 操作按钮 */}
        <div className="px-4 py-6">
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/tasks')}
              className="flex-1 btn-ghost flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} />
              答题挑战
            </button>
            <button className="flex-1 btn-gold flex items-center justify-center gap-2">
              <Volume2 size={16} />
              开始导览
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitDetail;
