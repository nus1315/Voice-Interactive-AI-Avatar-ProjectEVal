import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Trash2, Lock, Eye, BarChart3, Download, User, Crown, Medal, Award, TrendingUp, HelpCircle
} from 'lucide-react';
import { speakers, metrics, compareModels } from './data.js';
import { ExportModal } from './EvalComponents.jsx';

export const AnalyticsTab = ({
  history,
  isAdmin,
  setShowLogin,
  requestDelete
}) => {
  const [exportType, setExportType] = useState(null); // 'eval'

  // Build Eval CSV mapping the new comparative ranking rows
  const buildEvalCSV = () => {
    if (!history || history.length === 0) return 'No data';
    let csv = 'Timestamp,SessionID,SpeakerID,SpeakerName,ClipSlug,ModelID,ModelName,VoiceRank,SyncRank,VisualRank\n';
    history.forEach(entry => {
      const rows = entry.rows || [];
      rows.forEach(row => {
        const sp = speakers.find(s => s.id === row.speakerId);
        const model = compareModels.find(m => m.id === row.modelId);
        csv += `${entry.timestamp},${entry.sessionId},${row.speakerId},${sp?.name ?? row.speakerId},${row.clipSlug},${row.modelId},${model?.name ?? row.modelId},${row.voiceRank},${row.syncRank},${row.visualRank}\n`;
      });
    });
    return csv;
  };

  // 1. Process rankings statistics for each model
  const stats = useMemo(() => {
    if (!history || history.length === 0) return null;

    // Initialize agg statistics for each model
    const modelStats = {};
    compareModels.forEach(m => {
      modelStats[m.id] = {
        id: m.id,
        name: m.name,
        shortName: m.shortName,
        icon: m.icon,
        color: m.color,
        gradient: m.gradient,
        badgeBg: m.badgeBg,
        badgeText: m.badgeText,
        venue: m.venue,
        desc: m.desc,
        voice: { sum: 0, count: 0, wins: 0 },
        sync: { sum: 0, count: 0, wins: 0 },
        visual: { sum: 0, count: 0, wins: 0 },
        totalWins: 0,
      };
    });

    history.forEach(entry => {
      const rows = entry.rows || [];
      rows.forEach(row => {
        const mId = row.modelId;
        if (!modelStats[mId]) return;

        if (row.voiceRank !== '' && row.voiceRank !== undefined) {
          const r = Number(row.voiceRank);
          modelStats[mId].voice.sum += r;
          modelStats[mId].voice.count++;
          if (r === 1) {
            modelStats[mId].voice.wins++;
            modelStats[mId].totalWins++;
          }
        }
        if (row.syncRank !== '' && row.syncRank !== undefined) {
          const r = Number(row.syncRank);
          modelStats[mId].sync.sum += r;
          modelStats[mId].sync.count++;
          if (r === 1) {
            modelStats[mId].sync.wins++;
            modelStats[mId].totalWins++;
          }
        }
        if (row.visualRank !== '' && row.visualRank !== undefined) {
          const r = Number(row.visualRank);
          modelStats[mId].visual.sum += r;
          modelStats[mId].visual.count++;
          if (r === 1) {
            modelStats[mId].visual.wins++;
            modelStats[mId].totalWins++;
          }
        }
      });
    });

    // Compute averages and compile list
    const modelList = compareModels.map(m => {
      const ms = modelStats[m.id];
      const vAvg = ms.voice.count ? ms.voice.sum / ms.voice.count : 0;
      const sAvg = ms.sync.count ? ms.sync.sum / ms.sync.count : 0;
      const visAvg = ms.visual.count ? ms.visual.sum / ms.visual.count : 0;

      const voiceAvgStr = vAvg ? vAvg.toFixed(2) : '—';
      const syncAvgStr = sAvg ? sAvg.toFixed(2) : '—';
      const visualAvgStr = visAvg ? visAvg.toFixed(2) : '—';

      const overallAvg = (vAvg && sAvg && visAvg) ? (vAvg + sAvg + visAvg) / 3 : 0;
      const overallAvgStr = overallAvg ? overallAvg.toFixed(2) : '—';

      return {
        ...m,
        avgVoice: voiceAvgStr,
        avgSync: syncAvgStr,
        avgVisual: visualAvgStr,
        overallAvg: overallAvgStr,
        overallNum: overallAvg || 99, // For sorting (lower is better)
        totalWins: ms.totalWins,
        voiceWins: ms.voice.wins,
        syncWins: ms.sync.wins,
        visualWins: ms.visual.wins,
        evalCount: ms.voice.count,
      };
    });

    // Sort by overall rank ascending (lower is better, e.g. 1.0 is highest possible)
    return modelList.sort((a, b) => a.overallNum - b.overallNum);
  }, [history]);

  // 2. Process statistics for each speaker
  const speakerStats = useMemo(() => {
    if (!history || history.length === 0) return {};
    const res = {};

    speakers.forEach(sp => {
      const modelStats = {};
      compareModels.forEach(m => {
        modelStats[m.id] = {
          voice: { sum: 0, count: 0 },
          sync: { sum: 0, count: 0 },
          visual: { sum: 0, count: 0 },
        };
      });

      history.forEach(entry => {
        const rows = entry.rows || [];
        rows.forEach(row => {
          if (row.speakerId !== sp.id) return;
          const mId = row.modelId;
          if (!modelStats[mId]) return;

          if (row.voiceRank !== '' && row.voiceRank !== undefined) {
            modelStats[mId].voice.sum += Number(row.voiceRank);
            modelStats[mId].voice.count++;
          }
          if (row.syncRank !== '' && row.syncRank !== undefined) {
            modelStats[mId].sync.sum += Number(row.syncRank);
            modelStats[mId].sync.count++;
          }
          if (row.visualRank !== '' && row.visualRank !== undefined) {
            modelStats[mId].visual.sum += Number(row.visualRank);
            modelStats[mId].visual.count++;
          }
        });
      });

      res[sp.id] = compareModels.map(m => {
        const ms = modelStats[m.id];
        const voiceAvg = ms.voice.count ? (ms.voice.sum / ms.voice.count).toFixed(2) : '—';
        const syncAvg = ms.sync.count ? (ms.sync.sum / ms.sync.count).toFixed(2) : '—';
        const visualAvg = ms.visual.count ? (ms.visual.sum / ms.visual.count).toFixed(2) : '—';
        return {
          ...m,
          voiceAvg,
          syncAvg,
          visualAvg,
        };
      });
    });

    return res;
  }, [history]);

  // Helper: Find winning model for a speaker & metric
  const getSpeakerWinner = (spId, metricKey) => {
    const spData = speakerStats[spId];
    if (!spData || spData.length === 0) return null;

    let bestModel = null;
    let bestVal = Infinity;

    spData.forEach(m => {
      const valStr = metricKey === 'voice' ? m.voiceAvg : metricKey === 'sync' ? m.syncAvg : m.visualAvg;
      if (valStr !== '—') {
        const val = parseFloat(valStr);
        if (val < bestVal) {
          bestVal = val;
          bestModel = m;
        }
      }
    });

    return bestModel ? { ...bestModel, avg: bestVal.toFixed(2) } : null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  // Convert rank (1 to 4) to visually intuitive progress percentage (1st place = 100%, 4th place = 0%)
  const rankToPercent = (rankStr) => {
    if (rankStr === '—') return 0;
    const rank = parseFloat(rankStr);
    return Math.max(0, Math.min(100, ((4 - rank) / 3) * 100));
  };

  return (
    <motion.div key="summary" variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1.5">
            <TrendingUp size={14} /><span>Research Dashboard Analytics</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">สรุปผลการประเมิน</h1>
          <p className="text-slate-500 mt-1 font-semibold text-sm">
            วิเคราะห์และเปรียบเทียบอันดับเฉลี่ยของโมเดล (Average Rank) — {history.length} Session{history.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Right side: admin controls */}
        {isAdmin ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl">
              <ShieldCheck size={14} className="text-amber-600" />
              <span className="text-xs font-black text-amber-700 uppercase tracking-wider">Admin Mode</span>
            </div>
            <button
              onClick={requestDelete}
              disabled={history.length === 0}
              className="flex items-center gap-2 px-5 py-3 text-red-500 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200/50 rounded-2xl transition-all active:scale-95 font-black text-xs uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              title="Clear all data (Admin only)"
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-amber-50 text-slate-400 hover:text-amber-600 border border-transparent hover:border-amber-200 px-5 py-3 rounded-2xl transition-all text-xs font-black uppercase tracking-wider"
            title="Admin login to manage data"
          >
            <Lock size={14} />
            <span>Admin Only</span>
          </button>
        )}
      </header>

      {/* Read-only notice for non-admin */}
      {!isAdmin && history.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 bg-blue-50 border border-blue-100 text-blue-700 px-6 py-4 rounded-2xl text-sm font-bold shadow-sm">
          <Eye size={16} className="shrink-0" />
          <span>คุณกำลังดู Analytics ในโหมด <b>Read-only</b> — เข้าสู่ระบบ Admin เพื่อจัดการและล้างข้อมูล</span>
        </motion.div>
      )}

      {!stats ? (
        <div className="bg-white rounded-[4rem] p-24 border border-slate-200 text-center shadow-sm">
          <BarChart3 size={72} className="mx-auto mb-6 text-slate-200" strokeWidth={1.5} />
          <p className="text-slate-400 font-black text-lg uppercase tracking-[0.3em]">No Evaluation Data Yet</p>
          <p className="text-slate-400 font-semibold text-xs mt-2">ยังไม่มีข้อมูลการจัดอันดับ ร่วมประเมินได้ที่หน้า Evaluation เพื่อดูการประมวลผล</p>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Leaderboard Cards Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Crown size={22} className="text-amber-500" /> Model Leaderboard (อันดับเฉลี่ย)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((model, idx) => {
                const isLeader = idx === 0;
                return (
                  <motion.div
                    key={model.id}
                    variants={cardVariants}
                    className={`bg-white rounded-[2.5rem] p-6 border-2 transition-all relative flex flex-col justify-between ${
                      isLeader 
                        ? 'border-amber-400 shadow-xl shadow-amber-50 ring-4 ring-amber-400/5' 
                        : 'border-slate-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Position Badge */}
                    <div className="absolute -top-3.5 left-8 z-10 flex items-center justify-center">
                      <div className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow ${
                        idx === 0 ? 'bg-amber-400 text-amber-950 font-black' :
                        idx === 1 ? 'bg-slate-300 text-slate-800' :
                        idx === 2 ? 'bg-orange-300 text-orange-950' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {idx === 0 && <Crown size={10} fill="currentColor" />}
                        {idx === 0 && 'Winner'}
                        {idx > 0 && `Rank #${idx + 1}`}
                      </div>
                    </div>

                    <div className="pt-2">
                      {/* Title */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{model.icon}</span>
                          <div>
                            <h3 className="font-black text-slate-900 text-lg">{model.name}</h3>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{model.venue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Overall Average Rank Block */}
                      <div className="bg-slate-50 rounded-2xl p-4 text-center mb-6">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Overall Rank</span>
                        <div className="flex items-baseline justify-center gap-1.5 mt-1">
                          <span className={`text-4xl font-black ${isLeader ? 'text-amber-500' : 'text-slate-800'}`}>{model.overallAvg}</span>
                          <span className="text-[10px] text-slate-400 font-bold">/ 4.00</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">(ต่ำสุดคือดีที่สุด)</span>
                      </div>

                      {/* Detail Metrics */}
                      <div className="space-y-4">
                        {[
                          { label: 'Voice Likeness', avg: model.avgVoice, color: 'indigo' },
                          { label: 'Lip Synchronization', avg: model.avgSync, color: 'purple' },
                          { label: 'Visual Stability', avg: model.avgVisual, color: 'violet' }
                        ].map(metric => (
                          <div key={metric.label}>
                            <div className="flex justify-between items-center text-xs mb-1 font-bold">
                              <span className="text-slate-600">{metric.label}</span>
                              <span className={`text-sm font-black text-${metric.color}-600`}>{metric.avg}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${rankToPercent(metric.avg)}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full rounded-full bg-${metric.color}-500`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Wins Badge */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-slate-400">Total #1 picks</span>
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-2.5 py-1 rounded-lg">
                        🏆 {model.totalWins} ครั้ง
                      </span>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Per-Speaker Breakdown Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                  <User size={18} className="text-indigo-600" /> Per-Speaker Winning Models
                </h3>
                <p className="text-slate-400 font-semibold text-xs mt-0.5">โมเดลที่ได้อันดับเฉลี่ยดีที่สุด (ดีที่สุดเป็นอันดับหนึ่ง) แยกรายคน</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 text-slate-500 rounded-xl px-3 py-1.5 self-start text-[10px] font-black uppercase tracking-wider">
                <Crown size={12} className="text-amber-500" /> Winner Based on average rank
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/4">Speaker</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">🎤 Voice Winner</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">👄 Lip Sync Winner</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">👁️ Visual Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {speakers.map(sp => {
                    const voiceWin = getSpeakerWinner(sp.id, 'voice');
                    const syncWin = getSpeakerWinner(sp.id, 'sync');
                    const visualWin = getSpeakerWinner(sp.id, 'visual');

                    return (
                      <tr key={sp.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black ${
                              sp.gender === 'Male' ? 'bg-blue-500 shadow-md shadow-blue-100' : 'bg-pink-500 shadow-md shadow-pink-100'
                            }`}>
                              {sp.gender === 'Female' ? '👩' : '👨'}
                            </div>
                            <div>
                              <span className="font-black text-slate-800 text-sm block">{sp.name}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sp.role} ({sp.gender})</span>
                            </div>
                          </div>
                        </td>

                        {/* Voice Winner */}
                        <td className="px-6 py-5">
                          {voiceWin ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{voiceWin.icon}</span>
                              <div>
                                <span className={`text-xs font-black text-${voiceWin.color}-600 block`}>{voiceWin.name}</span>
                                <span className="text-[9px] font-semibold text-slate-400">Avg Rank: {voiceWin.avg}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 font-bold">—</span>
                          )}
                        </td>

                        {/* Sync Winner */}
                        <td className="px-6 py-5">
                          {syncWin ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{syncWin.icon}</span>
                              <div>
                                <span className={`text-xs font-black text-${syncWin.color}-600 block`}>{syncWin.name}</span>
                                <span className="text-[9px] font-semibold text-slate-400">Avg Rank: {syncWin.avg}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 font-bold">—</span>
                          )}
                        </td>

                        {/* Visual Winner */}
                        <td className="px-6 py-5">
                          {visualWin ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{visualWin.icon}</span>
                              <div>
                                <span className={`text-xs font-black text-${visualWin.color}-600 block`}>{visualWin.name}</span>
                                <span className="text-[9px] font-semibold text-slate-400">Avg Rank: {visualWin.avg}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 font-bold">—</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bottom: statistics summary + export block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Interaction Summary */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-end min-h-[250px] border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-20 -mt-20" />
          <div className="relative z-10">
            <p className="font-black text-indigo-400 uppercase text-[10px] tracking-[0.4em] mb-4">Total Interactions</p>
            <div className="flex gap-8 mb-4">
              <div>
                <h2 className="text-6xl font-black tracking-tighter leading-[0.8] mb-2">{history.length}</h2>
                <p className="text-indigo-100 font-bold opacity-60 text-[10px] uppercase tracking-widest">Active Eval Sessions</p>
              </div>
            </div>
            <p className="text-[11px] text-white/50 font-medium max-w-[280px]">
              เก็บสถิติแยกรายตัวสำหรับทุก Speaker และคลิปที่ถูกประเมิน ข้อมูลถูกเข้ารหัสและเก็บบน Local Storage พร้อมระบบคลาวด์ซิงก์
            </p>
          </div>
        </div>

        {/* Export dataset (Admin Only) */}
        {isAdmin ? (
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative group overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            
            <div className="relative z-10 transition-colors duration-500 group-hover:text-white">
              <h4 className="font-black mb-3 flex items-center gap-3 text-xl">
                <Download size={24} className="text-indigo-600 group-hover:text-white transition-colors" />
                Admin Export Dataset
              </h4>
              <p className="text-[11px] opacity-80 mb-6 font-bold leading-relaxed border-l-4 border-indigo-100 group-hover:border-white/20 pl-4 transition-all">
                ดาวน์โหลดผลการเปรียบเทียบโมเดลทั้งหมดในรูปแบบ CSV หรือ JSON ไปใช้วิเคราะห์ต่อทางสถิติ
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setExportType('eval')}
                  disabled={history.length === 0}
                  className="w-full bg-slate-100 group-hover:bg-white/10 text-slate-900 group-hover:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <BarChart3 size={14} /> Export Model Ranking Dataset (CSV)
                </button>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 group-hover:border-white/20">
              <a href="https://docs.google.com/spreadsheets/d/1itf6Hj9SkUT0Xcea_Unj8mtkF_SCSoRLMoG5vpV_g7I/edit?usp=sharing" target="_blank" rel="noreferrer"
                 className="flex items-center justify-center gap-2 text-xs font-black text-indigo-600 group-hover:text-indigo-200 hover:underline">
                <Eye size={14} /> View Master Google Sheet
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 border-dashed flex flex-col items-center justify-center text-center opacity-75">
            <Lock size={32} className="text-slate-300 mb-4" />
            <h4 className="font-black text-slate-500 mb-1.5">Export Dataset Locked</h4>
            <p className="text-[10px] text-slate-400 font-bold max-w-[220px] leading-relaxed">
              กรุณาเข้าสู่ระบบในฐานะ Admin เพื่อปลดล็อคการดาวน์โหลดไฟล์ชุดข้อมูลประเมินทั้งหมด
            </p>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {exportType === 'eval' && (
          <ExportModal
            onClose={() => setExportType(null)}
            data={buildEvalCSV()}
            filename="V2L_Model_Rankings"
            label="Model Ranking Data"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
