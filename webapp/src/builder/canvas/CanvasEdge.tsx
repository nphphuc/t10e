import type { DiagramEdge, DiagramNode } from '../engine/types';

interface CanvasEdgeProps {
  edge: DiagramEdge;
  from: DiagramNode;
  to: DiagramNode;
  fromSize?: NodeSize;
  toSize?: NodeSize;
  selected: boolean;
  readOnly?: boolean;
  compact?: boolean;
  onSelect: () => void;
}

export interface NodeSize {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

interface NodeRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  center: Point;
  size: NodeSize;
}

function boundaryPoint(origin: Point, target: Point, size: NodeSize): Point {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  if (dx === 0 && dy === 0) return origin;

  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;
  const tx = dx === 0 ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(dx);
  const ty = dy === 0 ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(dy);
  const scale = Math.min(tx, ty);
  return { x: origin.x + dx * scale, y: origin.y + dy * scale };
}

function toNodeRect(node: DiagramNode, size: NodeSize): NodeRect {
  return {
    left: node.x,
    right: node.x + size.width,
    top: node.y,
    bottom: node.y + size.height,
    center: { x: node.x + size.width / 2, y: node.y + size.height / 2 },
    size,
  };
}

function edgeAnchors(fromRect: NodeRect, toRect: NodeRect): { from: Point; to: Point } {
  const gap = 0;
  const overlapTop = Math.max(fromRect.top, toRect.top);
  const overlapBottom = Math.min(fromRect.bottom, toRect.bottom);
  const overlapLeft = Math.max(fromRect.left, toRect.left);
  const overlapRight = Math.min(fromRect.right, toRect.right);
  const horizontallySeparated = fromRect.right <= toRect.left || toRect.right <= fromRect.left;
  const verticallySeparated = fromRect.bottom <= toRect.top || toRect.bottom <= fromRect.top;

  // Cards on the same row should have a perfectly horizontal UML edge even
  // when their attribute counts make their heights slightly different.
  if (horizontallySeparated && overlapTop < overlapBottom) {
    const y = (overlapTop + overlapBottom) / 2;
    if (fromRect.center.x < toRect.center.x) {
      return { from: { x: fromRect.right + gap, y }, to: { x: toRect.left - gap, y } };
    }
    return { from: { x: fromRect.left - gap, y }, to: { x: toRect.right + gap, y } };
  }

  // Apply the equivalent rule for cards arranged in one column.
  if (verticallySeparated && overlapLeft < overlapRight) {
    const x = (overlapLeft + overlapRight) / 2;
    if (fromRect.center.y < toRect.center.y) {
      return { from: { x, y: fromRect.bottom + gap }, to: { x, y: toRect.top - gap } };
    }
    return { from: { x, y: fromRect.top - gap }, to: { x, y: toRect.bottom + gap } };
  }

  return {
    from: boundaryPoint(fromRect.center, toRect.center, fromRect.size),
    to: boundaryPoint(toRect.center, fromRect.center, toRect.size),
  };
}

export default function CanvasEdge({ edge, from, to, fromSize, toSize, selected, compact, onSelect }: CanvasEdgeProps) {
  const fallbackSize = compact ? { width: 112, height: 82 } : { width: 210, height: 132 };
  const resolvedFromSize = fromSize ?? fallbackSize;
  const resolvedToSize = toSize ?? fallbackSize;
  const anchors = edgeAnchors(toNodeRect(from, resolvedFromSize), toNodeRect(to, resolvedToSize));
  const fromAnchor = anchors.from;
  const toAnchor = anchors.to;
  const x1 = fromAnchor.x;
  const y1 = fromAnchor.y;
  const x2 = toAnchor.x;
  const y2 = toAnchor.y;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const edgeLength = Math.max(1, Math.hypot(x2 - x1, y2 - y1));
  const unitX = (x2 - x1) / edgeLength;
  const unitY = (y2 - y1) / edgeLength;
  const normalX = -unitY;
  const normalY = unitX;
  const nameX = midX - normalX * 10;
  const nameY = midY - normalY * 10;
  const fromLabelX = x1 + unitX * 14 + normalX * 15;
  const fromLabelY = y1 + unitY * 14 + normalY * 15;
  const toLabelX = x2 - unitX * 14 + normalX * 15;
  const toLabelY = y2 - unitY * 14 + normalY * 15;
  const markerStart = edge.type === 'composition' ? 'url(#cdb-composition)' : edge.type === 'aggregation' ? 'url(#cdb-aggregation)' : undefined;
  const markerEnd = edge.type === 'generalization' ? 'url(#cdb-generalization)' : undefined;
  return (
    <g
      className={`cdb-edge ${selected ? 'is-selected' : ''}`}
      role="button"
      aria-label={`Quan hệ ${from.name} đến ${to.name}, loại ${edge.type}, multiplicity ${edge.multiplicity?.from ?? 'chưa đặt'} và ${edge.multiplicity?.to ?? 'chưa đặt'}`}
      tabIndex={0}
      onClick={(event) => { event.stopPropagation(); onSelect(); }}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(); } }}
    >
      <line x1={x1} y1={y1} x2={x2} y2={y2} markerStart={markerStart} markerEnd={markerEnd} />
      <text x={nameX} y={nameY} textAnchor="middle">{edge.name || edge.type}</text>
      {edge.type !== 'generalization' && <>
        <text x={fromLabelX} y={fromLabelY} textAnchor="middle">{edge.multiplicity?.from ?? '?'}</text>
        <text x={toLabelX} y={toLabelY} textAnchor="middle">{edge.multiplicity?.to ?? '?'}</text>
      </>}
      <line className="cdb-edge__hit" x1={x1} y1={y1} x2={x2} y2={y2} />
    </g>
  );
}
