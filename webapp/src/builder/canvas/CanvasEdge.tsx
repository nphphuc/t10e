import type { DiagramEdge, DiagramNode } from '../engine/types';
import { nodeCenter, nodeHeight, NODE_WIDTH } from './layout';

// Where a line from `center` toward `target` crosses the border of the axis-aligned
// box centered at `center` — so edges visually touch the box frame instead of
// piercing through to the class name in the middle of it.
function clipToBoxBorder(
  center: { cx: number; cy: number },
  target: { cx: number; cy: number },
  halfWidth: number,
  halfHeight: number
): { x: number; y: number } {
  const dx = target.cx - center.cx;
  const dy = target.cy - center.cy;
  if (dx === 0 && dy === 0) return { x: center.cx, y: center.cy };
  const scaleX = dx !== 0 ? halfWidth / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? halfHeight / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY, 1);
  return { x: center.cx + dx * scale, y: center.cy + dy * scale };
}

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
  const fromCenter = nodeCenter(fromNode.x, fromNode.y, fromNode.attributes.length);
  const toCenter = nodeCenter(toNode.x, toNode.y, toNode.attributes.length);
  const fromHalfHeight = nodeHeight(fromNode.attributes.length) / 2;
  const toHalfHeight = nodeHeight(toNode.attributes.length) / 2;

  // Clip the center-to-center line to each box's border so it visually touches the
  // frame instead of piercing through to the class name in the middle.
  const from = clipToBoxBorder(fromCenter, toCenter, NODE_WIDTH / 2, fromHalfHeight);
  const to = clipToBoxBorder(toCenter, fromCenter, NODE_WIDTH / 2, toHalfHeight);
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  const strokeColor = highlighted ? '#EF4444' : selected ? '#F59E0B' : '#6b7280';
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  const labelOffset = 14;
  const fromLabelPos = {
    x: from.x + Math.cos(angle) * labelOffset,
    y: from.y + Math.sin(angle) * labelOffset - 4,
  };
  const toLabelPos = {
    x: to.x - Math.cos(angle) * labelOffset,
    y: to.y - Math.sin(angle) * labelOffset - 4,
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
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={strokeColor}
        strokeWidth={selected || highlighted ? 2.5 : 1.5}
        strokeDasharray={edge.type === 'generalization' ? undefined : undefined}
      />

      {edge.type === 'generalization' && (
        <polygon
          points={`${to.x - Math.cos(angle) * 14 + Math.sin(angle) * 7},${to.y - Math.sin(angle) * 14 - Math.cos(angle) * 7} ${to.x - Math.cos(angle) * 14 - Math.sin(angle) * 7},${to.y - Math.sin(angle) * 14 + Math.cos(angle) * 7} ${to.x},${to.y}`}
          fill="#0c0d0e"
          stroke={strokeColor}
          strokeWidth={1.5}
        />
      )}

      {(edge.type === 'composition' || edge.type === 'aggregation') && (
        <polygon
          points={diamondPoints(from.x + Math.cos(angle) * 10, from.y + Math.sin(angle) * 10, angle)}
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
