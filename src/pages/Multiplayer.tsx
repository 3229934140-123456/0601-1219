import React, { useState, useRef, useEffect } from 'react';
import { Users, MessageCircle, Camera, Send, X, UserPlus, Smile, MapPin, Navigation, Flag, Crown, LogOut, Check, Route, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { friends, emojiActions, photoSpots } from '@/data/social';
import { useAppStore } from '@/store/useAppStore';
import { getHallById } from '@/data/halls';
import { halls } from '@/data/halls';
import { tourRoutes, getRouteById } from '@/data/routes';
import { tasks } from '@/data/tasks';
import { getExhibitById } from '@/data/exhibits';
import type { Message } from '@/types';
import { cn } from '@/lib/utils';

const hallIdMap: Record<string, string | null> = {
  '古代文明厅': 'hall-1',
  '艺术珍品厅': 'hall-2',
  '自然科学厅': 'hall-3',
  '数字未来厅': 'hall-4',
  '民俗文化厅': 'hall-5',
  '特展：丝路遗珍': 'hall-6',
};

const getFriendHallId = (friend: { currentHall?: string }): string | null => {
  if (!friend.currentHall) return null;
  return hallIdMap[friend.currentHall] || null;
};

const Multiplayer: React.FC = () => {
  const navigate = useNavigate();
  const { user, addChatMessage, getChatMessages, createSquad, joinSquad, leaveSquad, setSquadGatherPoint, setSquadRoute, setCurrentRoute, addNotification, addPhoto } = useAppStore();
  const [activeTab, setActiveTab] = useState<'friends' | 'chat' | 'squad'>('friends');
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPhotoSpot, setShowPhotoSpot] = useState(false);
  const [showCreateSquad, setShowCreateSquad] = useState(false);
  const [squadName, setSquadName] = useState('');
  const [showGatherModal, setShowGatherModal] = useState(false);
  const [gatherName, setGatherName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [showFriendPicker, setShowFriendPicker] = useState(false);
  const [friendPickerMode, setFriendPickerMode] = useState<'create' | 'invite'>('create');
  const [showSquadRoutePicker, setShowSquadRoutePicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onlineFriends = friends.filter(f => f.isOnline);
  const offlineFriends = friends.filter(f => !f.isOnline);

  const selectedFriendData = friends.find(f => f.id === selectedFriend);
  const currentMessages = selectedFriend ? getChatMessages(selectedFriend) : [];
  const currentSquad = user.squad;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages.length]);

  useEffect(() => {
    if (currentSquad && activeTab === 'squad' && currentSquad.gatherPoint) {
      setGatherName(currentSquad.gatherPoint.name);
    }
  }, [currentSquad, activeTab]);

  const autoReplies = [
    '好的！我也想去看看~',
    '太厉害了！',
    '这个展品真的很精美',
    '我们一起去下个展厅吧',
    '哈哈，我刚也看到了',
    '你发现了什么好玩的？',
    '等我一下，我马上过来',
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedFriend) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      content: chatMessage.trim(),
      type: emojiActions.some(e => e.emoji === chatMessage.trim()) ? 'emoji' : 'text',
      timestamp: Date.now(),
    };
    
    addChatMessage(selectedFriend, newMessage);
    setChatMessage('');
    setShowEmojis(false);

    setTimeout(() => {
      const reply: Message = {
        id: `msg-${Date.now()}-reply`,
        senderId: selectedFriend,
        content: autoReplies[Math.floor(Math.random() * autoReplies.length)],
        type: 'text',
        timestamp: Date.now(),
      };
      addChatMessage(selectedFriend, reply);
    }, 1000 + Math.random() * 1500);
  };

  const handleEmoji = (emoji: string) => {
    if (!selectedFriend) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      content: emoji,
      type: 'emoji',
      timestamp: Date.now(),
    };
    addChatMessage(selectedFriend, newMessage);
    
    setTimeout(() => {
      const reply: Message = {
        id: `msg-${Date.now()}-reply`,
        senderId: selectedFriend,
        content: emojiActions[Math.floor(Math.random() * emojiActions.length)].emoji,
        type: 'emoji',
        timestamp: Date.now(),
      };
      addChatMessage(selectedFriend, reply);
    }, 800 + Math.random() * 1000);
  };

  const handleInvite = (friendId: string) => {
    setSelectedFriend(friendId);
    setShowInviteModal(true);
  };

  const handleStartChat = (friendId: string) => {
    setSelectedFriend(friendId);
    setActiveTab('chat');
  };

  const handleCreateSquad = () => {
    if (!squadName.trim() || selectedFriends.length === 0) {
      return;
    }
    const firstFriendId = selectedFriends[0];
    const friendData = friends.find(f => f.id === firstFriendId);
    if (!friendData) return;
    
    createSquad(
      squadName.trim(),
      firstFriendId,
      friendData.name,
      friendData.avatar,
      getFriendHallId(friendData)
    );
    
    for (let i = 1; i < selectedFriends.length; i++) {
      const f = friends.find(fr => fr.id === selectedFriends[i]);
      if (f) {
        joinSquad(f.id, f.name, f.avatar, getFriendHallId(f));
      }
    }
    
    setShowCreateSquad(false);
    setShowInviteModal(false);
    setActiveTab('squad');
    setSquadName('');
    setSelectedFriends([]);
  };

  const handleJoinSquad = (friendId: string) => {
    const friendData = friends.find(f => f.id === friendId);
    if (!friendData) return;
    joinSquad(friendId, friendData.name, friendData.avatar, getFriendHallId(friendData));
  };

  const handleOpenFriendPicker = (mode: 'create' | 'invite') => {
    setFriendPickerMode(mode);
    setSelectedFriends([]);
    setShowFriendPicker(true);
  };

  const handleFriendPickerConfirm = () => {
    setShowFriendPicker(false);
    if (friendPickerMode === 'create') {
      if (selectedFriends.length > 0) {
        const firstFriend = friends.find(f => f.id === selectedFriends[0]);
        setSquadName(firstFriend ? `${user.nickname}和${firstFriend.name}的小队` : '我的小队');
      }
      setShowCreateSquad(true);
    } else {
      for (const fid of selectedFriends) {
        handleJoinSquad(fid);
      }
      setSelectedFriends([]);
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleStartSquadRoute = (routeId: string) => {
    setCurrentRoute(routeId);
    setSquadRoute(routeId);
    setShowSquadRoutePicker(false);
    const route = getRouteById(routeId);
    if (route && route.hallIds.length > 0) {
      navigate(`/hall/${route.hallIds[0]}?fromRoute=${routeId}&step=1`);
    }
  };

  const handleSquadPhoto = () => {
    const squad = currentSquad;
    if (!squad) return;
    const routeName = squad.currentRouteId ? getRouteById(squad.currentRouteId)?.name : undefined;
    const memberNames = squad.members.map(m => m.name);
    navigate(`/camera?squadId=${squad.id}&squadMembers=${encodeURIComponent(memberNames.join(','))}${routeName ? `&routeName=${encodeURIComponent(routeName)}` : ''}`);
  };

  const handleLeaveSquad = () => {
    leaveSquad();
    setActiveTab('friends');
  };

  const handleSetGatherPoint = () => {
    if (!gatherName.trim() || !currentSquad) return;
    const hall = currentSquad.currentHallId ? getHallById(currentSquad.currentHallId) : null;
    const x = hall ? hall.position.x : 50;
    const y = hall ? hall.position.y : 50;
    setSquadGatherPoint(x, y, gatherName.trim());
    setShowGatherModal(false);
    setGatherName('');
  };

  const formatJoinTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚加入';
    if (minutes < 60) return `${minutes} 分钟前加入`;
    const hours = Math.floor(minutes / 60);
    return `${hours} 小时前加入`;
  };

  const getHallName = (hallId: string | null) => {
    if (!hallId) return '未定位';
    const hall = getHallById(hallId);
    return hall ? hall.name : '未知位置';
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
          <button
            onClick={() => setActiveTab('squad')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all relative',
              activeTab === 'squad'
                ? 'bg-gold text-space-dark'
                : 'text-text-secondary hover:text-white'
            )}
          >
            <Flag size={16} />
            小队
            {currentSquad && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-green-500 rounded-full" />
            )}
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
        ) : activeTab === 'chat' ? (
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
                  {currentMessages.map((msg) => {
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
                  <div ref={messagesEndRef} />
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
        ) : activeTab === 'squad' ? (
          <div className="px-4">
            {currentSquad ? (
              <>
                {/* 小队信息 */}
                <div className="mb-6">
                  <GlassCard className="p-4 bg-gradient-to-br from-gold/10 to-teal/10 border-gold/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                          <Flag size={24} className="text-gold" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white">{currentSquad.name}</h2>
                          <p className="text-xs text-text-secondary">
                            {currentSquad.members.length} 名成员 · {getHallName(currentSquad.currentHallId)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleLeaveSquad}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <LogOut size={18} />
                      </button>
                    </div>

                    {/* 集合点 */}
                    {currentSquad.gatherPoint && (
                      <div className="mb-4 p-3 rounded-xl bg-teal/10 border border-teal/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Navigation size={16} className="text-teal animate-pulse" />
                          <span className="text-sm font-semibold text-teal">集合点</span>
                        </div>
                        <p className="text-sm text-white mb-2">📍 {currentSquad.gatherPoint.name}</p>
                        <div className="space-y-1.5">
                          {currentSquad.members.map(member => {
                            const memberHall = getHallName(member.currentHallId);
                            const gatherHall = currentSquad.gatherPoint?.name || '';
                            const isAtGatherPoint = memberHall === gatherHall || 
                              (member.currentHallId && halls.find(h => h.id === member.currentHallId)?.name === gatherHall);
                            return (
                              <div key={member.friendId} className="flex items-center gap-2 text-xs">
                                {isAtGatherPoint ? (
                                  <span className="text-teal flex items-center gap-1">
                                    <Check size={10} />
                                    {member.name} 已到达集合点
                                  </span>
                                ) : (
                                  <span className="text-text-secondary">
                                    {member.name} 在 {memberHall}，请前往 {gatherHall} 汇合
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 队长操作 */}
                    {currentSquad.leaderId === 'me' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowGatherModal(true)}
                          className="flex-1 btn-gold flex items-center justify-center gap-2"
                        >
                          <Navigation size={16} />
                          {currentSquad.gatherPoint ? '更新集合点' : '设置集合点'}
                        </button>
                        <button
                          onClick={() => handleOpenFriendPicker('invite')}
                          className="flex-1 btn-ghost flex items-center justify-center gap-2"
                        >
                          <UserPlus size={16} />
                          邀请成员
                        </button>
                      </div>
                    )}
                  </GlassCard>
                </div>

                {/* 队伍成员 */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    队伍成员 ({currentSquad.members.length})
                  </h3>
                  <div className="space-y-2">
                    {currentSquad.members.map((member, index) => {
                      const memberRouteProgress = (() => {
                        if (!currentSquad.currentRouteId) return null;
                        const route = getRouteById(currentSquad.currentRouteId);
                        if (!route) return null;
                        const completedInRoute = route.exhibitIds.filter(eid => {
                          const task = tasks.find(t => t.exhibitId === eid);
                          return task ? user.completedTasks.includes(task.id) : false;
                        }).length;
                        return { completed: completedInRoute, total: route.exhibitIds.length };
                      })();
                      return (
                        <GlassCard key={member.friendId} className="flex items-center gap-3 p-3">
                          <div className="relative">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-12 h-12 rounded-full bg-space-light"
                            />
                            {member.isOnline && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-space-dark" />
                            )}
                            {index === 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                                <Crown size={12} className="text-space-dark" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white text-sm">{member.name}</h4>
                              {index === 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold">
                                  队长
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary flex items-center gap-1">
                              <MapPin size={10} />
                              {getHallName(member.currentHallId)}
                            </p>
                            {memberRouteProgress && member.friendId === 'me' && (
                              <p className="text-[10px] text-teal mt-1 flex items-center gap-1">
                                <Trophy size={10} />
                                路线进度 {memberRouteProgress.completed}/{memberRouteProgress.total}
                              </p>
                            )}
                            {memberRouteProgress && member.friendId !== 'me' && (
                              <p className="text-[10px] text-text-muted mt-1">
                                🔄 进行中...
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={cn(
                              'text-[10px] px-2 py-0.5 rounded-full',
                              member.isOnline
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-text-muted/20 text-text-muted'
                            )}>
                              {member.isOnline ? '在线' : '离线'}
                            </span>
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                </div>

                {/* 小队路线进度 */}
                {currentSquad.currentRouteId && (() => {
                  const squadRoute = getRouteById(currentSquad.currentRouteId);
                  if (!squadRoute) return null;
                  const myProgress = squadRoute.exhibitIds.filter(eid => {
                    const task = tasks.find(t => t.exhibitId === eid);
                    return task ? user.completedTasks.includes(task.id) : false;
                  }).length;
                  return (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Route size={16} className="text-gold" />
                        小队路线进度
                      </h3>
                      <GlassCard className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">{squadRoute.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{squadRoute.name}</p>
                            <p className="text-[10px] text-text-secondary">
                              你已完成 {myProgress}/{squadRoute.exhibitIds.length} 项
                            </p>
                          </div>
                          <button
                            onClick={() => navigate('/tasks')}
                            className="text-[10px] px-2 py-1 rounded-full bg-gold/20 text-gold"
                          >
                            继续路线
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {squadRoute.exhibitIds.map((eid, idx) => {
                            const exhibit = getExhibitById(eid);
                            const task = tasks.find(t => t.exhibitId === eid);
                            const done = task ? user.completedTasks.includes(task.id) : false;
                            return (
                              <div key={eid} className="flex items-center gap-2 text-[10px]">
                                <div className={cn(
                                  'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0',
                                  done ? 'bg-teal/20 text-teal' : 'bg-glass text-text-muted'
                                )}>
                                  {done ? <Check size={8} /> : <span className="text-[8px]">{idx+1}</span>}
                                </div>
                                <span className={done ? 'text-text-secondary' : 'text-text-muted'}>
                                  {exhibit?.name ?? `展品${idx+1}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </GlassCard>
                    </div>
                  );
                })()}

                {/* 小队活动 */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-white mb-3">小队活动</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowSquadRoutePicker(true)}
                      className="w-full glass-card p-4 flex items-center gap-3 hover:border-gold/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center">
                        <Route size={20} className="text-teal" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm text-white">
                          {currentSquad.currentRouteId ? '查看路线进度' : '发起同游路线'}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {currentSquad.currentRouteId 
                            ? `${getRouteById(currentSquad.currentRouteId)?.name ?? '路线进行中'}`
                            : '和小队一起按路线探索博物馆'}
                        </p>
                      </div>
                      <span className="text-text-muted">›</span>
                    </button>
                    <button
                      onClick={() => navigate('/map')}
                      className="w-full glass-card p-4 flex items-center gap-3 hover:border-gold/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                        <MapPin size={20} className="text-gold" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm text-white">一起逛展厅</p>
                        <p className="text-xs text-text-secondary">查看展厅地图，选择目的地</p>
                      </div>
                      <span className="text-text-muted">›</span>
                    </button>
                    <button
                      onClick={handleSquadPhoto}
                      className="w-full glass-card p-4 flex items-center gap-3 hover:border-gold/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Camera size={20} className="text-purple-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm text-white">小队合影</p>
                        <p className="text-xs text-text-secondary">
                          {currentSquad.currentRouteId 
                            ? `在${getRouteById(currentSquad.currentRouteId)?.name}站点合影`
                            : '记录美好的同游时光'}
                        </p>
                      </div>
                      <span className="text-text-muted">›</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-glass flex items-center justify-center mb-4">
                  <Users size={36} className="text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">还没有同游小队</h3>
                <p className="text-text-secondary text-sm mb-6">
                  创建小队，邀请好友一起探索博物馆
                </p>
                <button
                  onClick={() => handleOpenFriendPicker('create')}
                  className="btn-gold flex items-center gap-2"
                >
                  <Flag size={18} />
                  创建同游小队
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* 小队路线选择弹窗 */}
      {showSquadRoutePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSquadRoutePicker(false)}
          />
          <GlassCard className="relative w-full max-w-sm max-h-[80vh] overflow-y-auto p-6 animate-slide-up">
            <button
              onClick={() => setShowSquadRoutePicker(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-teal/20 flex items-center justify-center">
                <Route size={28} className="text-teal" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">选择同游路线</h3>
              <p className="text-sm text-text-secondary">
                小队将一起按照路线探索
              </p>
            </div>

            <div className="space-y-2 mb-4">
              {tourRoutes.map(route => {
                const isCurrentSquadRoute = currentSquad?.currentRouteId === route.id;
                return (
                  <button
                    key={route.id}
                    onClick={() => !isCurrentSquadRoute && handleStartSquadRoute(route.id)}
                    disabled={isCurrentSquadRoute}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                      isCurrentSquadRoute ? 'bg-teal/10 border border-teal/30' : 'bg-glass hover:bg-glass-border'
                    )}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: `${route.color}20` }}
                    >
                      {route.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{route.name}</p>
                      <p className="text-[10px] text-text-secondary">
                        {route.hallIds.length}展厅 · {route.exhibitIds.length}展品 · {route.estimatedTime}分钟
                      </p>
                    </div>
                    {isCurrentSquadRoute && (
                      <span className="text-[10px] text-teal">当前路线</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowSquadRoutePicker(false)}
              className="btn-ghost w-full"
            >
              取消
            </button>
          </GlassCard>
        </div>
      )}

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

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  if (currentSquad && currentSquad.leaderId === 'me') {
                    handleOpenFriendPicker('invite');
                  } else {
                    handleOpenFriendPicker('create');
                  }
                }}
                className="btn-gold w-full"
              >
                {currentSquad && currentSquad.leaderId === 'me' ? '邀请加入小队' : '创建同游小队'}
              </button>
              <button
                onClick={() => {
                  handleStartChat(selectedFriendData.id);
                  setShowInviteModal(false);
                }}
                className="btn-ghost w-full"
              >
                先聊天
              </button>
            </div>
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

      {/* 创建小队弹窗 */}
      {showCreateSquad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setShowCreateSquad(false);
              setSquadName('');
            }}
          />
          <GlassCard className="relative w-full max-w-sm p-6 animate-slide-up">
            <button
              onClick={() => {
                setShowCreateSquad(false);
                setSquadName('');
              }}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold/20 flex items-center justify-center">
                <Flag size={32} className="text-gold" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">创建同游小队</h3>
              <p className="text-sm text-text-secondary">
                邀请好友一起探索博物馆
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-text-secondary mb-2">小队名称</label>
              <input
                type="text"
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                placeholder="给小队起个名字吧"
                className="w-full px-4 py-3 rounded-xl bg-glass border border-glass-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            {selectedFriends.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-text-secondary mb-2">
                  邀请成员 ({selectedFriends.length})
                </p>
                <div className="space-y-2">
                  {selectedFriends.map(fid => {
                    const f = friends.find(fr => fr.id === fid);
                    if (!f) return null;
                    return (
                      <GlassCard key={fid} className="p-3 flex items-center gap-3">
                        <img
                          src={f.avatar}
                          alt={f.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-white">{f.name}</p>
                          <p className="text-xs text-green-500">在线</p>
                        </div>
                        <span className="text-xs text-gold">已选择</span>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleCreateSquad}
                disabled={!squadName.trim() || selectedFriends.length === 0}
                className={cn(
                  'w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2',
                  squadName.trim() && selectedFriends.length > 0
                    ? 'btn-gold'
                    : 'bg-glass text-text-muted cursor-not-allowed'
                )}
              >
                <Flag size={16} />
                创建小队
              </button>
              <button
                onClick={() => {
                  setShowCreateSquad(false);
                  setSquadName('');
                  setSelectedFriends([]);
                }}
                className="btn-ghost w-full"
              >
                取消
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 选择好友弹窗 */}
      {showFriendPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => { setShowFriendPicker(false); setSelectedFriends([]); }}
          />
          <GlassCard className="relative w-full max-w-sm p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => { setShowFriendPicker(false); setSelectedFriends([]); }}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gold/20 flex items-center justify-center">
                <UserPlus size={28} className="text-gold" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {friendPickerMode === 'create' ? '选择好友一起组队' : '邀请好友加入小队'}
              </h3>
              <p className="text-sm text-text-secondary">
                {selectedFriends.length > 0 ? `已选择 ${selectedFriends.length} 人` : '点击好友即可选择'}
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {onlineFriends.map((friend) => {
                const isSelected = selectedFriends.includes(friend.id);
                const alreadyInSquad = currentSquad?.members.some(m => m.friendId === friend.id);
                return (
                  <button
                    key={friend.id}
                    onClick={() => !alreadyInSquad && toggleFriendSelection(friend.id)}
                    disabled={!!alreadyInSquad}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                      alreadyInSquad ? 'opacity-40 cursor-not-allowed' :
                      isSelected ? 'bg-gold/20 border border-gold/50' : 'bg-glass hover:bg-glass-border'
                    )}
                  >
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-space-dark" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{friend.name}</p>
                      <p className="text-xs text-text-secondary flex items-center gap-1">
                        <MapPin size={10} />
                        {friend.currentHall || '漫游中'}
                      </p>
                    </div>
                    {alreadyInSquad ? (
                      <span className="text-[10px] text-text-muted">已在小队</span>
                    ) : isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                        <Check size={14} className="text-space-dark" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-glass-border" />
                    )}
                  </button>
                );
              })}
              {offlineFriends.length > 0 && (
                <>
                  <p className="text-xs text-text-muted pt-2 pb-1">离线好友</p>
                  {offlineFriends.map((friend) => {
                    const isSelected = selectedFriends.includes(friend.id);
                    const alreadyInSquad = currentSquad?.members.some(m => m.friendId === friend.id);
                    return (
                      <button
                        key={friend.id}
                        onClick={() => !alreadyInSquad && toggleFriendSelection(friend.id)}
                        disabled={!!alreadyInSquad}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left opacity-60',
                          alreadyInSquad ? 'cursor-not-allowed' :
                          isSelected ? 'bg-gold/20 border border-gold/50' : 'bg-glass hover:bg-glass-border'
                        )}
                      >
                        <div className="relative">
                          <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-10 h-10 rounded-full grayscale"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-secondary">{friend.name}</p>
                          <p className="text-xs text-text-muted">离线</p>
                        </div>
                        {alreadyInSquad ? (
                          <span className="text-[10px] text-text-muted">已在小队</span>
                        ) : isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                            <Check size={14} className="text-space-dark" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-glass-border" />
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleFriendPickerConfirm}
                disabled={selectedFriends.length === 0}
                className={cn(
                  'w-full py-3 rounded-full font-semibold transition-all',
                  selectedFriends.length > 0
                    ? 'btn-gold'
                    : 'bg-glass text-text-muted cursor-not-allowed'
                )}
              >
                {friendPickerMode === 'create' ? '下一步：设置小队' : `邀请 ${selectedFriends.length} 人加入`}
              </button>
              <button
                onClick={() => { setShowFriendPicker(false); setSelectedFriends([]); }}
                className="btn-ghost w-full"
              >
                取消
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 设置集合点弹窗 */}
      {showGatherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setShowGatherModal(false);
              setGatherName('');
            }}
          />
          <GlassCard className="relative w-full max-w-sm p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowGatherModal(false);
                setGatherName('');
              }}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal/20 flex items-center justify-center">
                <Navigation size={32} className="text-teal animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">设置集合点</h3>
              <p className="text-sm text-text-secondary">
                选择一个展厅作为集合地点
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {halls.map(hall => {
                const isSelected = gatherName === hall.name;
                const membersHere = currentSquad?.members.filter(m => m.currentHallId === hall.id) || [];
                return (
                  <button
                    key={hall.id}
                    onClick={() => setGatherName(hall.name)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                      isSelected ? 'bg-teal/20 border border-teal/50' : 'bg-glass hover:bg-glass-border'
                    )}
                  >
                    <img
                      src={hall.coverImage}
                      alt={hall.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{hall.name}</p>
                      <p className="text-xs text-text-secondary">
                        {membersHere.length > 0 
                          ? `${membersHere.map(m => m.name).join('、')} 在此` 
                          : hall.theme}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center">
                        <Check size={14} className="text-space-dark" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSetGatherPoint}
                disabled={!gatherName.trim()}
                className={cn(
                  'w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2',
                  gatherName.trim()
                    ? 'btn-gold'
                    : 'bg-glass text-text-muted cursor-not-allowed'
                )}
              >
                <Navigation size={16} />
                设置集合点
              </button>
              <button
                onClick={() => {
                  setShowGatherModal(false);
                  setGatherName('');
                }}
                className="btn-ghost w-full"
              >
                取消
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
