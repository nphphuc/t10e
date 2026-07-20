import { useState } from 'react';
import type { DiagramNode, DiagramState } from './engine/types';
import type { ScoreResult } from './engine/scoring';
import CanvasEdge from './canvas/CanvasEdge';
import { NODE_WIDTH, nodeHeight, NODE_HEADER_HEIGHT, NODE_ATTR_ROW_HEIGHT } from './canvas/layout';

const GROUP_LABELS: Record<ScoreResult['groups'][number]['key'], string> = {
  classes: 'Tập class',
  attributes: 'Attribute đúng class',
  associations: 'Tập association',
  multiplicity: 'Multiplicity',
  edgeTypes: 'Loại quan hệ',
  associationClass: 'Association class',
};

function ReadOnlyNode({ node, highlighted, onSelect }: { node: DiagramNode; highlighted: boolean; onSelect: (name: string) => void }) {
  const height = nodeHeight(node.attributes.length);
  const isAssociationClass = node.type === 'associationClass';
  const strokeColor = highlighted ? '#EF4444' : '#8B5CF6';
  const fillColor = isAssociationClass ? 'rgba(16,185,129,0.08)' : 'rgba(139,92,246,0.08)';

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      role="button"
      tabIndex={0}
      aria-label={`Reference class ${node.name}`}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelect(node.name)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(node.name);
        }
      }}
    >
      <rect
        width={NODE_WIDTH}
        height={height}
        rx={8}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={highlighted ? 2.5 : 1.5}
        strokeDasharray={isAssociationClass ? '5 3' : undefined}
      />
      <text x={NODE_WIDTH / 2} y={19} textAnchor="middle" fontSize={12} fontWeight="bold" fill={isAssociationClass ? '#34d399' : '#c4b5fd'}>
        {node.name}
      </text>
      <line x1={0} y1={NODE_HEADER_HEIGHT - 4} x2={NODE_WIDTH} y2={NODE_HEADER_HEIGHT - 4} stroke={strokeColor} strokeWidth={1} opacity={0.6} />
      {node.attributes.map((attr, idx) => (
        <text
          key={attr.id}
          x={10}
          y={NODE_HEADER_HEIGHT + idx * NODE_ATTR_ROW_HEIGHT + 13}
          fontSize={10}
          fontFamily="monospace"
          fill="#cbd5e1"
        >
          - {attr.name}
        </text>
      ))}
    </g>
  );
}

function ReadOnlyDiagram({
  diagram,
  title,
  highlightName,
  onSelectName,
}: {
  diagram: DiagramState;
  title: string;
  highlightName: string | null;
  onSelectName: (name: string) => void;
}) {
  const nodesById = new Map(diagram.nodes.map((n) => [n.id, n]));
  const maxX = Math.max(400, ...diagram.nodes.map((n) => n.x + NODE_WIDTH + 40));
  const maxY = Math.max(300, ...diagram.nodes.map((n) => n.y + nodeHeight(n.attributes.length) + 40));

  return (
    <div className="flex-1 min-w-0">
      <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">{title}</div>
      <div className="w-full h-[420px] bg-[#090a0c]/60 border border-gray-800 rounded-2xl overflow-auto">
        <svg width={maxX} height={maxY} viewBox={`0 0 ${maxX} ${maxY}`}>
          {diagram.edges.map((edge) => {
            const fromNode = nodesById.get(edge.from);
            const toNode = nodesById.get(edge.to);
            if (!fromNode || !toNode) return null;
            const attachedNode = edge.attachedClassId ? nodesById.get(edge.attachedClassId) : undefined;
            const edgeHighlighted =
              highlightName !== null && (fromNode.name === highlightName || toNode.name === highlightName);
            return (
              <CanvasEdge
                key={edge.id}
                edge={edge}
                fromNode={fromNode}
                toNode={toNode}
                attachedNode={attachedNode}
                selected={false}
                highlighted={edgeHighlighted}
                onSelect={() => {}}
              />
            );
          })}
          {diagram.nodes.map((node) => (
            <ReadOnlyNode key={node.id} node={node} highlighted={highlightName === node.name} onSelect={onSelectName} />
          ))}
        </svg>
      </div>
    </div>
  );
}

interface ReviewScreenProps {
  userDiagram: DiagramState;
  referenceDiagram: DiagramState;
  // Present for PE's 'review' step (numeric rubric); absent for Guided's 'compare' step,
  // which reuses this same side-by-side visual without a score (§5.2 vs §5.3 of the handoff).
  score?: ScoreResult;
  passThreshold?: number;
}

export default function ReviewScreen({ userDiagram, referenceDiagram, score, passThreshold }: ReviewScreenProps) {
  const [highlightName, setHighlightName] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {score && (
        <div
          className={`p-4 rounded-2xl border ${
            score.passed ? 'border-success/40 bg-success/5' : 'border-control/40 bg-control/5'
          }`}
        >
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-extrabold ${score.passed ? 'text-emerald-300' : 'text-amber-300'}`}>
              {Math.round(score.total)}%
            </span>
            <span className="text-xs font-bold text-gray-400">Ngưỡng đạt: {passThreshold}%</span>
          </div>
          <div className="mt-3 space-y-1.5">
            {score.groups.map((g) => (
              <div key={g.key} className="flex items-center gap-2 text-[11px]">
                <span className="w-32 text-gray-400 flex-shrink-0">{GROUP_LABELS[g.key]}</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.round(g.ratio * 100)}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-500">{Math.round(g.ratio * 100)}%</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-gray-500 italic">
            Máy chấm là gợi ý, không phải phán quyết — đối chiếu bản tham chiếu bên dưới và tự sửa nếu cần.
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <ReadOnlyDiagram
          diagram={userDiagram}
          title="Bài làm của bạn"
          highlightName={highlightName}
          onSelectName={setHighlightName}
        />
        <ReadOnlyDiagram
          diagram={referenceDiagram}
          title="Bản tham chiếu"
          highlightName={highlightName}
          onSelectName={setHighlightName}
        />
      </div>
    </div>
  );
}
