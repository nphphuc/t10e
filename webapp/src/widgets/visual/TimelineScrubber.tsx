import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * TimelineScrubber — Timeline kéo được (scrubber).
 *
 * Kéo handle ngang để di chuyển qua các bước. Panel bên dưới
 * cập nhật nội dung theo bước đang chọn.
 *
 * Keyboard: ← → (hoặc A/D) để di chuyển từng bước.
 * Reduced-motion fallback: dùng tab buttons thay scrubber animation.
 *
 * Config (screen.visual):
 *   variant: "timeline-scrubber"
 *   steps: [{ label: string, content: string, emoji?: string, svg?: string }]
 */

interface Step {
  label: string;
  content: string;
  emoji?: string;
  svg?: string; // inline SVG string nếu có
}

interface TimelineScrubberData {
  visual: {
    variant: 'timeline-scrubber';
    steps: Step[];
  };
  prompt?: string;
  correct?: number; // optional: bước đúng cho câu hỏi (nếu dùng làm câu hỏi)
}

interface Props {
  data: TimelineScrubberData;
  selectedAnswer: any;
  onAnswer: (v: any) => void;
  isSubmitted: boolean;
}

export default function TimelineScrubber({ data, onAnswer, isSubmitted }: Props) {
  const steps: Step[] = data.visual?.steps || [];
  const shouldReduceMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const posToIdx = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || steps.length <= 1) return 0;
      const rect = track.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      return clamp(Math.round(ratio * (steps.length - 1)), 0, steps.length - 1);
    },
    [steps.length]
  );

  const goTo = (idx: number) => {
    const next = clamp(idx, 0, steps.length - 1);
    setActiveIdx(next);
    onAnswer(next); // ghi lại bước cuối người dùng dừng
  };

  // Mouse / Touch handlers
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isSubmitted) return;
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    goTo(posToIdx(e.clientX));
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || isSubmitted) return;
    goTo(posToIdx(e.clientX));
  };

  const handleTrackPointerUp = () => {
    isDragging.current = false;
  };

  // Keyboard handler on track
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isSubmitted) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      goTo(activeIdx - 1);
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      goTo(activeIdx + 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(steps.length - 1);
    }
  };

  if (steps.length === 0) {
    return <div className="text-gray-500 text-sm">TimelineScrubber: thiếu steps.</div>;
  }

  const currentStep = steps[activeIdx];
  const percent = steps.length > 1 ? (activeIdx / (steps.length - 1)) * 100 : 0;

  // Reduced motion: tab buttons
  if (shouldReduceMotion) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Timeline steps">
          {steps.map((step, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIdx}
              onClick={() => !isSubmitted && goTo(i)}
              disabled={isSubmitted}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                i === activeIdx
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {step.emoji && <span className="mr-1">{step.emoji}</span>}
              {step.label}
            </button>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700 text-gray-200 text-sm leading-relaxed min-h-[80px]">
          <div className="font-bold text-blue-300 mb-1.5 text-xs uppercase tracking-wide">
            Bước {activeIdx + 1}: {currentStep.label}
          </div>
          {currentStep.content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      {/* Timeline track */}
      <div className="space-y-2">
        {/* Step labels row */}
        <div className="flex justify-between text-[10px] text-gray-500 font-semibold px-1">
          {steps.map((step, i) => (
            <span
              key={i}
              className={`transition-colors ${i === activeIdx ? 'text-blue-400' : ''}`}
              style={{ width: `${100 / steps.length}%`, textAlign: 'center' }}
            >
              {step.emoji || '●'}
            </span>
          ))}
        </div>

        {/* Scrubber track */}
        <div
          ref={trackRef}
          role="slider"
          aria-label="Timeline scrubber"
          aria-valuemin={0}
          aria-valuemax={steps.length - 1}
          aria-valuenow={activeIdx}
          aria-valuetext={`Bước ${activeIdx + 1}: ${currentStep.label}`}
          tabIndex={isSubmitted ? -1 : 0}
          className={`relative h-10 flex items-center cursor-pointer ${isSubmitted ? 'opacity-60 cursor-default' : ''}`}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerUp}
          onKeyDown={handleKeyDown}
          onFocus={() => {}}
        >
          {/* Background rail */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-gray-700/60" />

          {/* Progress fill */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 pointer-events-none"
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />

          {/* Step dots */}
          {steps.map((_, i) => {
            const dotPercent = steps.length > 1 ? (i / (steps.length - 1)) * 100 : 0;
            const isPast = i <= activeIdx;
            return (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                style={{ left: `${dotPercent}%` }}
              >
                <motion.div
                  animate={
                    i === activeIdx
                      ? { scale: 1.4, backgroundColor: '#22d3ee' }
                      : isPast
                        ? { scale: 1, backgroundColor: '#3b82f6' }
                        : { scale: 1, backgroundColor: '#374151' }
                  }
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-3 h-3 rounded-full border-2 border-gray-900"
                />
              </div>
            );
          })}

          {/* Thumb handle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            animate={{ left: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_10px_rgba(34,211,238,0.6)] border-2 border-cyan-400 ring-2 ring-cyan-400/20" />
          </motion.div>
        </div>

        {/* Step labels below */}
        <div className="flex px-1">
          {steps.map((step, i) => (
            <div
              key={i}
              style={{ width: `${100 / steps.length}%` }}
              className="text-center"
            >
              <span
                className={`text-[9px] font-semibold transition-colors ${
                  i === activeIdx ? 'text-blue-300' : 'text-gray-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-2xl bg-gray-800/50 border border-gray-700/60 min-h-[100px]"
        >
          <div className="font-bold text-blue-300 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400">
              {activeIdx + 1}
            </span>
            <span>{currentStep.label}</span>
          </div>
          <p className="text-gray-200 text-[14px] leading-relaxed">{currentStep.content}</p>
          {currentStep.svg && (
            <div
              className="mt-3"
              dangerouslySetInnerHTML={{ __html: currentStep.svg }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Keyboard hint */}
      <p className="text-[10px] text-gray-600 text-center">
        ← → hoặc kéo để điều hướng
      </p>
    </div>
  );
}
