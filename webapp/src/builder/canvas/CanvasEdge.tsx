import type { DiagramEdge, DiagramNode } from '../engine/types';
import { nodeCenter, NODE_WIDTH } from './layout';

interface CanvasEdgeProps {
  edge: DiagramEdge;
  fromNode: DiagramNode;
  toNode: DiagramNode;
  attachedNode?: DiagramNode;
  selected: boolean;
  highlighted: boolean;
  onSelect: (id: string) => void;
}

function diamondPoints(cx: number, cy: number, angle: number, size = 8): string {
  const pts = [
    [cx + Math.cos(angle) * size, cy + Math.sin(angle) * size],
    [cx + Math.cos(angle + 2.4) * size * 0.55, cy + Math.sin(angle + 2.4) * size * 0.55],
    [cx - Math.cos(angle) * size, cy - Math.sin(angle) * size],
    [cx + Math.cos(angle - 2.4) * size * 0.55, cy + Math.sin(angle - 2.4) * size * 0.55],
  ];
  return pts.map((p) => p.join(',')).join(' ');
}

export default function CanvasEdge({ edge, fromNode, toNode, attachedNode, selected, highlighted, onSelect }: CanvasEdgeProps) {
  const from = nodeCenter(fromNode.x, fromNode.y, fromNode.attributes.length);
  const to = nodeCenter(toNode.x, toNode.y, toNode.attributes.length);
  const angle = Math.atan2(to.cy - from.cy, to.cx - from.cx);

  const strokeColor = highlighted ? '#EF4444' : selected ? '#F59E0B' : '#6b7280';
  const midX = (from.cx + to.cx) / 2;
  const midY = (from.cy + to.cy) / 2;

  const labelOffset = 14;
  const fromLabelPos = {
    x: from.cx + Math.cos(angle) * labelOffset,
    y: from.cy + Math.sin(angle) * labelOffset - 4,
  };
  const toLabelPos = {
    x: to.cx - Math.cos(angle) * labelOffset,
    y: to.cy - Math.sin(angle) * labelOffset - 4,
  };

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Relationship ${edge.type} from ${fromNode.name} to ${toNode.name}${edge.name ? `, named ${edge.name}` : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(edge.id);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(edge.id);
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <line
        x1={from.cx}
        y1={from.cy}
        x2={to.cx}
        y2={to.cy}
        stroke={strokeColor}
        strokeWidth={selected || highlighted ? 2.5 : 1.5}
        strokeDasharray={edge.type === 'generalization' ? undefined : undefined}
      />

      {edge.type === 'generalization' && (
        <polygon
          points={`${to.cx - Math.cos(angle) * 14 + Math.sin(angle) * 7},${to.cy - Math.sin(angle) * 14 - Math.cos(angle) * 7} ${to.cx - Math.cos(angle) * 14 - Math.sin(angle) * 7},${to.cy - Math.sin(angle) * 14 + Math.cos(angle) * 7} ${to.cx},${to.cy}`}
          fill="#0c0d0e"
          stroke={strokeColor}
          strokeWidth={1.5}
        />
      )}

      {(edge.type === 'composition' || edge.type === 'aggregation') && (
        <polygon
          points={diamondPoints(from.cx + Math.cos(angle) * 10, from.cy + Math.sin(angle) * 10, angle)}
          fill={edge.type === 'composition' ? strokeColor : '#0c0d0e'}
          stroke={strokeColor}
          strokeWidth={1.5}
        />
      )}

      {edge.name && (
        <text x={midX} y={midY - 8} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#94a3b8">
          {edge.name}
        </text>
      )}

      {edge.multiplicity && (
        <>
          <text x={fromLabelPos.x} y={fromLabelPos.y} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#fbbf24">
            {edge.multiplicity.from}
          </text>
          <text x={toLabelPos.x} y={toLabelPos.y} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#fbbf24">
            {edge.multiplicity.to}
          </text>
        </>
      )}

      {attachedNode && (
        <line
          x1={midX}
          y1={midY}
          x2={attachedNode.x + NODE_WIDTH / 2}
          y2={attachedNode.y}
          stroke="#64748b"
          strokeWidth={1.25}
          strokeDasharray="4 4"
        />
      )}
    </g>
  );
}
