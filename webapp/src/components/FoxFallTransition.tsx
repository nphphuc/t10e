import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FoxMascot from './FoxMascot';

/**
 * Transition "fox rơi vào ải":
 * - Fox rơi từ trên xuống GIỮA, dừng ~0.75s, rồi rơi tiếp xuống dưới.
 * - Nền đen là lớp RIÊNG, tự mờ đi NGAY khi fox tới giữa → nội dung lộ ra sớm
 *   (content pop-up đồng bộ trong PageTransition), fox rơi tiếp đè lên nội dung.
 * - Overlay luôn pointer-events-none (không chặn tương tác) và tự gỡ khỏi DOM →
 *   KHÔNG BAO GIỜ kẹt đen kể cả khi có hiccup.
 * - reduced-motion: bỏ hoàn toàn.
 */
export default function FoxFallTransition() {
  const shouldReduceMotion = useReducedMotion();
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setRemoved(true);
      return;
    }
    // Fox rơi xong (~1.5s) thì gỡ overlay
    const t = setTimeout(() => setRemoved(true), 1500);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

  if (removed || shouldReduceMotion) {
    return null;
  }

  // 12 vạch gió chạy dọc lên
  const lines = Array.from({ length: 12 }).map((_, idx) => ({
    id: idx,
    left: 5 + idx * 8.5 + Math.random() * 4,
    duration: 0.45 + Math.random() * 0.3,
    delay: Math.random() * 0.35,
    height: 120 + Math.random() * 140,
    opacity: 0.15 + Math.random() * 0.25,
  }));

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden select-none" aria-hidden="true">
      <style>{`
        @keyframes speed-line-up {
          0% { transform: translateY(100vh); }
          100% { transform: translateY(-100vh); }
        }
      `}</style>

      {/* Lớp nền đen RIÊNG: mờ đi ngay khi fox tới giữa (~0.35s) để content lộ ra */}
      <motion.div
        className="absolute inset-0 bg-[#0c0d0e]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.35, delay: 0.9, ease: 'easeOut' }}
      />

      {/* Gió */}
      <div className="absolute inset-0 overflow-hidden">
        {lines.map((line) => (
          <div
            key={line.id}
            className="absolute bg-gradient-to-t from-transparent via-cyan-400/40 to-transparent w-[1.5px] rounded-full"
            style={{
              left: `${line.left}%`,
              height: `${line.height}px`,
              opacity: line.opacity,
              animation: `speed-line-up ${line.duration}s linear infinite`,
              animationDelay: `${line.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Fox: rơi xuống giữa → dừng 0.75s → rơi tiếp xuống dưới */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ y: '-70vh', scale: 0.8, opacity: 0, rotate: -8 }}
          animate={{
            y: ['-70vh', '0vh', '0vh', '70vh'],
            scale: [0.8, 1, 1, 0.9],
            opacity: [0, 1, 1, 1],
            rotate: [-8, 0, 0, 8],
          }}
          transition={{
            duration: 1.05,
            times: [0, 0.32, 0.5, 1],
            ease: ['easeOut', 'linear', 'easeIn'],
          }}
          className="w-[260px] h-[260px] flex items-center justify-center"
        >
          <FoxMascot animation="Fall" className="w-full h-full" />
        </motion.div>
      </div>
    </div>
  );
}
