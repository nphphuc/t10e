import { useDraggable } from '@dnd-kit/core';
import type { ActivityNode as ActivityNodeModel } from '../engine/types';
import { ACTION_WIDTH, ACTION_HEIGHT, DECISION_SIZE, INITIAL_SIZE, FINAL_SIZE, FORKJOIN_LENGTH, FORKJOIN_THICKNESS } from './layout';

interface ActivityNodeProps {
  node: ActivityNodeModel;
  selected: boolean;
  highlighted: boolean;
  onSelect: (id: string) => void;
  onStartConnect?: (id: string) => void;
  isConnectSource?: boolean;
  onFocusNode?: (id: string) => void;
  onBlurNode?: () => void;
}

const TYPE_LABEL: Record<ActivityNodeModel['type'], string> = {
  initial: 'Điểm bắt đầu',
  action: 'Hành động',
  decision: 'Quyết định (decision)',
  merge: 'Điểm gộp nhánh (merge)',
  fork: 'Tách nhánh song song (fork)',
  join: 'Gộp nhánh song song (join)',
  final: 'Điểm kết thúc',
};

export default function ActivityNode({
  node,
  selected,
  highlighted,
  onSelect,
  onStartConnect,
  isConnectSource,
  onFocusNode,
  onBlurNode,
}: ActivityNodeProps) {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: node.id,
    data: { kind: 'move-node', nodeId: node.id },
  });

  const strokeColor = highlighted ? '#EF4444' : isConnectSource ? '#16A34A' : selected ? '#F59E0B' : '#8B5CF6';
  const dx = transform ? transform.x : 0;
  const dy = transform ? transform.y : 0;

  const ariaLabel = node.name ? `${TYPE_LABEL[node.type]}: ${node.name}` : TYPE_LABEL[node.type];

  return (
    <g
      ref={(el) => setDragRef(el as unknown as HTMLElement | null)}
      transform={`translate(${node.x + dx}, ${node.y + dy})`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab', opacity: isDragging ? 0.85 : 1 }}
      tabIndex={0}
      role="group"
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onFocus={() => onFocusNode?.(node.id)}
      onBlur={() => onBlurNode?.()}
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
      <ActivityNodeShape node={node} strokeColor={strokeColor} selected={selected || highlighted || !!isConnectSource} />
    </g>
  );
}

function ActivityNodeShape({
  node,
  strokeColor,
  selected,
}: {
  node: ActivityNodeModel;
  strokeColor: string;
  selected: boolean;
}) {
  const strokeWidth = selected ? 2.5 : 1.5;

  switch (node.type) {
    case 'initial':
      return <circle cx={INITIAL_SIZE / 2} cy={INITIAL_SIZE / 2} r={INITIAL_SIZE / 2} fill={strokeColor} />;

    case 'final':
      return (
        <g>
          <circle cx={FINAL_SIZE / 2} cy={FINAL_SIZE / 2} r={FINAL_SIZE / 2 - 1} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx={FINAL_SIZE / 2} cy={FINAL_SIZE / 2} r={FINAL_SIZE / 2 - 6} fill={strokeColor} />
        </g>
      );

    case 'decision':
    case 'merge': {
      const half = DECISION_SIZE / 2;
      const isDecision = node.type === 'decision';
      return (
        <g>
          <polygon
            points={`${half},0 ${DECISION_SIZE},${half} ${half},${DECISION_SIZE} 0,${half}`}
            fill="rgba(139,92,246,0.08)"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          {node.name && (
            <text x={half} y={half + 4} textAnchor="middle" fontSize={9} fill="#c4b5fd">
              {node.name}
            </text>
          )}
          {!node.name && (
            <text x={half} y={half - DECISION_SIZE / 2 - 4} textAnchor="middle" fontSize={8} fill="#6b7280">
              {isDecision ? 'decision' : 'merge'}
            </text>
          )}
        </g>
      );
    }

    case 'fork':
    case 'join':
      return (
        <rect
          width={FORKJOIN_LENGTH}
          height={FORKJOIN_THICKNESS}
          rx={2}
          fill={strokeColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      );

    case 'action':
    default:
      return (
        <g>
          <rect
            width={ACTION_WIDTH}
            height={ACTION_HEIGHT}
            rx={16}
            fill="rgba(139,92,246,0.08)"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <text x={ACTION_WIDTH / 2} y={ACTION_HEIGHT / 2 + 4} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#c4b5fd">
            {node.name ?? '(chưa đặt tên)'}
          </text>
        </g>
      );
  }
}
