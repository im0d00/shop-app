import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Package, ShoppingCart, DollarSign, Users, Settings, FileText, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home, roles: ['super_admin', 'manager', 'cashier'] },
    { path: '/pos', label: 'POS', icon: ShoppingCart, roles: ['super_admin', 'manager', 'cashier'] },
    { path: '/inventory', label: 'Inventory', icon: Package, roles: ['super_admin', 'manager', 'inventory'] },
    { path: '/sales', label: 'Sales', icon: DollarSign, roles: ['super_admin', 'manager', 'cashier'] },
    { path: '/customers', label: 'Customers', icon: Users, roles: ['super_admin', 'manager'] },
    { path: '/employees', label: 'Employees', icon: Users, roles: ['super_admin', 'manager'] },
    { path: '/reports', label: 'Reports', icon: FileText, roles: ['super_admin', 'manager'] },
    { path: '/settings', label: 'Settings', icon: Settings, roles: ['super_admin'] },
  ];

  const visibleItems = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-dark-800 border-r border-dark-700 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">ROS</span>
            </div>
            <h1 className="text-xl font-bold text-white">Retail OS</h1>
          </div>

          <nav className="space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                      : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-dark-800 text-white hover:bg-dark-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </>
  );
}

export default Sidebar;
