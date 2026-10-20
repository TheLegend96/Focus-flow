import React from 'react';
import { Clock, BarChart2, User, Star, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: 'timer' | 'analytics' | 'profile' | 'favorites' | 'settings';
  setActiveTab: (tab: 'timer' | 'analytics' | 'profile' | 'favorites' | 'settings') => void;
  onOpenCalendar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-16 border-r border-zinc-100 flex flex-col items-center justify-between py-6 bg-white shrink-0 select-none">
      {/* Top Window controls or subtle brand */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
        </div>
      </div>

      {/* Middle Navigation Icons */}
      <nav className="flex flex-col items-center gap-6">
        {/* Timer Tab */}
        <button
          onClick={() => setActiveTab('timer')}
          className={`relative p-2 rounded-xl transition-all ${
            activeTab === 'timer'
              ? 'text-zinc-900'
              : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
          }`}
          title="Focus Timer"
        >
          <Clock className="w-5 h-5 stroke-[1.75]" />
          {activeTab === 'timer' && (
            <span className="absolute -top-0.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
          )}
        </button>

        {/* Analytics Tab */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`p-2 rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'text-zinc-900 bg-zinc-100'
              : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
          }`}
          title="Analytics"
        >
          <BarChart2 className="w-5 h-5 stroke-[1.75]" />
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`p-2 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-zinc-900 bg-zinc-100'
              : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
          }`}
          title="User Profile & Sync"
        >
          <User className="w-5 h-5 stroke-[1.75]" />
        </button>

        {/* Favorites */}
        <button
          onClick={() => setActiveTab('favorites')}
          className={`p-2 rounded-xl transition-all ${
            activeTab === 'favorites'
              ? 'text-zinc-900 bg-zinc-100'
              : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
          }`}
          title="Bookmarks & Favorites"
        >
          <Star className="w-5 h-5 stroke-[1.75]" />
        </button>
      </nav>

      {/* Bottom Settings */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => setActiveTab('settings')}
          className={`p-2 rounded-xl transition-all ${
            activeTab === 'settings'
              ? 'text-zinc-900 bg-zinc-100'
              : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
          }`}
          title="Settings & Integrations"
        >
          <Settings className="w-5 h-5 stroke-[1.75]" />
        </button>
      </div>
    </aside>
  );
};
