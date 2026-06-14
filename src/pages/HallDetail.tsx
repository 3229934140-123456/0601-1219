import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Sparkles, Eye, Share2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { getHallById } from '@/data/halls';
import { getExhibitsByHall } from '@/data/exhibits';
import { getRoutesByHall } from '@/data/routes';
import { cn } from '@/lib/utils';

const HallDetail: React.FC = () => {
  const navigate = useNavigate();
  const { hallId } = useParams<{ hallId: string }>();
  const [searchParams] = useSearchParams();
  const fromRoute = searchParams.get('fromRoute');
  const routeStep = searchParams.get('step');

  const hall = getHallById(hallId || '');
  const exhibits = getExhibitsByHall(hallId || '');
  const relatedRoutes = getRoutesByHall(hallId || '');

  if (!hall) {
    return (
      <div className="page-container flex items-center justify-center">
        <p className="text-text-secondary">展厅不存在</p>
      </div>
    );
  }

  const hasExhibits = exhibits.length > 0;

  return (
    <div className="page-container">
      <div className="stars-bg opacity-50" />

      {/* 顶部封面 */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={hall.coverImage}
          alt={hall.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-space-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-space-dark/80 via-transparent to-transparent" />
        
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* 分享按钮 */}
        <button className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors">
          <Share2 size={20} />
        </button>

        {/* 展厅信息 */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-medium">
              {hall.theme}
            </span>
            {hall.isNew && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/80 text-white text-xs font-medium">
                新开展厅
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{hall.name}</h1>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {hall.exhibitCount} 件展品
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              约 {Math.max(hall.exhibitCount * 3, 10)} 分钟
            </span>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* 路线进度提示 */}
        {fromRoute && routeStep && (
          <div className="px-4 mb-4">
            <GlassCard className="bg-teal/10 border-teal/30 p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center">
                  <Sparkles size={20} className="text-teal" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-teal font-medium">主题路线进行中</p>
                  <p className="text-xs text-text-secondary">当前第 {routeStep} 站：{hall.name}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* 展厅介绍 */}
        <div className="px-4 mb-6">
          <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Eye size={18} className="text-gold" />
            展厅介绍
          </h2>
          <GlassCard className="p-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              {hall.description}
            </p>
          </GlassCard>
        </div>

        {/* 展品列表 */}
        {hasExhibits ? (
          <div className="px-4 mb-6">
            <h2 className="text-base font-semibold text-white mb-3">
              热门展品 ({exhibits.length})
            </h2>
            <div className="space-y-3">
              {exhibits.map((exhibit, index) => (
                <GlassCard
                  key={exhibit.id}
                  hover
                  onClick={() => navigate(`/exhibit/${exhibit.id}?hall=${hall.id}${fromRoute ? `&fromRoute=${fromRoute}&step=${routeStep}` : ''}`)}
                  className="flex gap-4 p-3"
                >
                  <div className="relative">
                    <img
                      src={exhibit.image}
                      alt={exhibit.name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-gold text-space-dark text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1">{exhibit.name}</h3>
                    <p className="text-xs text-gold mb-1">{exhibit.era}</p>
                    <p className="text-xs text-text-secondary line-clamp-1">
                      {exhibit.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-glass text-text-muted">
                        {exhibit.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-glass text-text-muted">
                        {exhibit.audioDuration}′ 语音
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 mb-6">
            <h2 className="text-base font-semibold text-white mb-3">
              展品展区
            </h2>
            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <Sparkles size={32} className="text-gold" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">精彩即将呈现</h3>
              <p className="text-sm text-text-secondary mb-4">
                {hall.name}正在紧张布展中，
                <br />一批来自未来的数字艺术作品即将与您见面！
              </p>
              <div className="space-y-2 text-xs text-text-muted">
                <p className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                  VR 沉浸式体验区
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: '0.3s' }} />
                  AI 互动艺术装置
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.6s' }} />
                  元宇宙概念展
                </p>
              </div>
              <button
                onClick={() => navigate('/map')}
                className="mt-6 btn-gold w-full"
              >
                探索其他展厅
              </button>
            </GlassCard>
          </div>
        )}

        {/* 相关主题路线 */}
        {relatedRoutes.length > 0 && (
          <div className="px-4 mb-8">
            <h2 className="text-base font-semibold text-white mb-3">
              相关主题路线
            </h2>
            <div className="space-y-3">
              {relatedRoutes.map((route) => (
                <GlassCard
                  key={route.id}
                  hover
                  onClick={() => navigate(`/tasks?route=${route.id}`)}
                  className="p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${route.color}20` }}
                    >
                      {route.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{route.name}</h3>
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-full',
                          route.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          route.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        )}>
                          {route.difficulty === 'easy' ? '轻松' : route.difficulty === 'medium' ? '适中' : '挑战'}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-1 mb-2">
                        {route.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {route.estimatedTime} 分钟
                        </span>
                        <span>
                          {route.exhibitIds.length} 件展品
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HallDetail;
