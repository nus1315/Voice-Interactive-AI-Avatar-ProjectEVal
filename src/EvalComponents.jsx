import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, VolumeX, User, Play, Pause, RotateCcw,
  ThumbsUp, Crown, Star, Trophy, SlidersHorizontal,
  CheckCircle2, ChevronRight, BarChart3,
} from 'lucide-react';
import { speakers, metrics, commonClips } from './data.js';

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

// ─── RatingRow ────────────────────────────────────────────────────────────────
export const RatingRow = ({ speakerId, clipSlug, metric, value, onChange }) => {
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
        {[1,2,3,4,5].map(val => (
          <button key={val} type="button" onClick={() => onChange(rk, val)}
            className={`h-14 rounded-2xl font-black text-xl transition-all border-2 ${
              value === val
                ? `${cols.active} text-white scale-105 shadow-xl`
                : `bg-white border-slate-100 text-slate-300 ${cols.hover} hover:shadow-lg`
            }`}>{val}</button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-300 font-bold px-1">
        <span>Poor</span><span>Excellent</span>
      </div>
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
    <motion.div layout className={`relative rounded-3xl overflow-hidden bg-slate-900 border-2 transition-all duration-500 ${
      isWinner ? 'border-amber-400 shadow-2xl shadow-amber-200/60 scale-[1.02]'
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

// ─── EvaluationTab ────────────────────────────────────────────────────────────
export const EvaluationTab = ({ ratings, onRate, onSubmit, submitted, progress, totalRequired }) => {
  const iv = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
  return (
    <motion.div key="eval" initial="hidden" animate="visible" exit="hidden"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
      className="space-y-10">
      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-indigo-600 text-white px-8 py-5 rounded-2xl flex items-center gap-4 shadow-2xl ring-4 ring-indigo-50">
            <CheckCircle2 size={24} /><span className="font-bold text-lg">บันทึกผลการประเมินสำเร็จ!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} className="space-y-16">
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
              {speaker.clips.map((clip, cIdx) => (
                <div key={cIdx} className="bg-slate-50/60 rounded-[2rem] border border-slate-100 p-8 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-black shadow">{cIdx + 1}</div>
                    <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">{clip.emoji} {clip.label}</h4>
                    <span className="ml-auto text-[10px] font-bold text-slate-300 uppercase tracking-widest">{clip.slug}.mp4</span>
                  </div>
                  <VideoCard src={`${speaker.path}/${clip.slug}.mp4`} label={clip.label} emoji={clip.emoji} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                    {metrics.map(metric => (
                      <RatingRow key={metric.key} speakerId={speaker.id} clipSlug={clip.slug}
                        metric={metric} value={ratings[`${speaker.id}__${clip.slug}__${metric.key}`]}
                        onChange={onRate} />
                    ))}
                  </div>
                </div>
              ))}
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
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-400">{Math.round(progress)}%</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Completion</p>
                <p className="text-xs font-bold text-white">{Object.keys(ratings).length}/{totalRequired} ratings</p>
              </div>
            </div>
            <button type="submit" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-3 transition-all active:scale-95">
              <span>Submit Batch</span><ChevronRight size={17} />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

// ─── CompareTab ───────────────────────────────────────────────────────────────
export const CompareTab = ({ voteHistory, onVote }) => {
  const [selectedClip, setSelectedClip] = useState(commonClips[0].slug);
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState(null);
  const videoRefs = useRef({});
  const clip = commonClips.find(c => c.slug === selectedClip);
  const available = speakers.filter(sp => sp.clips.some(c => c.slug === selectedClip));

  const changeClip = (slug) => {
    Object.values(videoRefs.current).forEach(v => v?.pause());
    setSelectedClip(slug); setVoted(false); setWinner(null);
  };
  const playAll = () => Object.values(videoRefs.current).forEach(v => { if (v) { v.currentTime = 0; v.play(); } });
  const pauseAll = () => Object.values(videoRefs.current).forEach(v => v?.pause());
  const resetAll = () => Object.values(videoRefs.current).forEach(v => { if (v) { v.currentTime = 0; v.pause(); } });
  const handleVote = (id) => { setWinner(id); setVoted(true); onVote(selectedClip, id); };

  const tally = {};
  voteHistory.filter(v => v.clip === selectedClip).forEach(v => { tally[v.winner] = (tally[v.winner] || 0) + 1; });
  const totalVotes = Object.values(tally).reduce((a, b) => a + b, 0);

  return (
    <motion.div key="compare" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
      <header className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Trophy size={120} className="text-amber-500" /></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 text-amber-600 font-bold text-xs mb-3 uppercase tracking-widest">
              <SlidersHorizontal size={15} /><span>Side-by-Side · Play All · Vote Best</span><Star size={13} fill="currentColor" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Face Comparison</h1>
            <p className="text-slate-500 mt-3 text-base font-medium">เล่นวิดีโอของผู้พูดทุกคนพร้อมกัน แล้วเลือกอันที่ดีที่สุด</p>
          </div>
          <div className="flex gap-3">
            <button onClick={playAll} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95">
              <Play size={16} fill="white" /> Play All
            </button>
            <button onClick={pauseAll} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-black text-sm transition-all active:scale-95">
              <Pause size={16} /> Pause
            </button>
            <button onClick={resetAll} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-black text-sm transition-all active:scale-95">
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Select Clip Scenario</p>
        <div className="flex flex-wrap gap-3">
          {commonClips.map(c => (
            <button key={c.slug} onClick={() => changeClip(c.slug)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black text-sm transition-all ${
                selectedClip === c.slug
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-700 border border-slate-200'
              }`}>
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-6 ${available.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : available.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {available.map((sp) => {
          const isWinner = voted && winner === sp.id;
          const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
          const rank = voted && tally[sp.id] ? sorted.findIndex(([id]) => id === sp.id) + 1 : null;
          return (
            <div key={sp.id} className="space-y-4 pt-5">
              <SyncVideoCard src={`${sp.path}/${selectedClip}.mp4`} speaker={sp}
                isWinner={isWinner} voted={voted} rank={rank}
                videoRef={el => { videoRefs.current[sp.id] = el; }} />
              {!voted ? (
                <button onClick={() => handleVote(sp.id)}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    sp.gender === 'Male'
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 hover:shadow-lg'
                      : 'bg-pink-50 text-pink-700 hover:bg-pink-600 hover:text-white border border-pink-200 hover:shadow-lg'
                  }`}>
                  <ThumbsUp size={16} /> เลือกอันนี้
                </button>
              ) : (
                <div className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 ${isWinner ? 'bg-amber-50 text-amber-700 border-2 border-amber-400' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                  {isWinner ? <><Crown size={16} fill="currentColor" /> Your Pick!</> : <><Star size={14} /> Not selected</>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalVotes > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900">ผลโหวต — {clip?.emoji} {clip?.label}</h3>
              <p className="text-xs text-slate-400 font-bold">{totalVotes} session{totalVotes !== 1 ? 's' : ''} voted</p>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([id, count], i) => {
              const sp = speakers.find(s => s.id === id);
              const pct = Math.round((count / totalVotes) * 100);
              const barColor = i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : 'bg-orange-300';
              return (
                <div key={id}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Crown size={14} className="text-amber-500" fill="currentColor" />}
                      <span className="font-black text-sm text-slate-800">{sp?.name ?? id}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${sp?.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{sp?.gender}</span>
                    </div>
                    <span className="text-sm font-black text-slate-600">{pct}% ({count})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${barColor}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-[2rem] border border-indigo-100 p-6 flex items-start gap-4">
        <BarChart3 size={20} className="text-indigo-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-800 font-medium">
          <strong>หมายเหตุ:</strong> ผลโหวตจะถูกบันทึกสะสมใน localStorage ของเครื่อง สามารถดูสถิติรวมใน tab Analytics ได้
        </p>
      </div>
    </motion.div>
  );
};
