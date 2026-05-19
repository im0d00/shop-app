import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';

function TopBar({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className="bg-dark-800 border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Welcome back, {user?.name}!</h2>
          <p className="text-dark-400 text-sm">{user?.shop_name || 'Retail Store'}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-dark-400 hover:text-white transition-colors">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-white text-sm font-medium">{user?.name}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-dark-700 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
