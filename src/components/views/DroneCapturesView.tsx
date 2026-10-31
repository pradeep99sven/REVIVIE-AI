import React, { useState } from 'react';
import {
  Camera,
  Calendar,
  Eye,
  ArrowLeft,
  UploadCloud,
  Layers,
  Compass,
  FileCheck,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DroneCapture } from '../../types';
import { detectEWasteInImage } from '../../services/aiDetection';

export const DroneCapturesView: React.FC = () => {
  const { droneCaptures, addNewDroneCapture } = useApp();

  const [activeTab, setActiveTab] = useState<'gallery' | 'details'>('gallery');
  const [selectedDroneId, setSelectedDroneId] = useState<string>('D-001');
  const [dateFilter, setDateFilter] = useState<string>('Last 7 Days');
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [analyzingImage, setAnalyzingImage] = useState<boolean>(false);

  const selectedCapture =
    droneCaptures.find((c) => c.id === selectedDroneId) || droneCaptures[0];

  // Count detected categories for badge breakdown
  const categoryCounts = selectedCapture?.detections.reduce((acc, cur) => {
    const key = cur.category;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const handleSimulateNewUpload = async () => {
    setAnalyzingImage(true);
    try {
      const results = await detectEWasteInImage('drone_upload');
      addNewDroneCapture({
        droneName: 'Drone 3 (VTOL Survey)',
        locationName: 'Dump Site 03 – East Sector',
        sector: 'East Canal Sector',
        lat: 8.7305,
        lng: 77.7689,
        altitude: 45,
        direction: 'East-North-East',
        resolution: '4096 × 2160 (4K Cinema)',
        fileSize: '3.4 MB',
        imageUrl: '/assets/aistudio/drone_1_photo_exact.jpeg',
        notes: results.summary,
        detections: results.items,
      });
      setUploadModalOpen(false);
      setActiveTab('gallery');
    } finally {
      setAnalyzingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching reference screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
            REVIVE AI / DRONE CAPTURES
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Drone Captures
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View and analyze aerial images of waste sites
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 bg-[#124229] hover:bg-[#1a5538] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Aerial Survey</span>
        </button>
      </div>

      {/* Mode Tabs + Date Filter */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-200/60 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#124229] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>⊞ Gallery</span>
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'bg-[#124229] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>☰ Details</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3.5 py-2 bg-white rounded-xl text-xs sm:text-sm border border-slate-200 text-slate-700 font-medium shadow-2xs focus:outline-hidden cursor-pointer"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>All Captures</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: GALLERY VIEW (Matching screenshot 1) */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {droneCaptures.map((capture) => (
              <div
                key={capture.id}
                className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Drone Info Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {capture.droneName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>📍</span>
                        <span>
                          {capture.locationName} – {capture.sector}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{capture.captureTime}</span>
                  </div>
                </div>

                {/* Drone Image with Bounding Boxes */}
                <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-900 border border-slate-200">
                  <img
                    src={capture.imageUrl}
                    alt={capture.droneName}
                    className="w-full h-full object-cover"
                  />

                  {/* Bounding Boxes */}
                  {!capture.hasBakedDetections &&
                    capture.detections.map((box) => (
                      <div
                        key={box.id}
                        style={{
                          left: `${box.x}%`,
                          top: `${box.y}%`,
                          width: `${box.width}%`,
                          height: `${box.height}%`,
                          borderColor: box.color || '#2563eb',
                        }}
                        className="absolute border-2 rounded-xs shadow-xs pointer-events-none"
                      >
                        <span
                          style={{ backgroundColor: box.color || '#2563eb' }}
                          className="absolute -top-3.5 left-0 text-white text-[8px] font-bold px-1 rounded-xs uppercase tracking-wider"
                        >
                          {box.label}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Drone Specs Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Resolution</span>
                    <span className="font-bold text-slate-800">{capture.resolution}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Altitude</span>
                    <span className="font-bold text-slate-800">{capture.altitude} m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Direction</span>
                    <span className="font-bold text-slate-800">{capture.direction}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDroneId(capture.id);
                      setActiveTab('details');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>
              Showing 1–{droneCaptures.length} of {droneCaptures.length} captures
            </span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed">
                ‹
              </button>
              <button className="px-3 py-1 bg-[#124229] text-white font-bold rounded-lg shadow-xs">
                1
              </button>
              <button className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed">
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DETAILS VIEW (Matching screenshot 2) */}
      {activeTab === 'details' && selectedCapture && (
        <div className="space-y-6">
          {/* Top Detail Nav Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('gallery')}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Gallery</span>
            </button>

            {/* Drone selection pills */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
              {droneCaptures.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedDroneId(c.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDroneId === c.id
                      ? 'bg-[#124229] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c.droneName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Box: Image & Insights (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-lg">
                      {selectedCapture.droneName}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {selectedCapture.locationName} – {selectedCapture.sector}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  📷 Capture #{selectedCapture.id}
                </span>
              </div>

              {/* High-Res View with Zoomable Bounding Boxes */}
              <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-950 border border-slate-200 group">
                <img
                  src={selectedCapture.imageUrl}
                  alt={selectedCapture.droneName}
                  className="w-full h-full object-cover"
                />

                {!selectedCapture.hasBakedDetections &&
                  selectedCapture.detections.map((box) => (
                    <div
                      key={box.id}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                        borderColor: box.color || '#2563eb',
                      }}
                      className="absolute border-2 rounded-xs shadow-lg transition-transform group-hover:scale-102"
                    >
                      <span
                        style={{ backgroundColor: box.color || '#2563eb' }}
                        className="absolute -top-3.5 left-0 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider"
                      >
                        {box.label} ({Math.round(box.confidence * 100)}%)
                      </span>
                    </div>
                  ))}
              </div>

              {/* Image Insights Banner */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <span>📊</span>
                  <span>Image Insights</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedCapture.notes}
                </p>
              </div>
            </div>

            {/* Right Box: Capture Details & Detected Categories (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Capture Details Card */}
              <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Capture Details
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <span>📍</span> Location Name
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedCapture.locationName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-slate-400" /> Direction
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedCapture.direction}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-slate-400" /> Altitude
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedCapture.altitude} m
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Capture Time
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedCapture.captureTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <span>🖥️</span> Resolution
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedCapture.resolution}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500 flex items-center gap-2">
                      <span>💾</span> File Size
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedCapture.fileSize}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detected Items Count Card */}
              <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-3xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <span>🍃</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">
                      Detected Items
                    </h4>
                    <p className="text-[11px] text-emerald-700">
                      Electronic waste items found
                    </p>
                  </div>
                </div>
                <span className="text-3xl font-black text-emerald-800">
                  {selectedCapture.detections.length}
                </span>
              </div>

              {/* Detected Categories Pills */}
              <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Detected Categories
                </h4>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryCounts).map(([cat, count]) => {
                    let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
                    if (cat === 'cable') badgeColor = 'bg-green-100 text-green-800 border-green-200';
                    if (cat === 'keyboard') badgeColor = 'bg-red-100 text-red-800 border-red-200';
                    if (cat === 'circuit_board') badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';

                    const formattedLabel =
                      cat === 'circuit_board'
                        ? 'Circuit Board'
                        : cat.charAt(0).toUpperCase() + cat.slice(1);

                    return (
                      <span
                        key={cat}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${badgeColor}`}
                      >
                        {formattedLabel} ({count})
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Aerial Mission Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Drone Mission Aerial Upload
                </h3>
                <p className="text-xs text-slate-500">
                  Run computer vision object detection on geotagged survey image
                </p>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center bg-emerald-50/40">
                <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  Upload Drone Orthomosaic or Snapshot
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supported formats: GeoTIFF, JPG, PNG (with EXIF GPS coordinates)
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-900">Simulated Telemetry Feed:</p>
                <p>• Flight Controller: DJI Matrice 300 RTK</p>
                <p>• Sensor: Zenmuse H20T Thermal & Optical</p>
                <p>• Survey Waypoint: Tirunelveli Canal Grid Sector East</p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={analyzingImage}
                  onClick={handleSimulateNewUpload}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  {analyzingImage ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Detecting Objects...</span>
                    </>
                  ) : (
                    <>
                      <span>Process & Map Detections</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
