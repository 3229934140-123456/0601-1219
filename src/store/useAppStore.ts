import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserData, UserSettings, Message, Feedback, Reservation, Photo, Notification, Squad, TourRoute, SquadMember } from '@/types';
import { mockMessages } from '@/data/social';
import { getRouteById as getRouteByIdFromData } from '@/data/routes';

interface AppState {
  user: UserData;
  currentPage: string;
  currentHallId: string | null;
  currentExhibitId: string | null;
  isPlaying: boolean;
  currentAudioId: string | null;
  playbackProgress: number;
  showAvatarSelector: boolean;
  
  setCurrentPage: (page: string) => void;
  setCurrentHall: (hallId: string | null) => void;
  setCurrentExhibit: (exhibitId: string | null) => void;
  toggleCollect: (exhibitId: string) => void;
  completeTask: (taskId: string, badgeId?: string) => void;
  unlockBadge: (badgeId: string) => void;
  unlockBadgeWithNotification: (badgeId: string, badgeName: string, badgeIcon: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addVisitDuration: (seconds: number) => void;
  setAvatar: (avatarId: string) => void;
  setNickname: (nickname: string) => void;
  addPhoto: (photoId: string, image: string, title: string, location: string, extra?: Partial<Photo>) => void;
  setShowAvatarSelector: (show: boolean) => void;
  togglePlay: (audioId?: string) => void;
  setPlaybackProgress: (progress: number) => void;
  addChatMessage: (friendId: string, message: Message) => void;
  getChatMessages: (friendId: string) => Message[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'status'>) => void;
  updateReservationStatus: (reservationId: string, status: Reservation['status'], guideName?: string) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'status'>) => void;
  updateFeedbackStatus: (feedbackId: string, status: Feedback['status']) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  createSquad: (name: string, friendId: string, friendName: string, friendAvatar: string, friendHallId?: string | null) => void;
  joinSquad: (friendId: string, friendName: string, friendAvatar: string, friendHallId?: string | null) => void;
  leaveSquad: () => void;
  setSquadGatherPoint: (x: number, y: number, name: string) => void;
  updateSquadMemberLocation: (friendId: string, hallId: string | null) => void;
  setSquadRoute: (routeId: string | null) => void;
  setCurrentRoute: (routeId: string | null) => void;
  advanceRouteProgress: (exhibitId?: string) => void;
}

const initialSettings: UserSettings = {
  soundEnabled: true,
  subtitleEnabled: true,
  subtitleSize: 'medium',
  autoplayAudio: false,
};

const initialUser: UserData = {
  avatar: '/images/avatar-1.svg',
  nickname: '博物馆探索者',
  collectedExhibits: ['exhibit-1'],
  unlockedBadges: ['badge-6'],
  completedTasks: ['task-6'],
  visitDuration: 3600,
  visitCount: 5,
  reservations: [
    {
      id: 'res-1',
      type: 'offline_guide',
      date: '2026-06-20',
      time: '10:00',
      status: 'confirmed',
      guideName: '王老师',
    },
  ],
  photos: [],
  settings: initialSettings,
  selectedAvatar: 'avatar-1',
  chats: [
    {
      friendId: 'friend-1',
      messages: [...mockMessages],
    },
  ],
  feedbacks: [],
  notifications: [
    {
      id: 'notif-1',
      type: 'system',
      title: '欢迎来到元宇宙博物馆',
      content: '探索六大展厅，开启你的文化之旅',
      createdAt: Date.now() - 86400000 * 2,
      isRead: true,
    },
  ],
  squad: null,
  currentRouteId: null,
  routeProgress: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      currentPage: 'lobby',
      currentHallId: null,
      currentExhibitId: null,
      isPlaying: false,
      currentAudioId: null,
      playbackProgress: 0,
      showAvatarSelector: false,

      setCurrentPage: (page) => set({ currentPage: page }),
      
      setCurrentHall: (hallId) => set({ currentHallId: hallId }),
      
      setCurrentExhibit: (exhibitId) => set({ currentExhibitId: exhibitId }),
      
      toggleCollect: (exhibitId) => {
        const { collectedExhibits } = get().user;
        const isCollected = collectedExhibits.includes(exhibitId);
        set({
          user: {
            ...get().user,
            collectedExhibits: isCollected
              ? collectedExhibits.filter(id => id !== exhibitId)
              : [...collectedExhibits, exhibitId],
          },
        });
      },
      
      completeTask: (taskId, badgeId) => {
        const { completedTasks, unlockedBadges } = get().user;
        const newBadges = badgeId && !unlockedBadges.includes(badgeId)
          ? [...unlockedBadges, badgeId]
          : unlockedBadges;
        
        set({
          user: {
            ...get().user,
            completedTasks: [...new Set([...completedTasks, taskId])],
            unlockedBadges: newBadges,
          },
        });
      },
      
      unlockBadge: (badgeId) => {
        const { unlockedBadges } = get().user;
        if (unlockedBadges.includes(badgeId)) return;
        set({
          user: {
            ...get().user,
            unlockedBadges: [...unlockedBadges, badgeId],
          },
        });
      },

      unlockBadgeWithNotification: (badgeId, badgeName, badgeIcon) => {
        const { unlockedBadges } = get().user;
        if (unlockedBadges.includes(badgeId)) return;
        const newBadges = [...unlockedBadges, badgeId];
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: 'badge',
          title: `获得新纪念章 ${badgeIcon}`,
          content: `恭喜你解锁了「${badgeName}」纪念章！`,
          createdAt: Date.now(),
          isRead: false,
          relatedId: badgeId,
        };
        set({
          user: {
            ...get().user,
            unlockedBadges: newBadges,
            notifications: [newNotification, ...get().user.notifications],
          },
        });
      },
      
      updateSettings: (settings) => {
        set({
          user: {
            ...get().user,
            settings: { ...get().user.settings, ...settings },
          },
        });
      },
      
      addVisitDuration: (seconds) => {
        set({
          user: {
            ...get().user,
            visitDuration: get().user.visitDuration + seconds,
          },
        });
      },
      
      setAvatar: (avatarId) => {
        const avatarUrl = `/images/${avatarId}.svg`;
        set({
          user: {
            ...get().user,
            avatar: avatarUrl,
            selectedAvatar: avatarId,
          },
        });
      },
      
      setNickname: (nickname) => {
        set({
          user: {
            ...get().user,
            nickname,
          },
        });
      },
      
      addPhoto: (photoId, image, title, location, extra) => {
        set({
          user: {
            ...get().user,
            photos: [
              { id: photoId, image, title, createdAt: Date.now(), location, ...extra },
              ...get().user.photos,
            ],
          },
        });
      },
      
      setShowAvatarSelector: (show) => set({ showAvatarSelector: show }),
      
      togglePlay: (audioId) => {
        const { isPlaying, currentAudioId } = get();
        if (audioId && audioId !== currentAudioId) {
          set({ isPlaying: true, currentAudioId: audioId, playbackProgress: 0 });
        } else {
          set({ isPlaying: !isPlaying });
        }
      },
      
      setPlaybackProgress: (progress) => set({ playbackProgress: progress }),

      addChatMessage: (friendId, message) => {
        const { chats } = get().user;
        const existingChat = chats.find(c => c.friendId === friendId);
        
        let newChats;
        if (existingChat) {
          newChats = chats.map(c => 
            c.friendId === friendId 
              ? { ...c, messages: [...c.messages, message] }
              : c
          );
        } else {
          newChats = [...chats, { friendId, messages: [message] }];
        }
        
        set({
          user: {
            ...get().user,
            chats: newChats,
          },
        });
      },

      getChatMessages: (friendId) => {
        const chat = get().user.chats.find(c => c.friendId === friendId);
        return chat ? chat.messages : [];
      },

      addReservation: (reservation) => {
        const newReservation: Reservation = {
          ...reservation,
          id: `res-${Date.now()}`,
          status: 'pending',
        };
        set({
          user: {
            ...get().user,
            reservations: [newReservation, ...get().user.reservations],
          },
        });
      },

      addFeedback: (feedback) => {
        const newFeedback: Feedback = {
          ...feedback,
          id: `fb-${Date.now()}`,
          createdAt: Date.now(),
          status: 'pending',
        };
        const newNotification: Notification = {
          id: `notif-${Date.now() + 1}`,
          type: 'feedback',
          title: '反馈已提交',
          content: '我们已收到您的反馈，正在处理中',
          createdAt: Date.now(),
          isRead: false,
          relatedId: newFeedback.id,
        };
        set({
          user: {
            ...get().user,
            feedbacks: [newFeedback, ...get().user.feedbacks],
            notifications: [newNotification, ...get().user.notifications],
          },
        });
      },

      updateFeedbackStatus: (feedbackId, status) => {
        const feedback = get().user.feedbacks.find(f => f.id === feedbackId);
        if (!feedback) return;
        
        const statusText = status === 'processing' ? '正在处理' : status === 'resolved' ? '已解决' : '';
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: 'feedback',
          title: '反馈状态更新',
          content: `您的反馈已${statusText}`,
          createdAt: Date.now(),
          isRead: false,
          relatedId: feedbackId,
        };
        set({
          user: {
            ...get().user,
            feedbacks: get().user.feedbacks.map(f => 
              f.id === feedbackId ? { ...f, status } : f
            ),
            notifications: [newNotification, ...get().user.notifications],
          },
        });
      },

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          createdAt: Date.now(),
          isRead: false,
        };
        set({
          user: {
            ...get().user,
            notifications: [newNotification, ...get().user.notifications],
          },
        });
      },

      markNotificationRead: (notificationId) => {
        set({
          user: {
            ...get().user,
            notifications: get().user.notifications.map(n =>
              n.id === notificationId ? { ...n, isRead: true } : n
            ),
          },
        });
      },

      markAllNotificationsRead: () => {
        set({
          user: {
            ...get().user,
            notifications: get().user.notifications.map(n => ({ ...n, isRead: true })),
          },
        });
      },

      updateReservationStatus: (reservationId, status, guideName) => {
        const statusText = status === 'confirmed' ? '已确认' : status === 'completed' ? '已完成' : status === 'cancelled' ? '已取消' : '';
        const guideText = guideName ? `，讲解员：${guideName}` : '';
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: 'reservation',
          title: '预约状态更新',
          content: `您的线下讲解预约${statusText}${guideText}`,
          createdAt: Date.now(),
          isRead: false,
          relatedId: reservationId,
        };
        set({
          user: {
            ...get().user,
            reservations: get().user.reservations.map(r =>
              r.id === reservationId ? { ...r, status, guideName } : r
            ),
            notifications: [newNotification, ...get().user.notifications],
          },
        });
      },

      createSquad: (name, friendId, friendName, friendAvatar, friendHallId) => {
        const newSquad: Squad = {
          id: `squad-${Date.now()}`,
          name,
          leaderId: 'me',
          members: [
            {
              friendId: 'me',
              name: get().user.nickname,
              avatar: get().user.avatar,
              currentHallId: get().currentHallId,
              isOnline: true,
              joinedAt: Date.now(),
            },
            {
              friendId,
              name: friendName,
              avatar: friendAvatar,
              currentHallId: friendHallId || null,
              isOnline: true,
              joinedAt: Date.now(),
            },
          ],
          currentHallId: get().currentHallId,
          currentRouteId: null,
          createdAt: Date.now(),
        };
        const newNotification: Notification = {
          id: `notif-${Date.now() + 1}`,
          type: 'squad',
          title: '小队创建成功',
          content: `同游小队「${name}」已创建，${friendName}已加入`,
          createdAt: Date.now(),
          isRead: false,
        };
        set({
          user: {
            ...get().user,
            squad: newSquad,
            notifications: [newNotification, ...get().user.notifications],
          },
        });
      },

      joinSquad: (friendId, friendName, friendAvatar, friendHallId) => {
        const { squad } = get().user;
        if (!squad) return;
        
        const newMember: SquadMember = {
          friendId,
          name: friendName,
          avatar: friendAvatar,
          currentHallId: friendHallId || null,
          isOnline: true,
          joinedAt: Date.now(),
        };
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: 'squad',
          title: '新成员加入',
          content: `${friendName}加入了同游小队`,
          createdAt: Date.now(),
          isRead: false,
        };
        set({
          user: {
            ...get().user,
            squad: {
              ...squad,
              members: [...squad.members, newMember],
            },
            notifications: [newNotification, ...get().user.notifications],
          },
        });
      },

      leaveSquad: () => {
        set({
          user: {
            ...get().user,
            squad: null,
          },
        });
      },

      setSquadGatherPoint: (x, y, name) => {
        const { squad } = get().user;
        if (!squad) return;
        
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: 'squad',
          title: '集合点已更新',
          content: `队长将集合点设为「${name}」，请前往汇合`,
          createdAt: Date.now(),
          isRead: false,
        };
        set({
          user: {
            ...get().user,
            squad: {
              ...squad,
              gatherPoint: { x, y, name },
            },
            notifications: [newNotification, ...get().user.notifications],
          },
        });
      },

      updateSquadMemberLocation: (friendId, hallId) => {
        const { squad } = get().user;
        if (!squad) return;
        
        set({
          user: {
            ...get().user,
            squad: {
              ...squad,
              members: squad.members.map(m =>
                m.friendId === friendId ? { ...m, currentHallId: hallId } : m
              ),
            },
          },
        });
      },

      setSquadRoute: (routeId) => {
        const { squad } = get().user;
        if (!squad) return;
        set({
          user: {
            ...get().user,
            squad: { ...squad, currentRouteId: routeId },
          },
        });
      },

      setCurrentRoute: (routeId) => {
        set({
          user: {
            ...get().user,
            currentRouteId: routeId,
            routeProgress: routeId ? 0 : 0,
          },
        });
      },

      advanceRouteProgress: (exhibitId) => {
        const { currentRouteId, routeProgress } = get().user;
        if (!currentRouteId) return;

        if (exhibitId) {
          const route = getRouteByIdFromData(currentRouteId);
          if (!route) return;
          if (!route.exhibitIds.includes(exhibitId)) return;
        }

        const route = getRouteByIdFromData(currentRouteId);
        const maxProgress = route ? route.exhibitIds.length : 0;
        if (routeProgress >= maxProgress) return;

        set({
          user: {
            ...get().user,
            routeProgress: routeProgress + 1,
          },
        });
      },
    }),
    {
      name: 'museum-app-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
