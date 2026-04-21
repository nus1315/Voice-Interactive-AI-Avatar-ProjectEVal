import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck,
  FileText,
  BarChart3,
  Download,
  PlayCircle,
  Settings,
  Info,
  CheckCircle2,
  Trash2,
  Video,
  ExternalLink,
  ChevronRight,
  User,
  Users,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle,
  X,
} from 'lucide-react';

// ─── Admin password from env ──────────────────────────────────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'v2l@admin2026';

// ─── Data: only speakers with complete SadTalker output ─────────────────────
const BASE = '/Voice-Interactive-AI-Avatar-Project/videos';

const speakers = [
  {
    id: 'm_chai',
    name: 'Dr. Chai',
    gender: 'Male',
    path: `${BASE}/male_teacher/dr_chai`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_warning',    label: 'Warning',          emoji: '⚠️' },
    ],
  },
  {
    id: 'm_wit',
    name: 'Dr. Wit',
    gender: 'Male',
    path: `${BASE}/male_teacher/dr_wit`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_warning',    label: 'Warning',          emoji: '⚠️' },
    ],
  },
  {
    id: 'm_tun',
    name: 'Tun (Male)',
    gender: 'Male',
    path: `${BASE}/male_teacher/tun`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_warning',    label: 'Warning',          emoji: '⚠️' },
    ],
  },
  {
    id: 'f_tun',
    name: 'Tun (Female)',
    gender: 'Female',
    path: `${BASE}/female_teacher/tun`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
];

const metrics = [
  { key: 'voice',  label: 'Voice Likeness',       desc: 'Naturalness & Similarity',        color: 'indigo' },
  { key: 'visual', label: 'Visual Stability',      desc: 'Artifact-free & Steady',           color: 'violet' },
  { key: 'sync',   label: 'Lip Synchronization',   desc: 'Audio-visual temporal alignment',  color: 'purple' },
];

// ─── VideoCard ─────────────────────────────────────────────────────────────────
const VideoCard = ({ src, label, emoji }) => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/5 group/video aspect-video">
      <video ref={videoRef} src={src} controls muted={muted} className="w-full h-full object-cover" preload="metadata" />
      <div className="absolute top-3 left-3 pointer-events-none">
        <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
          <span>{emoji}</span> {label}
        </span>
      </div>
      <button
        onClick={() => setMuted(m => !m)}
        className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover/video:opacity-100 transition-opacity"
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
    </div>
  );
};

// ─── RatingRow ────────────────────────────────────────────────────────────────
const RatingRow = ({ speakerId, clipSlug, metric, value, onChange }) => {
  const rk = `${speakerId}__${clipSlug}__${metric.key}`;
  const cols = {
    indigo: { active: 'bg-indigo-600 border-indigo-600 shadow-indigo-200', hover: 'hover:border-indigo-200 hover:text-indigo-600' },
    violet: { active: 'bg-violet-600 border-violet-600 shadow-violet-200', hover: 'hover:border-violet-200 hover:text-violet-600' },
    purple: { active: 'bg-purple-600 border-purple-600 shadow-purple-200', hover: 'hover:border-purple-200 hover:text-purple-600' },
  }[metric.color];
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full bg-${metric.color}-600`} />
          {metric.label}
        </label>
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-tight">{metric.desc}</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(rk, val)}
            className={`h-14 rounded-2xl font-black text-xl transition-all border-2 ${
              value === val
                ? `${cols.active} text-white scale-105 shadow-xl`
                : `bg-white border-slate-100 text-slate-300 ${cols.hover} hover:shadow-lg`
            }`}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-300 font-bold px-1">
        <span>Poor</span><span>Excellent</span>
      </div>
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState('evaluation');
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState({});
  const [history, setHistory] = useState([]);

  // Admin state
  const [isAdmin, setIsAdmin]         = useState(false);
  const [showLogin, setShowLogin]     = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('v2l_research_v2');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // ── Rating handlers ──────────────────────────────────────────────────────
  const handleRating = (key, val) => setRatings(prev => ({ ...prev, [key]: val }));

  const totalRequired = speakers.reduce((acc, sp) => acc + sp.clips.length * metrics.length, 0);
  const progress = (Object.keys(ratings).length / totalRequired) * 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = { timestamp: new Date().toLocaleString('th-TH'), data: { ...ratings } };
    const updated = [...history, entry];
    setHistory(updated);
    localStorage.setItem('v2l_research_v2', JSON.stringify(updated));
    setSubmitted(true);
    setRatings({});
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

  // ── Analytics ─────────────────────────────────────────────────────────────
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

  const cv = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.08 } },
  };
  const iv = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

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
                <span className="text-[10px] text-slate-400 font-bold">v2.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Tab switcher */}
            <div className="flex bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50">
              {[
                { id: 'evaluation', label: 'Evaluation', icon: ClipboardCheck },
                { id: 'paper',      label: 'Research',   icon: FileText },
                { id: 'summary',    label: 'Analytics',  icon: BarChart3 },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5'
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
              ║  1. EVALUATION TAB           ║
              ╚══════════════════════════════╝ */}
          {activeTab === 'evaluation' && (
            <motion.div key="eval" variants={cv} initial="hidden" animate="visible" exit="hidden" className="space-y-10">
              <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={120} className="text-indigo-600" /></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-indigo-600 font-bold text-xs mb-3 uppercase tracking-widest">
                    <Users size={15} />
                    <span>4 Speakers · 4 Clips · 3 Metrics</span>
                    <Zap size={13} fill="currentColor" />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Audio-Visual Evaluation</h1>
                  <p className="text-slate-500 mt-3 text-base font-medium">
                    Watch each video, then rate Voice, Visual, and Lip Sync quality (1 = Poor, 5 = Excellent)
                  </p>
                </div>
                <a href="https://github.com/OpenTalker/SadTalker" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:-translate-y-1 transition-all">
                  <ExternalLink size={15} /> SadTalker Repo
                </a>
              </header>

              <AnimatePresence>
                {submitted && (
                  <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-indigo-600 text-white px-8 py-5 rounded-2xl flex items-center gap-4 shadow-2xl ring-4 ring-indigo-50">
                    <CheckCircle2 size={24} />
                    <span className="font-bold text-lg">บันทึกผลการประเมินสำเร็จ!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-16">
                {speakers.map((speaker, sIdx) => (
                  <motion.div key={speaker.id} variants={iv}
                    className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className={`px-10 py-8 border-b border-slate-100 flex items-center gap-6 ${speaker.gender === 'Male' ? 'bg-blue-50/30' : 'bg-pink-50/30'}`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${speaker.gender === 'Male' ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-100' : 'bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-100'}`}>
                        <User size={28} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Speaker {sIdx + 1}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${speaker.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{speaker.gender}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">{speaker.name}</h3>
                      </div>
                    </div>

                    <div className="p-10 space-y-14">
                      {speaker.clips.map((clip, cIdx) => {
                        const videoSrc = `${speaker.path}/${clip.slug}.mp4`;
                        return (
                          <div key={cIdx} className="bg-slate-50/60 rounded-[2rem] border border-slate-100 p-8 space-y-8">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-black shadow">{cIdx + 1}</div>
                              <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">{clip.emoji} {clip.label}</h4>
                              <span className="ml-auto text-[10px] font-bold text-slate-300 uppercase tracking-widest">{clip.slug}.mp4</span>
                            </div>
                            <VideoCard src={videoSrc} label={clip.label} emoji={clip.emoji} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                              {metrics.map(metric => (
                                <RatingRow key={metric.key} speakerId={speaker.id} clipSlug={clip.slug}
                                  metric={metric} value={ratings[`${speaker.id}__${clip.slug}__${metric.key}`]}
                                  onChange={handleRating} />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}

                {/* Floating submit bar */}
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
                  <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-5 shadow-2xl border border-white/10 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-5 pl-2">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-12 h-12 -rotate-90">
                          <circle cx="24" cy="24" r="20" strokeWidth="4" fill="transparent" className="text-white/10" stroke="currentColor" />
                          <circle cx="24" cy="24" r="20" strokeWidth="4" fill="transparent"
                            strokeDasharray={126} strokeDashoffset={126 - (126 * progress / 100)}
                            className="text-indigo-500 transition-all duration-700" stroke="currentColor" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-400">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Completion</p>
                        <p className="text-xs font-bold text-white">{Object.keys(ratings).length}/{totalRequired} ratings</p>
                      </div>
                    </div>
                    <button type="submit" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-3 transition-all active:scale-95">
                      <span>Submit Batch</span>
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* ╔══════════════════════════════╗
              ║  2. RESEARCH TAB             ║
              ╚══════════════════════════════╝ */}
          {activeTab === 'paper' && (
            <motion.div key="paper" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white rounded-[4rem] border border-slate-200 p-12 md:p-20 shadow-sm relative overflow-hidden min-h-[80vh]">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60" />
              <div className="max-w-4xl mx-auto relative z-10 space-y-16">
                <header className="text-center space-y-6">
                  <div className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 text-[10px] font-black px-6 py-3 rounded-full tracking-[0.3em] uppercase border border-indigo-100">
                    <FileText size={13} /> SadTalker Evaluation Framework
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tight">
                    Audio-Visual <br />
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Fidelity Study</span>
                  </h1>
                  <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                    Mean Opinion Score (MOS) study on SadTalker-generated talking-head videos across 4 Thai speakers (3M, 1F) with 4 speech scenarios each.
                  </p>
                </header>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Speakers', value: '4', sub: '3M / 1F' },
                    { label: 'Scenarios', value: '4', sub: 'per speaker' },
                    { label: 'Metrics',   value: '3', sub: 'MOS dimensions' },
                    { label: 'Model',     value: 'SAD', sub: 'SadTalker' },
                  ].map(c => (
                    <div key={c.label} className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl p-8 text-center border border-indigo-100">
                      <p className="text-5xl font-black text-indigo-600">{c.value}</p>
                      <p className="font-black text-slate-700 mt-2 text-sm">{c.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{c.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <section>
                    <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-10 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
                      Evaluation Dimensions
                    </h2>
                    <div className="space-y-4">
                      {metrics.map(m => (
                        <div key={m.key} className={`p-5 rounded-2xl border bg-${m.color}-50 border-${m.color}-100`}>
                          <p className="font-black text-slate-800 text-sm">{m.label}</p>
                          <p className="text-xs text-slate-500 font-medium mt-1">{m.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-10 bg-gradient-to-b from-violet-600 to-purple-600 rounded-full" />
                      Speaker Cohort
                    </h2>
                    <div className="space-y-3">
                      {speakers.map((sp, i) => (
                        <div key={sp.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${sp.gender === 'Male' ? 'bg-blue-50 border-blue-100' : 'bg-pink-50 border-pink-100'}`}>
                          <span className="text-xs font-black text-slate-400">S{i + 1}</span>
                          <span className="font-black text-slate-800 text-sm flex-1">{sp.name}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${sp.gender === 'Male' ? 'bg-blue-200 text-blue-800' : 'bg-pink-200 text-pink-800'}`}>{sp.gender}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{sp.clips.length} clips</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {/* ╔══════════════════════════════╗
              ║  3. ANALYTICS TAB            ║
              ╚══════════════════════════════╝ */}
          {activeTab === 'summary' && (
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
                  <button onClick={() => setActiveTab('evaluation')}
                    className="mt-10 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1">
                    Start Evaluation
                  </button>
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

                    {/* Export — available to everyone */}
                    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
                      <div className="relative z-10 transition-colors duration-500 group-hover:text-white">
                        <h4 className="font-black mb-6 flex items-center gap-3 text-xl">
                          <Download size={24} className="text-indigo-600 group-hover:text-white transition-colors" />
                          Export CSV Dataset
                        </h4>
                        <p className="text-sm opacity-60 mb-10 font-bold leading-relaxed border-l-4 border-indigo-100 group-hover:border-white/20 pl-6 transition-all">
                          Download complete MOS data for statistical analysis (ANOVA, P-value, etc.)
                        </p>
                        <button
                          onClick={() => {
                            let csv = 'Timestamp,SpeakerID,SpeakerName,Gender,Clip,Metric,Score\n';
                            history.forEach(entry => {
                              Object.entries(entry.data).forEach(([key, val]) => {
                                const [sid, clip, mk] = key.split('__');
                                const sp = speakers.find(s => s.id === sid);
                                csv += `${entry.timestamp},${sid},${sp?.name ?? sid},${sp?.gender ?? ''},${clip},${mk},${val}\n`;
                              });
                            });
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url; a.download = 'V2L_MOS_Results.csv'; a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="w-full bg-slate-100 group-hover:bg-white text-slate-900 py-5 rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                          <Download size={18} /> Download V2L_MOS_Results.csv
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
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