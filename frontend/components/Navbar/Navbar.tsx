'use client';

import { Menu, Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '@/lib/auth/authStore';
import { useEffect } from 'react';

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Navbar({ onMenuClick, title = 'Dashboard' }: NavbarProps) {
  const { user, hydrate } = useAuthStore();

  useEffect(() => { hydrate(); }, [hydrate]);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-40"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
