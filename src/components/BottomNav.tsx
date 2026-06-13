import React from 'react';
import { Home, Map, Award, Users, Camera } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'lobby', label: '大厅', icon: Home, path: '/' },
  { id: 'map', label: '地图', icon: Map, path: '/map' },
  { id: 'tasks', label: '任务', icon: Award, path: '/tasks' },
  { id: 'social', label: '同行', icon: Users, path: '/social' },
  { id: 'backpack', label: '背包', icon: Camera, path: '/backpack' },
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'lobby';
    if (path === '/map') return 'map';
    if (path === '/tasks') return 'tasks';
    if (path.startsWith('/exhibit')) return 'map';
    if (path === '/social') return 'social';
    if (path === '/camera') return 'camera';
    if (path === '/backpack') return 'backpack';
    return 'lobby';
  };

  const currentPage = getCurrentPage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass-card rounded-t-2xl border-b-0 border-x-0 px-2 pt-2 pb-6 mx-0">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300',
                  isActive
                    ? 'text-gold scale-105'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <div className={cn(
                  'p-2 rounded-full transition-all duration-300',
                  isActive ? 'bg-gold/20 shadow-glow-gold' : ''
                )}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
