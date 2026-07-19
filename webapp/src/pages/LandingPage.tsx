import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import FoxMascot from '../components/FoxMascot';
import { TOPIC_ICONS, ClayIconDefs } from '../components/ClayIcon';

/* ===== Ambient Background ===== */

function AnimatedGradientBlobs() {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-800/8 blur-[150px] top-[-15%] left-[-10%] animate-blob-float" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-800/6 blur-[120px] bottom-[-15%] right-[-10%] animate-blob-float-delayed" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-cyan-800/5 blur-[100px] top-[30%] left-[60%] animate-blob-float-fast" />
    </div>
  );
}

function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.025]"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />
  );
}

/* ===== Topic Icon Card ===== */

function TopicCard({ topic, index, onClick }: {
  topic: typeof TOPIC_ICONS[0];
  index: number;
  onClick: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = topic.component;

  return (
    <motion.button
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl 
                 bg-gray-900/20 border border-gray-800/40
                 hover:bg-gray-900/40 hover:border-gray-700/60
                 transition-all duration-300 ease-out
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
    >
      {/* Icon container — square, rounded */}
      <div className="relative w-full aspect-square rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 
                      overflow-hidden flex items-center justify-center
                      group-hover:scale-[1.02] transition-transform duration-300 ease-out
                      border border-gray-800/30 group-hover:border-gray-700/40">
        {/* Ambient glow behind icon */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          style={{ backgroundColor: topic.color, opacity: 0.08 }}
        />

        {/* The clay icon */}
        <div className="relative z-10 w-3/4 h-3/4 flex items-center justify-center">
          <Icon />
        </div>

        {/* Hover shine sweep */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                        bg-gradient-to-r from-transparent via-white/5 to-transparent
                        -skew-x-12 -translate-x-full group-hover:translate-x-full
                        transition-transform duration-700 ease-out pointer-events-none" />
      </div>

      {/* Topic name */}
      <span className="text-xs font-semibold text-gray-300 group-hover:text-white 
                       transition-colors duration-200 text-center leading-tight">
        {topic.label}
      </span>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 pointer-events-none"
           style={{ boxShadow: `inset 0 0 0 1px ${topic.color}20` }} />
    </motion.button>
  );
}

/* ===== Main Landing Page ===== */

export default function LandingPage() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#f3f4f6] relative overflow-x-hidden">
      {/* Shared SVG filter & gradient defs — rendered once to avoid ID collisions */}
      <ClayIconDefs />

      {/* Background */}
      <AnimatedGradientBlobs />
      <DotGrid />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* ===== HERO — minimal, no big buttons ===== */}
      <section className="relative z-10 pt-24 pb-8 md:pt-32 md:pb-10 px-6">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg mx-auto text-center space-y-4"
        >
          {/* Pill badge */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                       bg-purple-500/8 border border-purple-500/15 
                       text-purple-300/70 text-[10px] font-semibold tracking-widest uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            SWD392 • FPT University
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight font-display"
          >
            <span className="text-white">Software Design</span>
            <br />
            <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
              & Architecture
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-gray-500 text-sm md:text-base max-w-sm mx-auto leading-relaxed"
          >
            Tương tác trực quan — mỗi khái niệm là một thử thách, mỗi thử thách là một bước tiến.
          </motion.p>
        </motion.div>
      </section>

      {/* ===== TOPIC GRID — Brilliant-style clay icons ===== */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 md:gap-3">
          {TOPIC_ICONS.map((topic, idx) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={idx}
              onClick={() => navigate('/home')}
            />
          ))}
        </div>
      </section>

      {/* ===== FOX + CTA ===== */}
      <section className="relative z-10 max-w-md mx-auto px-6 pb-24 md:pb-32">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5 text-center"
        >
          {/* Fox + message */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16">
              <FoxMascot animation="Sit" />
            </div>
            <div className="text-left">
              <p className="text-gray-300 text-sm font-medium">
                Sẵn sàng khám phá?
              </p>
              <p className="text-gray-500 text-xs">
                11 chủ đề — 72 bài học tương tác
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/home')}
            className="group relative px-8 py-3.5 rounded-2xl 
                       bg-gradient-to-r from-purple-600 to-indigo-600 
                       hover:from-purple-500 hover:to-indigo-500 
                       text-white font-bold text-base
                       transition-all duration-300 ease-out
                       shadow-lg shadow-purple-600/20 hover:shadow-purple-500/35
                       active:scale-[0.97]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Bắt đầu hành trình
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            {/* Shine */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </div>
          </button>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 text-center px-6 py-8 border-t border-gray-800/30">
        <p className="text-xs text-gray-600">
          SWD392 — Software Design & Architecture © FPT University
        </p>
        <p className="text-[10px] text-gray-700 mt-1">
          Built with React + Vite + TypeScript
        </p>
      </footer>
    </div>
  );
}
