import React from 'react';
import {
  Camera,
  Truck,
  ShieldCheck,
  Recycle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Scan,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const { orders, setCurrentView, systemOnline, setRole } = useApp();

  return (
    <div className="space-y-6">
      {/* Welcome Banner matching screenshot */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-900/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative leaf background tint */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-100/40 to-transparent pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-950/20">
            <span className="text-2xl">🍃</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, John!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Smarter waste management. A cleaner tomorrow.
            </p>
          </div>
        </div>

        {/* Right System Indicator */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="relative flex h-2.5 w-2.5">
                {systemOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    systemOnline ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                ></span>
              </span>
              <span className="text-xs font-bold text-slate-800">
                {systemOnline ? 'System Online' : 'System Paused'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Last updated: 2 min ago</p>
          </div>

          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shrink-0 border border-emerald-200/50 shadow-xs">
            🌍
          </div>
        </div>
      </div>

      {/* 4 Stats with Sparkline trend lines matching reference */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Items Detected */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              ↑ 12%
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">128</div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Items Detected</p>
          </div>
          {/* Sparkline curve */}
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
              <path
                d="M 0 18 Q 20 22, 40 14 T 70 8 T 100 4"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 2. Collected */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              ↑ 8%
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">46</div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Collected</p>
          </div>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
              <path
                d="M 0 20 Q 25 15, 50 16 T 75 10 T 100 6"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 3. Under Inspection */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5">
              ↑ 5%
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">32</div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Under Inspection</p>
          </div>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
              <path
                d="M 0 16 Q 30 20, 50 12 T 80 14 T 100 8"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 4. Recovered */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              ↑ 20%
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">18</div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Recovered</p>
          </div>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
              <path
                d="M 0 22 Q 20 18, 45 10 T 75 8 T 100 2"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Row: Waste Detection Map (4 cols) | Recent Detections (4 cols) | Activity Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. Waste Detection Map */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Waste Detection Map
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('map')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mini Interactive Map representation */}
          <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
              alt="Satellite Map Area"
              className="w-full h-full object-cover opacity-80"
            />
            {/* Markers */}
            <div className="absolute top-1/4 left-1/3 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-emerald-950/50 animate-bounce">
              ♻️
            </div>
            <div className="absolute top-1/2 left-2/3 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-emerald-950/50">
              ♻️
            </div>
            <div className="absolute bottom-1/4 left-1/2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-blue-950/50">
              📍
            </div>
            <div className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-amber-950/50">
              ⚠️
            </div>

            {/* Map Legend Pill */}
            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-white flex items-center gap-2.5">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Electronic
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Plastic
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Fibre
              </span>
            </div>
          </div>
        </div>

        {/* 2. Recent Detections 2x2 Grid */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-emerald-700" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Recent Detections
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('drone_captures')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Laptop */}
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-900 border border-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80"
                alt="Laptop waste"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#124229] text-white shadow-xs">
                Laptop
              </span>
            </div>

            {/* Phones */}
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-900 border border-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1596558450268-9c27524ba856?auto=format&fit=crop&w=300&q=80"
                alt="Phones waste"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#124229] text-white shadow-xs">
                Phones
              </span>
            </div>

            {/* Electronics */}
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-900 border border-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80"
                alt="Electronics waste"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#124229] text-white shadow-xs">
                Electronics
              </span>
            </div>

            {/* Plastic */}
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-900 border border-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=300&q=80"
                alt="Plastic waste"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#124229] text-white shadow-xs">
                Plastic
              </span>
            </div>
          </div>
        </div>

        {/* 3. Activity Feed Timeline */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700">⚡</span>
            <h3 className="font-extrabold text-slate-900 text-sm">Activity Feed</h3>
          </div>

          <div className="relative pl-6 space-y-4 pt-1 border-l-2 border-emerald-100 ml-2 text-xs">
            {/* Event 1 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              <div className="flex items-start justify-between gap-1">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    New detection at Sector B
                  </h4>
                  <span className="text-[10px] text-slate-400">2 min ago</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=100&q=80"
                  className="w-7 h-7 rounded-lg object-cover"
                  alt="item"
                />
              </div>
            </div>

            {/* Event 2 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">
                  Collection completed (46 items)
                </h4>
                <span className="text-[10px] text-slate-400">12 min ago</span>
              </div>
            </div>

            {/* Event 3 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-xs" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">
                  Inspection in progress (32 items)
                </h4>
                <span className="text-[10px] text-slate-400">18 min ago</span>
              </div>
            </div>

            {/* Event 4 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">
                  Recovery process started (18 items)
                </h4>
                <span className="text-[10px] text-slate-400">25 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: New Waste Report Action Banner (8 cols) & Material Recovery Overview (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* New Waste Report Banner */}
        <div className="lg:col-span-8 bg-gradient-to-r from-[#0d3824] to-[#165538] text-white rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                New Waste Report
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Upload a photo or use drone scanning to detect waste and immediately route it into the tracking workflow.
            </p>
          </div>

          <div className="pt-6 relative z-10">
            <button
              onClick={() => setRole('citizen')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-[#0d3824] rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Start Detection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Background drone silhouette */}
          <div className="absolute right-4 bottom-2 opacity-35 hidden sm:block pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80"
              alt="Drone scan"
              className="w-64 h-36 object-cover rounded-2xl mix-blend-luminosity"
            />
          </div>
        </div>

        {/* Material Recovery Overview Donut */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Recycle className="w-4 h-4 text-emerald-700" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Material Recovery Overview
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('reports')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Report</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Donut and Legend */}
          <div className="flex items-center justify-around gap-4 pt-2">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray="185 54"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900">78%</span>
                <span className="text-[9px] font-bold text-slate-400">Recovery</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="text-slate-600 font-medium">Reusable Electronics</span>
                <span className="font-bold text-slate-900 ml-auto">45%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-500"></span>
                <span className="text-slate-600 font-medium">Recycled Plastic</span>
                <span className="font-bold text-slate-900 ml-auto">35%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                <span className="text-slate-600 font-medium">Recycled Fibre</span>
                <span className="font-bold text-slate-900 ml-auto">20%</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Circular index: ISO 14021</span>
            <span className="text-emerald-700 font-bold">Grade A+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
