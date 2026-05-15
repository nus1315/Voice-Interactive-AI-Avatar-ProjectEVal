import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck,
  FileText,
  BarChart3,
  Settings,
  User,
  Users,
  Video,
  Lock,
  LogOut,
  X,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  AlertTriangle,
  Trophy
} from 'lucide-react';
import { speakers, metrics, compareModels } from './data.js';
import { EvaluationTab, CompareTab } from './EvalComponents.jsx';
import { AnalyticsTab } from './AnalyticsTab.jsx';
import { ResearchTab } from './ResearchTab.jsx';

// ─── Admin password from env ──────────────────────────────────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'v2l@admin2026';

// ─── AdminLoginModal ──────────────────────────────────────────────────────────
const AdminLoginModal = ({ onSuccess, onClose }) => {
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const attempt = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError('Incorrect password. Admin access denied.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPw('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Card */}
      <motion.div
        className={`relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border border-slate-200 ${shake ? 'animate-shake' : ''}`}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-xl hover:bg-slate-100">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl shadow-amber-200 mb-5">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Admin Access</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Enter admin password to manage evaluation data</p>
        </div>

        <form onSubmit={attempt} className="space-y-5">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={e => { setPw(e.target.value); setError(''); }}
              placeholder="Admin password"
              autoFocus
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 outline-none rounded-2xl px-5 py-4 pr-14 text-slate-900 font-bold text-sm transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-red-50 text-red-700 px-4 py-3 rounded-2xl border border-red-100"
            >
              <ShieldAlert size={16} className="shrink-0" />
              <span className="text-xs font-bold">{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-4 rounded-2xl font-black shadow-xl shadow-amber-200 transition-all active:scale-95"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ─── DeleteConfirmModal ───────────────────────────────────────────────────────
const DeleteConfirmModal = ({ onConfirm, onClose, count }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
    <motion.div
      className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    />
    <motion.div
      className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-10 border border-slate-200 text-center"
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
        <AlertTriangle size={32} className="text-red-600" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">Clear All Data?</h3>
      <p className="text-slate-500 text-sm font-medium mb-8">
        This will permanently delete <b>{count}</b> evaluation session{count !== 1 ? 's' : ''}.
        This action cannot be undone.
      </p>
      <div className="flex gap-4">
        <button onClick={onClose} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-200 transition-all active:scale-95">
          Delete All
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
const App = () => {
  const [activeTab, setActiveTab] = useState('paper');
  const [submitted, setSubmitted] = useState(false);
  const [rankings, setRankings] = useState({});
  // rankings["speakerId__clipSlug"]["voice"|"visual"|"sync"] = [modelId,...] best→worst
  const [history, setHistory] = useState([]);
  const [voteHistory, setVoteHistory] = useState([]);
  const sessionId = useMemo(() => Math.random().toString(36).substring(2, 8).toUpperCase(), []);

  // Admin state
  const [isAdmin, setIsAdmin]         = useState(false);
  const [showLogin, setShowLogin]     = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Google Sheets Auto-Sync
  const GOOGLE_WEBAPP_URL = import.meta.env.VITE_GOOGLE_WEBAPP_URL;
  const sendDataToGoogleSheet = (payload) => {
    if (!GOOGLE_WEBAPP_URL) return;
    try {
      fetch(GOOGLE_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error('Failed to sync to Google Sheets', e);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('v2l_research_v2');
    if (saved) setHistory(JSON.parse(saved));
    const savedVotes = localStorage.getItem('v2l_votes_v1');
    if (savedVotes) setVoteHistory(JSON.parse(savedVotes));
  }, []);

  const handleVote = (clip, winnerId) => {
    const entry = { clip, winner: winnerId, timestamp: new Date().toLocaleString('th-TH') };
    const updated = [...voteHistory, entry];
    setVoteHistory(updated);
    localStorage.setItem('v2l_votes_v1', JSON.stringify(updated));

    // Send to Google Sheets
    const subjectId = clip.split('__')[0] || '';
    sendDataToGoogleSheet({
      type: 'vote',
      sessionId,
      timestamp: entry.timestamp,
      clip: clip,
      winner: winnerId,
      subjectId: subjectId
    });
  };

  // ── Ranking handlers ─────────────────────────────────────────────────────
  const handleRank = (clipKey, metricKey, orderedIds) =>
    setRankings(prev => ({ ...prev, [clipKey]: { ...(prev[clipKey] || {}), [metricKey]: orderedIds } }));

  const RANK_METRIC_KEYS = ['voice', 'sync', 'visual'];
  const totalClips = speakers.reduce((acc, sp) => acc + sp.clips.length, 0);
  const completedClips = Object.values(rankings).filter(r =>
    RANK_METRIC_KEYS.every(k => (r[k] || []).length === compareModels.length)
  ).length;
  const progress = (completedClips / totalClips) * 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert rankings → flat rows (1 row per model per clip)
    const rows = [];
    Object.entries(rankings).forEach(([clipKey, mr]) => {
      const [speakerId, clipSlug] = clipKey.split('__');
      compareModels.forEach(m => {
        rows.push({
          speakerId, clipSlug, modelId: m.id,
          voiceRank:  ((mr.voice  || []).indexOf(m.id) + 1) || '',
          syncRank:   ((mr.sync   || []).indexOf(m.id) + 1) || '',
          visualRank: ((mr.visual || []).indexOf(m.id) + 1) || '',
        });
      });
    });
    const entry = { timestamp: new Date().toLocaleString('th-TH'), sessionId, rows };
    const updated = [...history, entry];
    setHistory(updated);
    localStorage.setItem('v2l_research_v2', JSON.stringify(updated));
    sendDataToGoogleSheet({ type: 'eval_rank', sessionId, timestamp: entry.timestamp, rows });
    setSubmitted(true);
    setRankings({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSubmitted(false), 3500);
  };

  // ── Admin actions ─────────────────────────────────────────────────────────
  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const confirmClear = () => {
    setHistory([]);
    localStorage.removeItem('v2l_research_v2');
    setShowDeleteConfirm(false);
  };

  const requestDelete = () => {
    if (!isAdmin) { setShowLogin(true); return; }
    setShowDeleteConfirm(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f8] text-slate-900 font-sans selection:bg-indigo-100">

      {/* ── Modals ── */}
      <AnimatePresence>
        {showLogin && <AdminLoginModal onSuccess={handleAdminLogin} onClose={() => setShowLogin(false)} />}
        {showDeleteConfirm && (
          <DeleteConfirmModal count={history.length} onConfirm={confirmClear} onClose={() => setShowDeleteConfirm(false)} />
        )}
      </AnimatePresence>

      {/* ── Nav ── */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Video size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className="block font-black text-xl tracking-tight text-slate-900 uppercase">V2L Metrics Pro</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-500 font-bold">SadTalker Research</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-[10px] text-slate-400 font-bold">v3.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Tab switcher */}
            <div className="flex bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50">
              {[
                { id: 'paper',      label: 'Research',   icon: FileText },
                { id: 'evaluation', label: 'Evaluation', icon: ClipboardCheck },
                { id: 'compare',    label: 'Compare',    icon: Trophy },
                { id: 'summary',    label: 'Analytics',  icon: BarChart3 },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? tab.id === 'compare'
                        ? 'bg-white text-amber-600 shadow-md ring-1 ring-black/5'
                        : 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <tab.icon size={15} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Admin badge / login button */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5">
                  <ShieldCheck size={16} className="text-amber-600" />
                  <span className="text-xs font-black text-amber-700 uppercase tracking-wider">Admin</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout admin"
                  className="p-2.5 bg-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-600 border border-transparent hover:border-amber-200 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
              >
                <Lock size={14} /> Admin
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 pb-40">
        <AnimatePresence mode="wait">

          {/* ╔══════════════════════════════╗
              ║  RESEARCH TAB                ║
              ╚══════════════════════════════╝ */}
          {activeTab === 'paper' && (
            <ResearchTab key="paper" />
          )}

          {/* ╔══════════════════════════════╗
              ║  EVALUATION TAB              ║
              ╚══════════════════════════════╝ */}
          {activeTab === 'evaluation' && (
            <EvaluationTab
              key="eval"
              rankings={rankings}
              onRank={handleRank}
              onSubmit={handleSubmit}
              submitted={submitted}
              progress={progress}
              completedClips={completedClips}
              totalClips={totalClips}
            />
          )}

          {/* ╔══════════════════════════════╗
              ║  COMPARE TAB                 ║
              ╚══════════════════════════════╝ */}
          {activeTab === 'compare' && (
            <CompareTab key="compare" voteHistory={voteHistory} onVote={handleVote} />
          )}

          {/* ╔══════════════════════════════╗
              ║  ANALYTICS TAB               ║
              ╚══════════════════════════════╝ */}
          {activeTab === 'summary' && (
            <AnalyticsTab
              key="summary"
              history={history}
              voteHistory={voteHistory}
              isAdmin={isAdmin}
              setShowLogin={setShowLogin}
              requestDelete={requestDelete}
            />
          )}

        </AnimatePresence>
      </main>

      <footer className="py-16 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="text-slate-300 font-black text-[11px] uppercase tracking-[0.8em]">V2L Research Engine</div>
            <div className="flex gap-3 items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-slate-400">Systems Operational</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            {isAdmin ? (
              <button onClick={handleLogout} className="flex items-center gap-2 text-amber-500 hover:text-amber-700 text-xs font-black uppercase tracking-widest transition-colors">
                <LogOut size={14} /> Logout Admin
              </button>
            ) : (
              <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 hover:text-amber-600 text-xs font-black uppercase tracking-widest transition-colors">
                <Lock size={14} /> Admin
              </button>
            )}
            <Settings size={20} className="hover:text-indigo-600 cursor-pointer transition-colors" />
            <User size={20} className="hover:text-indigo-600 cursor-pointer transition-colors" />
            <Users size={20} className="hover:text-indigo-600 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>

      {/* Keyframe for shake animation */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;