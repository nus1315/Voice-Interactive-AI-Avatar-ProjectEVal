import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Trash2, Lock, Eye, BarChart3, Download, User
} from 'lucide-react';
import { speakers, metrics } from './data.js';
import { ExportModal } from './EvalComponents.jsx';

export const AnalyticsTab = ({
  history,
  isAdmin,
  setShowLogin,
  requestDelete
}) => {
  const cv = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.08 } },
  };
  const [showExport, setShowExport] = useState(false);

  // Build CSV
  const buildCSV = () => {
    if (history.length === 0) return 'No data';
    let csv = 'Timestamp,SpeakerID,SpeakerName,Gender,Clip,Metric,Score\n';
    history.forEach(entry => {
      Object.entries(entry.data).forEach(([key, val]) => {
        const [sid, clip, mk] = key.split('__');
        const sp = speakers.find(s => s.id === sid);
        csv += `${entry.timestamp},${sid},${sp?.name ?? sid},${sp?.gender ?? ''},${clip},${mk},${val}\n`;
      });
    });
    return csv;
  };

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const agg = {};
    metrics.forEach(m => { agg[m.key] = { total: 0, count: 0 }; });
    history.forEach(entry => {
      Object.entries(entry.data).forEach(([key, val]) => {
        const mk = key.split('__')[2];
        if (agg[mk]) { agg[mk].total += val; agg[mk].count++; }
      });
    });
    return metrics.map(m => ({
      ...m,
      avg: agg[m.key].count ? (agg[m.key].total / agg[m.key].count).toFixed(2) : '—',
    }));
  }, [history]);

  const speakerStats = useMemo(() => {
    if (history.length === 0) return {};
    const res = {};
    speakers.forEach(sp => {
      const agg = {};
      metrics.forEach(m => { agg[m.key] = { total: 0, count: 0 }; });
      history.forEach(entry => {
        Object.entries(entry.data).forEach(([key, val]) => {
          const [sid, , mk] = key.split('__');
          if (sid === sp.id && agg[mk]) { agg[mk].total += val; agg[mk].count++; }
        });
      });
      res[sp.id] = metrics.map(m => ({
        ...m,
        avg: agg[m.key].count ? (agg[m.key].total / agg[m.key].count).toFixed(2) : '—',
      }));
    });
    return res;
  }, [history]);

  return (
    <motion.div key="summary" variants={cv} initial="hidden" animate="visible" className="space-y-10">
      {/* Header — shows admin controls OR read-only notice */}
      <header className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Performance Analytics</h1>
          <p className="text-slate-500 mt-1 font-semibold">
            Mean Opinion Score (MOS) — {history.length} submission{history.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Right side: admin delete or lock icon */}
        {isAdmin ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
              <ShieldCheck size={14} className="text-amber-600" />
              <span className="text-xs font-black text-amber-700 uppercase tracking-wider">Admin Mode</span>
            </div>
            <button
              onClick={requestDelete}
              disabled={history.length === 0}
              className="flex items-center gap-2 p-4 text-red-500 hover:text-white bg-red-50 hover:bg-red-600 rounded-2xl transition-all active:scale-95 font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              title="Clear all data (Admin only)"
            >
              <Trash2 size={20} />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-amber-50 text-slate-400 hover:text-amber-600 border border-transparent hover:border-amber-200 p-4 rounded-2xl transition-all text-xs font-black uppercase tracking-wider"
            title="Admin login to manage data"
          >
            <Lock size={16} />
            <span className="hidden sm:inline">Admin Only</span>
          </button>
        )}
      </header>

      {/* Read-only notice for non-admin */}
      {!isAdmin && history.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 bg-blue-50 border border-blue-100 text-blue-700 px-6 py-4 rounded-2xl text-sm font-bold">
          <Eye size={16} className="shrink-0" />
          <span>คุณกำลังดู Analytics ในโหมด <b>Read-only</b> — เข้าสู่ระบบ Admin เพื่อจัดการข้อมูล</span>
        </motion.div>
      )}

      {!stats ? (
        <div className="bg-white rounded-[4rem] p-32 border border-slate-200 text-center shadow-sm">
          <BarChart3 size={72} className="mx-auto mb-8 text-slate-100" strokeWidth={1} />
          <p className="text-slate-300 font-black text-lg uppercase tracking-[0.3em]">No Data Yet</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Global metric cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stats.map(s => (
              <div key={s.key} className={`bg-white p-8 rounded-[3rem] border border-${s.color}-100 shadow-sm`}>
                <p className={`text-[10px] font-black uppercase tracking-[0.4em] text-${s.color}-400 mb-4`}>Global Average</p>
                <p className={`text-7xl font-black text-${s.color}-600 tracking-tighter`}>{s.avg}</p>
                <p className="font-black text-slate-700 mt-3">{s.label}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">{s.desc}</p>
                <div className="mt-6 w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(parseFloat(s.avg) / 5) * 100}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={`h-full rounded-lg ${parseFloat(s.avg) >= 4 ? `bg-${s.color}-500` : parseFloat(s.avg) >= 3 ? 'bg-amber-400' : 'bg-red-400'}`}
                  />
                </div>
                <p className="text-[10px] text-slate-300 font-bold mt-2 text-right">/5.00</p>
              </div>
            ))}
          </div>

          {/* Per-speaker table */}
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-lg">Per-Speaker Breakdown</h3>
              {!isAdmin && (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Eye size={12} /> Read-only
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-10 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Speaker</th>
                    {metrics.map(m => (
                      <th key={m.key} className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{m.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {speakers.map(sp => {
                    const spStat = speakerStats[sp.id] || [];
                    return (
                      <tr key={sp.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black ${sp.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                              <User size={14} />
                            </div>
                            <span className="font-bold text-slate-800">{sp.name}</span>
                          </div>
                        </td>
                        {spStat.map(s => (
                          <td key={s.key} className="px-6 py-5">
                            <span className={`text-2xl font-black text-${s.color}-600`}>{s.avg}</span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom: submission count + export */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-end min-h-[280px] border border-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-20 -mt-20" />
              <div className="relative z-10">
                <p className="font-black text-indigo-400 uppercase text-[10px] tracking-[0.4em] mb-4">Submissions</p>
                <h2 className="text-[8rem] font-black tracking-tighter leading-[0.8] mb-4">{history.length}</h2>
                <p className="text-indigo-100 font-bold opacity-60">Total evaluation sessions stored locally.</p>
              </div>
            </div>

            {/* Export — password protected */}
            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
              <div className="relative z-10 transition-colors duration-500 group-hover:text-white">
                <h4 className="font-black mb-6 flex items-center gap-3 text-xl">
                  <Download size={24} className="text-indigo-600 group-hover:text-white transition-colors" />
                  Export CSV / JSON Dataset
                </h4>
                <p className="text-sm opacity-60 mb-10 font-bold leading-relaxed border-l-4 border-indigo-100 group-hover:border-white/20 pl-6 transition-all">
                  ดาวน์โหลด MOS data สำหรับวิเคราะห์ทางสถิติ (ANOVA, P-value ฯลฯ) — ต้องใส่รหัสผ่าน
                </p>
                <button
                  onClick={() => setShowExport(true)}
                  disabled={history.length === 0}
                  className="w-full bg-slate-100 group-hover:bg-white text-slate-900 py-5 rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Lock size={18} className="text-indigo-600 group-hover:text-indigo-600" /> Export with Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && (
          <ExportModal
            onClose={() => setShowExport(false)}
            data={buildCSV()}
            filename="V2L_Analytics_MOS"
            label="Analytics MOS Data"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
