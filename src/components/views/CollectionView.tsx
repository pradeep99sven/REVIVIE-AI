import React, { useState } from 'react';
import {
  Recycle,
  Scale,
  CheckCircle,
  Clock,
  Download,
  ArrowRight,
  ArrowLeft,
  FileText,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CollectionItem } from '../../types';

export const CollectionView: React.FC = () => {
  const { collections } = useApp();

  const [activeTab, setActiveTab] = useState<'items' | 'history'>('items');
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [detailTab, setDetailTab] = useState<'item_details' | 'parts_list' | 'technical_sheet'>('item_details');

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Title,Location,Date,WeightKg,CollectedBy,Status\n' +
      collections
        .map(
          (c) =>
            `"${c.id}","${c.title}","${c.location}","${c.date}",${c.weightKg},"${c.collectedBy}","${c.status}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'revive_collected_waste_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* If an item is selected, show the Collection Details view matching right side of screenshot */}
      {selectedItem ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
                Collection &gt; Collection Details
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Collection Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Detailed information about the collected item
              </p>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="self-start sm:self-center flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Collection</span>
            </button>
          </div>

          {/* Collection Completed Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-sm">
                Collection Completed
              </h3>
              <p className="text-xs text-emerald-700">
                Collected on {selectedItem.date}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Image, Details & Notes (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-16/10 bg-slate-900 border border-slate-200">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span>🏷️</span> Item ID
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedItem.id}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedItem.location}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-slate-400" /> Type
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedItem.type}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-slate-400" /> Weight
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedItem.weightKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span>👤</span> Collected By
                  </span>
                  <span className="font-bold text-emerald-800">
                    {selectedItem.collectedBy}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-slate-500 flex items-center gap-2 mb-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Collection Notes
                  </span>
                  <p className="text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    "{selectedItem.notes}"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Detail Tabs (Item Details, Parts List, Technical Sheet) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-4">
              {/* Tab Pills */}
              <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                <button
                  onClick={() => setDetailTab('item_details')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    detailTab === 'item_details'
                      ? 'bg-[#124229] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Item Details
                </button>
                <button
                  onClick={() => setDetailTab('parts_list')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    detailTab === 'parts_list'
                      ? 'bg-[#124229] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Parts List
                </button>
                <button
                  onClick={() => setDetailTab('technical_sheet')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    detailTab === 'technical_sheet'
                      ? 'bg-[#124229] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Technical Sheet
                </button>
              </div>

              {/* Tab Content 1: Item Details */}
              {detailTab === 'item_details' && (
                <div className="space-y-4 text-xs text-slate-700">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2">Material Breakdown</h4>
                    <p className="leading-relaxed">
                      Primary collection consisted of rack servers, enterprise cooling blocks,
                      and communication cables. Heavy gauge copper is salvageable along with
                      high grade tantalum capacitors.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                      <p className="text-[10px] text-emerald-800 uppercase font-bold">Reuse Score</p>
                      <p className="text-xl font-black text-emerald-950 mt-1">94%</p>
                    </div>
                    <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                      <p className="text-[10px] text-blue-800 uppercase font-bold">Disassembly</p>
                      <p className="text-xl font-black text-blue-950 mt-1">Modular</p>
                    </div>
                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                      <p className="text-[10px] text-amber-800 uppercase font-bold">Hazard Risk</p>
                      <p className="text-xl font-black text-amber-950 mt-1">Low (0%)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 2: Parts List */}
              {detailTab === 'parts_list' && (
                <div className="space-y-3">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Component Item</th>
                        <th className="py-2.5 px-3">OEM Ref #</th>
                        <th className="py-2.5 px-3 text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedItem.partsList || [
                        { item: 'Motherboard Chassis', partNumber: '1W-0115', quantity: 2 },
                        { item: 'DDR4 Server Memory', partNumber: '1W-0118', quantity: 12 },
                        { item: 'Processor Trays', partNumber: '1W-0120', quantity: 4 },
                        { item: 'Power Supply Unit', partNumber: '6V-5538', quantity: 6 },
                      ]).map((part, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {part.item}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-emerald-700">
                            {part.partNumber}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            {part.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab Content 3: Technical Sheet (Direct reference to exploded diagram in screenshot) */}
              {detailTab === 'technical_sheet' && (
                <div className="border border-slate-300 rounded-2xl p-4 bg-white font-mono text-[11px] space-y-3 shadow-inner">
                  <div className="text-center border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm tracking-wide">
                      BASIC ENGINE SPECIFICATION SCHEMATIC
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                      149-0477 CYLINDER BLOCK AS (CHG-00 THRU-03)
                    </p>
                  </div>

                  <div className="grid grid-cols-5 text-[10px] font-bold text-slate-600 border-b border-slate-200 pb-1">
                    <span>NOTE</span>
                    <span>REF</span>
                    <span>PART #</span>
                    <span>QTY</span>
                    <span>DESCRIPTION</span>
                  </div>

                  <div className="space-y-1 text-[10px] text-slate-800 max-h-48 overflow-y-auto font-mono">
                    <div className="grid grid-cols-5 py-0.5">
                      <span>-</span>
                      <span>1</span>
                      <span className="text-emerald-700">1W-0115</span>
                      <span>12</span>
                      <span>SEAL-O-RING</span>
                    </div>
                    <div className="grid grid-cols-5 py-0.5 bg-slate-50">
                      <span>-</span>
                      <span>2</span>
                      <span className="text-emerald-700">1W-0116</span>
                      <span>36</span>
                      <span>SEAL-O-RING</span>
                    </div>
                    <div className="grid grid-cols-5 py-0.5">
                      <span>-</span>
                      <span>3</span>
                      <span className="text-emerald-700">1W-0118</span>
                      <span>10</span>
                      <span>STUD-TAPERLOCK</span>
                    </div>
                    <div className="grid grid-cols-5 py-0.5 bg-slate-50">
                      <span>-</span>
                      <span>4</span>
                      <span className="text-emerald-700">1W-0120</span>
                      <span>14</span>
                      <span>STUD-TAPERLOCK</span>
                    </div>
                    <div className="grid grid-cols-5 py-0.5">
                      <span>-</span>
                      <span>5</span>
                      <span className="text-emerald-700">1W-0124</span>
                      <span>14</span>
                      <span>NUT-HEX (CRANKSHAFT)</span>
                    </div>
                    <div className="grid grid-cols-5 py-0.5 bg-slate-50">
                      <span>-</span>
                      <span>6</span>
                      <span className="text-emerald-700">6V-5538</span>
                      <span>1</span>
                      <span>DOWEL PIN</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center border-t border-slate-200">
                    <p className="text-[10px] text-slate-400">
                      Verified against Circular Remanufacturing Standard ISO 14001
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Regular Collection Dashboard Grid (Matching left half of screenshot) */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
                Collection &gt; Collected Items
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Collection
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                View and manage collected waste items
              </p>
            </div>

            <button
              onClick={handleExport}
              className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 bg-[#124229] hover:bg-[#1a5538] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>

          {/* Top 4 Stat Cards matching reference */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Recycle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Collected</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900">48</span>
                  <span className="text-xs font-semibold text-emerald-600">↑ +12%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Weight</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900">1.8 Tons</span>
                  <span className="text-xs font-semibold text-emerald-600">↑ +8%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Completed</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900">45</span>
                  <span className="text-xs font-semibold text-emerald-600">↑ +10%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">In Progress</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900">3</span>
                  <span className="text-xs font-semibold text-slate-400">→ 0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Collected Items / Collection History */}
          <div className="flex bg-slate-200/60 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('items')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'items'
                  ? 'bg-[#124229] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Collected Items
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#124229] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Collection History
            </button>
          </div>

          {/* Cards Grid (6 cards matching screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-100 border border-slate-100 mb-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item.location}</span>
                  </p>

                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{item.date}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100/70 text-emerald-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
