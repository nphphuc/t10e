import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FoxMascot from './FoxMascot';

export default function FoxFallTransition() {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState<'enter' | 'exit' | 'removed'>('enter');

  useEffect(() => {
    if (shouldReduceMotion) {
      setStage('removed');
      return;
    }

    const tExit = setTimeout(() => {
      setStage('exit');
    }, 1100); // Giữ overlay ~1.1s ở trạng thái enter

    const tRemove = setTimeout(() => {
      setStage('removed');
    }, 1450); // Gỡ hoàn toàn khỏi DOM sau khi exit animation xong (1.1s + 350ms)

    return () => {
      clearTimeout(tExit);
      clearTimeout(tRemove);
    };
  }, [shouldReduceMotion]);

  if (stage === 'removed' || shouldReduceMotion) {
    return null;
  }

  // Tạo ngẫu nhiên 12 vạch tốc độ gió
  const lines = Array.from({ length: 12 }).map((_, idx) => {
    const left = 5 + (idx * 8.5) + (Math.random() * 4); // Phân bổ đều chiều rộng kèm lệch nhẹ
    const duration = 0.45 + Math.random() * 0.3; // Tốc độ chạy lên nhanh chậm ngẫu nhiên
    const delay = Math.random() * 0.35;
    const height = 120 + Math.random() * 140; // Chiều dài vạch ngẫu nhiên
    const opacity = 0.15 + Math.random() * 0.25;
    return { left, duration, delay, height, opacity, id: idx };
  });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`fixed inset-0 z-[999] bg-[#0c0d0e] flex flex-col items-center justify-center overflow-hidden select-none ${
        stage === 'exit' ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes speed-line-up {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-100vh);
          }
        }
      `}</style>

      {/* Hiệu ứng gió: các vạch tốc độ chạy dọc ngược lên */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
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

      {/* Con Fox phóng lớn ở giữa chạy animation Fall */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0, y: -40 }}
        animate={{ scale: [0.4, 1.05, 1], opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.34, 1.56, 0.64, 1] 
        }}
        className="w-[280px] h-[280px] flex items-center justify-center relative select-none pointer-events-none"
      >
        <FoxMascot animation="Fall" className="w-full h-full" />
      </motion.div>

      {/* Speed wind vignette blur/darken edges */}
      <div 
        className="absolute inset-0 pointer-events-none border-[30px] border-transparent"
        style={{
          boxShadow: 'inset 0 0 120px rgba(12, 13, 14, 0.95)',
          backdropFilter: 'blur(0.5px)',
        }}
      />
    </motion.div>
  );
}
