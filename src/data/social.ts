import type { Friend, AvatarOption, Message } from '@/types';

export const friends: Friend[] = [
  {
    id: 'friend-1',
    name: '小明',
    avatar: '/images/avatar-1.svg',
    isOnline: true,
    currentHall: '古代文明厅',
  },
  {
    id: 'friend-2',
    name: '小红',
    avatar: '/images/avatar-2.svg',
    isOnline: true,
    currentHall: '艺术珍品厅',
  },
  {
    id: 'friend-3',
    name: '大壮',
    avatar: '/images/avatar-3.svg',
    isOnline: false,
  },
  {
    id: 'friend-4',
    name: '晓雯',
    avatar: '/images/avatar-4.svg',
    isOnline: true,
    currentHall: '数字未来厅',
  },
  {
    id: 'friend-5',
    name: '阿杰',
    avatar: '/images/avatar-5.svg',
    isOnline: false,
  },
  {
    id: 'friend-6',
    name: '思思',
    avatar: '/images/avatar-6.svg',
    isOnline: true,
    currentHall: '民俗文化厅',
  },
];

export const avatarOptions: AvatarOption[] = [
  {
    id: 'avatar-1',
    name: '探险家',
    image: '/images/avatar-1.svg',
    description: '勇敢的博物馆探险家',
  },
  {
    id: 'avatar-2',
    name: '学者',
    image: '/images/avatar-2.svg',
    description: '博学的历史学者',
  },
  {
    id: 'avatar-3',
    name: '艺术家',
    image: '/images/avatar-3.svg',
    description: '充满灵感的艺术家',
  },
  {
    id: 'avatar-4',
    name: '科学家',
    image: '/images/avatar-4.svg',
    description: '求真的科学家',
  },
  {
    id: 'avatar-5',
    name: '旅行家',
    image: '/images/avatar-5.svg',
    description: '环游世界的旅行家',
  },
  {
    id: 'avatar-6',
    name: '守护者',
    image: '/images/avatar-6.svg',
    description: '文化遗产守护者',
  },
];

export const emojiActions = [
  { id: 'wave', emoji: '👋', name: '挥手' },
  { id: 'clap', emoji: '👏', name: '鼓掌' },
  { id: 'heart', emoji: '❤️', name: '比心' },
  { id: 'thumbsup', emoji: '👍', name: '点赞' },
  { id: 'star', emoji: '⭐', name: '星星' },
  { id: 'fire', emoji: '🔥', name: '火焰' },
  { id: 'party', emoji: '🎉', name: '庆祝' },
  { id: 'think', emoji: '🤔', name: '思考' },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'friend-1',
    content: '嗨！你也来参观啦',
    type: 'text',
    timestamp: Date.now() - 300000,
  },
  {
    id: 'msg-2',
    senderId: 'me',
    content: '对呀，今天有特展',
    type: 'text',
    timestamp: Date.now() - 280000,
  },
  {
    id: 'msg-3',
    senderId: 'friend-1',
    content: '一起去看丝路遗珍吧！',
    type: 'text',
    timestamp: Date.now() - 260000,
  },
  {
    id: 'msg-4',
    senderId: 'friend-1',
    content: '👏',
    type: 'emoji',
    timestamp: Date.now() - 250000,
  },
];

export const photoSpots = [
  { id: 'spot-1', name: '大厅入口', x: 50, y: 50 },
  { id: 'spot-2', name: '青铜方鼎前', x: 30, y: 35 },
  { id: 'spot-3', name: '恐龙化石旁', x: 25, y: 70 },
  { id: 'spot-4', name: '丝路展馆', x: 80, y: 40 },
  { id: 'spot-5', name: '艺术长廊', x: 55, y: 55 },
];

export const postcardTemplates = [
  { id: 'tpl-1', name: '典雅金框', color: '#D4AF37', style: 'elegant' },
  { id: 'tpl-2', name: '简约白框', color: '#FFFFFF', style: 'minimal' },
  { id: 'tpl-3', name: '科技蓝框', color: '#00D4AA', style: 'tech' },
  { id: 'tpl-4', name: '复古棕框', color: '#8B4513', style: 'vintage' },
];
