import React, { useState } from 'react';
import {
  Users,
  Truck,
  MapPin,
  Calendar,
  ChevronRight,
  CheckCircle,
  Phone,
  Image as ImageIcon,
  FileText,
  Clock,
  Send,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WasteOrder, OrderStatus } from '../../types';
import { rankWorkersForOrder } from '../../utils/wasteLogic';

export const ReceivedOrdersView: React.FC = () => {
  const { orders, workers, updateOrderStatus, assignWorkerToOrder } = useApp();

  const [activeTab, setActiveTab] = useState<'people' | 'dump'>('people');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ORD-001');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesTab = activeTab === 'people' ? ord.type === 'citizen' : ord.type === 'dump_site';
    const matchesStatus =
      statusFilter === 'All Statuses' ? true : ord.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      ord.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesStatus && matchesSearch;
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || orders[0];

  const peopleCount = orders.filter((o) => o.type === 'citizen').length;
  const dumpCount = orders.filter((o) => o.type === 'dump_site').length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Assigned':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Collecting':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Collected':
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const rankedWorkers = selectedOrder ? rankWorkersForOrder(selectedOrder, workers) : [];

  return (
    <div className="space-y-6">
      {/* Header matching reference screenshot */}
      <div>
        <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
          REVIVE AI / RECEIVED ORDERS
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Received Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View and manage waste collection requests
        </p>
      </div>

      {/* Top Controls: Tabs + Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs: People Orders / Dump Waste Orders */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('people')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'people'
                ? 'bg-[#124229] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>People Orders ({peopleCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('dump')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'dump'
                ? 'bg-[#124229] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Dump Waste Orders ({dumpCount})</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              className="pl-9 pr-3 py-2 bg-white rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-slate-700 shadow-2xs"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              🔍
            </span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl text-xs sm:text-sm border border-slate-200 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 shadow-2xs cursor-pointer"
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Assigned</option>
            <option>Collecting</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {/* Main Master-Detail Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List Column (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-slate-400 text-sm border border-slate-200">
              No orders found matching criteria.
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`bg-white rounded-2xl p-3 sm:p-4 border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs hover:shadow-sm ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={ord.imageUrl}
                      alt={ord.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm tracking-tight truncate">
                          {ord.trackingNumber}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <span>👤</span>
                        <span>{ord.userType}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{ord.location}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5 shrink-0" />
                        <span>{ord.date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                        ord.status
                      )}`}
                    >
                      {ord.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Column (7 cols) */}
        {selectedOrder && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {selectedOrder.trackingNumber}
                  </h2>
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.date}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  {selectedOrder.userType}
                </span>
                <span>|</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedOrder.location}
                </span>
              </p>
            </div>

            {/* Photo & Details row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Photo */}
              <div className="md:col-span-6">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner group aspect-4/3">
                  <img
                    src={selectedOrder.imageUrl}
                    alt={selectedOrder.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedOrder.itemsDetected && selectedOrder.itemsDetected.length > 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {selectedOrder.itemsDetected.map((box) => (
                        <div
                          key={box.id}
                          style={{
                            left: `${box.x}%`,
                            top: `${box.y}%`,
                            width: `${box.width}%`,
                            height: `${box.height}%`,
                            borderColor: box.color || '#10b981',
                          }}
                          className="absolute border-2 rounded-xs shadow-xs"
                        >
                          <span
                            style={{ backgroundColor: box.color || '#10b981' }}
                            className="absolute -top-4 left-0 text-white text-[9px] font-bold px-1 rounded-xs"
                          >
                            {box.label} ({Math.round(box.confidence * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-lg">
                    {selectedOrder.imageCount} image{selectedOrder.imageCount > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Order Details box */}
              <div className="md:col-span-6 bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between text-xs space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Order Details</h4>

                <div className="space-y-2">
                  <div className="flex items-start justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      👤 Requested By:
                    </span>
                    <span className="font-bold text-slate-900 text-right">
                      {selectedOrder.requestedBy}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact:
                    </span>
                    <span className="font-semibold text-slate-800 text-right">
                      {selectedOrder.contact}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location:
                    </span>
                    <span className="font-semibold text-slate-800 text-right">
                      {selectedOrder.location}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Image Count:
                    </span>
                    <span className="font-semibold text-slate-800 text-right">
                      {selectedOrder.imageCount}
                    </span>
                  </div>

                  <div className="py-1">
                    <span className="text-slate-500 flex items-center gap-1.5 mb-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> Description:
                    </span>
                    <p className="text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                      "{selectedOrder.description}"
                    </p>
                  </div>

                  {selectedOrder.assignedWorkerName && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-900">
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase">
                          Assigned Collector
                        </p>
                        <p className="font-bold text-xs">
                          {selectedOrder.assignedWorkerName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location on Map snippet */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Location on Map</span>
              </h4>
              <div className="h-36 rounded-2xl bg-emerald-950/5 border border-slate-200 relative overflow-hidden flex items-center justify-center">
                {/* Visual Map Background simulation */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-70"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, #86efac30 0%, #064e3b20 100%), linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
                    backgroundSize: '100% 100%, 20px 20px, 20px 20px',
                  }}
                />
                <div className="relative z-10 flex items-center gap-2 bg-white/95 px-4 py-2 rounded-xl shadow-lg border border-slate-200">
                  <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">
                    {selectedOrder.trackingNumber}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ({selectedOrder.lat.toFixed(4)}, {selectedOrder.lng.toFixed(4)})
                  </span>
                </div>
              </div>
            </div>

            {/* Actions matching screenshot */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setAssignModalOpen(true)}
                className="flex-1 py-3 px-4 bg-[#124229] hover:bg-[#1a5538] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Assign Collection</span>
              </button>

              <button
                onClick={() => updateOrderStatus(selectedOrder.id, 'Completed')}
                className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Mark as Completed</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Smart Worker Assignment Modal */}
      {assignModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Smart Worker Dispatch
                </h3>
                <p className="text-xs text-slate-500">
                  Assign nearest available team for {selectedOrder.trackingNumber}
                </p>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
              {rankedWorkers.map(({ worker, distanceKm, eligible }, idx) => (
                <div
                  key={worker.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    eligible
                      ? 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-xs'
                      : 'bg-slate-50/70 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {worker.name}
                      </h4>
                      {idx === 0 && eligible && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Vehicle: {worker.vehicleType} • Capacity: {worker.vehicleCapacityKg} kg
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                      <span className="font-mono text-emerald-700 font-bold">
                        📍 {distanceKm} km away
                      </span>
                      <span>•</span>
                      <span
                        className={`font-semibold ${
                          worker.status === 'Available' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {worker.status}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={!eligible}
                    onClick={() => {
                      assignWorkerToOrder(selectedOrder.id, worker.id);
                      setAssignModalOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      eligible
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Dispatch Team
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
