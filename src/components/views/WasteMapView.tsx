import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  ClipboardList,
  Truck,
  Recycle,
  Plus,
  Minus,
  Crosshair,
  AlertTriangle,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCoordinates } from '../../utils/wasteLogic';
import L from 'leaflet';

export const WasteMapView: React.FC = () => {
  const { orders, workers, setCurrentView } = useApp();
  const [mapType, setMapType] = useState<'map' | 'satellite'>('satellite');
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Center on Tirunelveli / Trivandrum sector
  const centerLat = 8.7342;
  const centerLng = 77.7431;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Remove existing tile layer if any
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // Add selected layer
    if (mapType === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19 }
      ).addTo(map);
    }

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // 1. Add Dump Site 01 (Red marker & zone)
    const dumpSiteLat = 8.7392;
    const dumpSiteLng = 77.7412;
    L.circle([dumpSiteLat, dumpSiteLng], {
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.25,
      radius: 400,
      weight: 1.5,
    }).addTo(map);

    const dumpMarkerIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg shadow-red-950/40 border border-white/80 cursor-pointer hover:scale-105 transition-transform whitespace-nowrap">
          <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.5l8.5 14.5H3.5L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
          <span>Dump Site 01</span>
        </div>
      `,
      iconSize: [110, 32],
      iconAnchor: [55, 16],
    });

    const markerDump = L.marker([dumpSiteLat, dumpSiteLng], { icon: dumpMarkerIcon }).addTo(map);
    markerDump.on('click', () => {
      setSelectedPoint({
        title: 'Dump Site 01',
        type: 'critical',
        lat: dumpSiteLat,
        lng: dumpSiteLng,
        status: 'Unverified Accumulation',
        description: 'Drone survey confirmed high density electronic scrap and open dumping.',
      });
    });

    // 2. Add Orders (ORD-001, ORD-002, ORD-003) as Blue markers with pulse
    const orderPoints = [
      { id: 'ORD-001', lat: 8.735, lng: 77.748 },
      { id: 'ORD-002', lat: 8.728, lng: 77.738 },
      { id: 'ORD-003', lat: 8.742, lng: 77.732 },
    ];

    orderPoints.forEach((ord) => {
      L.circle([ord.lat, ord.lng], {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.2,
        radius: 300,
        weight: 1,
      }).addTo(map);

      const ordIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg shadow-blue-950/40 border border-white/80 cursor-pointer hover:scale-105 transition-transform whitespace-nowrap">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>${ord.id}</span>
          </div>
        `,
        iconSize: [95, 30],
        iconAnchor: [47, 15],
      });

      const m = L.marker([ord.lat, ord.lng], { icon: ordIcon }).addTo(map);
      m.on('click', () => {
        setSelectedPoint({
          title: `Pending Request (${ord.id})`,
          type: 'order',
          lat: ord.lat,
          lng: ord.lng,
          status: 'Pending Citizen Pickup',
          description: 'Awaiting collector dispatch from regional depot.',
        });
      });
    });

    // 3. Add Collectors (COL-103, COL-104) as Green trucks
    const collectorPoints = [
      { id: 'COL-103', lat: 8.731, lng: 77.744 },
      { id: 'COL-104', lat: 8.744, lng: 77.747 },
    ];

    collectorPoints.forEach((col) => {
      L.circle([col.lat, col.lng], {
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 0.25,
        radius: 350,
        weight: 1,
      }).addTo(map);

      const colIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg shadow-emerald-950/40 border border-white/80 cursor-pointer hover:scale-105 transition-transform whitespace-nowrap">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span>${col.id}</span>
          </div>
        `,
        iconSize: [95, 30],
        iconAnchor: [47, 15],
      });

      const m = L.marker([col.lat, col.lng], { icon: colIcon }).addTo(map);
      m.on('click', () => {
        setSelectedPoint({
          title: `Active Collector (${col.id})`,
          type: 'collector',
          lat: col.lat,
          lng: col.lng,
          status: 'On Duty / Live GPS',
          description: 'Team Alpha is currently in transit to assigned collection location.',
        });
      });
    });

    // 4. Add Recovery Plant (Orange marker)
    const recLat = 8.726;
    const recLng = 77.754;
    L.circle([recLat, recLng], {
      color: '#f97316',
      fillColor: '#f97316',
      fillOpacity: 0.2,
      radius: 400,
      weight: 1,
    }).addTo(map);

    const recIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="flex items-center gap-1.5 bg-amber-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg shadow-amber-950/40 border border-white/80 cursor-pointer hover:scale-105 transition-transform whitespace-nowrap">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.2a1.8 1.8 0 0 0 1.5-2.6l-3.9-6.4"/><path d="m14 13-3-5 3-5"/></svg>
          <span>Recovery Plant</span>
        </div>
      `,
      iconSize: [120, 30],
      iconAnchor: [60, 15],
    });

    const mRec = L.marker([recLat, recLng], { icon: recIcon }).addTo(map);
    mRec.on('click', () => {
      setSelectedPoint({
        title: 'Tirunelveli Circular Recovery Facility',
        type: 'facility',
        lat: recLat,
        lng: recLng,
        status: 'Operational Facility',
        description: 'Certified regional facility for electronic dismantling and materials refining.',
      });
    });
  }, [mapType, orders, workers]);

  const handleZoomIn = () => {
    leafletMapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    leafletMapRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    leafletMapRef.current?.setView([centerLat, centerLng], 13);
  };

  return (
    <div className="space-y-6">
      {/* Header text from reference screenshot */}
      <div>
        <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
          REVIVE AI / MAP
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Waste Management Map
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Track waste locations, orders and collection status in real-time
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Locations</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">24</span>
              <span className="text-xs font-semibold text-emerald-600">↑ +2</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Active Orders</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">8</span>
              <span className="text-xs font-semibold text-emerald-600">↑ +1</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Collections Today</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">5</span>
              <span className="text-xs font-semibold text-emerald-600">↑ +1</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Dump Sites</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">3</span>
              <span className="text-xs font-semibold text-slate-400">- 0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map + Right Overview Cards (Strict Match to Screenshot!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Map Box (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-3 border border-emerald-900/10 shadow-sm relative overflow-hidden">
          {/* Map canvas */}
          <div
            ref={mapContainerRef}
            className="w-full h-[520px] rounded-2xl overflow-hidden relative z-10"
          />

          {/* Floating Top Left: Map / Satellite switcher */}
          <div className="absolute top-6 left-6 z-20 flex bg-black/70 backdrop-blur-md p-1 rounded-xl shadow-lg border border-white/20">
            <button
              onClick={() => setMapType('map')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapType === 'map'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapType === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Floating Top Right: Legend */}
          <div className="absolute top-6 right-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-white text-[9px]">
                ▲
              </span>
              <span>Dump Waste Area</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px]">
                ●
              </span>
              <span>Pending Orders</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9px]">
                ■
              </span>
              <span>Collecting</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-600 flex items-center justify-center text-white text-[9px]">
                ◆
              </span>
              <span>Recovery Center</span>
            </div>
          </div>

          {/* Floating Bottom Left: Sector & Coordinates */}
          <div className="absolute bottom-6 left-6 z-20 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg border border-white/20 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tirunelveli Sector</span>
            <span className="text-white/40">|</span>
            <span className="font-mono text-emerald-300">
              {formatCoordinates(centerLat, centerLng)}
            </span>
          </div>

          {/* Floating Bottom Right: Controls */}
          <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
              <button
                onClick={handleZoomIn}
                className="p-2.5 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer border-b border-slate-100"
                title="Zoom in"
                aria-label="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2.5 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                title="Zoom out"
                aria-label="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleRecenter}
              className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Recenter Map"
              aria-label="Recenter map"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Info Panels (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Map Overview Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Map Overview
              </h3>
            </div>

            {/* Donut Chart representation */}
            <div className="relative w-44 h-44 mx-auto my-3 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Clean Area 65% (green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray="155 84"
                  strokeDashoffset="0"
                />
                {/* Waste Area 25% (amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeDasharray="60 179"
                  strokeDashoffset="-155"
                />
                {/* Critical 10% (red) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray="24 215"
                  strokeDashoffset="-215"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900">24</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total
                </span>
              </div>
            </div>

            {/* Breakdown rows */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-700">Clean Area</span>
                </div>
                <span className="text-slate-900 font-bold">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-700">Waste Area</span>
                </div>
                <span className="text-slate-900 font-bold">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-slate-700">Critical</span>
                </div>
                <span className="text-slate-900 font-bold">10%</span>
              </div>
            </div>
          </div>

          {/* Recent Map Activity */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-emerald-700">🔔</span>
              <h3 className="font-extrabold text-slate-900 text-base">
                Recent Map Activity
              </h3>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => setCurrentView('received_orders')}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      New Order (ORD-003)
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">2 min ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Zone B</p>
                </div>
              </div>

              <div
                onClick={() => setCurrentView('collection')}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      Collection Started (COL-104)
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">5 min ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dump Site 01</p>
                </div>
              </div>

              <div
                onClick={() => setCurrentView('recovery')}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Recycle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      Recovery Update
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">12 min ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    8.5 tons processed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Map Marker Popover / Drawer */}
      {selectedPoint && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 mb-1.5">
                  {selectedPoint.status}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedPoint.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {formatCoordinates(selectedPoint.lat, selectedPoint.lng)}
                </p>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedPoint.description}
            </p>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setSelectedPoint(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setSelectedPoint(null);
                  setCurrentView(
                    selectedPoint.type === 'order'
                      ? 'received_orders'
                      : selectedPoint.type === 'collector'
                      ? 'collection'
                      : 'drone_captures'
                  );
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Module</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
