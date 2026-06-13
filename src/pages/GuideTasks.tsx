import React, { useState } from 'react';
import { Target, BookOpen, Calendar, Trophy, ChevronRight, X, Check, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import ProgressBar from '@/components/ProgressBar';
import BadgeItem from '@/components/BadgeItem';
import { tasks, badges } from '@/data/tasks';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

const GuideTasks: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeTask, unlockBadge } = useAppStore();
  const [activeTab, setActiveTab] = useState<'main' | 'side' | 'daily'>('main');
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

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
      completeTask(currentTask.id, currentTask.badgeId);
      if (currentTask.badgeId) {
        setNewBadge(currentTask.badgeId);
        setTimeout(() => {
          setShowBadgeModal(true);
        }, 1000);
      }
    }
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

  return (
    <div className="page-container">
      <div className="stars-bg opacity-30" />
      
      {/* 顶部栏 */}
      <header className="relative z-10 px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-gold-gradient text-center mb-4">
          导览任务
        </h1>
        
        {/* 总进度 */}
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
      </header>

      <div className="page-content">
        {/* 纪念章收集 */}
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

        {/* 任务分类 Tab */}
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

        {/* 任务列表 */}
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
      </div>

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
