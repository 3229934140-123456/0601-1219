import React, { useState } from 'react';
import { Bell, Settings, Sparkles, ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HallCard from '@/components/HallCard';
import GlassCard from '@/components/GlassCard';
import { halls } from '@/data/halls';
import { friends } from '@/data/social';
import { useAppStore } from '@/store/useAppStore';
import { avatarOptions } from '@/data/social';

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const { user, setShowAvatarSelector, showAvatarSelector, setAvatar } = useAppStore();
  const [activeBanner, setActiveBanner] = useState(0);

  const banners = [
    { id: 1, title: '丝路遗珍特展', subtitle: '限时开放中', image: '/images/banner-1.svg' },
    { id: 2, title: '数字未来厅', subtitle: '全新升级上线', image: '/images/banner-2.svg' },
    { id: 3, title: '新春纪念章', subtitle: '收集兑换好礼', image: '/images/banner-3.svg' },
  ];

  const onlineFriends = friends.filter(f => f.isOnline);

  const handleSelectAvatar = (avatarId: string) => {
    setAvatar(avatarId);
    setShowAvatarSelector(false);
  };

  return (
    <div className="page-container">
      <div className="stars-bg" />
      
      {/* 顶部栏 */}
      <header className="relative z-10 px-4 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAvatarSelector(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark p-0.5"
          >
            <img 
              src={user.avatar} 
              alt="avatar" 
              className="w-full h-full rounded-full bg-space-dark object-cover"
            />
          </button>
          <div>
            <p className="text-sm font-semibold text-white">{user.nickname}</p>
            <p className="text-xs text-text-secondary flex items-center gap-1">
              <Sparkles size={12} className="text-gold" />
              累计参观 {Math.floor(user.visitDuration / 60)} 分钟
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-text-secondary hover:text-white transition-colors">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button 
            onClick={() => navigate('/backpack')}
            className="p-2 text-text-secondary hover:text-white transition-colors"
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      <div className="page-content">
        {/* 欢迎语 */}
        <div className="px-4 mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold font-display text-gold-gradient mb-1">
            欢迎来到元宇宙博物馆
          </h1>
          <p className="text-sm text-text-secondary">
            选择一个展厅，开启您的虚拟文化之旅
          </p>
        </div>

        {/* 活动公告轮播 */}
        <div className="px-4 mb-6">
          <div className="relative rounded-2xl overflow-hidden h-36">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeBanner === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={banner.image} 
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-space-dark/90 via-space-dark/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-lg font-bold text-white mb-1">{banner.title}</h3>
                  <p className="text-xs text-gold flex items-center gap-1">
                    <Sparkles size={12} />
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveBanner(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeBanner === index ? 'w-6 bg-gold' : 'bg-text-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 在线好友 */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">在线好友 ({onlineFriends.length})</h2>
            <button 
              onClick={() => navigate('/social')}
              className="text-xs text-gold flex items-center gap-1"
            >
              查看全部
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {onlineFriends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => navigate('/social')}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div className="relative">
                  <img 
                    src={friend.avatar} 
                    alt={friend.name}
                    className="w-12 h-12 rounded-full bg-space-light border-2 border-glass-border"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-space-dark" />
                </div>
                <span className="text-xs text-text-secondary">{friend.name}</span>
              </button>
            ))}
            <button className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-glass border border-dashed border-glass-border flex items-center justify-center text-text-secondary">
                <User size={20} />
              </div>
              <span className="text-xs text-text-secondary">邀请</span>
            </button>
          </div>
        </div>

        {/* 主题展厅 */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">主题展厅</h2>
            <button 
              onClick={() => navigate('/map')}
              className="text-xs text-gold flex items-center gap-1"
            >
              全部展厅
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {halls.slice(0, 4).map((hall, index) => (
              <div key={hall.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                <HallCard hall={hall} />
              </div>
            ))}
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="px-4 mb-8">
          <h2 className="text-base font-semibold text-white mb-3">快捷功能</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '📸', label: '拍照', path: '/camera' },
              { icon: '🎯', label: '任务', path: '/tasks' },
              { icon: '🏆', label: '纪念章', path: '/tasks' },
              { icon: '📅', label: '预约', path: '/backpack' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="glass-card flex flex-col items-center justify-center py-4 gap-2 hover:bg-glass-border transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-text-secondary">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 数字形象选择弹窗 */}
      {showAvatarSelector && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAvatarSelector(false)}
          />
          <GlassCard className="relative w-full max-w-md mx-4 mb-8 p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-white mb-4 text-center">选择您的数字形象</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleSelectAvatar(avatar.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                    user.selectedAvatar === avatar.id
                      ? 'bg-gold/20 border border-gold/50'
                      : 'bg-glass hover:bg-glass-border'
                  }`}
                >
                  <img 
                    src={avatar.image} 
                    alt={avatar.name}
                    className="w-16 h-16 rounded-full bg-space-light"
                  />
                  <span className="text-xs text-text-secondary">{avatar.name}</span>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowAvatarSelector(false)}
              className="btn-gold w-full"
            >
              确定
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Lobby;
