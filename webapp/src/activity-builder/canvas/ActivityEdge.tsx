import type { ActivityEdge as ActivityEdgeModel, ActivityNode } from '../engine/types';
import { nodeBox, nodeCenter } from './layout';

interface ActivityEdgeProps {
  edge: ActivityEdgeModel;
  fromNode: ActivityNode;
  toNode: ActivityNode;
  selected: boolean;
  highlighted: boolean;
  onSelect: (id: string) => void;
}

// Where a line from `center` toward `target` crosses the border of the axis-aligned
// bounding box centered at `center` — so edges visually touch the node frame instead
// of piercing through to its center/label. Used as a consistent approximation for
// every node shape (rect/diamond/circle/bar), not just rectangles.
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

export default function ActivityEdge({ edge, fromNode, toNode, selected, highlighted, onSelect }: ActivityEdgeProps) {
  const fromCenter = nodeCenter(fromNode.x, fromNode.y, fromNode.type);
  const toCenter = nodeCenter(toNode.x, toNode.y, toNode.type);
  const fromBox = nodeBox(fromNode.type);
  const toBox = nodeBox(toNode.type);

  const from = clipToBoxBorder(fromCenter, toCenter, fromBox.width / 2, fromBox.height / 2);
  const to = clipToBoxBorder(toCenter, fromCenter, toBox.width / 2, toBox.height / 2);
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  const strokeColor = highlighted ? '#EF4444' : selected ? '#F59E0B' : '#6b7280';
  const arrowSize = 9;
  const arrowP1 = {
    x: to.x - Math.cos(angle - 0.5) * arrowSize,
    y: to.y - Math.sin(angle - 0.5) * arrowSize,
  };
  const arrowP2 = {
    x: to.x - Math.cos(angle + 0.5) * arrowSize,
    y: to.y - Math.sin(angle + 0.5) * arrowSize,
  };

  // Offset both along the line (so it doesn't sit right on the source node's
  // border) and perpendicular to it (so it doesn't sit directly on the line
  // itself, which tends to overlap a nearby node on short decision->merge hops).
  const labelAlong = 22;
  const labelSide = 12;
  const guardLabelPos = {
    x: from.x + Math.cos(angle) * labelAlong - Math.sin(angle) * labelSide,
    y: from.y + Math.sin(angle) * labelAlong + Math.cos(angle) * labelSide,
  };

  const nodeLabel = (n: ActivityNode) => n.name ?? n.type;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Luồng từ ${nodeLabel(fromNode)} tới ${nodeLabel(toNode)}${edge.guard ? `, điều kiện ${edge.guard}` : ''}`}
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
      />
      <polygon points={`${to.x},${to.y} ${arrowP1.x},${arrowP1.y} ${arrowP2.x},${arrowP2.y}`} fill={strokeColor} />
      {edge.guard && (
        <text x={guardLabelPos.x} y={guardLabelPos.y} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#fbbf24">
          [{edge.guard}]
        </text>
      )}
    </g>
  );
}
