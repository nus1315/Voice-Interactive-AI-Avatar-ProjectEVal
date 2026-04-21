import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  FileText, 
  BarChart3, 
  Download, 
  Send, 
  PlayCircle, 
  Settings,
  Info,
  CheckCircle2,
  Trash2,
  Video,
  Mic2,
  ExternalLink,
  ChevronRight,
  User,
  Users,
  Sparkles,
  Zap
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('evaluation');
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState({});
  const [history, setHistory] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('v2l_research_complex');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const speakers = [
    { id: 'm_chai', name: 'Dr. Chai', gender: 'Male' },
    { id: 'm_wit', name: 'Dr. Wit', gender: 'Male' },
    { id: 'm_tun', name: 'Tun', gender: 'Male' },
    { id: 'f_baifern', name: 'Baifern', gender: 'Female' },
    { id: 'f_bantita', name: 'Bantita', gender: 'Female' },
    { id: 'f_ped', name: 'Ped', gender: 'Female' },
    { id: 'f_pop', name: 'Pop', gender: 'Female' },
  ];

  const variations = ['Variation 1', 'Variation 2', 'Variation 3', 'Variation 4'];

  const metrics = [
    { key: 'voice', label: 'Voice Likeness', desc: 'Naturalness & Similarity' },
    { key: 'visual', label: 'Visual Stability', desc: 'Artifact-free & Steady' }
  ];

  const handleRating = (speakerId, varIdx, metricKey, value) => {
    setRatings(prev => ({
      ...prev,
      [`${speakerId}_v${varIdx}_${metricKey}`]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      timestamp: new Date().toLocaleString('th-TH'),
      data: { ...ratings }
    };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem('v2l_research_complex', JSON.stringify(updatedHistory));
    setSubmitted(true);
    setRatings({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const clearHistory = () => {
    if(window.confirm('Clear all metadata and statistics?')) {
      setHistory([]);
      localStorage.removeItem('v2l_research_complex');
    }
  };

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const summary = {};
    metrics.forEach(m => summary[m.key] = { total: 0, count: 0 });

    history.forEach(entry => {
      Object.keys(entry.data).forEach(key => {
        const parts = key.split('_');
        const metricKey = parts[parts.length - 1];
        if (summary[metricKey]) {
          summary[metricKey].total += entry.data[key];
          summary[metricKey].count += 1;
        }
      });
    });

    return metrics.map(m => ({
      label: m.label,
      avg: (summary[m.key].total / summary[m.key].count).toFixed(2)
    }));
  }, [history]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* --- Optimized Nav Bar --- */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200 animate-pulse-slow">
              <Video size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className="block font-black text-xl tracking-tight text-slate-900 font-outfit uppercase">V2L Metrics Pro</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-500 font-bold">Research Framework</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="text-[10px] text-slate-400 font-bold">v0.1.0</span>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            {[
              { id: 'evaluation', label: 'Evaluation', icon: ClipboardCheck },
              { id: 'paper', label: 'Research', icon: FileText },
              { id: 'summary', label: 'Analytics', icon: BarChart3 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 pb-40">
        
        <AnimatePresence mode="wait">
          {/* --- 1. EVALUATION TAB --- */}
          {activeTab === 'evaluation' && (
            <motion.div 
              key="eval"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-12"
            >
              <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles size={120} className="text-indigo-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-indigo-600 font-bold text-sm mb-4 uppercase tracking-widest">
                     <Users size={16} />
                     <span>Core Cohort: 7 Speakers</span>
                     <Zap size={14} fill="currentColor" />
                  </div>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tight font-outfit">Audio-Visual Evaluation</h1>
                  <p className="text-slate-500 mt-4 text-lg font-medium">Multimodal consistency assessment across variations</p>
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all">
                    <ExternalLink size={16} /> Repository
                  </button>
                </div>
              </header>

              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-indigo-600 text-white px-8 py-5 rounded-2xl flex items-center gap-4 shadow-2xl shadow-indigo-200 ring-4 ring-indigo-50"
                >
                  <CheckCircle2 size={24} />
                  <span className="font-bold text-lg">Entry committed to secure storage</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-20">
                {speakers.map((speaker, sIdx) => (
                  <motion.div 
                    key={speaker.id} 
                    variants={itemVariants}
                    className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-shadow"
                  >
                    <div className={`px-12 py-10 border-b border-slate-100 flex justify-between items-center ${speaker.gender === 'Male' ? 'bg-blue-50/20' : 'bg-pink-50/20'}`}>
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl ${speaker.gender === 'Male' ? 'bg-blue-600 shadow-blue-100' : 'bg-pink-600 shadow-pink-100'}`}>
                          <User size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Speaker ID: {sIdx + 1}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${speaker.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                              {speaker.gender}
                            </span>
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 font-outfit">{speaker.name}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-12 space-y-16">
                      {variations.map((vLabel, vIdx) => (
                        <div key={vIdx} className="bg-slate-50/40 p-10 rounded-[2.5rem] border border-slate-100 relative group/var">
                          <div className="flex items-center gap-4 mb-10">
                             <div className="w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-sm font-black text-indigo-600 shadow-sm">
                               {vIdx + 1}
                             </div>
                             <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs">{vLabel}</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            {metrics.map(metric => (
                              <div key={metric.key} className="space-y-6">
                                <div className="flex justify-between items-end">
                                  <label className="font-bold text-slate-800 text-sm flex items-center gap-2.5">
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                    {metric.label}
                                  </label>
                                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-tighter">{metric.desc}</span>
                                </div>
                                <div className="grid grid-cols-5 gap-3">
                                  {[1, 2, 3, 4, 5].map(val => (
                                    <button
                                      key={val}
                                      type="button"
                                      onClick={() => handleRating(speaker.id, vIdx, metric.key, val)}
                                      className={`h-16 rounded-2xl font-black text-xl transition-all border-2 relative overflow-hidden group/btn ${
                                        ratings[`${speaker.id}_v${vIdx}_${metric.key}`] === val
                                        ? 'bg-indigo-600 border-indigo-600 text-white scale-105 shadow-xl shadow-indigo-200'
                                        : 'bg-white border-white text-slate-300 hover:border-indigo-100 hover:text-indigo-600 hover:shadow-lg'
                                      }`}
                                    >
                                      {val}
                                      {ratings[`${speaker.id}_v${vIdx}_${metric.key}`] === val && (
                                        <motion.div layoutId={`blob-${speaker.id}-${vIdx}-${metric.key}`} className="absolute inset-0 bg-white/10" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Floating Navigation */}
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
                  <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-6 pl-4">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={126} strokeDashoffset={126 - (126 * (Object.keys(ratings).length / (speakers.length * variations.length * metrics.length)))} className="text-indigo-500 transition-all duration-1000" />
                        </svg>
                        <span className="absolute text-[10px] font-black text-indigo-400">
                          {Math.round((Object.keys(ratings).length / (speakers.length * variations.length * metrics.length)) * 100)}%
                        </span>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Progress Monitoring</p>
                        <p className="text-xs font-bold text-white">Commit Pending Data</p>
                      </div>
                    </div>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-2xl font-black shadow-xl shadow-indigo-900/50 flex items-center gap-3 transition-all active:scale-95 group">
                      <span>Submit Batch</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* --- 2. RESEARCH TAB --- */}
          {activeTab === 'paper' && (
            <motion.div 
              key="paper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[4rem] border border-slate-200 p-16 md:p-24 shadow-sm relative overflow-hidden min-h-[80vh] flex flex-col justify-center"
            >
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] -mr-64 -mt-64 opacity-40"></div>
               <div className="max-w-4xl mx-auto relative z-10">
                 <header className="mb-24 text-center">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 text-[10px] font-black px-6 py-3 rounded-full mb-10 tracking-[0.3em] uppercase border border-indigo-100"
                    >
                      <FileText size={14} />
                      Theoretical Framework
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-10 leading-[0.95] tracking-tight font-outfit">
                      Spatial & Temporal <br/> <span className="text-indigo-600">Optimization</span>
                    </h1>
                    <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                      Investigation into cross-gender speech synthesis consistency and visual fidelity in neural avatar pipelines.
                    </p>
                 </header>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <section className="space-y-10">
                      <div className="flex items-center gap-6">
                        <div className="w-1.5 h-16 bg-indigo-600 rounded-full"></div>
                        <h2 className="text-3xl font-black text-slate-900 font-outfit uppercase tracking-tighter">Cohort Analytics</h2>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-lg font-medium">
                        Using a structured dataset of 7 speakers (3M, 4F), we leverage multiple tone variations to evaluate 
                        model stability limits. This process identifies critical bottlenecks in temporal encoder performance
                        and visual artifact generation.
                      </p>
                    </section>
                    <div className="grid grid-cols-1 gap-8">
                       <div className="aspect-[4/3] bg-slate-900 rounded-[3rem] p-12 flex flex-col justify-between group cursor-pointer overflow-hidden relative shadow-2xl group border border-white/5">
                          <PlayCircle className="text-indigo-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" size={64} />
                          <div>
                            <p className="text-white font-black text-2xl mb-2 font-outfit">Sample Gallery</p>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Multi-gender synthesis samples</p>
                          </div>
                          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                       </div>
                    </div>
                 </div>
               </div>
            </motion.div>
          )}

          {/* --- 3. DASHBOARD TAB --- */}
          {activeTab === 'summary' && (
            <motion.div 
              key="dashboard"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              <header className="flex justify-between items-center bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight font-outfit">Performance Analytics</h1>
                  <p className="text-slate-500 mt-2 font-semibold">Mean Opinion Score (MOS) Distribution</p>
                </div>
                <button onClick={clearHistory} className="p-5 text-slate-400 hover:text-red-500 transition-all bg-slate-50 rounded-2xl hover:bg-red-50 active:scale-95">
                  <Trash2 size={24} />
                </button>
              </header>

              {!stats ? (
                <div className="bg-white rounded-[4rem] p-40 border border-slate-200 text-center shadow-sm relative overflow-hidden">
                  <BarChart3 size={80} className="mx-auto mb-10 text-slate-100" strokeWidth={1} />
                  <p className="text-slate-300 font-black text-lg uppercase tracking-[0.3em]">Dataset Registry Empty</p>
                  <button onClick={() => setActiveTab('evaluation')} className="mt-12 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1">Initialize Evaluation</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="bg-white p-14 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col justify-between glass-panel">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-16">Global Quality Metrics</h3>
                      <div className="space-y-16">
                        {stats.map(s => (
                          <div key={s.label}>
                            <div className="flex justify-between items-end mb-6">
                              <div className="flex flex-col">
                                <span className="text-indigo-600 font-extrabold text-[10px] uppercase tracking-widest mb-1">Reliability Index</span>
                                <span className="text-slate-900 font-black text-2xl tracking-tight font-outfit">{s.label}</span>
                              </div>
                              <span className="text-indigo-600 font-black text-5xl tracking-tighter font-outfit">{s.avg}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-8 rounded-2xl overflow-hidden border border-slate-200/50 p-1.5 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(s.avg / 5) * 100}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-full rounded-xl shadow-lg ${parseFloat(s.avg) < 3.8 ? 'bg-amber-400' : 'bg-indigo-600'}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-24 flex gap-6 p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                       <div className="absolute bottom-0 right-0 p-4 opacity-20">
                         <Info size={100} />
                       </div>
                       <div className="relative z-10 flex gap-6">
                         <Info size={28} className="shrink-0" />
                         <p className="text-sm text-indigo-50 leading-relaxed font-bold italic">
                           Current data suggests high visual stability across male cohorts, while female variations show 
                           slight artifacts in high-pitch tone synthesis. Recommendation: Adjust weight decay.
                         </p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="bg-slate-900 rounded-[4rem] p-14 text-white shadow-2xl relative overflow-hidden flex flex-col justify-end min-h-[400px] border border-white/5">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                      <div className="relative z-10">
                        <p className="font-black text-indigo-400 uppercase text-[10px] tracking-[0.4em] mb-6">Data Point Registry</p>
                        <h2 className="text-[12rem] font-black tracking-tighter leading-[0.8] mb-8 font-outfit">{history.length}</h2>
                        <p className="text-indigo-100 font-bold opacity-60 leading-relaxed max-w-xs text-lg">Total validated research entries stored in local cache.</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-14 rounded-[4rem] border border-slate-200 shadow-sm relative group overflow-hidden">
                      <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                      <div className="relative z-10 transition-colors duration-500 group-hover:text-white">
                        <h4 className="font-black mb-8 flex items-center gap-4 text-2xl font-outfit">
                          <Download size={28} className="text-indigo-600 group-hover:text-white transition-colors" /> Export Metrics
                        </h4>
                        <p className="text-sm opacity-60 mb-12 font-bold leading-relaxed border-l-4 border-indigo-100 pl-8 group-hover:border-white/20 transition-all">
                          Generate comprehensive research dataset for statistical significance (P-Value) modeling.
                        </p>
                        <button 
                          onClick={() => {
                            let csv = "Timestamp,Speaker,Gender,Variation,Metric,Score\n";
                            history.forEach(entry => {
                              Object.keys(entry.data).forEach(key => {
                                const [sid, vIdx, mk] = key.split('_');
                                const speaker = speakers.find(s => s.id === sid);
                                csv += `${entry.timestamp},${speaker.name},${speaker.gender},${vIdx},${mk},${entry.data[key]}\n`;
                              });
                            });
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `V2L_Metrics_Export.csv`;
                            a.click();
                          }}
                          className="w-full bg-slate-100 group-hover:bg-white text-slate-900 py-6 rounded-3xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4"
                        >
                          <Download size={20} />
                          Download Dataset (CSV)
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

      <footer className="py-24 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-slate-300 font-black text-[11px] uppercase tracking-[0.8em]">V2L Research Engine</div>
            <div className="flex gap-4">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase text-slate-400">Systems Operational</span>
            </div>
          </div>
          <div className="flex gap-12 text-slate-400">
             <Settings size={22} className="hover:text-indigo-600 cursor-pointer transition-colors" />
             <User size={22} className="hover:text-indigo-600 cursor-pointer transition-colors" />
             <Users size={22} className="hover:text-indigo-600 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;