import type { Multiplicity } from '../engine/types';

interface InstancePreviewProps {
  fromLabel: string;
  toLabel: string;
  multiplicity?: { from: Multiplicity; to: Multiplicity };
}

// Fixed illustrative link set with deliberately varied cardinalities on both sides
// (some "from" objects have 1 link, some have 2; same for "to") so that whichever
// multiplicity the learner currently has selected, violations (if any) are visible —
// a Predict-Observe-Explain moment, not a check against the "correct" answer.
const LINKS: [number, number][] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 2],
];
const FROM_COUNT = 2;
const TO_COUNT = 3;

function countOk(count: number, m: Multiplicity): boolean {
  if (m === '1') return count === 1;
  if (m === '0..1') return count <= 1;
  if (m === '1..*') return count >= 1;
  return true; // 0..*
}

export default function InstancePreview({ fromLabel, toLabel, multiplicity }: InstancePreviewProps) {
  if (!multiplicity) return null;

  const fromInitial = (fromLabel[0] || 'A').toLowerCase();
  const toInitial = (toLabel[0] || 'B').toLowerCase();

  const fromCounts = Array.from({ length: FROM_COUNT }, (_, i) => LINKS.filter(([f]) => f === i).length);
  const toCounts = Array.from({ length: TO_COUNT }, (_, i) => LINKS.filter(([, t]) => t === i).length);

  const fromViolations = fromCounts.map((c) => !countOk(c, multiplicity.to));
  const toViolations = toCounts.map((c) => !countOk(c, multiplicity.from));
  const hasViolation = fromViolations.some(Boolean) || toViolations.some(Boolean);

  return (
    <div className="p-3 bg-[#090a0c]/60 border border-gray-800 rounded-xl space-y-2">
      <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Ví dụ tập instance</div>
      <svg viewBox="0 0 220 110" className="w-full h-28">
        {LINKS.map(([f, t], idx) => {
          const x1 = 40;
          const y1 = 20 + f * 35;
          const x2 = 180;
          const y2 = 12 + t * 30;
          return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth={1.5} strokeOpacity={0.7} />;
        })}
        {Array.from({ length: FROM_COUNT }).map((_, i) => (
          <g key={i}>
            <circle
              cx={40}
              cy={20 + i * 35}
              r={12}
              fill={fromViolations[i] ? '#7f1d1d' : '#1e1b4b'}
              stroke={fromViolations[i] ? '#ef4444' : '#8b5cf6'}
              strokeWidth={2}
            />
            <text x={40} y={24 + i * 35} textAnchor="middle" fontSize={7} fill="#fff" fontWeight="bold">
              {fromInitial}
              {i + 1}
            </text>
          </g>
        ))}
        {Array.from({ length: TO_COUNT }).map((_, i) => (
          <g key={i}>
            <circle
              cx={180}
              cy={12 + i * 30}
              r={12}
              fill={toViolations[i] ? '#7f1d1d' : '#115e59'}
              stroke={toViolations[i] ? '#ef4444' : '#14b8a6'}
              strokeWidth={2}
            />
            <text x={180} y={16 + i * 30} textAnchor="middle" fontSize={7} fill="#fff" fontWeight="bold">
              {toInitial}
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <div className="text-[10px] text-center">
        {hasViolation ? (
          <span className="text-red-400 font-semibold">
            ⚠️ Có instance vi phạm multiplicity '{multiplicity.from}' / '{multiplicity.to}' đang chọn.
          </span>
        ) : (
          <span className="text-emerald-400 font-semibold">✓ Tập instance ví dụ hợp lệ với multiplicity đang chọn.</span>
        )}
      </div>
    </div>
  );
}
