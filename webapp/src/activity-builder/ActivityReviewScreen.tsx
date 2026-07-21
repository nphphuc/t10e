import { useState } from 'react';
import type { ActivityDiagramState, ActivityNode } from './engine/types';
import type { ScoreResult } from './engine/scoring';
import ActivityEdge from './canvas/ActivityEdge';
import { nodeBox } from './canvas/layout';

const GROUP_LABELS: Record<ScoreResult['groups'][number]['key'], string> = {
  actionSet: 'Tập hành động',
  mainSequence: 'Thứ tự luồng chính',
  decisionsGuards: 'Decision + guard',
  forkJoinReachability: 'Fork/join + initial/final',
  noForbidden: 'Không thừa phần tử cấm',
};

function ReadOnlyNode({ node, highlighted, onSelect }: { node: ActivityNode; highlighted: boolean; onSelect: (key: string) => void }) {
  const box = nodeBox(node.type);
  const strokeColor = highlighted ? '#EF4444' : '#8B5CF6';
  const label = node.name ?? node.type;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      role="button"
      tabIndex={0}
      aria-label={`Reference ${label}`}
      style={{ cursor: node.name ? 'pointer' : 'default' }}
      onClick={() => node.name && onSelect(node.name)}
      onKeyDown={(e) => {
        if (node.name && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(node.name);
        }
      }}
    >
      {node.type === 'initial' && <circle cx={box.width / 2} cy={box.height / 2} r={box.width / 2} fill={strokeColor} />}
      {node.type === 'final' && (
        <>
          <circle cx={box.width / 2} cy={box.height / 2} r={box.width / 2 - 1} fill="none" stroke={strokeColor} strokeWidth={1.5} />
          <circle cx={box.width / 2} cy={box.height / 2} r={box.width / 2 - 6} fill={strokeColor} />
        </>
      )}
      {(node.type === 'decision' || node.type === 'merge') && (
        <polygon
          points={`${box.width / 2},0 ${box.width},${box.height / 2} ${box.width / 2},${box.height} 0,${box.height / 2}`}
          fill="rgba(139,92,246,0.08)"
          stroke={strokeColor}
          strokeWidth={highlighted ? 2.5 : 1.5}
        />
      )}
      {(node.type === 'fork' || node.type === 'join') && (
        <rect width={box.width} height={box.height} rx={2} fill={strokeColor} />
      )}
      {node.type === 'action' && (
        <>
          <rect width={box.width} height={box.height} rx={16} fill="rgba(139,92,246,0.08)" stroke={strokeColor} strokeWidth={highlighted ? 2.5 : 1.5} />
          <text x={box.width / 2} y={box.height / 2 + 4} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#c4b5fd">
            {node.name}
          </text>
        </>
      )}
    </g>
  );
}

function ReadOnlyDiagram({
  diagram,
  title,
  highlightName,
  onSelectName,
}: {
  diagram: ActivityDiagramState;
  title: string;
  highlightName: string | null;
  onSelectName: (name: string) => void;
}) {
  const nodesById = new Map(diagram.nodes.map((n) => [n.id, n]));
  const maxX = Math.max(400, ...diagram.nodes.map((n) => n.x + nodeBox(n.type).width + 40));
  const maxY = Math.max(300, ...diagram.nodes.map((n) => n.y + nodeBox(n.type).height + 40));

  return (
    <div className="flex-1 min-w-0">
      <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">{title}</div>
      <div className="w-full h-[460px] bg-[#090a0c]/60 border border-gray-800 rounded-2xl overflow-auto">
        <svg width={maxX} height={maxY} viewBox={`0 0 ${maxX} ${maxY}`}>
          {diagram.edges.map((edge) => {
            const fromNode = nodesById.get(edge.from);
            const toNode = nodesById.get(edge.to);
            if (!fromNode || !toNode) return null;
            const edgeHighlighted =
              highlightName !== null && (fromNode.name === highlightName || toNode.name === highlightName);
            return (
              <ActivityEdge
                key={edge.id}
                edge={edge}
                fromNode={fromNode}
                toNode={toNode}
                selected={false}
                highlighted={edgeHighlighted}
                onSelect={() => {}}
              />
            );
          })}
          {diagram.nodes.map((node) => (
            <ReadOnlyNode key={node.id} node={node} highlighted={highlightName !== null && highlightName === node.name} onSelect={onSelectName} />
          ))}
        </svg>
      </div>
    </div>
  );
}

interface ActivityReviewScreenProps {
  userDiagram: ActivityDiagramState;
  referenceDiagram: ActivityDiagramState;
  // Present for PE's 'review' step (numeric rubric); absent for Guided's 'compare' step,
  // which reuses this same side-by-side visual without a score.
  score?: ScoreResult;
  passThreshold?: number;
}

export default function ActivityReviewScreen({ userDiagram, referenceDiagram, score, passThreshold }: ActivityReviewScreenProps) {
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
                <span className="w-36 text-gray-400 flex-shrink-0">{GROUP_LABELS[g.key]}</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${Math.round(g.ratio * 100)}%` }} />
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
        <ReadOnlyDiagram diagram={userDiagram} title="Bài làm của bạn" highlightName={highlightName} onSelectName={setHighlightName} />
        <ReadOnlyDiagram diagram={referenceDiagram} title="Bản tham chiếu" highlightName={highlightName} onSelectName={setHighlightName} />
      </div>
    </div>
  );
}
