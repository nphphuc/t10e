import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

interface TradeoffRadarProps {
  data: any;
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

export default function TradeoffRadar({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: TradeoffRadarProps) {
  // Tactics mapping from json or default
  const tactics = data.visual.tactics || [
    "Mã hóa dữ liệu & Xác thực đa nhân tố",
    "Sử dụng Caching",
    "Dư thừa dữ liệu (Redundancy)"
  ];

  const baseScore = 3;

  // Active tactics state
  const [activeTactics, setActiveTactics] = useState<Record<string, boolean>>({});

  const handleToggleTactic = (tactic: string) => {
    if (isSubmitted) return;
    const next = { ...activeTactics, [tactic]: !activeTactics[tactic] };
    setActiveTactics(next);

    // If "Mã hóa dữ liệu & Xác thực đa nhân tố" is toggled, it demonstrates the trade-off.
    // If user has toggled Tactic 0 (Mã hóa) ON, we can set answer to 1 (Trade-off: security overhead...)
    // This provides a reactive link between playing with the radar and answering the question!
    if (next[tactics[0]]) {
      onAnswer(1);
    } else {
      onAnswer(null);
    }
  };

  // Calculate scores
  const getScore = (attr: string) => {
    let score = baseScore;
    if (activeTactics[tactics[0]]) { // Encrypt & Auth
      if (attr === 'Security') score += 2;
      if (attr === 'Performance') score -= 2;
      if (attr === 'Modifiability') score -= 1;
    }
    if (activeTactics[tactics[1]]) { // Cache
      if (attr === 'Performance') score += 2;
      if (attr === 'Security') score -= 1;
      if (attr === 'Modifiability') score -= 1;
    }
    if (activeTactics[tactics[2]]) { // Redundancy
      if (attr === 'Availability') score += 2;
      if (attr === 'Performance') score -= 1;
      if (attr === 'Modifiability') score -= 1;
    }
    return Math.max(1, Math.min(5, score));
  };

  const secVal = getScore('Security');
  const perfVal = getScore('Performance');
  const availVal = getScore('Availability');
  const modVal = getScore('Modifiability');

  const cx = 200;
  const cy = 100;
  const maxR = 60;

  // Calculate coordinates for diamond vertices
  const getCoords = (val: number, direction: 'up' | 'right' | 'down' | 'left') => {
    const r = (val / 5) * maxR;
    if (direction === 'up') return { x: cx, y: cy - r };
    if (direction === 'right') return { x: cx + r, y: cy };
    if (direction === 'down') return { x: cx, y: cy + r };
    return { x: cx - r, y: cy };
  };

  const pSec = getCoords(secVal, 'up');
  const pPerf = getCoords(perfVal, 'right');
  const pAvail = getCoords(availVal, 'down');
  const pMod = getCoords(modVal, 'left');

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn select-none">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-all, .transition-colors {
            transition: none !important;
          }
          .animate-fadeIn {
            animation: none !important;
          }
        }
      `}</style>

      {/* Screen Reader Alternative */}
      <div className="sr-only" aria-live="polite">
        Biểu đồ Radar chất lượng thiết kế (NFR).
        Điểm số hiện tại: Security: {secVal}, Performance: {perfVal}, Availability: {availVal}, Modifiability: {modVal}.
      </div>

      {/* 1. Radar Chart SVG */}
      <div className="w-full p-4 bg-[#111214] border border-gray-800 rounded-3xl flex justify-center shadow-inner relative">
        <svg viewBox="0 0 400 200" className="w-full max-w-sm h-48 text-gray-200">
          {/* Axis Labels */}
          <text x={cx} y={cy - maxR - 8} fill="#a855f7" fontSize="8" fontWeight="bold" textAnchor="middle">SECURITY (Bảo mật)</text>
          <text x={cx + maxR + 10} y={cy + 3} fill="#fd971f" fontSize="8" fontWeight="bold" textAnchor="start">PERFORMANCE (Hiệu năng)</text>
          <text x={cx} y={cy + maxR + 14} fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">AVAILABILITY (Sẵn sàng)</text>
          <text x={cx - maxR - 10} y={cy + 3} fill="#3b82f6" fontSize="8" fontWeight="bold" textAnchor="end">MODIFIABILITY (Dễ bảo trì)</text>

          {/* Grid Circles / Rings (levels 1 to 5) */}
          {[1, 2, 3, 4, 5].map((lvl) => {
            const r = (lvl / 5) * maxR;
            return (
              <polygon
                key={lvl}
                points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
                fill="none"
                stroke="#374151"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Axis Lines */}
          <line x1={cx} y1={cy - maxR} x2={cx} y2={cy + maxR} stroke="#374151" strokeWidth="1" />
          <line x1={cx - maxR} y1={cy} x2={cx + maxR} y2={cy} stroke="#374151" strokeWidth="1" />

          {/* Active Tradeoff Polygon */}
          <polygon
            points={`${pSec.x},${pSec.y} ${pPerf.x},${pPerf.y} ${pAvail.x},${pAvail.y} ${pMod.x},${pMod.y}`}
            fill="#a855f71e"
            stroke="#a855f7"
            strokeWidth="2"
            className="transition-all duration-300"
          />

          {/* Markers on active vertices */}
          <circle cx={pSec.x} cy={pSec.y} r="3" fill="#a855f7" className="transition-all duration-300" />
          <circle cx={pPerf.x} cy={pPerf.y} r="3" fill="#fd971f" className="transition-all duration-300" />
          <circle cx={pAvail.x} cy={pAvail.y} r="3" fill="#10b981" className="transition-all duration-300" />
          <circle cx={pMod.x} cy={pMod.y} r="3" fill="#3b82f6" className="transition-all duration-300" />
        </svg>
      </div>

      {/* 2. Tactics Checkboxes */}
      <div className="flex flex-col gap-2 max-w-sm mx-auto w-full bg-[#0d0e12]/60 p-4 border border-gray-800 rounded-2xl">
        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2 text-center">
          Kích hoạt tactics kiến trúc
        </div>
        {tactics.map((tactic: string) => (
          <label
            key={tactic}
            className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
              activeTactics[tactic]
                ? 'border-purple-600 bg-purple-950/10 text-purple-200'
                : 'border-gray-800/80 bg-transparent text-gray-400 hover:border-gray-700'
            }`}
          >
            <span className="text-xs font-semibold">{tactic}</span>
            <input
              type="checkbox"
              disabled={isSubmitted}
              checked={!!activeTactics[tactic]}
              onChange={() => handleToggleTactic(tactic)}
              className="w-4 h-4 rounded text-purple-600 bg-gray-900 border-gray-700 focus:ring-purple-500 focus:ring-offset-gray-900"
            />
          </label>
        ))}
      </div>

      {/* Choice grading widget */}
      <div className="border-t border-gray-800 pt-4">
        <ChoiceWidget
          data={{
            prompt: data.prompt,
            options: data.options || [],
            correct: data.correct,
          }}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
          disabledOptions={disabledOptions}
        />
      </div>
    </div>
  );
}
