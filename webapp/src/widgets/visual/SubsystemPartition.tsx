import { useState } from 'react';

interface Link {
  from: string;
  to: string;
}

interface SubsystemPartitionProps {
  data: any;
  selectedAnswer: Record<string, string> | null;
  onAnswer: (value: Record<string, string>) => void;
  isSubmitted: boolean;
}

export default function SubsystemPartition({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: SubsystemPartitionProps) {
  const objects: string[] = data.visual.objects || [];
  const subsystems: string[] = data.visual.subsystems || [];
  const links: Link[] = data.visual.links || [];

  // Initialize assignment state (mapping: objectName -> subsystemName)
  const [assignments, setAssignments] = useState<Record<string, string>>(() => {
    return selectedAnswer || {};
  });

  const [selectedObj, setSelectedObj] = useState<string | null>(null);

  // Sync state back to parent player
  const updateAssignments = (newAssignments: Record<string, string>) => {
    setAssignments(newAssignments);
    onAnswer(newAssignments);
  };

  const handleAssign = (obj: string, subsystem: string | null) => {
    if (isSubmitted) return;
    const next = { ...assignments };
    if (subsystem === null) {
      delete next[obj];
    } else {
      next[obj] = subsystem;
    }
    updateAssignments(next);
    setSelectedObj(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, obj: string) => {
    if (isSubmitted) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', obj);
  };

  const handleDrop = (e: React.DragEvent, subsystem: string | null) => {
    e.preventDefault();
    const obj = e.dataTransfer.getData('text/plain');
    if (obj) {
      handleAssign(obj, subsystem);
    }
  };

  // Circular coordinates for coupling graph nodes
  const getNodeCoords = (idx: number, total: number) => {
    const angle = (idx * 2 * Math.PI) / total - Math.PI / 2;
    return {
      x: 200 + Math.cos(angle) * 110,
      y: 90 + Math.sin(angle) * 45,
    };
  };

  // Color coding based on subsystem
  const getSubsystemColor = (subsystem: string | undefined) => {
    if (!subsystem) return '#4b5563'; // Gray
    const idx = subsystems.indexOf(subsystem);
    if (idx === 0) return '#8b5cf6'; // Purple
    if (idx === 1) return '#eab308'; // Amber
    if (idx === 2) return '#10b981'; // Emerald
    return '#3b82f6'; // Blue
  };

  // Generate text alternative describing the coupling and partitioning
  const getTextAlternative = () => {
    const list = objects.map((obj) => {
      const sub = assignments[obj];
      return `${obj}: ${sub ? `phân hệ ${sub}` : 'chưa phân chia'}`;
    });
    return `Đồ thị liên kết đối tượng. Trạng thái phân chia hiện tại: ${list.join(', ')}.`;
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn select-none">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-all, .transition-colors, .animate-shake {
            transition: none !important;
            animation: none !important;
          }
          .animate-fadeIn {
            animation: none !important;
          }
        }
      `}</style>

      {/* Screen Reader Alternative */}
      <div className="sr-only" aria-live="polite">
        {getTextAlternative()}
      </div>

      <div className="text-center text-xs text-gray-400">
        💡 <span className="font-semibold text-gray-300">Mẹo:</span> Kéo thả các thẻ đối tượng hoặc click chọn rồi bấm số <span className="font-mono text-gray-300">1</span>, <span className="font-mono text-gray-300">2</span> để phân vào các cột phân hệ.
      </div>

      {/* 1. Dynamic Coupling Graph */}
      <div className="w-full p-4 bg-[#111214] border border-gray-800 rounded-3xl flex justify-center shadow-inner">
        <svg viewBox="0 0 400 180" className="w-full max-w-sm h-44 text-gray-200">
          {/* Draw coupling links */}
          {links.map((link, idx) => {
            const idx1 = objects.indexOf(link.from);
            const idx2 = objects.indexOf(link.to);
            if (idx1 === -1 || idx2 === -1) return null;
            const c1 = getNodeCoords(idx1, objects.length);
            const c2 = getNodeCoords(idx2, objects.length);
            return (
              <line
                key={idx}
                x1={c1.x}
                y1={c1.y}
                x2={c2.x}
                y2={c2.y}
                stroke="#374151"
                strokeWidth="2"
              />
            );
          })}

          {/* Draw nodes */}
          {objects.map((name, idx) => {
            const { x, y } = getNodeCoords(idx, objects.length);
            const assignedSub = assignments[name];
            const color = getSubsystemColor(assignedSub);
            const isSelected = selectedObj === name;

            return (
              <g key={name} className="cursor-pointer" onClick={() => !isSubmitted && setSelectedObj(isSelected ? null : name)}>
                <circle
                  cx={x}
                  cy={y}
                  r="18"
                  fill={color}
                  stroke={isSelected ? '#3b82f6' : '#1f2937'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="transition-colors duration-300"
                />
                <text
                  x={x}
                  y={y + 3}
                  fill="#ffffff"
                  fontSize="6.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {name.length > 9 ? name.substring(0, 7) + '..' : name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 2. Drag & Drop Columns Board */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {/* Left Column: Unassigned Source Pool */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, null)}
          onClick={() => selectedObj && handleAssign(selectedObj, null)}
          className="p-3 bg-[#0d0e12]/80 border border-gray-800/80 rounded-2xl min-h-[140px] flex flex-col gap-2 transition-all duration-200 hover:border-gray-700"
        >
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider text-center border-b border-gray-800 pb-1.5 mb-1">
            Chưa Phân Chia
          </div>
          {objects
            .filter((o) => !assignments[o])
            .map((obj) => (
              <div
                key={obj}
                draggable={!isSubmitted}
                onDragStart={(e) => handleDragStart(e, obj)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSubmitted) setSelectedObj(selectedObj === obj ? null : obj);
                }}
                tabIndex={isSubmitted ? -1 : 0}
                onKeyDown={(e) => {
                  if (isSubmitted) return;
                  const num = Number(e.key);
                  if (num >= 1 && num <= subsystems.length) {
                    handleAssign(obj, subsystems[num - 1]);
                  }
                }}
                className={`p-2 rounded-xl text-center text-xs font-semibold cursor-grab active:cursor-grabbing transition-all select-none border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  selectedObj === obj
                    ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                    : 'bg-gray-800/40 border-gray-700/60 text-gray-300 hover:border-gray-600'
                }`}
              >
                {obj}
              </div>
            ))}
        </div>

        {/* Subsystem Drop Destination Columns */}
        {subsystems.map((sub) => {
          const subColor = getSubsystemColor(sub);
          return (
            <div
              key={sub}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, sub)}
              onClick={() => selectedObj && handleAssign(selectedObj, sub)}
              className="p-3 bg-[#0d0e12]/80 border border-gray-800/80 rounded-2xl min-h-[140px] flex flex-col gap-2 transition-all duration-200 hover:border-gray-700"
            >
              <div
                style={{ color: subColor }}
                className="text-[10px] uppercase font-bold tracking-wider text-center border-b border-gray-800 pb-1.5 mb-1"
              >
                {sub}
              </div>
              {objects
                .filter((o) => assignments[o] === sub)
                .map((obj) => (
                  <div
                    key={obj}
                    draggable={!isSubmitted}
                    onDragStart={(e) => handleDragStart(e, obj)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSubmitted) setSelectedObj(selectedObj === obj ? null : obj);
                    }}
                    tabIndex={isSubmitted ? -1 : 0}
                    onKeyDown={(e) => {
                      if (isSubmitted) return;
                      if (e.key === 'Backspace' || e.key === '0') {
                        handleAssign(obj, null);
                      } else {
                        const num = Number(e.key);
                        if (num >= 1 && num <= subsystems.length) {
                          handleAssign(obj, subsystems[num - 1]);
                        }
                      }
                    }}
                    style={{ borderColor: `${subColor}40`, backgroundColor: `${subColor}10` }}
                    className={`p-2 rounded-xl text-center text-xs font-semibold cursor-grab active:cursor-grabbing transition-all select-none border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      selectedObj === obj
                        ? 'border-blue-500 bg-blue-600/10 text-white'
                        : 'text-gray-200'
                    }`}
                  >
                    {obj}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
