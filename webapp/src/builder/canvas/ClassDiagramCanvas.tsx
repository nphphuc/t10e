import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DiagramEdge, DiagramNode, DiagramState, NodeType, PaletteItem } from '../engine/types';
import CanvasEdge from './CanvasEdge';
import type { NodeSize } from './CanvasEdge';
import CanvasNode from './CanvasNode';
import EdgeEndEditor from './EdgeEndEditor';

const id = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

function PaletteButton({ item, onAdd }: { item: PaletteItem; onAdd: () => void }) {
  const draggable = useDraggable({ id: `palette:${item.kind}:${item.label}`, data: { kind: 'palette', item } });
  return (
    <button
      ref={draggable.setNodeRef}
      type="button"
      className={`cdb-palette-item cdb-palette-item--${item.kind}`}
      style={draggable.transform ? { transform: `translate3d(${draggable.transform.x}px, ${draggable.transform.y}px, 0)` } : undefined}
      {...draggable.listeners}
      {...draggable.attributes}
      onClick={onAdd}
      onKeyDownCapture={(event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        event.stopPropagation();
        onAdd();
      }}
      aria-label={`${item.kind === 'class' ? 'Class' : 'Attribute'} ${item.label}. Kéo thả hoặc nhấn để thêm.`}
    >
      <span>{item.kind === 'class' ? '▣' : item.kind.includes('trap') ? '◇' : '+'}</span>{item.label}
    </button>
  );
}

export interface ClassDiagramCanvasProps {
  value: DiagramState;
  onChange: (next: DiagramState) => void;
  palette?: PaletteItem[];
  readOnly?: boolean;
  compact?: boolean;
  title?: string;
  onUndo?: () => void;
  undoCount?: number;
  focusSubjectId?: string;
  focusRequest?: number;
}

export default function ClassDiagramCanvas({ value, onChange, palette = [], readOnly = false, compact = false, title = 'Class diagram canvas', onUndo, undoCount = 0, focusSubjectId, focusRequest }: ClassDiagramCanvasProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor));
  const canvas = useDroppable({ id: 'diagram-canvas', data: { kind: 'canvas' } });
  const [selectedId, setSelectedId] = useState<string>();
  const [connectingFrom, setConnectingFrom] = useState<string>();
  const [announcement, setAnnouncement] = useState('Canvas sẵn sàng.');
  const [manualName, setManualName] = useState('');
  const [manualType, setManualType] = useState<NodeType>('class');
  const [nodeSizes, setNodeSizes] = useState<Record<string, NodeSize>>({});
  const selectedNode = value.nodes.find((node) => node.id === selectedId);
  const selectedEdge = value.edges.find((edge) => edge.id === selectedId);

  const updateNodeSize = useCallback((nodeId: string, size: NodeSize) => {
    setNodeSizes((current) => {
      const previousSize = current[nodeId];
      if (previousSize?.width === size.width && previousSize.height === size.height) return current;
      return { ...current, [nodeId]: size };
    });
  }, []);

  const commit = (next: DiagramState, message: string) => {
    onChange(next);
    setAnnouncement(message);
  };

  const nextPosition = () => ({ x: 35 + (value.nodes.length % 3) * 320, y: 45 + Math.floor(value.nodes.length / 3) * 185 });
  const addNode = (name: string, type: NodeType = 'class', position = nextPosition()) => {
    const node: DiagramNode = { id: id('node'), type, name, attributes: [], ...position };
    commit({ ...value, nodes: [...value.nodes, node] }, `Đã thêm ${type === 'associationClass' ? 'association class' : 'class'} ${name}.`);
    setSelectedId(node.id);
  };
  const addAttribute = (nodeId: string, name: string) => {
    commit({ ...value, nodes: value.nodes.map((node) => node.id === nodeId ? { ...node, attributes: [...node.attributes, { id: id('attribute'), name }] } : node) }, `Đã thêm attribute ${name}.`);
  };
  const updateNode = (nodeId: string, updater: (node: DiagramNode) => DiagramNode, message: string) => commit({ ...value, nodes: value.nodes.map((node) => node.id === nodeId ? updater(node) : node) }, message);
  const updateEdge = (nextEdge: DiagramEdge) => commit({ ...value, edges: value.edges.map((edge) => edge.id === nextEdge.id ? nextEdge : edge) }, 'Đã cập nhật quan hệ.');
  const deleteNode = (nodeId: string) => {
    const node = value.nodes.find((candidate) => candidate.id === nodeId);
    if (!node) return;
    commit({ nodes: value.nodes.filter((candidate) => candidate.id !== nodeId), edges: value.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId).map((edge) => edge.attachedClassId === nodeId ? { ...edge, attachedClassId: undefined } : edge) }, `Đã xóa ${node.name}.`);
    setSelectedId(undefined);
  };
  const deleteEdge = (edgeId: string) => {
    commit({ ...value, edges: value.edges.filter((edge) => edge.id !== edgeId) }, 'Đã xóa quan hệ.');
    setSelectedId(undefined);
  };
  const selectNode = (nodeId: string) => {
    if (connectingFrom && connectingFrom !== nodeId) {
      const from = value.nodes.find((node) => node.id === connectingFrom)!;
      const to = value.nodes.find((node) => node.id === nodeId)!;
      const edge: DiagramEdge = { id: id('edge'), from: from.id, to: to.id, type: 'association', multiplicity: { from: '1', to: '1' } };
      commit({ ...value, edges: [...value.edges, edge] }, `Đã nối ${from.name} với ${to.name}.`);
      setSelectedId(edge.id);
      setConnectingFrom(undefined);
      return;
    }
    setSelectedId(nodeId);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const data = event.active.data.current;
    if (data?.kind === 'node') {
      const nodeId = String(data.nodeId);
      updateNode(nodeId, (node) => ({ ...node, x: Math.max(0, node.x + event.delta.x), y: Math.max(0, node.y + event.delta.y) }), 'Đã di chuyển class.');
      return;
    }
    if (data?.kind !== 'palette') return;
    const item = data.item as PaletteItem;
    const overId = String(event.over?.id ?? '');
    if (item.kind === 'class' || item.kind === 'verb-trap') {
      const translatedRect = event.active.rect.current.translated;
      const initialRect = event.active.rect.current.initial;
      const canvasRect = canvas.node.current?.getBoundingClientRect();
      const effectiveRect = initialRect ? {
        left: initialRect.left + event.delta.x,
        top: initialRect.top + event.delta.y,
        width: initialRect.width,
        height: initialRect.height,
      } : translatedRect;
      const center = effectiveRect ? { x: effectiveRect.left + effectiveRect.width / 2, y: effectiveRect.top + effectiveRect.height / 2 } : undefined;
      const isInsideCanvas = Boolean(center && canvasRect
        && center.x >= canvasRect.left && center.x <= canvasRect.right
        && center.y >= canvasRect.top && center.y <= canvasRect.bottom);
      if (!event.over && !isInsideCanvas) return;
      const position = effectiveRect && canvasRect ? { x: Math.max(10, effectiveRect.left - canvasRect.left), y: Math.max(10, effectiveRect.top - canvasRect.top) } : nextPosition();
      addNode(item.label, 'class', position);
    } else if (overId.startsWith('node:')) {
      addAttribute(overId.slice(5), item.label);
    } else {
      setAnnouncement(`Hãy thả attribute ${item.label} trúng một class.`);
    }
  };

  const textAlternative = useMemo(() => {
    const nodes = value.nodes.map((node) => `${node.type === 'associationClass' ? 'Association class' : 'Class'} ${node.name}: ${node.attributes.map((attribute) => attribute.name).join(', ') || 'không có attribute'}.`);
    const edges = value.edges.map((edge) => {
      const from = value.nodes.find((node) => node.id === edge.from)?.name ?? '?';
      const to = value.nodes.find((node) => node.id === edge.to)?.name ?? '?';
      return `${from} đến ${to}, ${edge.type}, ${edge.multiplicity?.from ?? '?'} và ${edge.multiplicity?.to ?? '?'}.`;
    });
    return [...nodes, ...edges].join(' ');
  }, [value]);

  useEffect(() => {
    if (!selectedId) return;
    if (!value.nodes.some((node) => node.id === selectedId) && !value.edges.some((edge) => edge.id === selectedId)) setSelectedId(undefined);
  }, [selectedId, value]);

  useEffect(() => {
    if (focusSubjectId && (value.nodes.some((node) => node.id === focusSubjectId) || value.edges.some((edge) => edge.id === focusSubjectId))) {
      setSelectedId(focusSubjectId);
    }
  }, [focusRequest, focusSubjectId]);

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <section className={`cdb-canvas-shell ${readOnly ? 'is-readonly' : ''}`} aria-label={title}>
        {!readOnly && <div className="cdb-canvas-toolbar">
          {palette.length > 0 ? <div className="cdb-palette" aria-label="Palette gợi ý">{palette.map((item) => <PaletteButton key={`${item.kind}-${item.label}`} item={item} onAdd={() => {
            if (item.kind === 'class' || item.kind === 'verb-trap') addNode(item.label);
            else if (selectedNode) addAttribute(selectedNode.id, item.label);
            else setAnnouncement(`Chọn một class rồi nhấn lại ${item.label}.`);
          }} />)}</div> : <p className="cdb-pe-label">PE free build · Không có palette gợi ý</p>}
          <div className="cdb-create-controls">
            <input value={manualName} onChange={(event) => setManualName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && manualName.trim()) { addNode(manualName.trim(), manualType); setManualName(''); } }} placeholder="Tên class…" aria-label="Tên phần tử mới" />
            <select value={manualType} onChange={(event) => setManualType(event.target.value as NodeType)} aria-label="Loại phần tử"><option value="class">Class</option><option value="associationClass">Association class</option></select>
            <button type="button" onClick={() => { if (manualName.trim()) { addNode(manualName.trim(), manualType); setManualName(''); } }}>Thêm</button>
            <button type="button" disabled={undoCount === 0} aria-label={`Hoàn tác (còn ${undoCount} bước)`} onClick={() => { onUndo?.(); setAnnouncement('Đã hoàn tác một bước.'); }}>↶ Undo</button>
            {connectingFrom && <button type="button" onClick={() => setConnectingFrom(undefined)}>Hủy nối</button>}
          </div>
        </div>}
        {connectingFrom && <div className="cdb-connect-banner" role="status">Chọn class đích rồi nhấn Enter hoặc click.</div>}
        <div
          ref={canvas.setNodeRef}
          className={`cdb-canvas ${canvas.isOver ? 'is-over' : ''}`}
          onClick={() => { setSelectedId(undefined); setConnectingFrom(undefined); }}
          onKeyDown={(event) => {
            if (readOnly) return;
            if (event.key === 'Escape') setConnectingFrom(undefined);
            if (event.key === 'Delete' && selectedEdge) deleteEdge(selectedEdge.id);
          }}
        >
          <svg className="cdb-edge-layer" width="100%" height="100%" role="group" aria-label="Các quan hệ trong class diagram">
            <defs>
              <marker id="cdb-composition" markerWidth="14" markerHeight="14" refX="2" refY="5" orient="auto"><path d="M0,5 L5,0 L10,5 L5,10 Z" fill="#f59e0b" /></marker>
              <marker id="cdb-aggregation" markerWidth="14" markerHeight="14" refX="2" refY="5" orient="auto"><path d="M0,5 L5,0 L10,5 L5,10 Z" fill="#111827" stroke="#a5b4fc" /></marker>
              <marker id="cdb-generalization" markerWidth="14" markerHeight="14" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#111827" stroke="#a5b4fc" /></marker>
            </defs>
            {value.edges.map((edge) => {
              const from = value.nodes.find((node) => node.id === edge.from);
              const to = value.nodes.find((node) => node.id === edge.to);
              return from && to ? <CanvasEdge key={edge.id} edge={edge} from={from} to={to} fromSize={nodeSizes[from.id]} toSize={nodeSizes[to.id]} selected={selectedId === edge.id} readOnly={readOnly} compact={compact} onSelect={() => setSelectedId(edge.id)} /> : null;
            })}
          </svg>
          {value.nodes.map((node) => <CanvasNode
            key={node.id}
            node={node}
            readOnly={readOnly}
            compact={compact}
            selected={selectedId === node.id}
            connecting={connectingFrom === node.id}
            connectionActive={Boolean(connectingFrom)}
            edgeCount={value.edges.filter((edge) => edge.from === node.id || edge.to === node.id).length}
            onSelect={() => selectNode(node.id)}
            onStartConnect={() => { setSelectedId(node.id); setConnectingFrom(node.id); setAnnouncement(`Đã chọn ${node.name} làm nguồn. Chọn class đích.`); }}
            onDelete={() => deleteNode(node.id)}
            onAddAttribute={(name) => addAttribute(node.id, name)}
            onRenameAttribute={(attributeId, name) => updateNode(node.id, (current) => ({ ...current, attributes: current.attributes.map((attribute) => attribute.id === attributeId ? { ...attribute, name } : attribute) }), `Đã sửa attribute thành ${name}.`)}
            onDeleteAttribute={(attributeId) => updateNode(node.id, (current) => ({ ...current, attributes: current.attributes.filter((attribute) => attribute.id !== attributeId) }), 'Đã xóa attribute.')}
            onSizeChange={updateNodeSize}
          />)}
          {value.nodes.length === 0 && <div className="cdb-empty-canvas"><strong>Bắt đầu từ danh từ trong brief.</strong><span>Kéo hoặc thêm class; dùng Tab + Enter/Space để thao tác bằng bàn phím.</span></div>}
        </div>
        {!readOnly && selectedEdge && (() => {
          const from = value.nodes.find((node) => node.id === selectedEdge.from);
          const to = value.nodes.find((node) => node.id === selectedEdge.to);
          return from && to ? <EdgeEndEditor edge={selectedEdge} from={from} to={to} associationClasses={value.nodes.filter((node) => node.type === 'associationClass')} onChange={updateEdge} onDelete={() => deleteEdge(selectedEdge.id)} /> : null;
        })()}
        <details className="cdb-text-alternative"><summary>Đọc biểu đồ dạng văn bản ({value.nodes.length} nodes · {value.edges.length} edges)</summary><p>{textAlternative || 'Biểu đồ trống.'}</p></details>
        <p className="cdb-sr-only" aria-live="polite">{announcement}</p>
      </section>
    </DndContext>
  );
}
