import React from 'react';
import {
  Home,
  Camera,
  MapPin,
  Inbox,
  Truck,
  ShieldCheck,
  Recycle,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import { useApp, AdminView } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, systemOnline, setSystemOnline } = useApp();

  const navItems: { id: AdminView; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'drone_captures', label: 'Drone Captures', icon: Camera },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'received_orders', label: 'Received Orders', icon: Inbox },
    { id: 'collection', label: 'Collection', icon: Truck },
    { id: 'inspection', label: 'Inspection', icon: ShieldCheck },
    { id: 'recovery', label: 'Recovery', icon: Recycle },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: AdminView) => {
    setCurrentView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main & ONLY Sidebar */}
      <aside
        id="main-app-sidebar"
        aria-label="Main Navigation"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a311e] text-white flex flex-col border-r border-[#15462c] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-[#14442a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-[#0a311e]">
              <Recycle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  ReVive AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium tracking-wide">
                Waste. Renewed.
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900/50"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu Section */}
        <div className="flex-1 py-6 px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-900">
          <div className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-widest px-3 mb-3">
            Main Menu
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#1b5837] text-white shadow-xs font-semibold'
                      : 'text-emerald-100/80 hover:text-white hover:bg-[#124229]'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'text-emerald-300 scale-105' : 'text-emerald-400/70'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / System Status */}
        <div className="p-4 border-t border-[#14442a] bg-[#082818]/60">
          <button
            onClick={() => setSystemOnline(!systemOnline)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-emerald-200/90 hover:bg-[#124229] transition-colors cursor-pointer"
            title="Toggle system connection status"
          >
            <span className="relative flex h-2.5 w-2.5">
              {systemOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  systemOnline ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              ></span>
            </span>
            <span className="tracking-wide">
              {systemOnline ? 'System Online' : 'System Paused'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
