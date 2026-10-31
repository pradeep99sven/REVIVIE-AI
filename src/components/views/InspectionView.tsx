import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  FileText,
  Plus,
  Box,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InspectionRecord, DurabilityStatus } from '../../types';
import { evaluateRecoverability } from '../../utils/wasteLogic';

export const InspectionView: React.FC = () => {
  const { inspections, addNewInspection } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'durable' | 'pending'>('all');
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>('INSP-001');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // New Inspection Form state
  const [newStatus, setNewStatus] = useState<DurabilityStatus>('Durable');
  const [newLocation, setNewLocation] = useState<string>('Dump Site 01 – NW Sector');
  const [newNotes, setNewNotes] = useState<string>('Materials verified clean and sorted for recovery.');

  const filteredInspections = inspections.filter((insp) => {
    if (filterTab === 'durable') return insp.status === 'Durable';
    if (filterTab === 'pending') return insp.status === 'Pending';
    return true;
  });

  const selectedInspection =
    inspections.find((i) => i.id === selectedInspectionId) ||
    filteredInspections[0] ||
    inspections[0];

  const handleCreateInspection = () => {
    const evalData = evaluateRecoverability(newStatus);
    addNewInspection({
      status: newStatus,
      location: newLocation,
      resultDescription: evalData.recommendation,
      inspectorNotes: newNotes,
      summary: {
        metalScrapKg: 140,
        plasticKg: 65,
        aluminiumKg: 45,
        cardboardKg: 20,
        ewasteKg: 85,
      },
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching reference screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
            Inspection &gt; Inspection Records
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Inspection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review collected waste and check durability status
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 bg-[#124229] hover:bg-[#1a5538] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Conduct Inspection</span>
        </button>
      </div>

      {/* Tabs matching screenshot: All Inspections / Durable / Pending */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-200/60 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-[#124229] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All Inspections</span>
          </button>
          <button
            onClick={() => setFilterTab('durable')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filterTab === 'durable'
                ? 'bg-[#124229] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Durable</span>
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filterTab === 'pending'
                ? 'bg-[#124229] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending</span>
          </button>
        </div>

        <select className="px-3.5 py-2 bg-white rounded-xl text-xs sm:text-sm border border-slate-200 text-slate-700 font-medium shadow-2xs focus:outline-hidden cursor-pointer">
          <option>All Status</option>
          <option>Durable</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Main Split Layout: Left List (5 cols) & Right Detail (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inspection Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredInspections.map((insp) => {
            const isSelected = selectedInspection?.id === insp.id;
            return (
              <div
                key={insp.id}
                onClick={() => setSelectedInspectionId(insp.id)}
                className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs hover:shadow-sm ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={insp.imageUrl}
                    alt={insp.id}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                  />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {insp.id}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{insp.location}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-2.5 h-2.5 shrink-0" />
                      <span>{insp.date}</span>
                    </p>
                    <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                      Collection: {insp.collectionId}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      insp.status === 'Durable'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {insp.status === 'Durable' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{insp.status}</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Inspection Details Panel matching reference */}
        {selectedInspection && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-5">
            {/* Top Detail Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight">
                    Inspection Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Detailed inspection report for collected waste
                  </p>
                </div>
              </div>

              <span
                className={`px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  selectedInspection.status === 'Durable'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {selectedInspection.status === 'Durable' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{selectedInspection.status}</span>
              </span>
            </div>

            {/* Meta Row: Inspection ID, Date, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Inspection ID</span>
                  <span className="font-bold text-slate-900">
                    {selectedInspection.id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Inspection Date</span>
                  <span className="font-bold text-slate-900">
                    {selectedInspection.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Location</span>
                  <span className="font-bold text-slate-900 truncate">
                    {selectedInspection.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Inspection Photo */}
            <div className="rounded-2xl overflow-hidden aspect-16/9 bg-slate-900 border border-slate-200">
              <img
                src={selectedInspection.imageUrl}
                alt={selectedInspection.id}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Result Box (Green Card) */}
            <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                  Result
                </p>
                <h4 className="font-black text-emerald-950 text-lg">
                  {selectedInspection.status}
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  {selectedInspection.resultDescription}
                </p>
              </div>
            </div>

            {/* Collected Item Summary Table */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5">
                Collected Item Summary
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-600 font-bold">🧱</span>
                    <span className="font-medium text-slate-800">Metal Scrap</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {selectedInspection.summary.metalScrapKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-blue-500 font-bold">🧴</span>
                    <span className="font-medium text-slate-800">Plastic Bottles</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {selectedInspection.summary.plasticKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 font-bold">🥫</span>
                    <span className="font-medium text-slate-800">Aluminium Cans</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {selectedInspection.summary.aluminiumKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-amber-600 font-bold">📦</span>
                    <span className="font-medium text-slate-800">Cardboard</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {selectedInspection.summary.cardboardKg} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Inspector Notes */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Inspector Notes</span>
              </span>
              <p className="text-slate-600 italic">
                "{selectedInspection.inspectorNotes}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Conduct Inspection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Conduct Material Triage & Inspection
                </h3>
                <p className="text-xs text-slate-500">
                  Verify durability, contaminants, and recycling yield
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Durability & Quality Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as DurabilityStatus)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium"
                >
                  <option value="Durable">Durable (High quality circular recovery)</option>
                  <option value="Repairable">Repairable (Suitable for component refurbishment)</option>
                  <option value="Recyclable">Recyclable (Smelting & mechanical sorting)</option>
                  <option value="Hazardous">Hazardous (Contains lead/cadmium/lithium)</option>
                  <option value="Pending">Pending (Requires secondary lab test)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Processing Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Inspector Notes & Triage Findings
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateInspection}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Inspection Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
