export interface Exhibit {
  id: string;
  name: string;
  image: string;
  description: string;
  era: string;
  material: string;
  size: string;
  hallId: string;
  audioDuration: number;
  subtitle: string;
  category: string;
}

export interface Hall {
  id: string;
  name: string;
  theme: string;
  description: string;
  coverImage: string;
  exhibitCount: number;
  position: { x: number; y: number };
  isNew: boolean;
  category: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily';
  exhibitId?: string;
  question?: string;
  options?: string[];
  correctAnswer?: number;
  reward: string;
  badgeId?: string;
  progress: number;
  isCompleted: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  unlockedAt?: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  currentHall?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'emoji';
  timestamp: number;
}

export interface Photo {
  id: string;
  image: string;
  title: string;
  createdAt: number;
  location: string;
  type?: 'photo' | 'postcard';
  templateColor?: string;
  text?: string;
  squadId?: string;
  squadMembers?: string[];
  routeName?: string;
}

export interface TourRoute {
  id: string;
  name: string;
  description: string;
  hallIds: string[];
  exhibitIds: string[];
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  color: string;
}

export interface SquadMember {
  friendId: string;
  name: string;
  avatar: string;
  currentHallId: string | null;
  isOnline: boolean;
  joinedAt: number;
}

export interface Squad {
  id: string;
  name: string;
  leaderId: string;
  members: SquadMember[];
  currentHallId: string | null;
  currentRouteId: string | null;
  gatherPoint?: { x: number; y: number; name: string };
  createdAt: number;
}

export type NotificationType = 'reservation' | 'feedback' | 'badge' | 'squad' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  relatedId?: string;
  createdAt: number;
  isRead: boolean;
}

export interface Reservation {
  id: string;
  type: 'offline_guide';
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  guideName?: string;
}

export interface UserSettings {
  soundEnabled: boolean;
  subtitleEnabled: boolean;
  subtitleSize: 'small' | 'medium' | 'large';
  autoplayAudio: boolean;
}

export interface ChatSession {
  friendId: string;
  messages: Message[];
}

export interface UserData {
  avatar: string;
  nickname: string;
  collectedExhibits: string[];
  unlockedBadges: string[];
  completedTasks: string[];
  visitDuration: number;
  visitCount: number;
  reservations: Reservation[];
  photos: Photo[];
  settings: UserSettings;
  selectedAvatar: string;
  chats: ChatSession[];
  feedbacks: Feedback[];
  notifications: Notification[];
  squad: Squad | null;
  currentRouteId: string | null;
  routeProgress: number;
}

export interface AvatarOption {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Feedback {
  id: string;
  type: string;
  description: string;
  exhibitId?: string;
  createdAt: number;
  status: 'pending' | 'processing' | 'resolved';
}
