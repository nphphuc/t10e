import { useEffect, useState } from 'react';
import type { EdgeType } from '../engine/types';

interface DeleteWholeSimProps {
  wholeLabel: string;
  partLabel: string;
  relationship: Extract<EdgeType, 'composition' | 'aggregation'>;
}

export default function DeleteWholeSim({ wholeLabel, partLabel, relationship }: DeleteWholeSimProps) {
  const [deleted, setDeleted] = useState(false);
  const isComposition = relationship === 'composition';

  useEffect(() => {
    setDeleted(false);
  }, [relationship]);

  return (
    <div className="p-3 bg-[#090a0c]/60 border border-gray-800 rounded-xl space-y-3">
      <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">
        Thử xóa Whole ({isComposition ? 'Composition' : 'Aggregation'})
      </div>
      <div className="sr-only" aria-live="polite">
        {deleted
          ? `Đã xóa ${wholeLabel}. Kết quả: ${partLabel} ${isComposition ? 'bị xóa theo' : 'vẫn tồn tại độc lập'}.`
          : ''}
      </div>
      <div className="flex items-center justify-center gap-8 h-16">
        <div
          className={`px-3 py-2 rounded-lg border-2 text-center text-[10px] font-bold transition-all duration-300 ${
            deleted ? 'opacity-0 scale-90' : 'opacity-100'
          } border-boundary bg-boundary/10 text-violet-200`}
        >
          :{wholeLabel}
        </div>
        <div
          className={`px-3 py-2 rounded-lg border-2 text-center text-[10px] font-bold transition-all duration-300 ${
            deleted
              ? isComposition
                ? 'opacity-0 scale-90'
                : 'border-success bg-success/10 text-emerald-300 -translate-x-4'
              : 'border-indigo-500 bg-indigo-950/10 text-indigo-200'
          }`}
        >
          :{partLabel}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setDeleted(true)}
          disabled={deleted}
          className="px-3 py-1.5 rounded-lg bg-error/80 hover:bg-error text-white text-[10px] font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🗑️ Xóa {wholeLabel}
        </button>
        {deleted && (
          <button
            onClick={() => setDeleted(false)}
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-bold"
          >
            🔄 Reset
          </button>
        )}
      </div>
      <div className="text-[10px] text-center">
        {!deleted ? (
          <span className="text-gray-500">Bấm nút để xem {partLabel} còn hay mất khi {wholeLabel} bị xóa.</span>
        ) : isComposition ? (
          <span className="text-red-400 font-medium">⚠️ {partLabel} bị xóa theo {wholeLabel} (Composition).</span>
        ) : (
          <span className="text-emerald-400 font-medium">✓ {partLabel} vẫn tồn tại độc lập (Aggregation).</span>
        )}
      </div>
    </div>
  );
}
