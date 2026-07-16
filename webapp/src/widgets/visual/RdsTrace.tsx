import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

interface RdsTraceProps {
  data: any;
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

interface Node {
  id: number;
  label: string;
  layer: 'req' | 'analysis' | 'design';
  x: number;
  y: number;
}

export default function RdsTrace({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: RdsTraceProps) {
  const nodes: Node[] = [
    // Requirement layer
    { id: 0, label: "REQ-1 (Đặt món)", layer: 'req', x: 70, y: 30 },
    { id: 1, label: "REQ-2 (Thanh toán)", layer: 'req', x: 230, y: 30 },
    // Analysis layer
    { id: 2, label: "UC-1 (Place Order UC)", layer: 'analysis', x: 70, y: 85 },
    { id: 3, label: "UC-2 (Pay Bill UC)", layer: 'analysis', x: 230, y: 85 },
    // Design layer
    { id: 4, label: "Subsystem: Order Mgmt", layer: 'design', x: 70, y: 140 },
    { id: 5, label: "Subsystem: Billing Mgmt", layer: 'design', x: 230, y: 140 },
  ];

  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);

  const handleToggleNode = (nodeId: number) => {
    if (isSubmitted) return;
    
    let next;
    if (selectedNodes.includes(nodeId)) {
      next = selectedNodes.filter(id => id !== nodeId);
    } else {
      next = [...selectedNodes, nodeId];
    }
    setSelectedNodes(next);

    // If student selected [0, 2, 4] (REQ-1 -> UC-1 -> Order Mgmt), match correct option index 1
    if (next.includes(0) && next.includes(2) && next.includes(4)) {
      onAnswer(1);
    } else {
      onAnswer(null);
    }
  };

  // Determine lines to draw between selected nodes in adjacent layers
  const getSelectedLines = () => {
    const lines: Array<{ from: Node; to: Node }> = [];
    
    // Req -> Analysis
    const reqSelected = nodes.filter(n => n.layer === 'req' && selectedNodes.includes(n.id));
    const analysisSelected = nodes.filter(n => n.layer === 'analysis' && selectedNodes.includes(n.id));
    const designSelected = nodes.filter(n => n.layer === 'design' && selectedNodes.includes(n.id));

    reqSelected.forEach(r => {
      analysisSelected.forEach(a => {
        // Draw line if correct mapping (0-2 or 1-3)
        if ((r.id === 0 && a.id === 2) || (r.id === 1 && a.id === 3)) {
          lines.push({ from: r, to: a });
        }
      });
    });

    analysisSelected.forEach(a => {
      designSelected.forEach(d => {
        // Draw line if correct mapping (2-4 or 3-5)
        if ((a.id === 2 && d.id === 4) || (a.id === 3 && d.id === 5)) {
          lines.push({ from: a, to: d });
        }
      });
    });

    return lines;
  };

  const activeLines = getSelectedLines();

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
        Sơ đồ Traceability liên kết Requirement ➔ Analysis ➔ Design.
        Các node đã chọn: {selectedNodes.map(id => nodes.find(n => n.id === id)?.label).join(', ') || 'Chưa chọn node nào'}.
      </div>

      {/* 1. Traceability graph visual */}
      <div className="w-full p-4 bg-[#111214] border border-gray-800 rounded-3xl flex justify-center shadow-inner relative">
        <svg viewBox="0 0 300 170" className="w-full max-w-sm h-48 text-gray-200">
          {/* Static gray connection background lines */}
          <line x1="70" y1="30" x2="70" y2="85" stroke="#1f2937" strokeWidth="1" />
          <line x1="230" y1="30" x2="230" y2="85" stroke="#1f2937" strokeWidth="1" />
          <line x1="70" y1="85" x2="70" y2="140" stroke="#1f2937" strokeWidth="1" />
          <line x1="230" y1="85" x2="230" y2="140" stroke="#1f2937" strokeWidth="1" />

          {/* Dynamic Active highlighted lines */}
          {activeLines.map((line, idx) => (
            <line
              key={idx}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
              stroke="#8b5cf6"
              strokeWidth="2.5"
              className="transition-all duration-300"
            />
          ))}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodes.includes(node.id);
            const isTargetNode = node.id === 0 || node.id === 2 || node.id === 4; // correct path
            
            return (
              <g
                key={node.id}
                onClick={() => handleToggleNode(node.id)}
                className="cursor-pointer group"
              >
                {/* Node Box */}
                <rect
                  x={node.x - 55}
                  y={node.y - 12}
                  width="110"
                  height="24"
                  rx="6"
                  fill={isSelected ? '#1e1b4b' : '#0d0e12'}
                  stroke={isSelected ? '#8b5cf6' : isTargetNode ? '#4b5563' : '#374151'}
                  strokeWidth={isSelected ? '1.8' : '1'}
                  className="transition-colors duration-200"
                />
                
                {/* Text Label */}
                <text
                  x={node.x}
                  y={node.y + 3}
                  fill={isSelected ? '#c084fc' : '#94a3b8'}
                  fontSize="7.5"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="transition-colors duration-200"
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* Layer Headers */}
          <text x="5" y="33" fill="#6b7280" fontSize="7" fontWeight="bold">REQ</text>
          <text x="5" y="88" fill="#6b7280" fontSize="7" fontWeight="bold">ANALYSIS</text>
          <text x="5" y="143" fill="#6b7280" fontSize="7" fontWeight="bold">DESIGN</text>
        </svg>
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
