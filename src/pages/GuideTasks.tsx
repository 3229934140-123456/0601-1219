import React, { useState, useEffect } from 'react';
import { Target, BookOpen, Calendar, Trophy, ChevronRight, X, Check, Clock, Star, MapPin, Navigation, Route, Flag, ArrowLeft, Award } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import ProgressBar from '@/components/ProgressBar';
import BadgeItem from '@/components/BadgeItem';
import { tasks, badges, getTaskById } from '@/data/tasks';
import { tourRoutes, getRouteById } from '@/data/routes';
import { getExhibitById, getExhibitsByHall } from '@/data/exhibits';
import { getHallById } from '@/data/halls';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

const GuideTasks: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeParam = searchParams.get('route');
  const { user, completeTask, unlockBadgeWithNotification, setCurrentRoute, advanceRouteProgress } = useAppStore();
  const [activeTab, setActiveTab] = useState<'main' | 'side' | 'daily'>('main');
  const [activeRouteTab, setActiveRouteTab] = useState<'tasks' | 'routes'>('tasks');
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [showRouteDetail, setShowRouteDetail] = useState(false);
  const [showRouteSummary, setShowRouteSummary] = useState(false);

  const currentRouteId = user.currentRouteId || routeParam;
  const currentRoute = currentRouteId ? getRouteById(currentRouteId) : null;
  const currentRouteProgress = Math.min(user.routeProgress, currentRoute?.exhibitIds.length ?? 0);

  useEffect(() => {
    if (routeParam && !user.currentRouteId) {
      setCurrentRoute(routeParam);
    }
  }, [routeParam, user.currentRouteId, setCurrentRoute]);

  const filteredTasks = tasks.filter(task => {
    if (task.type === 'main' && activeTab === 'main') return true;
    if (task.type === 'side' && activeTab === 'side') return true;
    if (task.type === 'daily' && activeTab === 'daily') return true;
    return false;
  }).map(task => ({
    ...task,
    isCompleted: user.completedTasks.includes(task.id),
  }));

  const completedCount = tasks.filter(t => user.completedTasks.includes(t.id)).length;
  const totalProgress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const unlockedBadges = badges.filter(b => user.unlockedBadges.includes(b.id));

  const routeTasks = currentRoute
    ? currentRoute.exhibitIds
        .map(exhibitId => tasks.find(t => t.exhibitId === exhibitId))
        .filter((t): t is Task => t !== undefined)
        .map(task => ({
          ...task,
          isCompleted: user.completedTasks.includes(task.id),
        }))
    : [];

  const isRouteCompleted = currentRoute
    ? currentRoute.exhibitIds.every(eid => {
        const task = tasks.find(t => t.exhibitId === eid);
        return task ? user.completedTasks.includes(task.id) : true;
      })
    : false;

  useEffect(() => {
    if (isRouteCompleted && currentRoute && !showRouteSummary) {
      setShowRouteSummary(true);
    }
  }, [isRouteCompleted, currentRoute]);

  const handleStartQuiz = (task: Task) => {
    if (user.completedTasks.includes(task.id)) return;
    setCurrentTask(task);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowQuiz(true);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentTask) return;
    
    const correct = selectedAnswer === currentTask.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      completeTask(currentTask.id);

      if (currentTask.badgeId) {
        const badge = badges.find(b => b.id === currentTask.badgeId);
        if (badge) {
          unlockBadgeWithNotification(currentTask.badgeId, badge.name, badge.icon);
          setNewBadge(currentTask.badgeId);
          setTimeout(() => {
            setShowBadgeModal(true);
          }, 1000);
        }
      }

      if (currentRoute && currentTask.exhibitId) {
        advanceRouteProgress(currentTask.exhibitId);
      }
    }
  };

  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    setShowRouteDetail(true);
  };

  const handleStartRoute = (routeId: string) => {
    setCurrentRoute(routeId);
    const route = getRouteById(routeId);
    if (route && route.hallIds.length > 0) {
      const firstHallId = route.hallIds[0];
      navigate(`/hall/${firstHallId}?fromRoute=${routeId}&step=1`);
    }
    setSelectedRouteId(null);
    setShowRouteDetail(false);
    setActiveRouteTab('tasks');
  };

  const handleContinueRoute = () => {
    if (!currentRoute) return;
    const nextIndex = currentRouteProgress;
    if (nextIndex < currentRoute.exhibitIds.length) {
      const nextExhibitId = currentRoute.exhibitIds[nextIndex];
      const nextExhibit = getExhibitById(nextExhibitId);
      if (nextExhibit) {
        navigate(`/exhibit/${nextExhibitId}?fromRoute=${currentRoute.id}&step=${nextIndex + 1}`);
      } else {
        const hallIndex = Math.min(nextIndex, currentRoute.hallIds.length - 1);
        const nextHallId = currentRoute.hallIds[hallIndex];
        navigate(`/hall/${nextHallId}?fromRoute=${currentRoute.id}&step=${nextIndex + 1}`);
      }
    }
  };

  const handleFinishRoute = () => {
    setShowRouteSummary(false);
    setCurrentRoute(null);
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setCurrentTask(null);
  };

  const tabs = [
    { id: 'main', label: '主线任务', icon: Target },
    { id: 'side', label: '支线任务', icon: BookOpen },
    { id: 'daily', label: '每日任务', icon: Calendar },
  ];

  if (showRouteSummary && currentRoute) {
    const completedTasksInRoute = routeTasks.filter(t => t.isCompleted);
    const earnedBadges = routeTasks
      .filter(t => t.isCompleted && t.badgeId)
      .map(t => badges.find(b => b.id === t.badgeId))
      .filter((b): b is typeof badges[0] => !!b);

    return (
      <div className="page-container">
        <div className="stars-bg opacity-30" />
        <div className="page-content flex flex-col items-center justify-center px-4 py-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-gold-dark p-1 mb-6 animate-pulse-glow">
            <div className="w-full h-full rounded-full bg-space-dark flex items-center justify-center">
              <Trophy size={40} className="text-gold" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gold-gradient mb-2">路线完成！</h2>
          <p className="text-lg font-semibold text-white mb-1">{currentRoute.name}</p>
          <p className="text-sm text-text-secondary mb-6">
            {currentRoute.description}
          </p>

          <GlassCard className="w-full p-4 mb-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Check size={16} className="text-teal" />
              完成统计
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-gold">{completedTasksInRoute.length}/{routeTasks.length}</p>
                <p className="text-[10px] text-text-muted">答题完成</p>
              </div>
              <div>
                <p className="text-xl font-bold text-teal">{currentRoute.hallIds.length}</p>
                <p className="text-[10px] text-text-muted">展厅探索</p>
              </div>
              <div>
                <p className="text-xl font-bold text-purple-400">{currentRoute.estimatedTime}′</p>
                <p className="text-[10px] text-text-muted">预计用时</p>
              </div>
            </div>
          </GlassCard>

          {earnedBadges.length > 0 && (
            <GlassCard className="w-full p-4 mb-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Award size={16} className="text-gold" />
                获得纪念章
              </h3>
              <div className="flex gap-3 justify-center">
                {earnedBadges.map(badge => (
                  <BadgeItem key={badge.id} badge={{ ...badge, isUnlocked: true }} size="small" />
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard className="w-full p-4 mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">路线足迹</h3>
            <div className="space-y-2">
              {currentRoute.exhibitIds.map((eid, idx) => {
                const exhibit = getExhibitById(eid);
                const task = routeTasks.find(t => t.exhibitId === eid);
                const done = task?.isCompleted ?? false;
                return (
                  <div key={eid} className="flex items-center gap-3 text-xs">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                      done ? 'bg-teal/20 text-teal' : 'bg-glass text-text-muted'
                    )}>
                      {done ? <Check size={12} /> : idx + 1}
                    </div>
                    <span className={cn('flex-1', done ? 'text-text-secondary' : 'text-text-muted')}>
                      {exhibit?.name ?? `展品 ${idx + 1}`}
                    </span>
                    {done && <span className="text-teal text-[10px]">已完成</span>}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <div className="w-full space-y-3">
            <button onClick={() => navigate('/camera')} className="btn-gold w-full flex items-center justify-center gap-2">
              📸 拍照留念
            </button>
            <button onClick={handleFinishRoute} className="btn-ghost w-full">
              返回任务中心
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="stars-bg opacity-30" />
      
      <header className="relative z-10 px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-gold-gradient text-center mb-4">
          导览任务
        </h1>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="text-gold" size={20} />
              <span className="text-sm font-medium text-white">探索进度</span>
            </div>
            <span className="text-sm text-gold font-bold">{completedCount}/{tasks.length}</span>
          </div>
          <ProgressBar progress={totalProgress} color="gold" />
          <p className="text-xs text-text-secondary mt-2 text-center">
            完成所有任务解锁传说纪念章
          </p>
        </GlassCard>

        {currentRoute && (
          <GlassCard className="p-4 mt-4 bg-gradient-to-r from-gold/10 to-teal/10 border-gold/30">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: `${currentRoute.color}20` }}
              >
                {currentRoute.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{currentRoute.name}</h3>
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full',
                    isRouteCompleted ? 'bg-teal/20 text-teal' : 'bg-gold/20 text-gold'
                  )}>
                    {isRouteCompleted ? '已完成' : '进行中'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  进度 {currentRouteProgress}/{currentRoute.exhibitIds.length} 项任务
                </p>
              </div>
              <button
                onClick={() => setCurrentRoute(null)}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px]"
              >
                结束
              </button>
            </div>
            <ProgressBar
              progress={(currentRouteProgress / currentRoute.exhibitIds.length) * 100}
              color="teal"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleContinueRoute}
                disabled={isRouteCompleted}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 text-sm py-2',
                  isRouteCompleted ? 'bg-glass text-text-muted cursor-not-allowed rounded-full' : 'btn-gold'
                )}
              >
                <Navigation size={14} />
                {isRouteCompleted ? '路线已完成' : '继续路线'}
              </button>
              <button
                onClick={() => setActiveRouteTab('tasks')}
                className="flex-1 btn-ghost flex items-center justify-center gap-2 text-sm py-2"
              >
                <Check size={14} />
                查看任务
              </button>
            </div>
          </GlassCard>
        )}
      </header>

      <div className="page-content">
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">纪念章收集</h2>
            <button 
              onClick={() => navigate('/backpack')}
              className="text-xs text-gold flex items-center gap-1"
            >
              全部
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {badges.slice(0, 6).map((badge) => (
              <BadgeItem 
                key={badge.id} 
                badge={{ ...badge, isUnlocked: user.unlockedBadges.includes(badge.id) }} 
                size="small"
              />
            ))}
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="flex gap-2 glass-card p-1">
            <button
              onClick={() => setActiveRouteTab('tasks')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all',
                activeRouteTab === 'tasks'
                  ? 'bg-gold text-space-dark'
                  : 'text-text-secondary hover:text-white'
              )}
            >
              <Target size={16} />
              任务中心
            </button>
            <button
              onClick={() => setActiveRouteTab('routes')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all',
                activeRouteTab === 'routes'
                  ? 'bg-gold text-space-dark'
                  : 'text-text-secondary hover:text-white'
              )}
            >
              <Route size={16} />
              主题路线
            </button>
          </div>
        </div>

        {activeRouteTab === 'tasks' ? (
          <>
            {currentRoute && routeTasks.length > 0 && (
              <div className="px-4 mb-6">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Flag size={16} style={{ color: currentRoute.color }} />
                  「{currentRoute.name}」路线站点
                </h2>
                <div className="space-y-2">
                  {currentRoute.exhibitIds.map((exhibitId, idx) => {
                    const exhibit = getExhibitById(exhibitId);
                    const task = routeTasks.find(t => t.exhibitId === exhibitId);
                    const hall = exhibit ? getHallById(exhibit.hallId) : null;
                    const isCompleted = task ? user.completedTasks.includes(task.id) : false;
                    const isCurrent = idx === currentRouteProgress;
                    return (
                      <GlassCard
                        key={exhibitId}
                        className={cn(
                          'p-3 transition-all',
                          isCompleted ? 'opacity-70' : isCurrent ? 'border-gold/40' : 'hover:border-gold/30'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
                            isCompleted ? 'bg-teal/20 text-teal' :
                            isCurrent ? 'bg-gold/20 text-gold' : 'bg-glass text-text-secondary'
                          )}>
                            {isCompleted ? <Check size={14} /> : idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className={cn(
                                'text-sm font-semibold',
                                isCompleted ? 'text-text-muted' : isCurrent ? 'text-gold' : 'text-white'
                              )}>
                                {exhibit?.name ?? `展品 ${idx + 1}`}
                              </h4>
                              {isCompleted && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal/20 text-teal">
                                  已完成
                                </span>
                              )}
                              {isCurrent && !isCompleted && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold">
                                  当前站
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-text-secondary">
                              {hall ? `🏛️ ${hall.name}` : ''}
                              {task?.question ? ' · 📝 有答题任务' : ''}
                            </p>
                          </div>
                          {!isCompleted && task?.question && (
                            <button
                              onClick={() => handleStartQuiz(task)}
                              className="text-[10px] px-2 py-1 rounded-full bg-gold/20 text-gold"
                            >
                              挑战
                            </button>
                          )}
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="px-4 mb-4">
              <div className="flex gap-2 glass-card p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'main' | 'side' | 'daily')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all',
                        isActive
                          ? 'bg-gold text-space-dark'
                          : 'text-text-secondary hover:text-white'
                      )}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-4 mb-8">
              <div className="space-y-3">
                {filteredTasks.map((task, index) => (
                  <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                    <GlassCard 
                      className={cn(
                        'p-4 transition-all',
                        task.isCompleted ? 'opacity-70' : 'hover:border-gold/30'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                          task.isCompleted 
                            ? 'bg-gold/20 text-gold' 
                            : 'bg-glass text-text-secondary'
                        )}>
                          {task.isCompleted ? (
                            <Check size={24} />
                          ) : (
                            <Star size={24} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={cn(
                              'font-semibold',
                              task.isCompleted ? 'text-text-muted' : 'text-white'
                            )}>
                              {task.title}
                            </h4>
                            {task.isCompleted && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal/20 text-teal">
                                已完成
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary mb-2 line-clamp-2">
                            {task.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gold">🎁 {task.reward}</span>
                            {!task.isCompleted && task.question && (
                              <button
                                onClick={() => handleStartQuiz(task)}
                                className="text-xs px-3 py-1.5 rounded-full bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
                              >
                                开始挑战
                              </button>
                            )}
                            {task.type === 'daily' && task.isCompleted && (
                              <span className="text-xs text-text-muted flex items-center gap-1">
                                <Clock size={12} />
                                明日刷新
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="px-4 mb-8">
            <h2 className="text-sm font-semibold text-white mb-3">选择主题路线</h2>
            <div className="space-y-3">
              {tourRoutes.map((route, index) => {
                const isCurrentRoute = user.currentRouteId === route.id;
                return (
                  <div key={route.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                    <GlassCard
                      hover
                      onClick={() => !isCurrentRoute && handleSelectRoute(route.id)}
                      className={cn(
                        'p-4 transition-all',
                        isCurrentRoute && 'opacity-60'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
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
                            {isCurrentRoute && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal/20 text-teal">
                                进行中
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary line-clamp-1 mb-2">
                            {route.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-text-muted">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {route.estimatedTime}分钟
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {route.hallIds.length}个展厅
                            </span>
                            <span>
                              {route.exhibitIds.length}件展品
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 路线详情弹窗 */}
      {showRouteDetail && selectedRouteId && (() => {
        const route = getRouteById(selectedRouteId);
        if (!route) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRouteDetail(false)} />
            <GlassCard className="relative w-full max-w-md max-h-[85vh] overflow-y-auto p-0 animate-slide-up">
              <div className="relative h-40 overflow-hidden rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${route.color}40, ${route.color}10)` }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">{route.icon}</span>
                </div>
                <button onClick={() => setShowRouteDetail(false)} className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1">{route.name}</h3>
                <p className="text-sm text-text-secondary mb-3">{route.description}</p>
                <div className="flex gap-4 text-xs text-text-muted mb-4">
                  <span className="flex items-center gap-1"><Clock size={12} />{route.estimatedTime}分钟</span>
                  <span className="flex items-center gap-1"><MapPin size={12} />{route.hallIds.length}个展厅</span>
                  <span>{route.exhibitIds.length}件展品</span>
                </div>

                <h4 className="text-sm font-semibold text-white mb-2">路线站点</h4>
                <div className="space-y-2 mb-5">
                  {route.exhibitIds.map((eid, idx) => {
                    const exhibit = getExhibitById(eid);
                    const hall = exhibit ? getHallById(exhibit.hallId) : null;
                    const task = tasks.find(t => t.exhibitId === eid);
                    const isCompleted = task ? user.completedTasks.includes(task.id) : false;
                    return (
                      <div key={eid} className="flex items-center gap-3 p-2 rounded-lg bg-glass">
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                          isCompleted ? 'bg-teal/20 text-teal' : 'bg-glass-border text-text-secondary'
                        )}>
                          {isCompleted ? <Check size={12} /> : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white">{exhibit?.name ?? `展品 ${idx + 1}`}</p>
                          <p className="text-[10px] text-text-muted">
                            {hall?.name ?? ''}
                            {task?.question ? ' · 📝 答题挑战' : ''}
                          </p>
                        </div>
                        {isCompleted && <span className="text-[10px] text-teal">✓</span>}
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => handleStartRoute(selectedRouteId)} className="btn-gold w-full flex items-center justify-center gap-2">
                  <Navigation size={16} />
                  开始这条路线
                </button>
              </div>
            </GlassCard>
          </div>
        );
      })()}

      {/* 答题弹窗 */}
      {showQuiz && currentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeQuiz}
          />
          <GlassCard className="relative w-full max-w-md p-6 animate-slide-up">
            <button 
              onClick={closeQuiz}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gold/20 flex items-center justify-center">
                <BookOpen size={28} className="text-gold" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{currentTask.title}</h3>
              <p className="text-sm text-text-secondary">答对即可获得奖励</p>
            </div>

            <div className="mb-6">
              <p className="text-base text-white font-medium mb-4 text-center">
                {currentTask.question}
              </p>
              <div className="space-y-2">
                {currentTask.options?.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = index === currentTask.correctAnswer;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !showResult && setSelectedAnswer(index)}
                      disabled={showResult}
                      className={cn(
                        'w-full p-3 rounded-xl text-left transition-all',
                        showResult
                          ? isCorrectAnswer
                            ? 'bg-teal/20 border border-teal text-teal'
                            : isSelected
                              ? 'bg-red-500/20 border border-red-500 text-red-400'
                              : 'bg-glass border border-glass-border text-text-secondary'
                          : isSelected
                            ? 'bg-gold/20 border border-gold text-gold'
                            : 'bg-glass border border-glass-border text-white hover:border-gold/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-glass flex items-center justify-center text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-sm">{option}</span>
                        {showResult && isCorrectAnswer && (
                          <Check size={16} className="ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {showResult ? (
              <div className="text-center">
                <p className={cn(
                  'text-lg font-bold mb-4',
                  isCorrect ? 'text-teal' : 'text-red-400'
                )}>
                  {isCorrect ? '🎉 回答正确！' : '😢 回答错误'}
                </p>
                <button
                  onClick={closeQuiz}
                  className="btn-gold w-full"
                >
                  {isCorrect ? '领取奖励' : '再试一次'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={cn(
                  'w-full py-3 rounded-full font-semibold transition-all',
                  selectedAnswer !== null
                    ? 'btn-gold'
                    : 'bg-glass text-text-muted cursor-not-allowed'
                )}
              >
                提交答案
              </button>
            )}
          </GlassCard>
        </div>
      )}

      {/* 获得纪念章弹窗 */}
      {showBadgeModal && newBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowBadgeModal(false)}
          />
          <div className="relative text-center animate-bounce-in">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold-dark p-1 animate-pulse-glow">
              <div className="w-full h-full rounded-full bg-space-dark flex items-center justify-center">
                <span className="text-6xl">
                  {badges.find(b => b.id === newBadge)?.icon}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gold-gradient mb-2">恭喜获得</h3>
            <p className="text-xl font-bold text-white mb-1">
              {badges.find(b => b.id === newBadge)?.name}
            </p>
            <p className="text-sm text-text-secondary mb-6">
              {badges.find(b => b.id === newBadge)?.description}
            </p>
            <button
              onClick={() => setShowBadgeModal(false)}
              className="btn-gold px-8"
            >
              太棒了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideTasks;
