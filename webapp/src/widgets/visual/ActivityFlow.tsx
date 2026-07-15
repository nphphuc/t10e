import { useState, useEffect } from 'react';

interface ActivityNode {
  id: string;
  type: 'initial' | 'action' | 'decision' | 'final';
  label: string;
  guard?: string; // e.g. "[Yes]" or "[No]"
}

interface ActivityFlowProps {
  data: any;
  selectedAnswer: string[] | null;
  onAnswer: (value: string[]) => void;
  isSubmitted: boolean;
}

export default function ActivityFlow({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: ActivityFlowProps) {
  const nodes: ActivityNode[] = data.visual.nodes;
  const correctOrder: string[] = data.visual.correctOrder;

  // Initialize and stabilize order state
  const [order, setOrder] = useState<string[]>(() => {
    if (selectedAnswer && selectedAnswer.length === nodes.length) {
      return selectedAnswer;
    }
    const ids = nodes.map((n) => n.id);
    let shuffled = [...ids];
    
    // Stable shuffle that is guaranteed not to match correctOrder on start
    let attempts = 0;
    const isSame = (a: string[], b: string[]) =>
      a.length === b.length && a.every((v, i) => v === b[i]);
    
    while (isSame(shuffled, correctOrder) && attempts < 20) {
      shuffled = [...shuffled].sort(() => Math.random() - 0.5);
      attempts++;
    }
    return shuffled;
  });

  // Sync state back to player if not set yet
  useEffect(() => {
    if (!selectedAnswer) {
      onAnswer(order);
    }
  }, [order, selectedAnswer, onAnswer]);

  const [draggedId, setDraggedId] = useState<string | null>(null);

  const moveNode = (fromIdx: number, toIdx: number) => {
    if (isSubmitted) return;
    const newOrder = [...order];
    const [moved] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, moved);
    setOrder(newOrder);
    onAnswer(newOrder);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (isSubmitted) {
      e.preventDefault();
      return;
    }
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const sourceIndex = order.indexOf(id);
    if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
      moveNode(sourceIndex, targetIndex);
    }
    setDraggedId(null);
  };

  // Generate text alternative describing the current flow order
  const getTextAlternative = () => {
    const flowNames = order.map((id) => {
      const node = nodes.find((n) => n.id === id);
      if (!node) return '';
      if (node.type === 'initial') return 'Bắt đầu';
      if (node.type === 'final') return 'Kết thúc';
      if (node.type === 'decision') return `Quyết định: ${node.label}${node.guard ? ` (${node.guard})` : ''}`;
      return `Hành động: ${node.label}`;
    });
    return `Sơ đồ hoạt động hiện tại: ${flowNames.join(' ➔ ')}.`;
  };

  return (
    <div className="space-y-6 select-none">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-all, .animate-bounce, .duration-200, .duration-300 {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      {/* Screen Reader Text Alternative */}
      <div className="sr-only" aria-live="polite">
        {getTextAlternative()}
      </div>

      <div className="text-center text-xs text-gray-400">
        💡 <span className="font-semibold text-gray-300">Mẹo:</span> Kéo thả các bước hoặc dùng các nút mũi tên <span className="font-mono text-gray-300">▲ ▼</span> để sắp xếp sơ đồ hoạt động theo đúng logic nghiệp vụ.
      </div>

      {/* Flow Assembly Board */}
      <div className="flex flex-col items-center gap-2 max-w-md mx-auto p-6 bg-[#090a0c]/60 border border-gray-800 rounded-3xl">
        {order.map((id, index) => {
          const node = nodes.find((n) => n.id === id);
          if (!node) return null;

          const isCorrectPos = isSubmitted && correctOrder[index] === id;

          return (
            <div
              key={node.id}
              className="w-full flex flex-col items-center"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {/* Node Card Container */}
              <div
                draggable={!isSubmitted}
                onDragStart={(e) => handleDragStart(e, node.id)}
                className={`relative flex items-center justify-between w-full p-3 rounded-2xl border-2 transition-all duration-200 bg-[#111214] ${
                  isSubmitted
                    ? isCorrectPos
                      ? 'border-emerald-500/80 bg-emerald-950/10'
                      : 'border-red-500/80 bg-red-950/10'
                    : draggedId === node.id
                    ? 'opacity-40 border-indigo-500 scale-[0.98]'
                    : 'border-gray-800 hover:border-gray-700 cursor-grab active:cursor-grabbing hover:scale-[1.01] focus-within:ring-2 focus-within:ring-blue-500'
                }`}
              >
                {/* Visual Icon compartment */}
                <div className="flex items-center gap-3">
                  {node.type === 'initial' && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-800 border border-gray-700">
                      <div className="w-3.5 h-3.5 bg-gray-200 rounded-full" />
                    </div>
                  )}
                  {node.type === 'final' && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-800 border border-gray-700">
                      <div className="relative w-4 h-4 rounded-full border-2 border-gray-200 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  )}
                  {node.type === 'action' && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#2e1065] border border-[#7c3aed] text-purple-300 text-xs font-bold shadow-inner">
                      [ ]
                    </div>
                  )}
                  {node.type === 'decision' && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#451a03] border border-[#f59e0b] text-amber-300 text-xs font-bold shadow-inner">
                      &lt;&gt;
                    </div>
                  )}

                  {/* Node Label Compartment */}
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block">
                      {node.type === 'initial' && 'Initial Node'}
                      {node.type === 'final' && 'Final Node'}
                      {node.type === 'action' && 'Action State'}
                      {node.type === 'decision' && 'Decision Node'}
                    </span>
                    <span className="text-xs font-bold text-gray-200 leading-snug">
                      {node.label}
                    </span>
                  </div>
                </div>

                {/* Keyboard Accessibility Controller & Status */}
                <div className="flex items-center gap-1.5">
                  {!isSubmitted && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveNode(index, index - 1)}
                        disabled={index === 0}
                        aria-label={`Di chuyển bước ${node.label} lên trên`}
                        className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/80 disabled:opacity-30 disabled:hover:bg-transparent transition-all focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveNode(index, index + 1)}
                        disabled={index === order.length - 1}
                        aria-label={`Di chuyển bước ${node.label} xuống dưới`}
                        className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/80 disabled:opacity-30 disabled:hover:bg-transparent transition-all focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        ▼
                      </button>
                    </div>
                  )}

                  {/* Right/Wrong Marker */}
                  {isSubmitted && (
                    <span className="text-sm font-bold ml-1">
                      {isCorrectPos ? (
                        <span className="text-emerald-500" title="Đúng vị trí">✓</span>
                      ) : (
                        <span className="text-red-500" title="Sai vị trí">✗</span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector Arrow Down */}
              {index < order.length - 1 && (
                <div className="my-1.5 flex flex-col items-center relative w-full h-8 justify-center">
                  <svg className="w-4 h-full text-gray-600" viewBox="0 0 20 40" fill="none">
                    <line x1="10" y1="0" x2="10" y2="35" stroke="currentColor" strokeWidth="2" />
                    <polygon points="10,40 6,32 14,32" fill="currentColor" />
                  </svg>
                  {/* If the current node is a decision node, render the guard value on the arrow */}
                  {node.type === 'decision' && node.guard && (
                    <span className="absolute left-[calc(50%+12px)] bg-gray-900 border border-amber-950/60 text-amber-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wide">
                      {node.guard}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
