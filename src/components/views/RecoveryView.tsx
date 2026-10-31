import React, { useState } from 'react';
import {
  Recycle,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  Navigation,
  Car,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RecoveryOrder } from '../../types';

export const RecoveryView: React.FC = () => {
  const { recoveryOrders, markRecoveryCompleted } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'history'>('orders');
  const [selectedRecoveryId, setSelectedRecoveryId] = useState<string>('REC-001');
  const [mapMode, setMapMode] = useState<'map' | 'route'>('map');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');

  const filteredRecoveries = recoveryOrders.filter((rec) => {
    if (activeTab === 'history') return rec.status === 'Recovered';
    if (statusFilter === 'All Status') return true;
    return rec.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const selectedOrder =
    recoveryOrders.find((r) => r.id === selectedRecoveryId) ||
    filteredRecoveries[0] ||
    recoveryOrders[0];

  const totalRecoveredCount = recoveryOrders.length;
  const completedCount = recoveryOrders.filter((r) => r.status === 'Recovered').length;
  const pendingCount = recoveryOrders.filter((r) => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Top Header matching reference screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
            Recovery &gt; Recovery Orders
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Recovery Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View and manage recovered waste from dump sites
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="self-start sm:self-center px-3.5 py-2 bg-white rounded-xl text-xs sm:text-sm border border-slate-200 text-slate-700 font-medium shadow-2xs focus:outline-hidden cursor-pointer"
        >
          <option>All Status</option>
          <option>Recovered</option>
          <option>Pending</option>
        </select>
      </div>

      {/* 4 Stat Cards matching reference */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Recovered</p>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
              {totalRecoveredCount}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Completed</p>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
              {completedCount}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
              {pendingCount}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-100/80 to-green-50 border border-emerald-200/60 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-950">Cleaner Tomorrow</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Together for a greener city
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Recovery Orders / History */}
      <div className="flex bg-slate-200/60 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#124229] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Recovery Orders
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#124229] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          History
        </button>
      </div>

      {/* Main Split Layout: Left List (5 cols) & Right Detail (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Order Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredRecoveries.map((rec) => {
            const isSelected = selectedOrder?.id === rec.id;
            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecoveryId(rec.id)}
                className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs hover:shadow-sm ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={rec.imageUrl}
                    alt={rec.id}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                  />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {rec.id}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{rec.location}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-2.5 h-2.5 shrink-0" />
                      <span>{rec.recoveredOn}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      rec.status === 'Recovered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {rec.status === 'Recovered' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span>{rec.status}</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 hover:text-emerald-700">
                    <MapPin className="w-3 h-3" />
                    <span>View Location</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Recovery Order Details matching reference */}
        {selectedOrder && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-5">
            {/* Header info with check circle */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight">
                    {selectedOrder.id}
                  </h3>
                  <p className="text-xs text-slate-500">Recovery Order Details</p>
                </div>
              </div>

              <span
                className={`px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  selectedOrder.status === 'Recovered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {selectedOrder.status === 'Recovered' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{selectedOrder.status}</span>
              </span>
            </div>

            {/* 3 Meta Columns matching screenshot: Location, Recovered On, Recovered By */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Location</span>
                  <span className="font-bold text-slate-900 truncate">
                    {selectedOrder.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Recovered On</span>
                  <span className="font-bold text-slate-900">
                    {selectedOrder.recoveredOn}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Recycle className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Recovered By</span>
                  <span className="font-bold text-slate-900">
                    {selectedOrder.recoveredBy}
                  </span>
                </div>
              </div>
            </div>

            {/* Map View & Route View Tabs + Canvas */}
            <div className="space-y-3">
              <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                <button
                  onClick={() => setMapMode('map')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mapMode === 'map'
                      ? 'bg-[#124229] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setMapMode('route')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mapMode === 'route'
                      ? 'bg-[#124229] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Route View
                </button>
              </div>

              {/* Interactive Route Map canvas simulation matching reference */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <svg className="w-full h-full bg-[#e8f1ec]" viewBox="0 0 500 240">
                  {/* Grid roads */}
                  <line x1="20" y1="60" x2="480" y2="60" stroke="#cbd5e1" strokeWidth="6" />
                  <line x1="20" y1="160" x2="480" y2="160" stroke="#cbd5e1" strokeWidth="6" />
                  <line x1="120" y1="10" x2="120" y2="230" stroke="#cbd5e1" strokeWidth="6" />
                  <line x1="380" y1="10" x2="380" y2="230" stroke="#cbd5e1" strokeWidth="6" />

                  {/* Route Line in bright green matching screenshot */}
                  <path
                    d="M 120 60 L 140 100 L 220 120 L 320 160 L 380 160"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="6 2"
                  />

                  {/* Start depot point */}
                  <circle cx="120" cy="60" r="7" fill="#16a34a" stroke="white" strokeWidth="2" />

                  {/* End destination point with pulsing beacon */}
                  <circle cx="380" cy="160" r="28" fill="#16a34a" fillOpacity="0.2" />
                  <circle cx="380" cy="160" r="10" fill="#16a34a" stroke="white" strokeWidth="2.5" />
                  <polygon points="377,156 384,160 377,164" fill="white" />
                </svg>

                {/* Floating Navigate Here pill */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#124229] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 border border-white/20">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate Here →</span>
                </div>

                {/* Floating Distance & Time indicator at bottom left */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>Distance: {selectedOrder.distanceKm} km</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">
                    Time: ~{selectedOrder.estMinutes} min
                  </span>
                </div>
              </div>
            </div>

            {/* Recovery Summary Table */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 mb-3">
                <Recycle className="w-4 h-4 text-emerald-600" />
                <span>Recovery Summary</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 font-bold text-slate-900">
                  <span>Items Recovered</span>
                  <span className="text-emerald-700 font-black">
                    {selectedOrder.itemsRecoveredKg} kg
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 text-slate-700">
                  <span>Metal</span>
                  <span className="font-semibold">{selectedOrder.breakdown.metalKg} kg</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 text-slate-700">
                  <span>Plastic</span>
                  <span className="font-semibold">{selectedOrder.breakdown.plasticKg} kg</span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-700">
                  <span>E-Waste</span>
                  <span className="font-semibold">{selectedOrder.breakdown.ewasteKg} kg</span>
                </div>
              </div>
            </div>

            {/* Bottom Action Button matching screenshot */}
            <button
              onClick={() => markRecoveryCompleted(selectedOrder.id)}
              disabled={selectedOrder.status === 'Recovered'}
              className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedOrder.status === 'Recovered'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-[#124229] hover:bg-[#1a5538] text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {selectedOrder.status === 'Recovered'
                  ? 'Already Verified as Recovered'
                  : 'Mark as Recovered'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
