import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Navigation,
  CheckCircle2,
  Camera,
  Scale,
  Phone,
  Clock,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FieldCollectorView: React.FC = () => {
  const { orders, updateOrderStatus, setRole } = useApp();

  // Active collection job
  const assignedOrders = orders.filter(
    (o) => o.status === 'Assigned' || o.status === 'Collecting'
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(
    assignedOrders[0]?.id || 'ORD-003'
  );
  const [jobStage, setJobStage] = useState<'dispatch' | 'arrived' | 'evidence' | 'finished'>('dispatch');
  const [recordedWeight, setRecordedWeight] = useState<number>(45);

  const currentJob =
    orders.find((o) => o.id === selectedJobId) || assignedOrders[0] || orders[0];

  const handleStartMission = () => {
    if (!currentJob) return;
    updateOrderStatus(currentJob.id, 'Collecting');
    setJobStage('arrived');
  };

  const handleConfirmArrival = () => {
    setJobStage('evidence');
  };

  const handleFinishPickup = () => {
    if (!currentJob) return;
    updateOrderStatus(currentJob.id, 'Collected');
    setJobStage('finished');
  };

  return (
    <div className="max-w-md mx-auto space-y-5 py-2">
      {/* Field Worker Header Card */}
      <div className="bg-[#124229] text-white rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-black">
              🚚
            </div>
            <div>
              <h2 className="font-extrabold text-base leading-tight">
                Team Alpha (Collector #103)
              </h2>
              <p className="text-[11px] text-emerald-300">
                Vehicle: EV Tipper • Status: On Duty
              </p>
            </div>
          </div>

          <button
            onClick={() => setRole('admin')}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-emerald-200 cursor-pointer"
          >
            Admin View
          </button>
        </div>

        {/* GPS Sensor status banner */}
        <div className="bg-white/10 rounded-2xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>GPS Tracking Broadcast: Active</span>
          </div>
          <span className="font-mono text-emerald-300">8.7312° N, 77.7485° E</span>
        </div>
      </div>

      {/* Today's Tasks Selector */}
      <div className="bg-white rounded-3xl p-4 border border-emerald-900/10 shadow-xs space-y-2">
        <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
          Assigned Orders Today ({assignedOrders.length})
        </h3>

        <div className="space-y-2">
          {assignedOrders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => {
                setSelectedJobId(ord.id);
                setJobStage(ord.status === 'Collecting' ? 'arrived' : 'dispatch');
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedJobId === ord.id
                  ? 'border-emerald-500 bg-emerald-50/60'
                  : 'border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="font-bold text-slate-900 text-xs">
                  {ord.trackingNumber}
                </span>
                <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                  {ord.location}
                </p>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {ord.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Active Mission Card */}
      {currentJob && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Current Active Job
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {currentJob.trackingNumber}
              </h3>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{currentJob.location}</span>
              </p>
            </div>

            <a
              href={`tel:${currentJob.contact}`}
              className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
              title="Call Citizen Contact"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Large Action Workflow Buttons */}
          {jobStage === 'dispatch' && (
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-slate-800">Destination Instructions:</p>
                <p className="text-slate-600">
                  Contact {currentJob.requestedBy} upon arrival. Check for lithium battery isolation before loading onto vehicle bed.
                </p>
              </div>

              <button
                onClick={handleStartMission}
                className="w-full py-4 bg-[#124229] hover:bg-[#1a5538] text-white rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Start Route Navigation</span>
              </button>
            </div>
          )}

          {jobStage === 'arrived' && (
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-900">
                <p className="font-bold">En Route to {currentJob.location}</p>
                <p className="text-[11px] mt-0.5">Estimated Arrival: 4 minutes</p>
              </div>

              <button
                onClick={handleConfirmArrival}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Confirm Arrival at Pickup Site</span>
              </button>
            </div>
          )}

          {jobStage === 'evidence' && (
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Weighed Electronic Scrap (KG)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={recordedWeight}
                    onChange={(e) => setRecordedWeight(Number(e.target.value))}
                    className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                  <span className="font-bold text-slate-600">KG</span>
                </div>
              </div>

              <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 text-center bg-emerald-50/40">
                <Camera className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block">
                  Photo Proof of Collection
                </span>
                <span className="text-[10px] text-slate-500">
                  Captured at 8.7392° N, 77.7412° E
                </span>
              </div>

              <button
                onClick={handleFinishPickup}
                className="w-full py-4 bg-[#124229] hover:bg-[#1a5538] text-white rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Pickup &amp; Transfer to Facility</span>
              </button>
            </div>
          )}

          {jobStage === 'finished' && (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h4 className="font-black text-slate-900">
                Collection Successfully Logged!
              </h4>
              <p className="text-xs text-slate-500">
                Item logged for Material Triage and Durability Inspection at Tirunelveli Circular Recovery Hub.
              </p>
              <button
                onClick={() => setJobStage('dispatch')}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Next Assigned Job
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
