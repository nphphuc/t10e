import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import FoxMascot from '../components/FoxMascot';

/* ===== Background Effects ===== */

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

/* ===== Nav Card — logo-only clickable square ===== */

interface NavCardProps {
  icon: string;
  glowColor: string;
  onClick?: () => void;
  disabled?: boolean;
}

function NavCard({ icon, glowColor, onClick, disabled }: NavCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const iconEl = (
    <div className="w-full h-full flex items-center justify-center p-6 md:p-8">
      {icon.startsWith('/') ? (
        <img
          src={`${import.meta.env.BASE_URL}${icon.slice(1)}`}
          alt=""
          className="w-full h-full object-contain"
          loading="lazy"
        />
      ) : (
        <span className="text-3xl">{icon}</span>
      )}
    </div>
  );

  if (disabled) {
    return (
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative aspect-square rounded-[48px] border-[8px] border-b-[24px] border-gray-700/40 bg-gray-900/15 backdrop-blur-sm opacity-50 select-none cursor-not-allowed overflow-hidden"
      >
        {iconEl}
      </motion.div>
    );
  }

  return (
    <motion.button
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
      onClick={onClick}
      className="group relative aspect-square rounded-[48px] border-[8px] border-b-[24px] border-gray-700/60 bg-gray-900/20 backdrop-blur-sm
                 hover:brightness-110
                 transition-all duration-300 ease-out w-full
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 overflow-hidden"
      style={{
        boxShadow: `0 0 0 0 transparent`,
        transition: `box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.15s ease`,
      }}
      onMouseEnter={(e) => {
        if (shouldReduceMotion) return;
        const el = e.currentTarget;
        el.style.borderColor = glowColor + '60';
        el.style.backgroundColor = 'rgba(255,255,255,0.04)';
        el.style.boxShadow = `0 0 30px -5px ${glowColor}30, 0 0 0 1px ${glowColor}20 inset`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = '';
        el.style.backgroundColor = '';
        el.style.boxShadow = '';
      }}
      onMouseDown={(e) => {
        if (shouldReduceMotion) return;
        const el = e.currentTarget;
        el.style.borderColor = glowColor + '90';
        el.style.boxShadow = `0 0 40px -4px ${glowColor}50, 0 0 0 1px ${glowColor}40 inset`;
        el.style.backgroundColor = 'rgba(255,255,255,0.06)';
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget;
        if (shouldReduceMotion) {
          el.style.borderColor = '';
          el.style.boxShadow = '';
          el.style.backgroundColor = '';
          return;
        }
        el.style.borderColor = glowColor + '60';
        el.style.boxShadow = `0 0 30px -5px ${glowColor}30, 0 0 0 1px ${glowColor}20 inset`;
        el.style.backgroundColor = 'rgba(255,255,255,0.04)';
      }}
      onTouchStart={(e) => {
        if (shouldReduceMotion) return;
        const el = e.currentTarget;
        el.style.borderColor = glowColor + '90';
        el.style.boxShadow = `0 0 40px -4px ${glowColor}50, 0 0 0 1px ${glowColor}40 inset`;
        el.style.backgroundColor = 'rgba(255,255,255,0.06)';
      }}
      onTouchEnd={(e) => {
        const el = e.currentTarget;
        if (shouldReduceMotion) {
          el.style.borderColor = '';
          el.style.boxShadow = '';
          el.style.backgroundColor = '';
          return;
        }
        el.style.borderColor = '';
        el.style.boxShadow = '';
        el.style.backgroundColor = '';
      }}
    >
      {/* Hover shine sweep */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                      bg-gradient-to-r from-transparent via-white/[0.04] to-transparent
                      -skew-x-12 -translate-x-full group-hover:translate-x-full
                      transition-transform duration-700 ease-out pointer-events-none" />

      {iconEl}
    </motion.button>
  );
}

/* ===== Main Landing Page ===== */

export default function LandingPage() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#f3f4f6] relative overflow-x-hidden flex flex-col">
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

      {/* ===== HERO ===== */}
      <section className="relative z-10 pt-20 pb-6 md:pt-28 md:pb-8 px-6">
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

          {/* Title row: fox + text */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center justify-center gap-3 md:gap-4"
          >
            {/* Fox logo — nhúc nhích cạnh title */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                ...(shouldReduceMotion ? {} : {
                  rotate: [0, -6, 3, -4, 2, 0],
                }),
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                ...(shouldReduceMotion ? {} : {
                  rotate: {
                    duration: 0.5,
                    delay: 0.7,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: 'easeInOut',
                  },
                }),
              }}
              className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0"
            >
              <FoxMascot animation="Sit" />
            </motion.div>

            {/* Title text — one line */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display whitespace-nowrap">
              <span className="text-white">Software Design</span>
              <span className="text-white mx-1.5">&</span>
              <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
                Architecture
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-gray-500 text-sm md:text-base max-w-sm mx-auto leading-relaxed"
          >
            Chọn chế độ học tập phù hợp với bạn
          </motion.p>
        </motion.div>
      </section>

      {/* ===== NAV CARDS (logo only) ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-8 flex-grow flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1: Bài học */}
          <div className="flex flex-col items-center gap-3">
            <NavCard
              icon="/baihoc.png"
              glowColor="#a855f7"
              onClick={() => navigate('/home')}
            />
            <span className="text-lg font-bold text-gray-200">Bài học</span>
          </div>

          {/* Card 2: Ôn thi PE */}
          <div className="flex flex-col items-center gap-3">
            <NavCard
              icon="/thipe.png"
              glowColor="#06b6d4"
              disabled
            />
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-200">Ôn thi PE</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/12 border border-amber-500/25 text-amber-400 text-[9px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                đang hoàn thiện
              </span>
            </div>
          </div>

          {/* Card 3: Ôn thi FE (đang hoàn thiện) */}
          <div className="flex flex-col items-center gap-3">
            <NavCard
              icon="/thife.png"
              glowColor="#f59e0b"
              disabled
            />
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-200">Ôn thi FE</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/12 border border-amber-500/25 text-amber-400 text-[9px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                đang hoàn thiện
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 text-center px-6 py-8 border-t border-gray-800/30 mt-auto">
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
