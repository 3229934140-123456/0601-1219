import React, { useState } from 'react';
import { Users, MessageCircle, Camera, Send, X, UserPlus, Smile, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { friends, emojiActions, mockMessages, photoSpots } from '@/data/social';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const Multiplayer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'friends' | 'chat'>('friends');
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPhotoSpot, setShowPhotoSpot] = useState(false);

  const onlineFriends = friends.filter(f => f.isOnline);
  const offlineFriends = friends.filter(f => !f.isOnline);

  const selectedFriendData = friends.find(f => f.id === selectedFriend);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessage('');
    setShowEmojis(false);
  };

  const handleEmoji = (emoji: string) => {
    setChatMessage(prev => prev + emoji);
  };

  const handleInvite = (friendId: string) => {
    setSelectedFriend(friendId);
    setShowInviteModal(true);
  };

  const handleStartChat = (friendId: string) => {
    setSelectedFriend(friendId);
    setActiveTab('chat');
  };

  return (
    <div className="page-container">
      <div className="stars-bg opacity-30" />
      
      {/* 顶部栏 */}
      <header className="relative z-10 px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-gold-gradient text-center mb-4">
          多人同行
        </h1>
        
        {/* Tab 切换 */}
        <div className="flex gap-2 glass-card p-1">
          <button
            onClick={() => setActiveTab('friends')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all',
              activeTab === 'friends'
                ? 'bg-gold text-space-dark'
                : 'text-text-secondary hover:text-white'
            )}
          >
            <Users size={16} />
            好友列表
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all relative',
              activeTab === 'chat'
                ? 'bg-gold text-space-dark'
                : 'text-text-secondary hover:text-white'
            )}
          >
            <MessageCircle size={16} />
            私聊
            <span className="absolute top-1 right-4 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </header>

      <div className="page-content">
        {activeTab === 'friends' ? (
          <>
            {/* 合影打卡点 */}
            <div className="px-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Camera size={16} className="text-gold" />
                  合影打卡点
                </h2>
                <button 
                  onClick={() => navigate('/camera')}
                  className="text-xs text-gold"
                >
                  去拍照
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {photoSpots.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => setShowPhotoSpot(true)}
                    className="flex-shrink-0 glass-card px-4 py-3 flex items-center gap-2 hover:border-gold/30 transition-colors"
                  >
                    <MapPin size={14} className="text-teal" />
                    <span className="text-xs text-white">{spot.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 在线好友 */}
            <div className="px-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">
                  在线好友 ({onlineFriends.length})
                </h2>
                <button className="text-xs text-gold flex items-center gap-1">
                  <UserPlus size={12} />
                  邀请好友
                </button>
              </div>
              <div className="space-y-2">
                {onlineFriends.map((friend) => (
                  <GlassCard key={friend.id} className="flex items-center gap-3 p-3">
                    <div className="relative">
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        className="w-12 h-12 rounded-full bg-space-light"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-space-dark" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm">{friend.name}</h4>
                      <p className="text-xs text-text-secondary flex items-center gap-1">
                        <MapPin size={10} />
                        {friend.currentHall}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartChat(friend.id)}
                        className="p-2 rounded-full bg-glass text-text-secondary hover:text-gold hover:bg-gold/10 transition-colors"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleInvite(friend.id)}
                        className="p-2 rounded-full bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
                      >
                        <Users size={16} />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* 离线好友 */}
            <div className="px-4 mb-8">
              <h2 className="text-sm font-semibold text-white mb-3">
                离线好友 ({offlineFriends.length})
              </h2>
              <div className="space-y-2">
                {offlineFriends.map((friend) => (
                  <GlassCard key={friend.id} className="flex items-center gap-3 p-3 opacity-60">
                    <div className="relative">
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        className="w-12 h-12 rounded-full bg-space-light grayscale"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-text-muted rounded-full border-2 border-space-dark" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-text-secondary text-sm">{friend.name}</h4>
                      <p className="text-xs text-text-muted">离线</p>
                    </div>
                    <button className="p-2 rounded-full bg-glass text-text-muted">
                      <MessageCircle size={16} />
                    </button>
                  </GlassCard>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 聊天界面 */}
            {selectedFriend ? (
              <div className="flex flex-col h-full">
                {/* 聊天头部 */}
                <div className="px-4 py-3 border-b border-glass-border flex items-center gap-3">
                  <button 
                    onClick={() => { setSelectedFriend(null); setActiveTab('friends'); }}
                    className="text-text-secondary"
                  >
                    <X size={20} />
                  </button>
                  <img 
                    src={selectedFriendData?.avatar} 
                    alt={selectedFriendData?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">{selectedFriendData?.name}</h4>
                    <p className="text-xs text-green-500">在线</p>
                  </div>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="text-xs px-3 py-1.5 rounded-full bg-gold/20 text-gold"
                  >
                    邀请同游
                  </button>
                </div>

                {/* 表情动作栏 */}
                <div className="px-4 py-3 border-b border-glass-border">
                  <p className="text-xs text-text-secondary mb-2">表情动作</p>
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                    {emojiActions.map((emoji) => (
                      <button
                        key={emoji.id}
                        onClick={() => handleEmoji(emoji.emoji)}
                        className="flex-shrink-0 w-12 h-12 rounded-xl bg-glass flex items-center justify-center text-2xl hover:bg-gold/20 transition-colors"
                      >
                        {emoji.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 消息列表 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {mockMessages.map((msg) => {
                    const isMe = msg.senderId === 'me';
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex',
                          isMe ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {!isMe && (
                          <img 
                            src={selectedFriendData?.avatar} 
                            alt=""
                            className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                          />
                        )}
                        <div
                          className={cn(
                            'max-w-[70%] px-4 py-2 rounded-2xl',
                            isMe
                              ? 'bg-gold/20 text-white rounded-br-sm'
                              : 'bg-glass text-white rounded-bl-sm'
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        {isMe && (
                          <img 
                            src={user.avatar} 
                            alt=""
                            className="w-8 h-8 rounded-full ml-2 flex-shrink-0"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 输入框 */}
                <div className="p-4 border-t border-glass-border">
                  <div className="flex items-end gap-2">
                    <button
                      onClick={() => setShowEmojis(!showEmojis)}
                      className="p-2 text-text-secondary hover:text-gold transition-colors"
                    >
                      <Smile size={20} />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="输入消息..."
                        className="w-full px-4 py-3 rounded-2xl bg-glass border border-glass-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      className="p-3 rounded-full bg-gold text-space-dark hover:shadow-glow-gold transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <MessageCircle size={48} className="text-text-muted mb-4" />
                <p className="text-text-secondary mb-2">选择一位好友开始聊天</p>
                <button
                  onClick={() => setActiveTab('friends')}
                  className="text-gold text-sm"
                >
                  查看好友列表
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 邀请同游弹窗 */}
      {showInviteModal && selectedFriendData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          />
          <GlassCard className="relative w-full max-w-sm p-6 animate-slide-up">
            <button 
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="flex justify-center items-center gap-4 mb-4">
                <img 
                  src={user.avatar} 
                  alt=""
                  className="w-16 h-16 rounded-full border-2 border-gold"
                />
                <span className="text-2xl">🤝</span>
                <img 
                  src={selectedFriendData.avatar} 
                  alt=""
                  className="w-16 h-16 rounded-full border-2 border-teal"
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                邀请 {selectedFriendData.name} 同游
              </h3>
              <p className="text-sm text-text-secondary">
                一起探索博物馆的奥秘
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="glass-card p-3 flex items-center gap-3">
                <span className="text-xl">🏛️</span>
                <div>
                  <p className="text-sm text-white">古代文明厅</p>
                  <p className="text-xs text-text-secondary">当前所在展厅</p>
                </div>
              </div>
              <div className="glass-card p-3 flex items-center gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="text-sm text-white">青铜方鼎探索</p>
                  <p className="text-xs text-text-secondary">任务目标</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInviteModal(false)}
              className="btn-gold w-full"
            >
              发送邀请
            </button>
          </GlassCard>
        </div>
      )}

      {/* 合影点弹窗 */}
      {showPhotoSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPhotoSpot(false)}
          />
          <GlassCard className="relative w-full max-w-sm p-6 animate-slide-up">
            <button 
              onClick={() => setShowPhotoSpot(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold/30 to-teal/30 flex items-center justify-center">
                <Camera size={32} className="text-gold" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">合影打卡点</h3>
              <p className="text-sm text-text-secondary">
                在这个位置与好友一起合影留念
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {photoSpots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => {
                    setShowPhotoSpot(false);
                    navigate('/camera');
                  }}
                  className="w-full glass-card p-3 flex items-center gap-3 hover:border-gold/30 transition-colors"
                >
                  <MapPin size={18} className="text-teal" />
                  <div className="flex-1 text-left">
                    <p className="text-sm text-white">{spot.name}</p>
                  </div>
                  <Camera size={16} className="text-gold" />
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
