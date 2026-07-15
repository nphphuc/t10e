import { useState } from 'react';

interface BoundarySortProps {
  data: {
    prompt: string;
    visual: {
      items?: string[];
      correctOutside?: string[];
    };
    feedbackWrongByItem?: Record<string, string>;
  };
  selectedAnswer: number[] | null;
  onAnswer: (value: number[]) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

const ITEM_META: Record<string, { desc: string; icon: string; color: string }> = {
  'Customer': { desc: 'Người mua hàng (User)', icon: '👤', color: 'from-emerald-500 to-teal-600' },
  'Warehouse Staff': { desc: 'Nhân viên kho bãi', icon: '📦', color: 'from-cyan-500 to-blue-600' },
  'Google Authentication Service': { desc: 'Dịch vụ xác thực bên ngoài', icon: '🔑', color: 'from-violet-500 to-indigo-600' },
  'Product Database': { desc: 'Lưu trữ thông tin sản phẩm', icon: '🗄️', color: 'from-rose-500 to-red-600' },
  'CheckoutController': { desc: 'Điều khiển quy trình mua hàng', icon: '⚙️', color: 'from-amber-500 to-orange-600' },
};

export default function BoundarySort({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: BoundarySortProps) {
  const items = data.visual.items || [];
  const correctOutside = data.visual.correctOutside || [];
  const currentSelections = selectedAnswer || [];

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const toggleItem = (idx: number) => {
    if (isSubmitted) return;
    if (currentSelections.includes(idx)) {
      onAnswer(currentSelections.filter((s) => s !== idx));
    } else {
      onAnswer([...currentSelections, idx]);
    }
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    if (isSubmitted) {
      e.preventDefault();
      return;
    }
    setDraggedIdx(idx);
    e.dataTransfer.setData('text/plain', idx.toString());
  };

  const handleDrop = (toOutside: boolean) => {
    if (draggedIdx === null || isSubmitted) return;
    const isCurrentlyOutside = currentSelections.includes(draggedIdx);

    if (toOutside && !isCurrentlyOutside) {
      onAnswer([...currentSelections, draggedIdx]);
    } else if (!toOutside && isCurrentlyOutside) {
      onAnswer(currentSelections.filter((s) => s !== draggedIdx));
    }
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      <div className="text-center text-xs text-gray-400">
        💡 <span className="font-semibold text-gray-300">Mẹo:</span> Kéo thả thẻ hoặc click/ấn Enter để di chuyển giữa hai vùng.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inside System Boundary Container */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(false)}
          className={`relative rounded-3xl p-6 border-2 transition-all min-h-[300px] flex flex-col justify-between ${
            isSubmitted
              ? 'border-gray-800 bg-gray-950/20'
              : 'border-dashed border-gray-700 bg-gray-900/10 hover:bg-gray-900/20 hover:border-gray-600'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-300 tracking-wide flex items-center gap-2">
                📂 Trong Hệ Thống FOS (Internal)
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 px-2 py-0.5 bg-gray-900 rounded-md">
                Inside
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Các thành phần phần mềm do nhóm bạn viết mã nguồn và triển khai trực tiếp.
            </p>
          </div>

          <div className="flex-grow flex flex-col gap-3 justify-center">
            {items.map((item, idx) => {
              if (currentSelections.includes(idx)) return null;
              
              const meta = ITEM_META[item] || { desc: '', icon: '❓', color: 'from-gray-500 to-gray-600' };
              const isWrong = isSubmitted && correctOutside.includes(item);

              return (
                <div
                  key={item}
                  draggable={!isSubmitted}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onClick={() => toggleItem(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleItem(idx);
                    }
                  }}
                  tabIndex={isSubmitted ? -1 : 0}
                  className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all select-none ${
                    isSubmitted
                      ? isWrong
                        ? 'border-red-500/50 bg-red-950/10 animate-shake'
                        : 'border-gray-800 bg-gray-900/30'
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 cursor-grab active:cursor-grabbing hover:scale-[1.01] focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-md shadow-inner`}>
                      {meta.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-gray-200">{item}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{meta.desc}</p>
                    </div>
                  </div>

                  {isWrong && data.feedbackWrongByItem?.[item] && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 p-2 rounded-xl bg-red-950 border border-red-800 text-[10px] text-red-200 leading-normal shadow-lg">
                      ⚠️ {data.feedbackWrongByItem[item]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Outside System Boundary Container */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(true)}
          className={`relative rounded-3xl p-6 border-2 transition-all min-h-[300px] flex flex-col justify-between ${
            isSubmitted
              ? 'border-gray-800 bg-gray-950/20'
              : 'border-dashed border-blue-500/30 bg-blue-950/5 hover:bg-blue-950/10 hover:border-blue-500/50'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-blue-300 tracking-wide flex items-center gap-2">
                👤 Ngoài Hệ Thống FOS (Actor / External)
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500 px-2 py-0.5 bg-blue-950/40 rounded-md">
                Actor
              </span>
            </div>
            <p className="text-xs text-blue-400/60 mb-6 leading-relaxed">
              Các tác nhân giao tiếp bên ngoài hệ thống (role con người, external service, hardware device).
            </p>
          </div>

          <div className="flex-grow flex flex-col gap-3 justify-center">
            {items.map((item, idx) => {
              if (!currentSelections.includes(idx)) return null;

              const meta = ITEM_META[item] || { desc: '', icon: '❓', color: 'from-gray-500 to-gray-600' };
              const isWrong = isSubmitted && !correctOutside.includes(item);

              return (
                <div
                  key={item}
                  draggable={!isSubmitted}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onClick={() => toggleItem(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleItem(idx);
                    }
                  }}
                  tabIndex={isSubmitted ? -1 : 0}
                  className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all select-none ${
                    isSubmitted
                      ? isWrong
                        ? 'border-red-500/50 bg-red-950/10 animate-shake'
                        : 'border-gray-800 bg-gray-900/30'
                      : 'border-blue-900/40 bg-blue-950/20 hover:border-blue-800 cursor-grab active:cursor-grabbing hover:scale-[1.01] focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-md shadow-inner`}>
                      {meta.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-gray-200">{item}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{meta.desc}</p>
                    </div>
                  </div>

                  {isWrong && data.feedbackWrongByItem?.[item] && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 p-2 rounded-xl bg-red-950 border border-red-800 text-[10px] text-red-200 leading-normal shadow-lg">
                      ⚠️ {data.feedbackWrongByItem[item]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
