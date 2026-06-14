import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserData, UserSettings, Message, Feedback, Reservation, Photo } from '@/types';
import { mockMessages } from '@/data/social';

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
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'status'>) => void;
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
        set({
          user: {
            ...get().user,
            feedbacks: [newFeedback, ...get().user.feedbacks],
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
