import React, { useState } from 'react';
import {
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ThumbsUp,
  FileText,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportItem } from '../../types';

export const ReportsView: React.FC = () => {
  const { reports } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'collection' | 'system'>('orders');
  const [selectedReportId, setSelectedReportId] = useState<string>('REP-001');
  const [dateFilter, setDateFilter] = useState<string>('Last 30 Days');

  const selectedReport =
    reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,OrderID,RequestType,RequestedBy,Email,Location,Date,Status\n' +
      reports
        .map(
          (r) =>
            `"${r.id}","${r.orderId}","${r.requestType}","${r.requestedBy}","${r.userEmail}","${r.location}","${r.date}","${r.status}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'revive_operations_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header matching reference screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
            Reports &amp; Orders &gt; All Reports and Orders
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Reports &amp; Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View citizen orders, collection reports and system reports
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white rounded-xl text-xs sm:text-sm border border-slate-200 text-slate-700 font-medium shadow-2xs focus:outline-hidden cursor-pointer"
          >
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#124229] hover:bg-[#1a5538] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Tabs matching reference */}
      <div className="flex bg-slate-200/60 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#124229] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>📦 Orders &amp; Reports</span>
        </button>
        <button
          onClick={() => setActiveTab('collection')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'collection'
              ? 'bg-[#124229] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🚛 Collection Reports</span>
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'system'
              ? 'bg-[#124229] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>⚙️ System Reports</span>
        </button>
      </div>

      {/* Split screen: Orders & Reports List (5 cols) & Report Details (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm mb-1">
            Orders &amp; Reports List
          </h3>

          {reports.map((rep) => {
            const isSelected = selectedReport?.id === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs hover:shadow-sm ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={rep.imageUrl}
                    alt={rep.requestType}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                  />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                      {rep.requestType}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <span>👤</span>
                      <span>
                        {rep.requestedBy} • {rep.userEmail}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-2.5 h-2.5 shrink-0" />
                      <span>{rep.date}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{rep.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      rep.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {rep.status === 'Completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span>{rep.status}</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1">
                    <span>View Report</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Card */}
        {selectedReport && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-5">
            {/* Top Detail Bar */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight">
                    Report Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Details of the selected order and pickup report
                  </p>
                </div>
              </div>

              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedReport.status}</span>
              </span>
            </div>

            {/* Photo & Meta Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-6 rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 border border-slate-200">
                <img
                  src={selectedReport.imageUrl}
                  alt={selectedReport.requestType}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-6 space-y-2 text-xs">
                <div className="py-1 border-b border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Order ID</span>
                  <span className="font-bold font-mono text-slate-900 text-sm">
                    {selectedReport.orderId}
                  </span>
                </div>

                <div className="py-1 border-b border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Request Type</span>
                  <span className="font-bold text-slate-900">
                    {selectedReport.requestType}
                  </span>
                </div>

                <div className="py-1 border-b border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Requested By</span>
                  <span className="font-bold text-slate-900">
                    {selectedReport.requestedBy}
                  </span>
                </div>

                <div className="py-1 border-b border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Location</span>
                  <span className="font-bold text-slate-900">
                    {selectedReport.location}
                  </span>
                </div>

                <div className="py-1">
                  <span className="text-slate-400 block text-[10px]">Request Date</span>
                  <span className="font-bold text-slate-900">
                    {selectedReport.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom 2 mini cards matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pickup Report */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Pickup Report</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {selectedReport.reportDetails.pickupNotes}
                  </p>
                </div>
              </div>

              {/* Report Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <ThumbsUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Report Details</h4>
                  <p className="text-[11px] text-slate-700 font-semibold mt-0.5">
                    Status: <span className="text-emerald-700">{selectedReport.reportDetails.status}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Notes: {selectedReport.reportDetails.notes}
                  </p>
                </div>
              </div>
            </div>

            {/* Report Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">
                  Report Summary
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {selectedReport.reportDetails.summary}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
