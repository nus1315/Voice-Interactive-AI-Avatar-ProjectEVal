// ─── Base URL ─────────────────────────────────────────────────────────────────
export const BASE = '/Voice-Interactive-AI-Avatar-ProjectEVal/videos';

// ─── Models (for Compare Tab) ────────────────────────────────────────────────
export const compareModels = [
  {
    id: 'sadtalker',
    name: 'SadTalker',
    shortName: 'SadTalker',
    venue: 'CVPR 2023',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    icon: '🎭',
    desc: '3DMM + GAN · Mel-CNN encoder',
  },
  {
    id: 'echomimic',
    name: 'EchoMimic',
    shortName: 'EchoMimic',
    venue: 'AAAI 2025',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-700',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-800',
    icon: '🌊',
    desc: 'Latent Video Diffusion · HuBERT',
  },
  {
    id: 'imtalker',
    name: 'IMTalker',
    shortName: 'IMTalker',
    venue: 'arXiv 2025',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    icon: '🚀',
    desc: 'Implicit Attention + Flow Matching',
  },
  {
    id: 'ditto',
    name: 'Ditto',
    shortName: 'Ditto',
    venue: 'arXiv Nov 2024',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    icon: '⚡',
    desc: 'Motion-Space Diffusion · HuBERT',
  },
];

// ─── Compare Subjects (speaker × clips for model comparison) ─────────────────
export const compareSubjects = [
  {
    id: 'f_baifern', name: 'Baifern', gender: 'Female', genderType: 'female',
    folder: 'baifern',
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Intro',       emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
  {
    id: 'f_bantita', name: 'Bantita', gender: 'Female', genderType: 'female',
    folder: 'bantita',
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Intro',       emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
  {
    id: 'f_ped', name: 'Ped', gender: 'Female', genderType: 'female',
    folder: 'ped',
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Intro',       emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
  {
    id: 'f_pop', name: 'Pop', gender: 'Female', genderType: 'female',
    folder: 'pop',
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Intro',       emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
  {
    id: 'f_tun', name: 'Tun (F)', gender: 'Female', genderType: 'female',
    folder: 'tun',
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Intro',       emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
  {
    id: 'm_dr_chai', name: 'Dr. Chai', gender: 'Male', genderType: 'male',
    folder: 'dr_chai',
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Intro',       emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_warning',    label: 'Warning',          emoji: '⚠️' },
    ],
  },
  {
    id: 'm_dr_wit', name: 'Dr. Wit', gender: 'Male', genderType: 'male',
    folder: 'dr_wit',
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Intro',       emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_warning',    label: 'Warning',          emoji: '⚠️' },
    ],
  },
  {
    id: 'm_tun', name: 'Tun (M)', gender: 'Male', genderType: 'male',
    folder: 'tun',
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Intro',       emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_warning',    label: 'Warning',          emoji: '⚠️' },
    ],
  },
];

// ─── Speakers ─────────────────────────────────────────────────────────────────
export const speakers = [
  {
    id: 'f_baifern', name: 'Baifern', gender: 'Female', role: 'Lecturer',
    path: `${BASE}/female_teacher/baifern`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
  {
    id: 'f_bantita', name: 'Bantita', gender: 'Female', role: 'Lecturer',
    path: `${BASE}/female_teacher/bantita`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
  {
    id: 'f_ped', name: 'Ped', gender: 'Female', role: 'Lecturer',
    path: `${BASE}/female_teacher/ped`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
  {
    id: 'f_pop', name: 'Pop', gender: 'Female', role: 'Lecturer',
    path: `${BASE}/female_teacher/pop`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
  {
    id: 'f_tun', name: 'Tun (F)', gender: 'Female', role: 'Lecturer',
    path: `${BASE}/female_teacher/tun`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_qa',         label: 'Q&A Session',      emoji: '❓' },
    ],
  },
  {
    id: 'm_dr_chai', name: 'Dr. Chai', gender: 'Male', role: 'Lecturer',
    path: `${BASE}/male_teacher/dr_chai`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_warning',    label: 'Warning',          emoji: '⚠️' },
    ],
  },
  {
    id: 'm_dr_wit', name: 'Dr. Wit', gender: 'Male', role: 'Lecturer',
    path: `${BASE}/male_teacher/dr_wit`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_warning',    label: 'Warning',          emoji: '⚠️' },
    ],
  },
  {
    id: 'm_tun', name: 'Tun (M)', gender: 'Male', role: 'Lecturer',
    path: `${BASE}/male_teacher/tun`,
    clips: [
      { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
      { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
      { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
      { slug: '04_warning',    label: 'Warning',          emoji: '⚠️' },
    ],
  },
];

// ─── Common clips (shared across all speakers for comparison) ─────────────────
export const commonClips = [
  { slug: '01_opening',    label: 'Opening',          emoji: '👋' },
  { slug: '02_math_intro', label: 'Math Introduction', emoji: '📐' },
  { slug: '03_encourage',  label: 'Encouragement',    emoji: '💪' },
];

// ─── Evaluation Metrics ───────────────────────────────────────────────────────
export const metrics = [
  { key: 'voice',  label: 'Voice Likeness',     desc: 'Naturalness & Similarity',       color: 'indigo' },
  { key: 'visual', label: 'Visual Stability',   desc: 'Artifact-free & Steady',          color: 'violet' },
  { key: 'sync',   label: 'Lip Synchronization',desc: 'Audio-visual temporal alignment', color: 'purple' },
];

// ─── Talking Head Models (from PDF) ──────────────────────────────────────────
export const talkingHeadModels = [
  {
    id: 'sadtalker',
    name: 'SadTalker',
    venue: 'CVPR 2023',
    paradigm: '3DMM + GAN Render',
    audioEncoder: 'Mel-CNN (Wav2Lip)',
    motionRep: 'Explicit 3DMM (64-d expr + pose)',
    renderer: 'Face-vid2vid GAN',
    speed: 'Real-time~',
    vram: '~6 GB',
    identity: 'Good',
    expressiveness: 'Limited',
    multilingual: 'Weak',
    realtime: true,
    color: 'blue',
    icon: '🎭',
    strengths: [
      'Fast, runs on consumer GPUs (≥6 GB VRAM)',
      'Audio-language-agnostic at architecture level',
      'Mature & widely used open-source',
    ],
    weaknesses: [
      'Mel-CNN under-represents Thai tonal contour',
      'Misses unreleased final stops (-p, -t, -k)',
      'Limited expressiveness (3DMM-bounded)',
    ],
    thaiRating: 2,
    paper: 'https://arxiv.org/abs/2211.12194',
  },
  {
    id: 'echomimic',
    name: 'EchoMimic',
    venue: 'AAAI 2025',
    paradigm: 'Latent Video Diffusion',
    audioEncoder: 'HuBERT / wav2vec2',
    motionRep: 'Implicit U-Net latent (+ optional landmarks)',
    renderer: 'SD VAE decoder',
    speed: 'Slow (multi-step diffusion)',
    vram: '~16–24 GB',
    identity: 'Very Good',
    expressiveness: 'Very High',
    multilingual: 'Strong',
    realtime: false,
    color: 'violet',
    icon: '🌊',
    strengths: [
      'HuBERT encoder generalizes across languages incl. Thai tones',
      'Richest texture & micro-expressions of the four',
      'Editable landmark conditioning for fine control',
    ],
    weaknesses: [
      'Slowest — many seconds per frame; impractical for real-time',
      'Rare Thai phonemes can produce subtle lip-shape errors',
      'Heavy compute (16–24 GB VRAM)',
    ],
    thaiRating: 3,
    paper: 'https://arxiv.org/abs/2407.08136',
  },
  {
    id: 'ditto',
    name: 'Ditto',
    venue: 'arXiv Nov 2024',
    paradigm: 'Motion-Space Diffusion',
    audioEncoder: 'HuBERT',
    motionRep: 'Explicit motion vectors (DiT)',
    renderer: 'Learned face renderer',
    speed: 'Real-time, streaming',
    vram: '~12–16 GB',
    identity: 'Very Good',
    expressiveness: 'High',
    multilingual: 'Strong',
    realtime: true,
    color: 'emerald',
    icon: '⚡',
    strengths: [
      'Designed for real-time streaming inference',
      'HuBERT handles Thai tonal prosody well',
      'Diffusion quality without full latent cost',
    ],
    weaknesses: [
      'Conservative head motion (can look unnatural)',
      'Large mouth openings can soften lip sharpness',
      'Head turn is limited compared to IMTalker',
    ],
    thaiRating: 4,
    paper: 'https://arxiv.org/abs/2411.19509',
  },
  {
    id: 'imtalker',
    name: 'IMTalker',
    venue: 'arXiv Nov 2025',
    paradigm: 'Implicit Attention + Flow Matching',
    audioEncoder: 'HuBERT / wav2vec2',
    motionRep: 'Implicit cross-attention latents',
    renderer: 'Cross-attention fusion',
    speed: '~42 FPS (RTX 4090)',
    vram: '~12–16 GB',
    identity: 'Best-in-class',
    expressiveness: 'High',
    multilingual: 'Strong*',
    realtime: true,
    color: 'rose',
    icon: '🚀',
    strengths: [
      'Best identity preservation — no face drift',
      'Handles large head poses & occlusions without tearing',
      '42 FPS — fastest of the four at highest quality',
    ],
    weaknesses: [
      'Newest — fewer public reproductions & community knowledge',
      'Trained primarily on English (README recommends English audio)',
      'Fine-tuning on Thai data needed to close remaining gap',
    ],
    thaiRating: 3,
    paper: 'https://arxiv.org/abs/2511.22167',
  },
];

// ─── Thai Language Challenges (from PDF §6) ───────────────────────────────────
export const thaiChallenges = [
  {
    id: 'tones',
    title: 'Five Lexical Tones',
    subtitle: '5 วรรณยุกต์',
    icon: '🎵',
    color: 'amber',
    detail: 'Thai distinguishes mid, low, falling, high, rising tones via F0 contours. Models using mel-CNN (SadTalker) cannot differentiate "maa" (come) from "máa" (horse) — but eyebrows, head pitch and mouth amplitude should differ.',
    impact: 'SadTalker most affected — mel-CNN discards tonal information',
  },
  {
    id: 'vowel',
    title: 'Vowel Length Contrast',
    subtitle: 'ความยาวสระ',
    icon: '⏱️',
    color: 'sky',
    detail: 'Thai contrasts short/long vowels lexically (/kʰaː/ ค่า vs. /kʰa/ คะ). Mouth-open duration must scale with vowel length. Models that smooth lip motion across fixed windows wash this out.',
    impact: 'All models partially affected; HuBERT-based models handle better',
  },
  {
    id: 'stops',
    title: 'Unreleased Final Stops',
    subtitle: 'พยัญชนะท้ายไม่ระเบิด',
    icon: '🔇',
    color: 'rose',
    detail: 'Final /-p/, /-t/, /-k/ in Thai are unreleased — lips/tongue close but no burst follows. The visual cue is a brief tight closure with no follow-through opening. SadTalker often misses this.',
    impact: 'Predicted ranking: IMTalker > Ditto > EchoMimic >> SadTalker',
  },
];

// ─── Benchmark comparison table data (from PDF §5) ───────────────────────────
export const benchmarkData = [
  { metric: 'Sync-C (HDTF)', sadtalker: '4.49–7.33', echomimic: '2.74–6.81', ditto: '~7.2', imtalker: 'N/A*', note: 'High variance due to protocol differences' },
  { metric: 'FID (HDTF)',    sadtalker: 'N/A',        echomimic: '29.13',      ditto: '32.20', imtalker: 'N/A*', note: 'Lower is better' },
  { metric: 'FVD (HDTF)',    sadtalker: 'N/A',        echomimic: '208–493',    ditto: '243',   imtalker: 'N/A*', note: '2.4× variance across protocols' },
  { metric: 'Speed (FPS)',   sadtalker: '~15–25',     echomimic: '<1 (slow)',  ditto: '>25 RT', imtalker: '~42',  note: 'RTX 4090, 512² output' },
  { metric: 'VRAM (GB)',     sadtalker: '~6',         echomimic: '16–24',      ditto: '12–16',  imtalker: '12–16',note: 'fp16, 512² inference' },
];

// ─── Hypotheses (from PDF §7.5) ───────────────────────────────────────────────
export const hypotheses = [
  { id: 'H1', text: 'SadTalker will have the worst Sync-C on tone-minimal-pair audio (A4, A8) because its mel-CNN encoder discards tone information.', prediction: 'SadTalker worst' },
  { id: 'H2', text: 'EchoMimic will have the highest naturalness MOS but the lowest FPS, making it unfit for real-time Thai applications.', prediction: 'EchoMimic best quality, worst speed' },
  { id: 'H3', text: 'Ditto and IMTalker will be statistically tied on Sync-C for clean Thai speech, with IMTalker winning on CSIM (identity).', prediction: 'Ditto ≈ IMTalker on sync; IMTalker wins identity' },
  { id: 'H4', text: 'All four will degrade more on female low-pitch audio (A7) than high-pitch (A5), because training data skews toward higher-pitched female speech.', prediction: 'Low-pitch female harder' },
  { id: 'H5', text: 'Final-stop fidelity (A9) will rank IMTalker > Ditto > EchoMimic >> SadTalker, because closure events require precise short-window motion.', prediction: 'IMTalker > Ditto > EchoMimic >> SadTalker' },
];
