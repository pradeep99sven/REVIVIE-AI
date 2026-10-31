import React, { useState } from 'react';
import {
  UploadCloud,
  MapPin,
  Sparkles,
  CheckCircle,
  Clock,
  Send,
  Phone,
  User,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { detectEWasteInImage, DetectionResult } from '../../services/aiDetection';
import { WasteCategory, BoundingBox } from '../../types';

export const CitizenPortalView: React.FC = () => {
  const { addNewOrder, orders, setRole } = useApp();

  const [reportType, setReportType] = useState<'single' | 'bulk'>('single');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number>(8.5241);
  const [lng, setLng] = useState<number>(76.9366);
  const [condition, setCondition] = useState<string>('Working');
  const [quantity, setQuantity] = useState<number>(1);
  const [description, setDescription] = useState('');

  // AI detection states
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);

  // Run AI detection
  const handleAnalyzePhoto = async () => {
    setIsAnalyzing(true);
    try {
      const res = await detectEWasteInImage(imagePreview);
      setDetectionResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get current geolocation
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setAddress(`GPS Location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          setAddress('North Zone, Trivandrum (Sector 4)');
        }
      );
    } else {
      setAddress('North Zone, Trivandrum (Sector 4)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) {
      alert('Please provide your name and contact phone number.');
      return;
    }

    const created = addNewOrder({
      type: 'citizen',
      title: `${reportType === 'bulk' ? 'Bulk ' : ''}E-Waste Contribution`,
      requestedBy: name,
      contact: contact,
      location: address || 'North Zone, Trivandrum',
      lat: lat,
      lng: lng,
      description: description || `Condition: ${condition}. Quantity: ${quantity} items.`,
      estimatedWeightKg: quantity * 4,
      imageUrl: imagePreview,
      itemsDetected: detectionResult?.items || [],
    });

    setSubmittedOrder(created);
  };

  const citizenOrders = orders.filter((o) => o.type === 'citizen');

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="bg-[#124229] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-300">
            <span>🌱</span> Citizen Waste Contributor Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Report Unused Electronics for Circular Recovery
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Upload photos of your idle gadgets, laptops, phones, cables or home electronics.
            Our computer vision model categorizes them and dispatches collection teams directly to your doorstep.
          </p>
        </div>

        <button
          onClick={() => setRole('admin')}
          className="self-start md:self-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Switch to Admin Dashboard →
        </button>
      </div>

      {submittedOrder ? (
        /* Confirmation screen */
        <div className="bg-white rounded-3xl p-8 border border-emerald-900/10 shadow-sm text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Request Logged: {submittedOrder.trackingNumber}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you! Your electronic waste report has been transmitted to our Tirunelveli / Trivandrum central dispatch hub.
            Our team will contact you at <span className="font-bold text-slate-900">{submittedOrder.contact}</span> prior to arrival.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl max-w-md mx-auto text-xs text-left space-y-2 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-bold text-slate-800">{submittedOrder.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
                {submittedOrder.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Weight:</span>
              <span className="font-bold text-slate-800">{submittedOrder.estimatedWeightKg} kg</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedOrder(null);
                setDetectionResult(null);
              }}
              className="px-5 py-2.5 bg-[#124229] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#1a5538] cursor-pointer"
            >
              Report Another Gadget
            </button>
            <button
              onClick={() => setRole('admin')}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Track in Admin Map
            </button>
          </div>
        </div>
      ) : (
        /* Citizen Submission Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: AI Photo Analysis (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Step 1: AI E-Waste Photo Scanner</span>
            </h3>

            {/* Photo preview with bounding boxes */}
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 border border-slate-200 group">
              <img
                src={imagePreview}
                alt="Uploaded Gadget"
                className="w-full h-full object-cover"
              />

              {detectionResult && (
                <div className="absolute inset-0 pointer-events-none">
                  {detectionResult.items.map((box) => (
                    <div
                      key={box.id}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                        borderColor: box.color || '#10b981',
                      }}
                      className="absolute border-2 rounded-xs shadow-md"
                    >
                      <span
                        style={{ backgroundColor: box.color || '#10b981' }}
                        className="absolute -top-3.5 left-0 text-white text-[8px] font-bold px-1 rounded-xs uppercase tracking-wider"
                      >
                        {box.label} ({Math.round(box.confidence * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sample Selector */}
            <div className="space-y-1.5 text-xs">
              <span className="text-slate-400 block text-[10px]">Or Select Sample Photo:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(
                      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
                    );
                    setDetectionResult(null);
                  }}
                  className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-emerald-50 cursor-pointer"
                >
                  Mixed Cables
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(
                      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80'
                    );
                    setDetectionResult(null);
                  }}
                  className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-emerald-50 cursor-pointer"
                >
                  Memory / RAM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(
                      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
                    );
                    setDetectionResult(null);
                  }}
                  className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-emerald-50 cursor-pointer"
                >
                  Circuit Heap
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleAnalyzePhoto}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Electronics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run AI Detection on Photo</span>
                </>
              )}
            </button>

            {/* AI Results */}
            {detectionResult && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">
                    AI Identified {detectionResult.totalCount} items
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                    {detectionResult.confidenceAverage}% Avg Confidence
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {detectionResult.categories.map((c) => (
                    <span
                      key={c.name}
                      className="px-2 py-0.5 rounded-full bg-white text-emerald-800 text-[10px] font-bold border border-emerald-200"
                    >
                      {c.name} ({c.count})
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-emerald-800 italic">
                  {detectionResult.summary}
                </p>
              </div>
            )}
          </div>

          {/* Right: Submission Form (7 cols) */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-emerald-900/10 shadow-xs space-y-5"
          >
            <h3 className="font-extrabold text-slate-900 text-base">
              Step 2: Pickup &amp; Item Details
            </h3>

            {/* Single vs Bulk options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReportType('single')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                  reportType === 'single'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Single Electronic Gadget
              </button>
              <button
                type="button"
                onClick={() => setReportType('bulk')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                  reportType === 'bulk'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Bulk / Institution Pickup
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">
                  Pickup Address &amp; Sector
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Auto-Detect My GPS</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. North Zone, Trivandrum, Tech Park Sector 8"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Physical Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option>Working</option>
                  <option>Damaged</option>
                  <option>Non-working</option>
                  <option>Unknown</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Approximate Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-bold text-slate-700 block mb-1">
                Additional Notes / Accessories Included
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Includes charging adapters, power cords, and original packaging."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#124229] hover:bg-[#1a5538] text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Collection Request</span>
            </button>
          </form>
        </div>
      )}

      {/* Your Recent Submissions */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">
          Active Citizen Collection Tracking
        </h3>

        <div className="space-y-3">
          {citizenOrders.slice(0, 3).map((ord) => (
            <div
              key={ord.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">
                    {ord.trackingNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {ord.status}
                  </span>
                </div>
                <p className="text-slate-500 mt-1">{ord.location} • {ord.date}</p>
              </div>

              <div className="text-right">
                <span className="text-emerald-700 font-semibold block">
                  {ord.assignedWorkerName || 'Pending Collector Assignment'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Approx: {ord.estimatedWeightKg} kg
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
