import React, { useState } from 'react';
import {
  Recycle,
  Sparkles,
  Camera,
  Truck,
  ShieldCheck,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { detectEWasteInImage, DetectionResult } from '../../services/aiDetection';

export const LandingPageView: React.FC = () => {
  const { setRole, setIsLandingPage, setCurrentView } = useApp();

  const [demoImage, setDemoImage] = useState<string>(
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
  );
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);

  const handleTestAI = async () => {
    setIsDetecting(true);
    try {
      const res = await detectEWasteInImage(demoImage);
      setDetectionResult(res);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleOpenAdmin = () => {
    setIsLandingPage(false);
    setRole('admin');
    setCurrentView('dashboard');
  };

  const handleOpenCitizen = () => {
    setIsLandingPage(false);
    setRole('citizen');
  };

  return (
    <div className="min-h-screen bg-[#f0f6f2] text-slate-800 font-sans">
      {/* Landing Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-950/5 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/20">
            <Recycle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              ReVive AI
            </span>
            <span className="block text-[10px] text-emerald-700 font-bold tracking-wider uppercase">
              Waste. Renewed.
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
          <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">
            How It Works
          </a>
          <a href="#ai-showcase" className="hover:text-emerald-700 transition-colors">
            AI Detection
          </a>
          <a href="#impact" className="hover:text-emerald-700 transition-colors">
            Impact Metrics
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCitizen}
            className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-full text-xs font-bold transition-all cursor-pointer"
          >
            Report E-Waste
          </button>
          <button
            onClick={handleOpenAdmin}
            className="px-4 py-2 bg-[#0c3822] hover:bg-[#144b30] text-white rounded-full text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Admin Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-16 pb-20 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-extrabold shadow-2xs">
          <span>🌿</span>
          <span>AI-Powered E-Waste Detection &amp; GPS Collection Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Give Your E-Waste <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-green-600">
            A Second Life.
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          ReVive AI turns unused household electronics and open dumping grounds into tracked, recoverable resources through drone aerial surveillance, computer vision object classification, and optimized GPS collection dispatch.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleOpenCitizen}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0c3822] hover:bg-[#154e33] text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Report Your E-Waste</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Explore Our Mission
          </a>
        </div>

        {/* Hero Dashboard Preview Card */}
        <div className="pt-10 relative">
          <div className="rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white p-2">
            <img
              src="/assets/aistudio/Gpt1_f4ec30d4.png"
              alt="ReVive AI Dashboard Preview"
              className="w-full rounded-2xl object-cover shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="impact" className="bg-white py-16 border-y border-emerald-950/5">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl sm:text-5xl font-black text-slate-900">128+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              Gadgets Detected
            </p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black text-emerald-700">1.8 Tons</p>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              Diverted from Landfills
            </p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black text-slate-900">78%</p>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              Material Recovery Rate
            </p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black text-emerald-700">24</p>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              Monitored Hotspots
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (Module 1 Section) */}
      <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            End-to-End Circular Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            How ReVive AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Connecting citizen contributors, drone flights, field collectors and recycling facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Citizen &amp; Drone Detection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Citizens submit photos of unused electronics while aerial drones survey open dumping sites with high-resolution imagery.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              AI Object Classification
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Computer vision identifies electronic components (laptops, circuits, cables, displays) and estimates recyclability yield.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Smart GPS Collection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The system calculates distances and dispatches authorized field collection workers with live GPS route guidance.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-lg">
              4
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Inspection &amp; Recovery
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Collected materials undergo durability verification, sorting reusable components into refurbishment and raw scrap into smelting.
            </p>
          </div>
        </div>
      </section>

      {/* Live AI Detection Showcase Widget */}
      <section id="ai-showcase" className="py-16 bg-white border-t border-emerald-950/5">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Interactive Model Demo</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              Try ReVive AI Vision Detection
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Test how the neural network identifies electronics with bounding boxes and confidence scores.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Image Preview with Bounding Boxes */}
            <div className="md:col-span-7">
              <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-900 border border-slate-300 shadow-md">
                <img
                  src={demoImage}
                  alt="Demo E-waste"
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
            </div>

            {/* Controls & Output */}
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-800">Select Test Image:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setDemoImage(
                        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
                      );
                      setDetectionResult(null);
                    }}
                    className="flex-1 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 cursor-pointer"
                  >
                    Cables &amp; Mixed
                  </button>
                  <button
                    onClick={() => {
                      setDemoImage(
                        '/assets/aistudio/drone_1_photo_exact.jpeg'
                      );
                      setDetectionResult(null);
                    }}
                    className="flex-1 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 cursor-pointer"
                  >
                    Drone Aerial
                  </button>
                </div>
              </div>

              <button
                disabled={isDetecting}
                onClick={handleTestAI}
                className="w-full py-3 bg-[#0c3822] hover:bg-[#154e33] text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDetecting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Image Tensor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Run AI Detection</span>
                  </>
                )}
              </button>

              {detectionResult && (
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Objects Detected</span>
                    <span className="text-emerald-700">
                      {detectionResult.totalCount} items
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {detectionResult.categories.map((c) => (
                      <span
                        key={c.name}
                        className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200"
                      >
                        {c.name} ({c.count})
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {detectionResult.summary}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a2919] text-white py-12 px-6 sm:px-12 border-t border-[#133d27]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-emerald-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-[#0a2919] flex items-center justify-center font-bold">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">ReVive AI</span>
              <p className="text-[10px] text-emerald-400">
                Detect. Locate. Collect. Recover. Revive.
              </p>
            </div>
          </div>

          <p className="text-center md:text-right text-[11px]">
            &copy; 2026 ReVive AI. Tirunelveli &amp; Trivandrum Smart E-Waste Management Ecosystem.
          </p>
        </div>
      </footer>
    </div>
  );
};
