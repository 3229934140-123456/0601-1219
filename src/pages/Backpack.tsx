import React, { useState } from 'react';
import { 
  Heart, Trophy, Clock, Calendar, Settings, ChevronRight, X, 
  Volume2, Subtitles, Bell, HelpCircle, Info, LogOut,
  Send, Star, User, Edit3, Check, MessageSquare
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import BadgeItem from '@/components/BadgeItem';
import ExhibitCard from '@/components/ExhibitCard';
import { exhibits } from '@/data/exhibits';
import { badges } from '@/data/tasks';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const Backpack: React.FC = () => {
  const { user, updateSettings, addReservation, addFeedback, setNickname } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'collection' | 'badges' | 'records' | 'settings'>('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [showFeedbackList, setShowFeedbackList] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackDesc, setFeedbackDesc] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [tempNickname, setTempNickname] = useState(user.nickname);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const collectedExhibits = exhibits.filter(e => user.collectedExhibits.includes(e.id));
  const userBadges = badges.map(b => ({
    ...b,
    isUnlocked: user.unlockedBadges.includes(b.id)
  }));

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2500);
  };

  const handleSaveNickname = () => {
    setNickname(tempNickname);
    setEditingName(false);
    showToast('昵称修改成功');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackType || !feedbackDesc.trim()) {
      showToast('请填写反馈类型和描述', 'error');
      return;
    }
    const typeLabel = feedbackTypes.find(t => t.id === feedbackType)?.label || feedbackType;
    addFeedback({
      type: typeLabel,
      description: feedbackDesc.trim(),
    });
    setShowFeedback(false);
    setFeedbackType('');
    setFeedbackDesc('');
    showToast('反馈提交成功，我们会尽快处理');
  };

  const handleReservation = () => {
    if (!selectedDate || !selectedTime) {
      showToast('请选择日期和时间', 'error');
      return;
    }
    addReservation({
      type: 'offline_guide',
      date: selectedDate,
      time: selectedTime,
    });
    setShowReservation(false);
    setSelectedDate('');
    setSelectedTime('');
    showToast('预约提交成功，等待确认');
  };

  const menuItems = [
    { id: 'collection', label: '我的收藏', icon: Heart, count: user.collectedExhibits.length, color: 'text-red-400' },
    { id: 'badges', label: '纪念章册', icon: Trophy, count: user.unlockedBadges.length, color: 'text-gold' },
    { id: 'records', label: '参观记录', icon: Clock, count: user.visitCount, color: 'text-teal' },
  ];

  const settingsItems = [
    { id: 'sound', label: '音效开关', icon: Volume2, type: 'toggle', value: user.settings.soundEnabled },
    { id: 'subtitle', label: '无障碍字幕', icon: Subtitles, type: 'toggle', value: user.settings.subtitleEnabled },
    { id: 'notification', label: '消息通知', icon: Bell, type: 'toggle', value: true },
  ];

  const feedbackTypes = [
    { id: 'exhibit', label: '展品问题' },
    { id: 'audio', label: '语音导览' },
    { id: 'bug', label: '功能异常' },
    { id: 'suggest', label: '意见建议' },
    { id: 'other', label: '其他问题' },
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  return (
    <div className="page-container">
      <div className="stars-bg opacity-30" />
      
      {/* 顶部栏 */}
      <header className="relative z-10 px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gold-gradient">个人背包</h1>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-text-secondary hover:text-white transition-colors"
          >
            <Settings size={22} />
          </button>
        </div>

        {/* 用户信息卡片 */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark p-0.5">
              <img 
                src={user.avatar} 
                alt="avatar" 
                className="w-full h-full rounded-full bg-space-dark object-cover"
              />
            </div>
            <div className="flex-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempNickname}
                    onChange={(e) => setTempNickname(e.target.value)}
                    className="flex-1 bg-glass border border-glass-border rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-gold/50"
                    autoFocus
                  />
                  <button onClick={handleSaveNickname} className="text-gold">
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{user.nickname}</h2>
                  <button 
                    onClick={() => { setTempNickname(user.nickname); setEditingName(true); }}
                    className="text-text-secondary hover:text-gold"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold">
                  Lv.{Math.floor(user.visitDuration / 1800) + 1}
                </span>
                <span className="text-xs text-text-secondary">
                  探索者
                </span>
              </div>
            </div>
          </div>

          {/* 数据统计 */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-glass-border">
            <div className="text-center">
              <p className="text-lg font-bold text-gold">{user.visitCount}</p>
              <p className="text-xs text-text-secondary">参观次数</p>
            </div>
            <div className="text-center border-x border-glass-border">
              <p className="text-lg font-bold text-teal">{formatDuration(user.visitDuration)}</p>
              <p className="text-xs text-text-secondary">累计时长</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gold-light">{user.unlockedBadges.length}</p>
              <p className="text-xs text-text-secondary">纪念章</p>
            </div>
          </div>
        </GlassCard>
      </header>

      <div className="page-content">
        {activeTab === 'overview' && (
          <div className="px-4">
            {/* 功能入口 */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className="glass-card p-4 flex flex-col items-center gap-2 hover:border-gold/30 transition-colors"
                  >
                    <div className={cn('p-2 rounded-xl bg-glass', item.color)}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs text-white font-medium">{item.label}</span>
                    <span className={cn('text-xs', item.color)}>{item.count}</span>
                  </button>
                );
              })}
            </div>

            {/* 预约管理 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Calendar size={18} className="text-gold" />
                  预约管理
                </h3>
                <button 
                  onClick={() => setShowReservation(true)}
                  className="text-xs text-gold"
                >
                  + 新预约
                </button>
              </div>
              {user.reservations.length > 0 ? (
                <div className="space-y-2">
                  {user.reservations.map((res) => (
                    <GlassCard key={res.id} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">线下讲解服务</span>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          res.status === 'confirmed' ? 'bg-teal/20 text-teal' :
                          res.status === 'pending' ? 'bg-gold/20 text-gold' :
                          'bg-text-muted/20 text-text-muted'
                        )}>
                          {res.status === 'confirmed' ? '已确认' : 
                           res.status === 'pending' ? '待确认' :
                           res.status === 'completed' ? '已完成' : '已取消'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span>📅 {res.date}</span>
                        <span>⏰ {res.time}</span>
                      </div>
                      {res.guideName && (
                        <p className="text-xs text-text-muted mt-2">讲解员：{res.guideName}</p>
                      )}
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <GlassCard className="p-6 text-center">
                  <Calendar size={32} className="mx-auto text-text-muted mb-2" />
                  <p className="text-sm text-text-secondary">暂无预约</p>
                  <p className="text-xs text-text-muted mt-1">预约线下讲解，获得更专业的导览体验</p>
                </GlassCard>
              )}
            </div>

            {/* 问题反馈 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-teal" />
                  问题反馈
                </h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowFeedbackList(true)}
                    className="text-xs text-text-secondary hover:text-white"
                  >
                    历史记录 ({user.feedbacks.length})
                  </button>
                  <button 
                    onClick={() => setShowFeedback(true)}
                    className="text-xs text-gold"
                  >
                    提交反馈
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="glass-card p-4 flex flex-col items-center gap-2 hover:border-gold/30 transition-colors">
                  <span className="text-2xl">🐛</span>
                  <span className="text-xs text-white">Bug反馈</span>
                </button>
                <button className="glass-card p-4 flex flex-col items-center gap-2 hover:border-gold/30 transition-colors">
                  <span className="text-2xl">💡</span>
                  <span className="text-xs text-white">意见建议</span>
                </button>
              </div>
              {user.feedbacks.length > 0 && (
                <div className="mt-4 space-y-2">
                  {user.feedbacks.slice(0, 2).map((fb) => (
                    <GlassCard key={fb.id} className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold">
                          {fb.type}
                        </span>
                        <span className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full',
                          fb.status === 'resolved' ? 'bg-teal/20 text-teal' :
                          fb.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gold/20 text-gold'
                        )}>
                          {fb.status === 'resolved' ? '已解决' :
                           fb.status === 'processing' ? '处理中' : '待处理'}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2">{fb.description}</p>
                      <p className="text-[10px] text-text-muted mt-1">
                        {new Date(fb.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>

            {/* 其他设置 */}
            <div className="mb-8">
              <div className="space-y-2">
                <GlassCard hover className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HelpCircle size={20} className="text-text-secondary" />
                    <span className="text-sm text-white">使用帮助</span>
                  </div>
                  <ChevronRight size={18} className="text-text-muted" />
                </GlassCard>
                <GlassCard hover className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Info size={20} className="text-text-secondary" />
                    <span className="text-sm text-white">关于我们</span>
                  </div>
                  <ChevronRight size={18} className="text-text-muted" />
                </GlassCard>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">我的收藏 ({collectedExhibits.length})</h3>
              <button 
                onClick={() => setActiveTab('overview')}
                className="text-xs text-text-secondary"
              >
                返回
              </button>
            </div>
            {collectedExhibits.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 pb-4">
                {collectedExhibits.map((exhibit) => (
                  <ExhibitCard key={exhibit.id} exhibit={exhibit} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <Heart size={48} className="text-text-muted mb-4" />
                <p className="text-text-secondary mb-2">还没有收藏任何展品</p>
                <p className="text-text-muted text-sm">去展厅看看，收藏你喜欢的展品吧</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">
                纪念章册 ({user.unlockedBadges.length}/{badges.length})
              </h3>
              <button 
                onClick={() => setActiveTab('overview')}
                className="text-xs text-text-secondary"
              >
                返回
              </button>
            </div>
            
            {/* 收集进度 */}
            <GlassCard className="p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">收集进度</span>
                <span className="text-sm text-gold font-medium">
                  {Math.round((user.unlockedBadges.length / badges.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-glass rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all"
                  style={{ width: `${(user.unlockedBadges.length / badges.length) * 100}%` }}
                />
              </div>
            </GlassCard>

            <div className="grid grid-cols-3 gap-4 pb-4">
              {userBadges.map((badge) => (
                <BadgeItem key={badge.id} badge={badge} size="medium" />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">参观记录</h3>
              <button 
                onClick={() => setActiveTab('overview')}
                className="text-xs text-text-secondary"
              >
                返回
              </button>
            </div>

            {/* 数据概览 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <GlassCard className="p-4">
                <Clock size={24} className="text-teal mb-2" />
                <p className="text-xl font-bold text-white">{formatDuration(user.visitDuration)}</p>
                <p className="text-xs text-text-secondary">累计参观时长</p>
              </GlassCard>
              <GlassCard className="p-4">
                <Star size={24} className="text-gold mb-2" />
                <p className="text-xl font-bold text-white">{user.visitCount} 次</p>
                <p className="text-xs text-text-secondary">参观次数</p>
              </GlassCard>
            </div>

            {/* 参观足迹 - 简化版本 */}
            <GlassCard className="p-4 mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">参观足迹</h4>
              <div className="space-y-3">
                {[
                  { hall: '古代文明厅', time: '今天 14:30', duration: '45分钟' },
                  { hall: '艺术珍品厅', time: '昨天 10:15', duration: '60分钟' },
                  { hall: '自然科学厅', time: '3天前', duration: '30分钟' },
                ].map((record, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-glass-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal" />
                      <span className="text-sm text-white">{record.hall}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-secondary">{record.time}</p>
                      <p className="text-xs text-text-muted">{record.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* 反馈历史弹窗 */}
      {showFeedbackList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowFeedbackList(false)}
          />
          <GlassCard className="relative w-full max-w-sm max-h-[70vh] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-glass-border">
              <h3 className="text-lg font-bold text-white">反馈历史</h3>
              <button 
                onClick={() => setShowFeedbackList(false)}
                className="text-text-secondary hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {user.feedbacks.length > 0 ? (
                <div className="space-y-3">
                  {user.feedbacks.map((fb) => (
                    <GlassCard key={fb.id} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold font-medium">
                          {fb.type}
                        </span>
                        <span className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full',
                          fb.status === 'resolved' ? 'bg-teal/20 text-teal' :
                          fb.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gold/20 text-gold'
                        )}>
                          {fb.status === 'resolved' ? '已解决' :
                           fb.status === 'processing' ? '处理中' : '待处理'}
                        </span>
                      </div>
                      <p className="text-sm text-white mb-2">{fb.description}</p>
                      <p className="text-[10px] text-text-muted">
                        {new Date(fb.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <MessageSquare size={40} className="text-text-muted mb-3" />
                  <p className="text-text-secondary text-sm">暂无反馈记录</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Toast 提示 */}
      {toast.show && (
        <div className={cn(
          'fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-lg animate-slide-down',
          toast.type === 'success' ? 'bg-teal text-white' : 'bg-red-500 text-white'
        )}>
          {toast.message}
        </div>
      )}

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[80vw] bg-space-dark border-l border-glass-border animate-slide-in">
            <div className="p-4 border-b border-glass-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">设置</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-text-secondary hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                const isEnabled = item.value;
                return (
                  <div key={item.id} className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-text-secondary" />
                        <span className="text-sm text-white">{item.label}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (item.id === 'sound') {
                            updateSettings({ soundEnabled: !user.settings.soundEnabled });
                          } else if (item.id === 'subtitle') {
                            updateSettings({ subtitleEnabled: !user.settings.subtitleEnabled });
                          }
                        }}
                        className={cn(
                          'w-12 h-6 rounded-full transition-colors relative',
                          isEnabled ? 'bg-gold' : 'bg-glass-border'
                        )}
                      >
                        <div className={cn(
                          'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                          isEnabled ? 'right-1' : 'left-1'
                        )} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* 字幕大小 */}
              <GlassCard className="p-4">
                <p className="text-sm text-white mb-3">字幕大小</p>
                <div className="flex gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSettings({ subtitleSize: size as any })}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-sm transition-colors',
                        user.settings.subtitleSize === size
                          ? 'bg-gold text-space-dark font-medium'
                          : 'bg-glass text-text-secondary'
                      )}
                    >
                      {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                    </button>
                  ))}
                </div>
              </GlassCard>

              <div className="pt-4 space-y-2">
                <button className="w-full glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-text-secondary" />
                    <span className="text-sm text-white">账号管理</span>
                  </div>
                  <ChevronRight size={18} className="text-text-muted" />
                </button>
                <button className="w-full glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HelpCircle size={20} className="text-text-secondary" />
                    <span className="text-sm text-white">帮助与反馈</span>
                  </div>
                  <ChevronRight size={18} className="text-text-muted" />
                </button>
                <button className="w-full glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Info size={20} className="text-text-secondary" />
                    <span className="text-sm text-white">关于</span>
                  </div>
                  <ChevronRight size={18} className="text-text-muted" />
                </button>
              </div>

              <button className="w-full mt-6 glass-card p-4 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut size={18} />
                <span className="text-sm">退出登录</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 反馈弹窗 */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowFeedback(false)}
          />
          <GlassCard className="relative w-full max-w-sm p-6 animate-slide-up">
            <button 
              onClick={() => setShowFeedback(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">问题反馈</h3>
            
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-2">反馈类型</p>
              <div className="flex flex-wrap gap-2">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFeedbackType(type.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      feedbackType === type.id
                        ? 'bg-gold text-space-dark'
                        : 'bg-glass text-text-secondary hover:bg-glass-border'
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-text-secondary mb-2">问题描述</p>
              <textarea
                value={feedbackDesc}
                onChange={(e) => setFeedbackDesc(e.target.value)}
                rows={4}
                placeholder="请详细描述您遇到的问题或建议..."
                className="w-full p-3 rounded-xl bg-glass border border-glass-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/50 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedback(false)}
                className="flex-1 btn-ghost"
              >
                取消
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="flex-1 btn-gold flex items-center justify-center gap-2"
              >
                <Send size={16} />
                提交
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 预约弹窗 */}
      {showReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowReservation(false)}
          />
          <GlassCard className="relative w-full max-w-sm p-6 animate-slide-up">
            <button 
              onClick={() => setShowReservation(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">预约线下讲解</h3>
            
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-2">选择日期</p>
              <div className="grid grid-cols-4 gap-2">
                {['今天', '明天', '后天', '周六'].map((day, index) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'py-2 rounded-lg text-xs font-medium transition-all',
                      selectedDate === day
                        ? 'bg-gold text-space-dark'
                        : 'bg-glass text-text-secondary hover:bg-glass-border'
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-text-secondary mb-2">选择时间</p>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      'py-2 rounded-lg text-xs font-medium transition-all',
                      selectedTime === time
                        ? 'bg-gold text-space-dark'
                        : 'bg-glass text-text-secondary hover:bg-glass-border'
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <GlassCard className="p-3 mb-6">
              <p className="text-xs text-text-secondary mb-1">讲解服务</p>
              <p className="text-sm text-white">专业讲解员 60 分钟</p>
              <p className="text-xs text-gold mt-1">免费 · 需提前预约</p>
            </GlassCard>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReservation(false)}
                className="flex-1 btn-ghost"
              >
                取消
              </button>
              <button
                onClick={handleReservation}
                className="flex-1 btn-gold"
              >
                确认预约
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Backpack;
