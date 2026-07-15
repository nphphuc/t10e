import { useState, useEffect } from 'react';

interface BecSorterProps {
  data: any;
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
}

export default function BecSorter({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: BecSorterProps) {
  const items: string[] = data.visual.items || [];
  const correctMapping: Record<string, string> = data.visual.correctMapping || {};
  const feedbackWrongByItem: Record<string, string> = data.feedbackWrongByItem || {};

  // Placements state: maps item to "boundary" | "entity" | "control"
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Synchronize state with parent selectedAnswer
  useEffect(() => {
    if (selectedAnswer && typeof selectedAnswer === 'object') {
      setPlacements(selectedAnswer);
    } else {
      setPlacements({});
    }
  }, [selectedAnswer]);

  const updatePlacement = (itemId: string, bucket: string | null) => {
    if (isSubmitted) return;
    const nextPlacements = { ...placements };
    if (bucket) {
      nextPlacements[itemId] = bucket;
    } else {
      delete nextPlacements[itemId];
    }
    setPlacements(nextPlacements);
    onAnswer(nextPlacements);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (isSubmitted) return;
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDrop = (e: React.DragEvent, bucket: string | null) => {
    e.preventDefault();
    if (isSubmitted) return;
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId) {
      updatePlacement(itemId, bucket);
    }
  };

  // Keyboard navigation & quick move
  const handleItemSelect = (itemId: string) => {
    if (isSubmitted) return;
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const handleKeyDownOnItem = (e: React.KeyboardEvent, itemId: string) => {
    if (isSubmitted) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemSelect(itemId);
    } else if (e.key === '1') {
      e.preventDefault();
      updatePlacement(itemId, 'boundary');
      setSelectedItem(null);
    } else if (e.key === '2') {
      e.preventDefault();
      updatePlacement(itemId, 'entity');
      setSelectedItem(null);
    } else if (e.key === '3') {
      e.preventDefault();
      updatePlacement(itemId, 'control');
      setSelectedItem(null);
    }
  };

  const unclassifiedItems = items.filter((item) => !placements[item]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-shake {
            animation: none !important;
          }
          .transition-all {
            transition: none !important;
          }
        }
      `}</style>

      {/* Screen Reader Instructions */}
      <div className="sr-only" aria-live="polite">
        Phân loại các đối tượng sau vào Boundary, Entity hoặc Control.
        Bàn phím: Chọn một đối tượng bằng Enter/Space, sau đó nhấn phím 1 để chọn Boundary, 2 để chọn Entity, 3 để chọn Control.
      </div>

      {/* 3 BEC Target Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Boundary Bucket */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'boundary')}
          onClick={() => selectedItem && updatePlacement(selectedItem, 'boundary')}
          className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 min-h-[160px] transition-all cursor-pointer ${
            selectedItem
              ? 'border-purple-500/50 bg-purple-950/10 hover:border-purple-500'
              : 'border-gray-800 bg-[#0c0d0f]'
          }`}
        >
          <div className="flex items-center gap-2">
            {/* sideways T (Boundary stereotype) SVG */}
            <svg className="w-5 h-5 stroke-purple-500 fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="14" cy="12" r="5" />
              <line x1="5" y1="6" x2="5" y2="18" />
              <line x1="5" y1="12" x2="9" y2="12" />
            </svg>
            <span className="font-bold text-xs text-purple-300">Boundary (Giao diện)</span>
          </div>

          <div className="w-full flex flex-col gap-2">
            {items
              .filter((item) => placements[item] === 'boundary')
              .map((item) => {
                const isWrong = isSubmitted && correctMapping[item] !== 'boundary';
                return (
                  <div
                    key={item}
                    draggable={!isSubmitted}
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePlacement(item, null);
                    }}
                    className={`relative p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      isWrong
                        ? 'border-red-500 bg-red-950/20 text-red-200 animate-shake'
                        : 'border-purple-900 bg-purple-950/10 text-purple-300 hover:bg-purple-950/20 cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    {item}
                    {isWrong && feedbackWrongByItem[item] && (
                      <div className="mt-1.5 p-2 rounded-lg bg-red-950 border border-red-800 text-[10px] text-red-200 text-left font-normal leading-normal">
                        ⚠️ {feedbackWrongByItem[item]}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Entity Bucket */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'entity')}
          onClick={() => selectedItem && updatePlacement(selectedItem, 'entity')}
          className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 min-h-[160px] transition-all cursor-pointer ${
            selectedItem
              ? 'border-emerald-500/50 bg-emerald-950/10 hover:border-emerald-500'
              : 'border-gray-800 bg-[#0c0d0f]'
          }`}
        >
          <div className="flex items-center gap-2">
            {/* circle with underline (Entity stereotype) SVG */}
            <svg className="w-5 h-5 stroke-emerald-500 fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="10" r="5" />
              <line x1="5" y1="18" x2="19" y2="18" />
            </svg>
            <span className="font-bold text-xs text-emerald-300">Entity (Dữ liệu)</span>
          </div>

          <div className="w-full flex flex-col gap-2">
            {items
              .filter((item) => placements[item] === 'entity')
              .map((item) => {
                const isWrong = isSubmitted && correctMapping[item] !== 'entity';
                return (
                  <div
                    key={item}
                    draggable={!isSubmitted}
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePlacement(item, null);
                    }}
                    className={`relative p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      isWrong
                        ? 'border-red-500 bg-red-950/20 text-red-200 animate-shake'
                        : 'border-emerald-900 bg-emerald-950/10 text-emerald-300 hover:bg-emerald-950/20 cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    {item}
                    {isWrong && feedbackWrongByItem[item] && (
                      <div className="mt-1.5 p-2 rounded-lg bg-red-950 border border-red-800 text-[10px] text-red-200 text-left font-normal leading-normal">
                        ⚠️ {feedbackWrongByItem[item]}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Control Bucket */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'control')}
          onClick={() => selectedItem && updatePlacement(selectedItem, 'control')}
          className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 min-h-[160px] transition-all cursor-pointer ${
            selectedItem
              ? 'border-amber-500/50 bg-amber-950/10 hover:border-amber-500'
              : 'border-gray-800 bg-[#0c0d0f]'
          }`}
        >
          <div className="flex items-center gap-2">
            {/* circle with circular arrow (Control stereotype) SVG */}
            <svg className="w-5 h-5 stroke-amber-500 fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="13" r="5" />
              <path d="M12 7a5 5 0 0 1 4 2.5l-2.5 1M16 9.5H12" />
            </svg>
            <span className="font-bold text-xs text-amber-300">Control (Điều phối)</span>
          </div>

          <div className="w-full flex flex-col gap-2">
            {items
              .filter((item) => placements[item] === 'control')
              .map((item) => {
                const isWrong = isSubmitted && correctMapping[item] !== 'control';
                return (
                  <div
                    key={item}
                    draggable={!isSubmitted}
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePlacement(item, null);
                    }}
                    className={`relative p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      isWrong
                        ? 'border-red-500 bg-red-950/20 text-red-200 animate-shake'
                        : 'border-amber-900 bg-amber-950/10 text-amber-300 hover:bg-amber-950/20 cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    {item}
                    {isWrong && feedbackWrongByItem[item] && (
                      <div className="mt-1.5 p-2 rounded-lg bg-red-950 border border-red-800 text-[10px] text-red-200 text-left font-normal leading-normal">
                        ⚠️ {feedbackWrongByItem[item]}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Unclassified Source Items List */}
      <div className="w-full p-5 bg-[#090a0c]/60 border border-gray-800 rounded-2xl flex flex-col gap-3">
        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider text-center">
          Danh sách đối tượng cần phân loại
        </div>

        {unclassifiedItems.length === 0 ? (
          <div className="text-center py-6 text-xs text-emerald-400 font-bold bg-emerald-950/5 border border-dashed border-emerald-900/40 rounded-xl">
            ✓ Đã phân loại hết tất cả đối tượng!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {unclassifiedItems.map((item) => {
              const isSelected = selectedItem === item;
              return (
                <div
                  key={item}
                  draggable={!isSubmitted}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => handleItemSelect(item)}
                  onKeyDown={(e) => handleKeyDownOnItem(e, item)}
                  tabIndex={isSubmitted ? -1 : 0}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all select-none cursor-grab active:cursor-grabbing ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/20 text-blue-200 ring-2 ring-blue-500 focus:outline-none'
                      : 'border-gray-700 bg-gray-900/50 text-gray-300 hover:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  }`}
                >
                  {item}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Keyboard Drawer / Helper Actions */}
      {selectedItem && (
        <div className="w-full p-4 bg-blue-950/20 border border-blue-900/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <span className="text-xs text-blue-300 font-medium">
            Phân loại <strong className="text-white">"{selectedItem}"</strong> vào đâu?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                updatePlacement(selectedItem, 'boundary');
                setSelectedItem(null);
              }}
              className="px-3 py-1.5 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-800 text-purple-200 text-[10px] font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              [1] Boundary
            </button>
            <button
              onClick={() => {
                updatePlacement(selectedItem, 'entity');
                setSelectedItem(null);
              }}
              className="px-3 py-1.5 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-800 text-emerald-200 text-[10px] font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              [2] Entity
            </button>
            <button
              onClick={() => {
                updatePlacement(selectedItem, 'control');
                setSelectedItem(null);
              }}
              className="px-3 py-1.5 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-800 text-amber-200 text-[10px] font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              [3] Control
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
