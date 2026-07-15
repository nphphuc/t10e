import { useState, useEffect } from 'react';
import ChoiceWidget from '../ChoiceWidget';

interface CompositionLifetimeProps {
  data: any;
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

export default function CompositionLifetime({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: CompositionLifetimeProps) {
  const whole = data.visual.whole || "Whole";
  const part = data.visual.part || "Part";
  const relationship = data.visual.relationship || "composition"; // "composition" | "aggregation"

  const [deleted, setDeleted] = useState(false);

  // Reset visual state when answer changes (so changing options resets the simulation)
  useEffect(() => {
    setDeleted(false);
  }, [selectedAnswer]);

  const handleDelete = () => {
    if (deleted || selectedAnswer === null) return;
    setDeleted(true);
  };

  const isComposition = relationship === "composition";
  const hasPrediction = selectedAnswer !== null;

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      <style>{`
        @keyframes dissolve {
          0% { opacity: 1; transform: scale(1); filter: blur(0px); }
          100% { opacity: 0; transform: scale(0.9); filter: blur(4px); }
        }
        .animate-dissolve {
          animation: dissolve 1s forwards ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .transition-all {
            transition: none !important;
          }
          .animate-dissolve {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>

      {/* Screen Reader Alternative */}
      <div className="sr-only" aria-live="polite">
        Sơ đồ quan hệ Whole-Part giữa {whole} và {part}.
        Quan hệ được xác định là {isComposition ? 'Composition (sở hữu mạnh, hình thoi đặc)' : 'Aggregation (sở hữu yếu, hình thoi rỗng)'}.
        {deleted ? `Đã thực hiện xóa đối tượng ${whole}. Kết quả: đối tượng ${part} ${isComposition ? 'bị xóa bỏ theo Whole' : 'vẫn tiếp tục tồn tại độc lập'}.` : ''}
      </div>

      {/* UML Lifetime Simulator Container */}
      <div className="w-full p-6 bg-[#111214] border border-gray-800 rounded-3xl flex flex-col items-center gap-6 shadow-inner">
        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
          {isComposition ? 'Composition (Sở hữu mạnh)' : 'Aggregation (Sở hữu yếu)'} Simulation
        </div>

        {/* Visual Diagram Board */}
        <div className="flex items-center justify-center gap-12 relative w-80 h-32 bg-[#090a0c]/60 border border-gray-900 rounded-2xl p-4 overflow-hidden">
          {/* Whole Object Box */}
          <div
            className={`w-24 py-4 border-2 rounded-xl text-center transition-all duration-500 bg-purple-950/20 text-purple-200 border-purple-500 ${
              deleted ? 'animate-dissolve' : ''
            }`}
          >
            <div className="font-bold text-xs underline underline-offset-4">
              :{whole}
            </div>
            <span className="text-[8px] text-gray-400 block mt-1">Whole Object</span>
          </div>

          {/* Connecting Line with Diamond */}
          <div
            className={`absolute w-12 h-0.5 bg-gray-600 transition-opacity duration-300 ${
              deleted ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ left: '136px' }}
          >
            {/* Diamond symbol at Whole end (left) */}
            <div
              className={`absolute -left-3 -top-1.5 w-3.5 h-3.5 transform rotate-45 border-2 ${
                isComposition
                  ? 'bg-purple-500 border-purple-500'
                  : 'bg-[#111214] border-purple-500'
              }`}
            />
          </div>

          {/* Part Object Box */}
          <div
            className={`w-24 py-4 border-2 rounded-xl text-center transition-all duration-700 ${
              deleted
                ? isComposition
                  ? 'animate-dissolve'
                  : 'border-emerald-500 bg-emerald-950/20 text-emerald-300 scale-105 shadow-md shadow-emerald-950/40 -translate-x-14'
                : 'border-indigo-500 bg-indigo-950/10 text-indigo-200'
            }`}
          >
            <div className="font-bold text-xs underline underline-offset-4">
              :{part}
            </div>
            <span className="text-[8px] text-gray-400 block mt-1">Part Object</span>
          </div>
        </div>

        {/* Simulation Control Button */}
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={!hasPrediction || deleted}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              !hasPrediction
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-transparent'
                : deleted
                ? 'bg-gray-900 text-gray-600 border border-gray-800'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950/20 focus:ring-2 focus:ring-red-400 active:scale-95'
            }`}
          >
            🗑️ Xóa đối tượng Whole (:{whole})
          </button>

          {deleted && (
            <button
              onClick={() => {
                setDeleted(false);
              }}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 text-xs font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              🔄 Reset
            </button>
          )}
        </div>

        {/* Instruction Message */}
        <div className="text-[11px] text-center text-gray-400">
          {!hasPrediction ? (
            <span className="text-gray-500">💡 Chọn một dự đoán bên dưới để mở khóa giả lập.</span>
          ) : !deleted ? (
            <span className="text-amber-400 animate-pulse font-medium">➔ Hãy bấm nút "Xóa đối tượng Whole" để chạy thử kết quả!</span>
          ) : isComposition ? (
            <span className="text-red-400 font-medium">⚠️ Kết quả: Khi Whole (:{whole}) bị hủy, Part (:{part}) bị xóa bỏ đồng thời (Composition).</span>
          ) : (
            <span className="text-emerald-400 font-bold">✓ Kết quả: Khi Whole (:{whole}) bị hủy, Part (:{part}) vẫn tồn tại độc lập (Aggregation).</span>
          )}
        </div>
      </div>

      {/* Choice Selection Section */}
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
