import type { TourRoute } from '@/types';

export const tourRoutes: TourRoute[] = [
  {
    id: 'route-1',
    name: '中华文明溯源',
    description: '从商代青铜器到明清青花瓷，沿着历史长河探索中华文明的发展脉络',
    hallIds: ['hall-1', 'hall-2', 'hall-5'],
    exhibitIds: ['exhibit-1', 'exhibit-2', 'exhibit-3', 'exhibit-4', 'exhibit-7'],
    estimatedTime: 45,
    difficulty: 'medium',
    icon: '🏛️',
    color: '#D4AF37',
  },
  {
    id: 'route-2',
    name: '艺术鉴赏之旅',
    description: '精选东西方艺术珍品，感受跨越时空的美学对话',
    hallIds: ['hall-2', 'hall-5'],
    exhibitIds: ['exhibit-3', 'exhibit-4', 'exhibit-7'],
    estimatedTime: 30,
    difficulty: 'easy',
    icon: '🎨',
    color: '#8B5CF6',
  },
  {
    id: 'route-3',
    name: '自然科学探索',
    description: '从宇宙诞生到生命演化，探索自然科学的奥秘',
    hallIds: ['hall-3', 'hall-4'],
    exhibitIds: ['exhibit-5', 'exhibit-6'],
    estimatedTime: 25,
    difficulty: 'medium',
    icon: '🔬',
    color: '#10B981',
  },
  {
    id: 'route-4',
    name: '丝绸之路',
    description: '跟随驼队足迹，感受东西方文明交汇的魅力',
    hallIds: ['hall-6', 'hall-5'],
    exhibitIds: ['exhibit-8', 'exhibit-7'],
    estimatedTime: 35,
    difficulty: 'hard',
    icon: '🐪',
    color: '#F59E0B',
  },
  {
    id: 'route-5',
    name: '博物馆深度游',
    description: '六大展厅全覆盖，深度体验博物馆的全部魅力',
    hallIds: ['hall-1', 'hall-2', 'hall-3', 'hall-4', 'hall-5', 'hall-6'],
    exhibitIds: ['exhibit-1', 'exhibit-2', 'exhibit-3', 'exhibit-4', 'exhibit-5', 'exhibit-6', 'exhibit-7', 'exhibit-8'],
    estimatedTime: 90,
    difficulty: 'hard',
    icon: '🌟',
    color: '#EC4899',
  },
];

export const getRouteById = (id: string): TourRoute | undefined => {
  return tourRoutes.find(route => route.id === id);
};

export const getRoutesByHall = (hallId: string): TourRoute[] => {
  return tourRoutes.filter(route => route.hallIds.includes(hallId));
};
