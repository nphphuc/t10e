import { useState, useEffect } from 'react';
import FoxMascot from './FoxMascot';
import { FOX_TRANSITION_S } from './transitionConfig';

/**
 * Overlay "fox rơi vào ải" — THUẦN CSS ANIMATION.
 *
 * TẠI SAO KHÔNG DÙNG FRAMER-MOTION Ở ĐÂY: animation JS (framer-motion) mount
 * ngay sau khi AnimatePresence/điều hướng SPA có thể KHÔNG BAO GIỜ start
 * (bug đã biết của framer-motion khi enter bị interrupt) → mọi thứ kẹt ở
 * initial: nền kẹt opacity 1 = màn hình đen vĩnh viễn, console sạch.
 * CSS @keyframes do browser tự chạy ngay khi element vào DOM — không phụ
 * thuộc React render/effect/animation-frame nào, không thể kẹt.
 *
 * Overlay tự gỡ khỏi DOM qua sự kiện DOM `animationend` của keyframe fox
 * (native event, bắn tin cậy). Người dùng có thể skip sớm bằng click,
 * Escape hoặc Space. Kể cả nếu không gỡ được: mọi keyframe kết thúc
 * ở opacity 0 (forwards) → vô hình, vô hại.
 */
export default function FoxFallTransition() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Spacebar') {
        setVisible(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!visible) return null;

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
    <div
      className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden select-none cursor-pointer"
      role="button"
      tabIndex={-1}
      aria-label="Bỏ qua hiệu ứng chuyển màn"
      onClick={() => setVisible(false)}
    >
      <style>{`
        @keyframes speed-line-up {
          0% { transform: translateY(100vh); }
          100% { transform: translateY(-100vh); }
        }
        @keyframes fox-bg-fade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes fox-fall {
          0%   { transform: translateY(-70vh) scale(0.8) rotate(-8deg); opacity: 0; }
          35%  { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
          50%  { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translateY(55vh) scale(0.9) rotate(8deg); opacity: 0; }
        }
      `}</style>

      {/* Nền đen: mờ đi đúng lúc fox chạm giữa rồi trong suốt hẳn (forwards) */}
      <div
        className="absolute inset-0 bg-[#0c0d0e]"
        style={{ animation: 'fox-bg-fade 0.2s ease-out 0.15s forwards' }}
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

      {/* Fox: rơi xuống giữa → dừng chớp nhoáng → rơi tiếp xuống dưới và mờ dần */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[260px] h-[260px] flex items-center justify-center"
          style={{
            animation: `fox-fall ${FOX_TRANSITION_S}s cubic-bezier(0.33, 1, 0.68, 1) forwards`,
            opacity: 0,
          }}
          onAnimationEnd={(e) => {
            if (e.animationName === 'fox-fall') setVisible(false);
          }}
        >
          <FoxMascot animation="Fall" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
