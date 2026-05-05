import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Zap, Brain, BarChart3, Globe, AlertCircle, CheckCircle2, XCircle, Cpu } from 'lucide-react';
import { talkingHeadModels, thaiChallenges, benchmarkData, hypotheses } from './data.js';

const colorMap = {
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700',    accent: 'from-blue-500 to-indigo-600',   badge: 'bg-blue-100 text-blue-700' },
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-700',  accent: 'from-violet-500 to-purple-600', badge: 'bg-violet-100 text-violet-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', accent: 'from-emerald-500 to-teal-600',  badge: 'bg-emerald-100 text-emerald-700' },
  rose:    { bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-700',    accent: 'from-rose-500 to-pink-600',     badge: 'bg-rose-100 text-rose-700' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   accent: 'from-amber-500 to-orange-500',  badge: 'bg-amber-100 text-amber-700' },
  sky:     { bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-700',     accent: 'from-sky-500 to-blue-500',      badge: 'bg-sky-100 text-sky-700' },
};

// ─── Thai Rating Stars ────────────────────────────────────────────────────────
const ThaiRating = ({ value }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(i => (
      <div key={i} className={`w-3 h-3 rounded-full ${i <= value ? 'bg-amber-400' : 'bg-slate-200'}`} />
    ))}
  </div>
);

// ─── Model Card ───────────────────────────────────────────────────────────────
const ModelCard = ({ model }) => {
  const c = colorMap[model.color];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-3xl border-2 ${c.border} overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${c.accent} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl mb-2">{model.icon}</div>
            <h3 className="text-2xl font-black">{model.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{model.venue}</span>
              {model.realtime && (
                <span className="bg-green-400/30 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> Real-time
                </span>
              )}
            </div>
          </div>
          <a href={model.paper} target="_blank" rel="noreferrer"
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl transition-all">
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Specs */}
        <div className={`${c.bg} rounded-2xl p-4 space-y-2`}>
          {[
            { label: 'Paradigm', value: model.paradigm },
            { label: 'Audio', value: model.audioEncoder },
            { label: 'Motion', value: model.motionRep },
            { label: 'Speed', value: model.speed },
            { label: 'VRAM', value: model.vram },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${c.text} shrink-0 mt-0.5`}>{label}</span>
              <span className="text-xs text-slate-700 font-medium text-right">{value}</span>
            </div>
          ))}
        </div>

        {/* Thai suitability */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thai Suitability</span>
          <ThaiRating value={model.thaiRating} />
        </div>

        {/* Strengths */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Strengths</p>
          <div className="space-y-1.5">
            {model.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Thai Weaknesses</p>
          <div className="space-y-1.5">
            {model.weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <XCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── ResearchTab ──────────────────────────────────────────────────────────────
export const ResearchTab = () => {
  return (
    <motion.div key="paper" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="space-y-12">

      {/* Hero */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-100 to-violet-50 rounded-full blur-[100px] -mr-64 -mt-64 opacity-70" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 text-[10px] font-black px-5 py-2.5 rounded-full tracking-[0.3em] uppercase border border-indigo-100 mb-6">
            <FileText size={12} /> Thai Talking-Head Model Comparison
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[0.95] tracking-tight mb-6">
            Talking-Head<br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Models for Thai</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
            เปรียบเทียบ 4 โมเดลสำหรับสร้างวิดีโอ Talking-Head ด้วยเสียงภาษาไทย — SadTalker, EchoMimic, Ditto, และ IMTalker โดยวิเคราะห์จากสถาปัตยกรรม ประสิทธิภาพ และความเหมาะสมกับลักษณะเฉพาะของภาษาไทย
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Models', value: '4', sub: 'Compared' },
              { label: 'Speakers', value: '4', sub: 'Thai TTS' },
              { label: 'Metrics', value: '3', sub: 'MOS dims' },
              { label: 'Clips', value: '16', sub: 'Total' },
            ].map(c => (
              <div key={c.label} className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-5 text-center border border-indigo-100">
                <p className="text-4xl font-black text-indigo-600">{c.value}</p>
                <p className="font-black text-slate-700 mt-1 text-sm">{c.label}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2"><Brain size={22} className="text-indigo-600" /> Model Architectures</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {talkingHeadModels.map(m => <ModelCard key={m.id} model={m} />)}
        </div>
      </div>

      {/* Architecture Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Cpu size={20} className="text-indigo-600" /> Side-by-Side Architecture Comparison</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">จาก PDF §4 — ตารางเปรียบเทียบการออกแบบที่สำคัญสำหรับการอนุมานภาษาไทย</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Aspect</th>
                {talkingHeadModels.map(m => (
                  <th key={m.id} className="text-left px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span>{m.icon}</span>
                      <span className={`font-black text-sm ${colorMap[m.color].text}`}>{m.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Year / Venue', keys: ['venue', 'venue', 'venue', 'venue'] },
                { label: 'Core Paradigm', keys: ['paradigm', 'paradigm', 'paradigm', 'paradigm'] },
                { label: 'Audio Encoder', keys: ['audioEncoder', 'audioEncoder', 'audioEncoder', 'audioEncoder'] },
                { label: 'Motion Rep.', keys: ['motionRep', 'motionRep', 'motionRep', 'motionRep'] },
                { label: 'Speed', keys: ['speed', 'speed', 'speed', 'speed'] },
                { label: 'VRAM', keys: ['vram', 'vram', 'vram', 'vram'] },
                { label: 'Identity', keys: ['identity', 'identity', 'identity', 'identity'] },
                { label: 'Expressiveness', keys: ['expressiveness', 'expressiveness', 'expressiveness', 'expressiveness'] },
                { label: 'Multilingual', keys: ['multilingual', 'multilingual', 'multilingual', 'multilingual'] },
              ].map(({ label, keys }, ri) => (
                <tr key={label} className={`border-b border-slate-50 ${ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{label}</td>
                  {talkingHeadModels.map((m, mi) => (
                    <td key={m.id} className={`px-4 py-4 text-xs font-medium ${colorMap[m.color].text}`}>{m[keys[mi]]}</td>
                  ))}
                </tr>
              ))}
              <tr className="border-b border-slate-50 bg-amber-50/50">
                <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Thai Rating</td>
                {talkingHeadModels.map(m => (
                  <td key={m.id} className="px-4 py-4"><ThaiRating value={m.thaiRating} /></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Thai Language Challenges */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2"><Globe size={22} className="text-amber-500" /> Why Thai is a Hard Test Case</h2>
        </div>
        <p className="text-slate-500 font-medium mb-6">จาก PDF §6 — ลักษณะเฉพาะทางสัทศาสตร์ของภาษาไทยที่ท้าทาย Talking-Head Models</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {thaiChallenges.map(ch => {
            const c = colorMap[ch.color];
            return (
              <div key={ch.id} className={`${c.bg} border ${c.border} rounded-3xl p-7`}>
                <div className="text-4xl mb-4">{ch.icon}</div>
                <h3 className="font-black text-slate-900 text-lg mb-1">{ch.title}</h3>
                <p className={`text-xs font-bold ${c.text} mb-4 uppercase tracking-wider`}>{ch.subtitle}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{ch.detail}</p>
                <div className={`bg-white/70 rounded-xl p-3 border ${c.border}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Model Impact</p>
                  <p className={`text-xs font-bold ${c.text}`}>{ch.impact}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benchmark Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><BarChart3 size={20} className="text-indigo-600" /> Published Benchmarks (§5)</h2>
          <div className="flex items-start gap-2 mt-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
            <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-medium">Sync-C มี protocol variance สูงมาก — ตัวเลขจากคนละ paper เปรียบเทียบตรงๆ ไม่ได้ ดูรายละเอียดใน §5.2</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Metric</th>
                {talkingHeadModels.map(m => (
                  <th key={m.id} className={`text-left px-4 py-4 text-xs font-black ${colorMap[m.color].text}`}>{m.icon} {m.name}</th>
                ))}
                <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Note</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkData.map((row, i) => (
                <tr key={row.metric} className={`border-b border-slate-50 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4 font-black text-slate-700 text-xs whitespace-nowrap">{row.metric}</td>
                  <td className="px-4 py-4 text-xs font-medium text-blue-700">{row.sadtalker}</td>
                  <td className="px-4 py-4 text-xs font-medium text-violet-700">{row.echomimic}</td>
                  <td className="px-4 py-4 text-xs font-medium text-emerald-700">{row.ditto}</td>
                  <td className="px-4 py-4 text-xs font-medium text-rose-700">{row.imtalker}</td>
                  <td className="px-4 py-4 text-xs text-slate-400 font-medium italic">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hypotheses */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-8 bg-gradient-to-b from-violet-600 to-purple-600 rounded-full" />
          <h2 className="text-2xl font-black text-slate-900">Research Hypotheses (§7.5)</h2>
        </div>
        <div className="space-y-4">
          {hypotheses.map(h => (
            <div key={h.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-5 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg shadow-violet-200">
                {h.id}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700 leading-relaxed">{h.text}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 text-[10px] font-black px-3 py-1.5 rounded-full border border-violet-100 uppercase tracking-wider">
                  Prediction: {h.prediction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
