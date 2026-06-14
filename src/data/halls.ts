import type { Hall } from '@/types';

export const halls: Hall[] = [
  {
    id: 'hall-1',
    name: '古代文明厅',
    theme: '历史',
    description: '探索人类古代文明的辉煌成就，从美索不达米亚到古埃及，从华夏文明到玛雅文化',
    coverImage: '/images/hall-ancient.svg',
    exhibitCount: 28,
    position: { x: 25, y: 30 },
    isNew: false,
    category: 'history',
  },
  {
    id: 'hall-2',
    name: '艺术珍品厅',
    theme: '艺术',
    description: '汇集东西方艺术大师的传世佳作，绘画、雕塑、装置艺术交相辉映',
    coverImage: '/images/hall-art.svg',
    exhibitCount: 35,
    position: { x: 60, y: 25 },
    isNew: true,
    category: 'art',
  },
  {
    id: 'hall-3',
    name: '自然科学厅',
    theme: '科技',
    description: '揭开自然的奥秘，从宇宙大爆炸到生命演化，从微观粒子到宏观世界',
    coverImage: '/images/hall-science.svg',
    exhibitCount: 42,
    position: { x: 20, y: 65 },
    isNew: false,
    category: 'science',
  },
  {
    id: 'hall-4',
    name: '数字未来厅',
    theme: '科技',
    description: '沉浸式体验数字科技的前沿成果，VR/AR、人工智能、元宇宙概念',
    coverImage: '/images/hall-tech.svg',
    exhibitCount: 18,
    position: { x: 70, y: 60 },
    isNew: true,
    category: 'tech',
  },
  {
    id: 'hall-5',
    name: '民俗文化厅',
    theme: '文化',
    description: '领略各地民俗风情，传统服饰、民间工艺、节庆习俗活态展示',
    coverImage: '/images/hall-culture.svg',
    exhibitCount: 52,
    position: { x: 45, y: 45 },
    isNew: false,
    category: 'culture',
  },
  {
    id: 'hall-6',
    name: '特展：丝路遗珍',
    theme: '特展',
    description: '丝绸之路沿线珍贵文物首次联合展出，限时开放中',
    coverImage: '/images/hall-special.svg',
    exhibitCount: 66,
    position: { x: 85, y: 35 },
    isNew: true,
    category: 'special',
  },
];

export const hallCategories = [
  { id: 'all', name: '全部' },
  { id: 'history', name: '历史' },
  { id: 'art', name: '艺术' },
  { id: 'science', name: '科技' },
  { id: 'culture', name: '文化' },
  { id: 'special', name: '特展' },
];

export const getHallById = (id: string) => {
  return halls.find(hall => hall.id === id);
};
