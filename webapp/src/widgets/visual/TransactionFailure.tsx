import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

interface TransactionFailureProps {
  data: any;
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

export default function TransactionFailure({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: TransactionFailureProps) {
  // Local state representing simulation
  const [simulationState, setSimulationState] = useState<'initial' | 'committed' | 'aborted'>('initial');

  const handleAction = (action: 'commit' | 'abort') => {
    if (isSubmitted) return;
    setSimulationState(action === 'commit' ? 'committed' : 'aborted');
    
    // Map action to Choice index
    const ansIdx = action === 'abort' ? 1 : 2;
    onAnswer(ansIdx);
  };

  const getLedgerAVal = () => {
    if (simulationState === 'committed') return '$50 (Committed)';
    if (simulationState === 'aborted') return '$100 (Rolled Back)';
    return '$50 (Prepared)';
  };

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
        Mô phỏng lỗi giao dịch phân tán. Account A đã chuẩn bị trừ $50, Account B bị lỗi. Bạn cần gửi Commit hoặc Abort.
      </div>

      {/* Distributed Ledger Visual */}
      <div className="w-full p-4 bg-[#111214] border border-gray-800 rounded-3xl flex flex-col items-center gap-4 shadow-inner">
        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
          Distributed Transaction Monitor (2-Phase Commit)
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
          {/* Service A (Prepared) */}
          <div className="p-3 bg-[#0d0e12] border border-violet-500/40 rounded-xl flex flex-col gap-1 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" title="Prepared" />
            <div className="text-[10px] font-bold text-violet-400">Bank X (Account A)</div>
            <div className="text-sm font-bold font-mono my-2 text-gray-200">{getLedgerAVal()}</div>
            <div className="text-[8px] uppercase tracking-wider text-yellow-400 bg-yellow-950/20 py-0.5 rounded border border-yellow-800/30">
              {simulationState === 'initial' ? 'Prepared (Waiting)' : simulationState === 'committed' ? 'Committed' : 'Aborted'}
            </div>
          </div>

          {/* Service B (Failed) */}
          <div className="p-3 bg-[#0d0e12] border border-rose-500/30 rounded-xl flex flex-col gap-1 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" title="Failed" />
            <div className="text-[10px] font-bold text-rose-400">Bank Y (Account B)</div>
            <div className="text-sm font-bold font-mono my-2 text-gray-400">$20</div>
            <div className="text-[8px] uppercase tracking-wider text-rose-500 bg-rose-950/20 py-0.5 rounded border border-rose-900/30">
              Failed (Offline)
            </div>
          </div>
        </div>

        {/* Coordinator Actions */}
        {!isSubmitted && (
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => handleAction('commit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                simulationState === 'committed'
                  ? 'bg-rose-700 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              Gửi COMMIT tới Bank X
            </button>
            <button
              onClick={() => handleAction('abort')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                simulationState === 'aborted'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              Gửi ABORT / ROLLBACK tới Bank X
            </button>
          </div>
        )}
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
