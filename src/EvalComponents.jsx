import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, VolumeX, User, Play, Pause, RotateCcw,
  ThumbsUp, Crown, Star, Trophy, SlidersHorizontal,
  CheckCircle2, ChevronRight, BarChart3,
  Download, Lock, X, Eye, EyeOff, FileJson, FileText,
} from 'lucide-react';
import { speakers, metrics, commonClips, compareModels, compareSubjects, BASE } from './data.js';

// ─── Export password from env ──────────────────────────────────────────────────
const EXPORT_PASSWORD = import.meta.env.VITE_EXPORT_PASSWORD || 'fuck u';

// ─── ExportModal ──────────────────────────────────────────────────────────────
export const ExportModal = ({ onClose, data, filename, label }) => {
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const attempt = (e) => {
    e.preventDefault();
    if (pw === EXPORT_PASSWORD) { setUnlocked(true); setError(''); }
    else { setError('Wrong export password.'); setPw(''); }
  };

  const downloadCSV = () => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename + '.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename + '.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} />
      <motion.div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border border-slate-200"
        initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40 }}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-5">
            <Download size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Export {label}</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">กรอกรหัสเพื่อดาวน์โหลดข้อมูล</p>
        </div>

        {!unlocked ? (
          <form onSubmit={attempt} className="space-y-5">
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={pw}
                onChange={e => { setPw(e.target.value); setError(''); }}
                placeholder="Export password"
                autoFocus
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 outline-none rounded-2xl px-5 py-4 pr-14 text-slate-900 font-bold text-sm transition-colors"
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-3 bg-red-50 text-red-700 px-4 py-3 rounded-2xl border border-red-100 text-xs font-bold">
                <Lock size={14} className="shrink-0" />{error}
              </div>
            )}
            <button type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all active:scale-95">
              Unlock Export
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} /> ปลดล็อคสำเร็จ — เลือกรูปแบบไฟล์
            </div>
            <button onClick={downloadCSV}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-700 text-white py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95">
              <FileText size={18} /> Download CSV
            </button>
            <button onClick={downloadJSON}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 text-white py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95">
              <FileJson size={18} /> Download JSON
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};


// ─── VideoCard ────────────────────────────────────────────────────────────────
export const VideoCard = ({ src, label, emoji }) => {
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

// ─── Ranking metric config ────────────────────────────────────────────────────
const RANK_METRICS = [
  { key: 'voice',  emoji: '🎤', question: 'เสียงพูดเป็นธรรมชาติที่สุด?',  hint: 'โทนเสียง · ความลื่นไหล · ฟังสบาย' },
  { key: 'sync',   emoji: '👄', question: 'ปากตรงกับเสียงมากที่สุด?',   hint: 'ดูการขยับปากสัมพันธ์กับเสียงที่ได้ยิน' },
  { key: 'visual', emoji: '👁️', question: 'ภาพมีความสมจริงและนิ่ง?',    hint: 'ความคมชัด · ไม่มี artifact · ใบหน้าไม่กระตุก' },
];

// ─── RankingRow ───────────────────────────────────────────────────────────────
const RANK_BADGE  = ['①', '②', '③', '④'];
const RANK_STYLE  = [
  'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-100',
  'bg-slate-600 border-slate-500 text-white shadow-lg shadow-slate-100',
  'bg-orange-400 border-orange-300 text-white shadow-lg shadow-orange-100',
  'bg-slate-200 border-slate-200 text-slate-600 shadow',
];

const RankingRow = ({ metric, ranking, onChange }) => {
  const click = (id) => {
    const i = ranking.indexOf(id);
    onChange(i === -1 ? [...ranking, id] : ranking.slice(0, i));
  };
  const done = ranking.length === compareModels.length;
  return (
    <div className={`rounded-3xl border-2 p-5 transition-all duration-300 ${
      done ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-100 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
            <span className="text-2xl">{metric.emoji}</span>{metric.question}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5 ml-9">{metric.hint}</p>
        </div>
        {done
          ? <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
          : <span className="text-xs font-black text-slate-300">{ranking.length}/4</span>}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {compareModels.map(m => {
          const ri = ranking.indexOf(m.id);
          const ranked = ri !== -1;
          return (
            <button key={m.id} type="button" onClick={() => click(m.id)}
              className={`relative flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl border-2 font-bold text-xs
                transition-all duration-150 active:scale-95 select-none ${
                ranked
                  ? `${RANK_STYLE[ri]} scale-[1.03]`
                  : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:border-slate-300'
              }`}>
              {ranked && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-base bg-white rounded-full w-7 h-7 flex items-center justify-center shadow border border-slate-100 font-black text-slate-700">
                  {RANK_BADGE[ri]}
                </span>
              )}
              <span className="text-2xl">{m.icon}</span>
              <span className="text-[11px] leading-tight text-center font-black">{m.shortName || m.name}</span>
            </button>
          );
        })}
      </div>
      {!done && (
        <p className="text-center text-[10px] text-slate-300 font-semibold mt-3">
          คลิกเรียงจาก ⭐ ดีที่สุด → แย่ที่สุด
        </p>
      )}
    </div>
  );
};

// ─── SyncVideoCard (Compare tab) ─────────────────────────────────────────────
export const SyncVideoCard = ({ src, speaker, isWinner, voted, rank, videoRef: externalRef }) => {
  const internalRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const setRef = (el) => {
    internalRef.current = el;
    if (typeof externalRef === 'function') externalRef(el);
  };
  const gc = speaker.gender === 'Male'
    ? { bg: 'from-blue-500 to-indigo-600', badge: 'bg-blue-100 text-blue-700', border: 'border-blue-200' }
    : { bg: 'from-pink-500 to-rose-600', badge: 'bg-pink-100 text-pink-700', border: 'border-pink-200' };

  const toggle = () => {
    const v = internalRef.current; if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };
  const reset = () => {
    const v = internalRef.current; if (!v) return;
    v.currentTime = 0; v.pause(); setPlaying(false);
  };

  return (
    <motion.div layout className={`relative rounded-3xl overflow-hidden bg-slate-900 border-2 transition-all duration-500 ${isWinner ? 'border-amber-400 shadow-2xl shadow-amber-200/60 scale-[1.02]'
        : voted ? 'border-slate-700 opacity-60'
          : 'border-white/10 hover:border-white/30 hover:shadow-xl'
      }`}>
      {isWinner && (
        <motion.div initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-amber-400 text-amber-900 rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-lg font-black text-xs uppercase tracking-wider">
            <Crown size={14} fill="currentColor" /> Best Pick!
          </div>
        </motion.div>
      )}
      {voted && rank && (
        <div className="absolute top-3 left-3 z-10 bg-black/70 text-white text-xs font-black px-2.5 py-1 rounded-full backdrop-blur-sm">#{rank}</div>
      )}
      <video ref={setRef} src={src} className="w-full aspect-video object-cover" preload="metadata" onEnded={() => setPlaying(false)} />
      <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-black/60 via-transparent to-black/20">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm bg-gradient-to-r ${gc.bg} shadow-lg`}>
            <User size={12} className="text-white" />
            <span className="text-white text-xs font-black">{speaker.name}</span>
          </div>
          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${gc.badge} backdrop-blur-sm`}>{speaker.gender}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={toggle} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all">
            {playing ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
          </button>
          <button onClick={reset} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── EvalVideoCard (with external ref for sync play) ──────────────────────────
const EvalVideoCard = ({ src, model, audioFallbackSrc, videoRef: externalRef }) => {
  const internalRef = useRef(null);
  const audioRef = useRef(null);
  
  const setRef = (el) => {
    internalRef.current = el;
    if (typeof externalRef === 'function') externalRef(el);
  };

  // Sync fallback audio with native video controls
  const handlePlay = () => { if (audioRef.current) audioRef.current.play(); };
  const handlePause = () => { if (audioRef.current) audioRef.current.pause(); };
  const handleSeek = () => { if (audioRef.current && internalRef.current) audioRef.current.currentTime = internalRef.current.currentTime; };

  return (
    <motion.div layout className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 hover:border-white/30 transition-all duration-500">
      {/* Model badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase bg-${model.color}-500/90 text-white flex items-center gap-1.5 backdrop-blur-sm shadow`}>
          <span>{model.icon}</span> {model.name}
        </span>
      </div>
      {/* Venue badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="text-[9px] font-bold text-white/60 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">{model.venue}</span>
      </div>

      {/* Video */}
      <div className="aspect-video bg-slate-950 relative">
        <video ref={setRef} src={src} playsInline controls
          className="w-full h-full object-cover"
          preload="metadata"
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={handleSeek}
        />
        {audioFallbackSrc && (
          <audio ref={audioRef} src={audioFallbackSrc} preload="metadata" />
        )}
      </div>
    </motion.div>
  );
};

// ─── EvaluationTab (Ranking UI) ───────────────────────────────────────────────
export const EvaluationTab = ({ rankings, onRank, onSubmit, submitted, progress, completedClips, totalClips }) => {
  const [selSubject, setSelSubject] = useState(speakers[0].id);
  const [selClip,    setSelClip]    = useState(speakers[0].clips[0].slug);
  const videoRefs = useRef({});

  const subject  = speakers.find(s => s.id === selSubject);
  const clip     = subject?.clips.find(c => c.slug === selClip);
  const clipKey  = `${selSubject}__${selClip}`;
  const clipR    = rankings[clipKey] || {};
  const clipDone = RANK_METRICS.every(m => (clipR[m.key] || []).length === compareModels.length);

  const stopAll  = () => Object.values(videoRefs.current).forEach(v => v?.pause());
  const playAll  = () => Object.values(videoRefs.current).forEach(v => { if (v) { v.currentTime = 0; v.play(); } });
  const resetAll = () => Object.values(videoRefs.current).forEach(v => { if (v) { v.currentTime = 0; v.pause(); } });

  const changeSubject = (id) => {
    stopAll();
    setSelSubject(id);
    setSelClip(speakers.find(s => s.id === id)?.clips[0]?.slug || '');
  };
  const changeClip = (slug) => { stopAll(); setSelClip(slug); };
  const goNext = () => {
    const clips = subject?.clips || [];
    const i = clips.findIndex(c => c.slug === selClip);
    if (i < clips.length - 1) changeClip(clips[i + 1].slug);
  };

  const spDoneCount = (sp) =>
    sp.clips.filter(c => RANK_METRICS.every(m =>
      (rankings[`${sp.id}__${c.slug}`]?.[m.key] || []).length === compareModels.length
    )).length;

  return (
    <motion.div key="eval" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

      {/* Success toast */}
      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-indigo-600 text-white px-8 py-5 rounded-2xl flex items-center gap-4 shadow-2xl ring-4 ring-indigo-50">
            <CheckCircle2 size={24} /><span className="font-bold text-lg">ส่งผลสำเร็จ! ขอบคุณครับ 🙏</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><BarChart3 size={120} className="text-indigo-500" /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-indigo-600 font-bold text-xs mb-3 uppercase tracking-widest">
            <SlidersHorizontal size={15} /><span>Ranking Evaluation · คลิกเรียงอันดับโมเดล</span><Star size={13} fill="currentColor" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">จัดอันดับโมเดล</h1>
          <p className="text-slate-500 mt-3 text-base font-medium">
            ดูวิดีโอ 4 ตัว แล้วกดเรียง <strong>① ② ③ ④</strong> จากดีที่สุด → แย่ที่สุด สำหรับแต่ละหัวข้อ
          </p>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                animate={{ width: `${progress}%` }} transition={{ duration: 0.7 }} />
            </div>
            <span className="text-sm font-black text-indigo-600 whitespace-nowrap">{completedClips}/{totalClips} คลิป</span>
          </div>
        </div>
      </header>

      {/* Speaker selector */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
          <User size={12} className="inline mr-1.5 mb-0.5" />เลือก Speaker
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {speakers.map(s => {
            const done = spDoneCount(s);
            const allDone = done === s.clips.length;
            return (
              <button key={s.id} type="button" onClick={() => changeSubject(s.id)}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl font-black text-xs transition-all ${
                  selSubject === s.id
                    ? s.gender === 'Female'
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}>
                <span className="text-lg">{s.gender === 'Female' ? '👩' : '👨'}</span>
                <span>{s.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selSubject === s.id ? 'bg-white/20 text-white'
                  : allDone ? 'bg-emerald-100 text-emerald-700'
                  : 'text-slate-400'
                }`}>{done}/{s.clips.length} ✓</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clip selector */}
      {subject && (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">เลือก Clip</p>
          <div className="flex flex-wrap gap-3">
            {subject.clips.map(c => {
              const done = RANK_METRICS.every(m =>
                (rankings[`${subject.id}__${c.slug}`]?.[m.key] || []).length === compareModels.length
              );
              return (
                <button key={c.slug} type="button" onClick={() => changeClip(c.slug)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black text-sm transition-all ${
                    selClip === c.slug
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200'
                      : done
                        ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
                  }`}>
                  <span>{c.emoji}</span>{c.label}
                  {done && <CheckCircle2 size={13} className="text-emerald-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Videos + Ranking */}
      <form onSubmit={onSubmit}>
        {subject && clip && (
          <div className="space-y-5 mb-32">

            {/* Video grid */}
            <div className="bg-slate-900 rounded-[2.5rem] p-6 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="text-white font-black text-lg">
                  {clip.emoji} {clip.label}
                  <span className="text-white/40 font-semibold text-sm ml-3">{subject.name}</span>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: 'Play All', icon: <Play size={13} fill="white" />, fn: playAll },
                    { label: 'Pause',    icon: <Pause size={13} />,            fn: stopAll },
                    { label: 'Reset',    icon: <RotateCcw size={13} />,        fn: resetAll },
                  ].map(b => (
                    <button key={b.label} type="button" onClick={b.fn}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
                      {b.icon}{b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {compareModels.map(model => (
                  <EvalVideoCard
                    key={model.id}
                    src={`${subject.path}/${model.id}/${clip.slug}.mp4`}
                    model={model}
                    audioFallbackSrc={model.id === 'echomimic' ? `${subject.path}/ditto/${clip.slug}.mp4` : null}
                    videoRef={(el) => { videoRefs.current[model.id] = el; }}
                  />
                ))}
              </div>
            </div>

            {/* 3 Ranking rows */}
            <div className="space-y-4">
              {RANK_METRICS.map(metric => (
                <RankingRow
                  key={metric.key}
                  metric={metric}
                  ranking={clipR[metric.key] || []}
                  onChange={(order) => onRank(clipKey, metric.key, order)}
                />
              ))}
            </div>

            {/* Next clip CTA */}
            <AnimatePresence>
              {clipDone && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex justify-center pt-2">
                  {subject.clips.findIndex(c => c.slug === selClip) < subject.clips.length - 1 ? (
                    <button type="button" onClick={goNext}
                      className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-emerald-200 transition-all active:scale-95 text-base">
                      <CheckCircle2 size={20} />คลิปนี้เสร็จแล้ว — ถัดไป<ChevronRight size={20} />
                    </button>
                  ) : (
                    <div className="text-emerald-600 font-black text-sm flex items-center gap-2 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-200">
                      <CheckCircle2 size={18} />ครบทุก Clip ของ {subject.name} แล้ว! กด &quot;ส่งผล&quot; หรือทำ Speaker อื่นต่อ
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

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
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-400">{Math.round(progress)}%</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">ความคืบหน้า</p>
                <p className="text-xs font-bold text-white">{completedClips}/{totalClips} คลิป</p>
              </div>
            </div>
            <button type="submit"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-3 transition-all active:scale-95">
              <span>ส่งผลทั้งหมด</span><ChevronRight size={17} />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};



  );
};

