import { motion } from 'framer-motion';

interface LessonIntroProps {
  levelLabel: string;
  title: string;
  xp: number;
}

/**
 * Splash "loading vào ải" hiện ~1.2s trước khi LessonPlayer xuất hiện.
 * Ring SVG vẽ tròn như thanh nạp; các dòng chữ vào so le.
 * (Chỉ render khi KHÔNG reduced-motion — LessonPage quyết định.)
 */
export default function LessonIntro({ levelLabel, title, xp }: LessonIntroProps) {
  const R = 34;
  const C = 2 * Math.PI * R;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0d0e] px-6 text-center">
      {/* Ring loading */}
      <div className="relative w-24 h-24 mb-8">
        <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
          <circle cx="40" cy="40" r={R} fill="none" stroke="#1f2937" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.0, ease: [0.65, 0, 0.35, 1] }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.6))' }}
          />
        </svg>
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 15 }}
        >
          🎯
        </motion.span>
      </div>

      <motion.span
        className="text-[11px] uppercase font-extrabold tracking-widest text-purple-400 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {levelLabel}
      </motion.span>

      <motion.h1
        className="text-2xl md:text-3xl font-extrabold text-white font-display leading-snug max-w-md"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, type: 'spring', stiffness: 200, damping: 20 }}
      >
        {title}
      </motion.h1>

      <motion.div
        className="mt-4 text-xs font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full flex items-center gap-1"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.38, type: 'spring', stiffness: 300, damping: 15 }}
      >
        <span>⚡</span>
        <span>{xp} XP</span>
      </motion.div>
    </div>
  );
}
