import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Smartphone,
  Plane,
  Shield,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
}

export const AdminHeader: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  searchPlaceholder = 'Search locations, items, orders...',
  onSearchChange,
  searchValue = '',
}) => {
  const {
    role,
    setRole,
    notifications,
    markNotificationAsRead,
    setIsLandingPage,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#f0f6f2]/95 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-emerald-950/5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/50" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-full text-xs sm:text-sm text-slate-700 placeholder-slate-400 border border-emerald-900/10 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Landing Page link button */}
        <button
          onClick={() => setIsLandingPage(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/80 transition-colors cursor-pointer"
        >
          <span>Landing Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-full bg-white text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-900/10 shadow-2xs transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {unreadCount} new
                  </span>
                </div>
                <button
                  onClick={() => notifications.forEach((n) => markNotificationAsRead(n.id))}
                  className="text-xs text-emerald-600 hover:underline font-medium cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 rounded-xl transition-all cursor-pointer ${
                        n.read
                          ? 'bg-slate-50/70 text-slate-600'
                          : 'bg-emerald-50/60 border border-emerald-200/50 text-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold">{n.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-white rounded-full border border-emerald-900/10 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#0a311e] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {role === 'admin'
                ? 'M'
                : role === 'collector'
                ? 'CW'
                : role === 'drone_operator'
                ? 'DO'
                : 'C'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {role === 'admin'
                  ? 'Manager'
                  : role === 'collector'
                  ? 'Field Collector'
                  : role === 'drone_operator'
                  ? 'Drone Pilot'
                  : 'Citizen Contributor'}
              </p>
              <p className="text-[10px] text-emerald-700 capitalize font-medium">
                {role === 'admin' ? 'Administrator' : role.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1.5">
                <p className="text-xs font-bold text-slate-900">Switch View / Role</p>
                <p className="text-[10px] text-slate-500">
                  Preview different user experiences
                </p>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setRole('admin');
                    setProfileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                    role === 'admin'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Administrator</span>
                  </div>
                  {role === 'admin' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  onClick={() => {
                    setRole('citizen');
                    setProfileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                    role === 'citizen'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Citizen Portal</span>
                  </div>
                  {role === 'citizen' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  onClick={() => {
                    setRole('collector');
                    setProfileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                    role === 'collector'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Collector Field App</span>
                  </div>
                  {role === 'collector' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  onClick={() => {
                    setRole('drone_operator');
                    setProfileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                    role === 'drone_operator'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Plane className="w-4 h-4 text-emerald-600" />
                    <span>Drone Operator</span>
                  </div>
                  {role === 'drone_operator' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              </div>

              <div className="border-t border-slate-100 mt-2 pt-1.5">
                <button
                  onClick={() => {
                    setIsLandingPage(true);
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Public Landing Page</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
