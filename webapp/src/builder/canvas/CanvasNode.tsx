import { useDraggable } from '@dnd-kit/core';
import type { DiagramNode } from '../engine/types';
import { NODE_WIDTH, nodeHeight, NODE_HEADER_HEIGHT, NODE_ATTR_ROW_HEIGHT } from './layout';

interface CanvasNodeProps {
  node: DiagramNode;
  selected: boolean;
  highlighted: boolean;
  onSelect: (id: string) => void;
  /** T3 will use this to enter connect-mode from a node's toolbar button. */
  onStartConnect?: (id: string) => void;
  isConnectSource?: boolean;
  onRemoveAttribute?: (nodeId: string, attributeId: string) => void;
  onToggleAssociationClass?: (nodeId: string) => void;
}

export default function CanvasNode({
  node,
  selected,
  highlighted,
  onSelect,
  onStartConnect,
  isConnectSource,
  onRemoveAttribute,
  onToggleAssociationClass,
}: CanvasNodeProps) {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: node.id,
    data: { kind: 'move-node', nodeId: node.id },
  });

  const height = nodeHeight(node.attributes.length);
  const isAssociationClass = node.type === 'associationClass';

  const strokeColor = highlighted ? '#EF4444' : isConnectSource ? '#16A34A' : selected ? '#F59E0B' : '#8B5CF6';
  const fillColor = isAssociationClass ? 'rgba(16,185,129,0.08)' : 'rgba(139,92,246,0.08)';

  const dx = transform ? transform.x : 0;
  const dy = transform ? transform.y : 0;

  return (
    <g
      ref={(el) => setDragRef(el as unknown as HTMLElement | null)}
      transform={`translate(${node.x + dx}, ${node.y + dy})`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab', opacity: isDragging ? 0.85 : 1 }}
      tabIndex={0}
      role="group"
      aria-label={`Class ${node.name}${isAssociationClass ? ' (association class)' : ''}, ${node.attributes.length} attribute`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(node.id);
        } else if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          onStartConnect?.(node.id);
        }
      }}
      {...listeners}
      {...attributes}
    >
      <rect
        width={NODE_WIDTH}
        height={height}
        rx={8}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={selected || highlighted || isConnectSource ? 2.5 : 1.5}
        strokeDasharray={isAssociationClass ? '5 3' : undefined}
        className="transition-colors duration-200"
      />
      <text x={NODE_WIDTH / 2} y={19} textAnchor="middle" fontSize={12} fontWeight="bold" fill={isAssociationClass ? '#34d399' : '#c4b5fd'}>
        {node.name}
      </text>
      {onToggleAssociationClass && (
        <text
          x={NODE_WIDTH - 8}
          y={12}
          fontSize={8}
          textAnchor="end"
          fill={isAssociationClass ? '#34d399' : '#6b7280'}
          role="button"
          aria-label={
            isAssociationClass ? `Bỏ đánh dấu association class cho ${node.name}` : `Đánh dấu ${node.name} là association class`
          }
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleAssociationClass(node.id);
          }}
        >
          {isAssociationClass ? '◇AC' : '◇'}
        </text>
      )}
      <line x1={0} y1={NODE_HEADER_HEIGHT - 4} x2={NODE_WIDTH} y2={NODE_HEADER_HEIGHT - 4} stroke={strokeColor} strokeWidth={1} opacity={0.6} />
      {node.attributes.map((attr, idx) => (
        <g key={attr.id}>
          <text
            x={10}
            y={NODE_HEADER_HEIGHT + idx * NODE_ATTR_ROW_HEIGHT + 13}
            fontSize={10}
            fontFamily="monospace"
            fill="#cbd5e1"
          >
            - {attr.name}
          </text>
          {selected && onRemoveAttribute && (
            <text
              x={NODE_WIDTH - 12}
              y={NODE_HEADER_HEIGHT + idx * NODE_ATTR_ROW_HEIGHT + 13}
              fontSize={10}
              fill="#f87171"
              textAnchor="middle"
              role="button"
              aria-label={`Xóa attribute ${attr.name}`}
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveAttribute(node.id, attr.id);
              }}
            >
              ✕
            </text>
          )}
        </g>
      ))}
    </g>
  );
}
