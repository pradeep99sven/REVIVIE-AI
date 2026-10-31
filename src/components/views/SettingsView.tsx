import React, { useState } from 'react';
import {
  User,
  Wrench,
  Clock,
  BookOpen,
  Brain,
  Globe,
  LogOut,
  Edit2,
  CheckCircle2,
  RotateCcw,
  Save,
  Check,
  Search,
  UploadCloud,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, documents, addOEMDocument, setIsLandingPage } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'account' | 'repair' | 'decision' | 'oem' | 'manual' | 'language'
  >('account');

  // Local form state for Repair Intelligence
  const [repairEnabled, setRepairEnabled] = useState(settings.repairIntelligenceEnabled);
  const [modelVersion, setModelVersion] = useState(settings.modelVersion);
  const [confidenceThreshold, setConfidenceThreshold] = useState(settings.confidenceThreshold);
  const [showGuide, setShowGuide] = useState(settings.showStepByStepGuide);
  const [includeParts, setIncludeParts] = useState(settings.includePartsCompatibility);
  const [allowAlt, setAllowAlt] = useState(settings.allowAlternativeMethods);
  const [maxSuggestions, setMaxSuggestions] = useState(settings.maxSuggestionsPerItem);
  const [analysisDepth, setAnalysisDepth] = useState(settings.analysisDepth);

  // Local form state for Decision Time
  const [decisionEnabled, setDecisionEnabled] = useState(settings.decisionTimeEnabled);
  const [approvalMins, setApprovalMins] = useState(settings.orderApprovalTimeMinutes);
  const [assignmentMins, setAssignmentMins] = useState(settings.collectionAssignmentTimeMinutes);
  const [recoveryMins, setRecoveryMins] = useState(settings.recoveryConfirmationTimeMinutes);
  const [autoCancel, setAutoCancel] = useState(settings.autoCancelPendingOrders);
  const [notifyEmail, setNotifyEmail] = useState(settings.notifyManagerEmail);
  const [sendReminder, setSendReminder] = useState(settings.sendReminderBeforeTimeout);

  // OEM Doc Library filter state
  const [oemSearch, setOemSearch] = useState('');
  const [oemBrandFilter, setOemBrandFilter] = useState('All Brands');
  const [oemCategory, setOemCategory] = useState<string>('All');
  const [uploadDocModalOpen, setUploadDocModalOpen] = useState(false);

  // Save feedback toast
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    updateSettings({
      repairIntelligenceEnabled: repairEnabled,
      modelVersion,
      confidenceThreshold,
      showStepByStepGuide: showGuide,
      includePartsCompatibility: includeParts,
      allowAlternativeMethods: allowAlt,
      maxSuggestionsPerItem: maxSuggestions,
      analysisDepth,
      decisionTimeEnabled: decisionEnabled,
      orderApprovalTimeMinutes: approvalMins,
      collectionAssignmentTimeMinutes: assignmentMins,
      recoveryConfirmationTimeMinutes: recoveryMins,
      autoCancelPendingOrders: autoCancel,
      notifyManagerEmail: notifyEmail,
      sendReminderBeforeTimeout: sendReminder,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleReset = () => {
    setRepairEnabled(true);
    setModelVersion('ReVive-R1 (Recommended)');
    setConfidenceThreshold(75);
    setShowGuide(true);
    setIncludeParts(true);
    setAllowAlt(true);
    setMaxSuggestions(5);
    setAnalysisDepth('Detailed');
    setDecisionEnabled(true);
    setApprovalMins(30);
    setAssignmentMins(60);
    setRecoveryMins(90);
    setAutoCancel(true);
    setNotifyEmail(true);
    setSendReminder(true);
  };

  // Filter OEM documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(oemSearch.toLowerCase()) ||
      doc.model.toLowerCase().includes(oemSearch.toLowerCase());
    const matchesBrand =
      oemBrandFilter === 'All Brands' ? true : doc.brand.toLowerCase() === oemBrandFilter.toLowerCase();
    const matchesCat = oemCategory === 'All' ? true : doc.category === oemCategory;
    return matchesSearch && matchesBrand && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header matching reference screenshot */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
            Settings
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your account and configure ReVive AI preferences
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-1">
            <Check className="w-4 h-4" />
            <span>Preferences Saved Successfully</span>
          </div>
        )}
      </div>

      {/* Main Settings Body: Clean Sub-tabs list on left (3 cols) + Active Configuration panel on right (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sub-Tab Navigation Strip (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-3 border border-emerald-900/10 shadow-xs space-y-1">
          <button
            onClick={() => setActiveSubTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeSubTab === 'account'
                ? 'bg-emerald-100/70 text-emerald-950 font-extrabold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4 text-emerald-700" />
            <span>Account Details</span>
          </button>

          <button
            onClick={() => setActiveSubTab('repair')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeSubTab === 'repair'
                ? 'bg-emerald-100/70 text-emerald-950 font-extrabold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-700" />
            <span>Repair Intelligence</span>
          </button>

          <button
            onClick={() => setActiveSubTab('decision')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeSubTab === 'decision'
                ? 'bg-emerald-100/70 text-emerald-950 font-extrabold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Decision Time</span>
          </button>

          <button
            onClick={() => setActiveSubTab('oem')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeSubTab === 'oem'
                ? 'bg-emerald-100/70 text-emerald-950 font-extrabold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>OEM Doc Library</span>
          </button>

          <button
            onClick={() => setActiveSubTab('manual')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeSubTab === 'manual'
                ? 'bg-emerald-100/70 text-emerald-950 font-extrabold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Brain className="w-4 h-4 text-emerald-700" />
            <span>Manual Intelligence</span>
          </button>

          <button
            onClick={() => setActiveSubTab('language')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeSubTab === 'language'
                ? 'bg-emerald-100/70 text-emerald-950 font-extrabold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>Language</span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsLandingPage(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Account Log Out</span>
            </button>
          </div>
        </div>

        {/* Right Configuration Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: Account Details (Matching ReVive_AI_Settings_Dashboard_510f9cda.png) */}
          {activeSubTab === 'account' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-900/10 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">
                        Account Details
                      </h3>
                      <p className="text-xs text-slate-500">
                        View and manage your account information
                      </p>
                    </div>
                  </div>

                  <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#124229] text-white flex items-center justify-center font-black text-2xl shadow-md">
                      M
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black text-slate-900">Manager</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          🛡️ Administrator
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span>✉️</span>
                        <span>manager@revive.ai</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <span>📍</span>
                        <span>Tech Park, Sector 8</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-2 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-6 pt-3 sm:pt-0">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Account Created</span>
                      <span className="font-bold text-slate-800">Apr 26, 2025</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Last Login</span>
                      <span className="font-bold text-slate-800">Apr 26, 2025 • 11:45 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-bold text-emerald-700">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Settings Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Repair Intelligence */}
                <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          Repair Intelligence
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Get AI-powered repair suggestions for recovered components.
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={repairEnabled}
                      onChange={(e) => setRepairEnabled(e.target.checked)}
                      className="w-5 h-5 accent-emerald-600 cursor-pointer"
                    />
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveSubTab('repair')}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Configure →
                    </button>
                  </div>
                </div>

                {/* Decision Time */}
                <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Decision Time</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Set time limits for order decisions and automated actions.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveSubTab('decision')}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Configure →
                    </button>
                  </div>
                </div>

                {/* OEM Doc Library */}
                <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        OEM Doc Library
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Access official manufacturer documentation and guides.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveSubTab('oem')}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Browse Library →
                    </button>
                  </div>
                </div>

                {/* Manual Intelligence */}
                <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Manual Intelligence
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Use AI to understand and apply repair manuals.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveSubTab('manual')}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Repair Intelligence (Matching WhatsApp_Image_2026-10-31_at_11.40.22_AM_8833b9b9.jpeg) */}
          {activeSubTab === 'repair' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Repair Intelligence
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure AI-powered repair suggestions for recovered components
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left settings forms (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Enable Repair Intelligence */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <span>🔌</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          Enable Repair Intelligence
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Turn on AI-powered repair suggestions and diagnostics.
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={repairEnabled}
                      onChange={(e) => setRepairEnabled(e.target.checked)}
                      className="w-5 h-5 accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* AI Model Settings */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          AI Model Settings
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Choose the model and configure sensitivity.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 text-xs">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-medium text-slate-700">Model Version</span>
                        <select
                          value={modelVersion}
                          onChange={(e) => setModelVersion(e.target.value)}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                        >
                          <option>ReVive-R1 (Recommended)</option>
                          <option>ReVive-Fast-v2</option>
                          <option>Gemini-Flash-Vision</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-700">Confidence Threshold</span>
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {confidenceThreshold}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="95"
                          value={confidenceThreshold}
                          onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Repair Suggestion Preferences */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Repair Suggestion Preferences
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Customize how suggestions are provided.
                    </p>

                    <div className="space-y-2 pt-1 text-xs">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showGuide}
                          onChange={(e) => setShowGuide(e.target.checked)}
                          className="accent-emerald-600 w-4 h-4"
                        />
                        <span className="text-slate-800 font-medium">
                          Show step-by-step repair guide
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeParts}
                          onChange={(e) => setIncludeParts(e.target.checked)}
                          className="accent-emerald-600 w-4 h-4"
                        />
                        <span className="text-slate-800 font-medium">
                          Include parts compatibility check
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowAlt}
                          onChange={(e) => setAllowAlt(e.target.checked)}
                          className="accent-emerald-600 w-4 h-4"
                        />
                        <span className="text-slate-800 font-medium">
                          Allow alternative repair methods
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Advanced Options
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-500 block mb-1">
                          Max Suggestions per Item
                        </label>
                        <select
                          value={maxSuggestions}
                          onChange={(e) => setMaxSuggestions(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value={3}>3</option>
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-500 block mb-1">Analysis Depth</label>
                        <select
                          value={analysisDepth}
                          onChange={(e) => setAnalysisDepth(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Detailed">Detailed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Preview Card & Recent Activity (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Preview Card */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Preview
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      See how repair suggestions will appear.
                    </p>

                    <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-3">
                      <div className="flex gap-4 items-start">
                        <div className="w-28 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-900">
                          <img
                            src="/assets/aistudio/gpt2_ae8ea60d.png"
                            alt="Repair Intelligence preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ✓ Repairable
                            </span>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">Confidence</span>
                              <span className="font-mono font-bold text-emerald-700 text-xs">
                                📊 92%
                              </span>
                            </div>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm mt-1">
                            Memory Module (RAM)
                          </h4>
                          <p className="text-[11px] text-slate-600">
                            Suggested Actions: Clean contacts, reseat, or replace if still faulty.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1 text-[11px]">
                        <p className="font-bold text-slate-800">Repair Steps:</p>
                        <p className="text-slate-600">
                          <span className="font-bold text-emerald-700">1.</span> Check for dust and clean with compressed air.
                        </p>
                        <p className="text-slate-600">
                          <span className="font-bold text-emerald-700">2.</span> Reseat the module in the slot.
                        </p>
                        <p className="text-slate-600">
                          <span className="font-bold text-emerald-700">3.</span> Run a memory test.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs">Recent Activity</h4>
                      <span className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer">
                        View All →
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-900 text-[11px]">Memory Module</p>
                          <p className="text-[10px] text-slate-400">Apr 26, 2025 • 11:45 AM</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Repairable 92%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-900 text-[11px]">Motherboard</p>
                          <p className="text-[10px] text-slate-400">Apr 26, 2025 • 10:20 AM</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                            Replace 88%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-900 text-[11px]">SSD</p>
                          <p className="text-[10px] text-slate-400">Apr 26, 2025 • 09:15 AM</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Repairable 85%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Save Bar */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-[#124229] hover:bg-[#1a5538] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Decision Time */}
          {activeSubTab === 'decision' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Decision Time
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set time limits for order decisions and automated actions
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Configuration (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Enable Switch */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        Enable Decision Time
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Automatically close pending orders if no decision is made within the specified time.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={decisionEnabled}
                      onChange={(e) => setDecisionEnabled(e.target.checked)}
                      className="w-5 h-5 accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* Time Limits */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-4 text-xs">
                    <h4 className="font-bold text-slate-900 text-sm">Time Limits</h4>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-medium text-slate-700">
                            Order Approval Time
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={approvalMins}
                              onChange={(e) => setApprovalMins(Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                            />
                            <span className="text-slate-500">minutes</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Time to approve or reject a new order.
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-medium text-slate-700">
                            Collection Assignment Time
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={assignmentMins}
                              onChange={(e) => setAssignmentMins(Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                            />
                            <span className="text-slate-500">minutes</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Time to assign a collector after order approval.
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-medium text-slate-700">
                            Recovery Confirmation Time
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={recoveryMins}
                              onChange={(e) => setRecoveryMins(Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                            />
                            <span className="text-slate-500">minutes</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Time to confirm recovery after collection.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions on Timeout */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3 text-xs">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Actions on Timeout
                    </h4>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoCancel}
                          onChange={(e) => setAutoCancel(e.target.checked)}
                          className="accent-emerald-600 w-4 h-4"
                        />
                        <span className="text-slate-800">Auto-cancel pending orders</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifyEmail}
                          onChange={(e) => setNotifyEmail(e.target.checked)}
                          className="accent-emerald-600 w-4 h-4"
                        />
                        <span className="text-slate-800">Notify manager via email</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sendReminder}
                          onChange={(e) => setSendReminder(e.target.checked)}
                          className="accent-emerald-600 w-4 h-4"
                        />
                        <span className="text-slate-800">
                          Send reminder notification before timeout (5 min)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Preview Flow & Decision Activity (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Preview
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Here's how the Decision Time works:
                    </p>

                    <div className="flex items-center justify-between text-center pt-2 text-[10px]">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold">
                          📄
                        </div>
                        <span className="font-semibold mt-1">Order Received</span>
                      </div>
                      <span className="text-slate-300">›</span>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold">
                          ⏱️
                        </div>
                        <span className="font-semibold mt-1">Decision Within 30 Min</span>
                      </div>
                      <span className="text-slate-300">›</span>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <span className="font-semibold mt-1">Order Approved</span>
                      </div>
                      <span className="text-slate-300">›</span>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                          🚚
                        </div>
                        <span className="font-semibold mt-1">Collection Assigned</span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-2 mt-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">
                          If no decision is made within 30 minutes:
                        </span>
                        <p className="text-emerald-800 mt-0.5">
                          The order will be automatically closed and marked as "Not Approved".
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Decision Activity */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs">
                      Recent Decision Activity
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-[11px]">
                            ORD-2025-0416
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Apr 26, 2025 • 11:20 AM
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ Approved
                          </span>
                        </div>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-[11px]">
                            ORD-2025-0415
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Apr 26, 2025 • 09:45 AM
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                            ✕ Auto-Cancelled
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Save Bar */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-[#124229] hover:bg-[#1a5538] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: OEM Doc Library (Matching ReVive_AI_OEM_Documentation_Library_e58cc836.png) */}
          {activeSubTab === 'oem' && (
            <div className="space-y-6">
              {/* Header Green Banner */}
              <div className="bg-[#124229] text-white rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                      OEM Doc Library
                    </h2>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      Browse and access official manufacturer documentation
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setUploadDocModalOpen(true)}
                  className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-[#124229] rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>

              {/* Library Navigation Tabs */}
              <div className="flex gap-4 border-b border-slate-200 pb-2 text-xs font-bold">
                <button className="pb-2 border-b-2 border-emerald-600 text-emerald-900 cursor-pointer">
                  Browse Library
                </button>
                <button className="pb-2 text-slate-500 hover:text-slate-800 cursor-pointer">
                  Manage Resources
                </button>
                <button className="pb-2 text-slate-500 hover:text-slate-800 cursor-pointer">
                  Quick Access
                </button>
              </div>

              {/* Search + Filter Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={oemSearch}
                    onChange={(e) => setOemSearch(e.target.value)}
                    placeholder="Search documents by brand, model or component..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-700 shadow-2xs focus:outline-hidden"
                  />
                </div>

                <select
                  value={oemBrandFilter}
                  onChange={(e) => setOemBrandFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
                >
                  <option>All Brands</option>
                  <option>Dell</option>
                  <option>HP</option>
                  <option>Lenovo</option>
                  <option>Apple</option>
                </select>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {['All', 'Manuals', 'Guides', 'Specifications', 'Other'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setOemCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        oemCategory === cat
                          ? 'bg-[#124229] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Results or Empty State */}
              {filteredDocs.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-emerald-900/10 shadow-xs space-y-4">
                  <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-100 shadow-xs">
                    <img
                      src="/assets/aistudio/ReVive_AI_OEM_Documentation_Library_e58cc836.png"
                      alt="OEM Documentation Library"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    No Documents Found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    There are no documents in the OEM Doc Library matching your search. Try uploading a document or adjusting criteria.
                  </p>
                  <button
                    onClick={() => setUploadDocModalOpen(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Document</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                          PDF
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {doc.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Brand: <span className="font-semibold text-slate-700">{doc.brand}</span> • Model: {doc.model}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-600">
                              {doc.category}
                            </span>
                            <span>{doc.fileSize}</span>
                            <span>•</span>
                            <span>{doc.uploadedAt}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Opening OEM Document: ${doc.title}`)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
                        title="Download / View Document"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5 & 6: Language & Manual Intelligence */}
          {(activeSubTab === 'manual' || activeSubTab === 'language') && (
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">
                {activeSubTab === 'language' ? 'Language Preferences' : 'Manual Intelligence'}
              </h3>
              <p className="text-xs text-slate-500">
                {activeSubTab === 'language'
                  ? 'Choose your preferred localization and terminology'
                  : 'Configure AI assisted document parsing and exploded schematic analysis.'}
              </p>

              {activeSubTab === 'language' ? (
                <div className="max-w-xs space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block">System Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSettings({ language: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option>English</option>
                    <option>Tamil (தமிழ்)</option>
                    <option>Malayalam (മലയാളം)</option>
                    <option>Hindi (हिन्दी)</option>
                    <option>Spanish (Español)</option>
                  </select>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-xs text-emerald-900 space-y-2">
                  <p className="font-bold">Automated OCR &amp; Circuit Layout Extraction Active</p>
                  <p>
                    ReVive AI automatically cross-references uploaded exploded view diagrams with repair histories to propose replacement part numbers.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {uploadDocModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Upload OEM Specification / Manual
              </h3>
              <button
                onClick={() => setUploadDocModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center bg-emerald-50/40">
                <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
                <p className="font-bold text-slate-800">Drag PDF Service Manual</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Maximum size 25MB</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dell PowerEdge Chassis Guide"
                  id="doc-title-input"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  defaultValue="Cisco Catalyst 9300 Hardware Installation Guide"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    defaultValue="Cisco"
                    id="doc-brand-input"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    id="doc-cat-select"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Manuals">Manuals</option>
                    <option value="Guides">Guides</option>
                    <option value="Specifications">Specifications</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setUploadDocModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const title =
                      (document.getElementById('doc-title-input') as HTMLInputElement)
                        ?.value || 'Cisco Hardware Guide';
                    const brand =
                      (document.getElementById('doc-brand-input') as HTMLInputElement)
                        ?.value || 'Cisco';
                    addOEMDocument({
                      title,
                      brand,
                      model: '9300 Series',
                      category: 'Manuals',
                      fileSize: '4.8 MB',
                    });
                    setUploadDocModalOpen(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save &amp; Index
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
