import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserData, UserSettings } from '@/types';

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
  addPhoto: (photoId: string, image: string, title: string, location: string) => void;
  setShowAvatarSelector: (show: boolean) => void;
  togglePlay: (audioId?: string) => void;
  setPlaybackProgress: (progress: number) => void;
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
      
      addPhoto: (photoId, image, title, location) => {
        set({
          user: {
            ...get().user,
            photos: [
              { id: photoId, image, title, createdAt: Date.now(), location },
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
    }),
    {
      name: 'museum-app-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
