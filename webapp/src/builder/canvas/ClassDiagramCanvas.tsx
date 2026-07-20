import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import {
  DndContext,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { DiagramEdge, DiagramState, PaletteItem } from '../engine/types';
import CanvasNode from './CanvasNode';
import CanvasEdge from './CanvasEdge';
import EdgeEndEditor from './EdgeEndEditor';
import { NODE_WIDTH, nodeCenter, nodeHeight } from './layout';

export interface ClassDiagramCanvasProps {
  diagram: DiagramState;
  onChange: (next: DiagramState) => void;
  palette: PaletteItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  highlightSubjectId?: string | null;
  mode: 'guided' | 'pe';
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function PaletteChip({ item, index }: { item: PaletteItem; index: number }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${index}`,
    data: { kind: 'palette-item', item },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50, position: 'relative' as const }
    : undefined;

  const kindStyles: Record<PaletteItem['kind'], string> = {
    class: 'border-boundary/60 bg-boundary/10 text-violet-200',
    attribute: 'border-gray-700 bg-gray-800/60 text-gray-300',
    'verb-trap': 'border-control/50 bg-control/10 text-amber-200',
    'attribute-trap': 'border-control/50 bg-control/10 text-amber-200',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      tabIndex={0}
      role="button"
      aria-label={`Palette item ${item.label} (${item.kind})`}
      className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-grab active:cursor-grabbing select-none transition-shadow ${kindStyles[item.kind]} ${isDragging ? 'opacity-60 shadow-lg' : ''}`}
    >
      {item.label}
    </div>
  );
}

function CanvasSurface({
  diagram,
  selectedId,
  highlightSubjectId,
  connectSourceId,
  editingEdge,
  onNodeClick,
  onEdgeClick,
  onBackgroundClick,
  onEdgeUpdate,
  onEdgeDelete,
  onEditorClose,
  containerRef,
}: {
  diagram: DiagramState;
  selectedId: string | null;
  highlightSubjectId?: string | null;
  connectSourceId: string | null;
  editingEdge: DiagramEdge | null;
  onNodeClick: (id: string) => void;
  onEdgeClick: (id: string) => void;
  onBackgroundClick: () => void;
  onEdgeUpdate: (patch: Partial<DiagramEdge>) => void;
  onEdgeDelete: () => void;
  onEditorClose: () => void;
  containerRef: MutableRefObject<HTMLDivElement | null>;
}) {
  const { setNodeRef } = useDroppable({ id: 'canvas-root', data: { kind: 'canvas' } });
  const [size, setSize] = useState({ width: 900, height: 520 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setSize({ width: Math.max(entry.contentRect.width, 320), height: Math.max(entry.contentRect.height, 420) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const nodesById = new Map(diagram.nodes.map((n) => [n.id, n]));
  const editorFromNode = editingEdge ? nodesById.get(editingEdge.from) : undefined;
  const editorToNode = editingEdge ? nodesById.get(editingEdge.to) : undefined;
  const editorPos =
    editingEdge && editorFromNode && editorToNode
      ? (() => {
          const from = nodeCenter(editorFromNode.x, editorFromNode.y, editorFromNode.attributes.length);
          const to = nodeCenter(editorToNode.x, editorToNode.y, editorToNode.attributes.length);
          return { left: (from.cx + to.cx) / 2, top: (from.cy + to.cy) / 2 };
        })()
      : null;

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        setNodeRef(el);
      }}
      className="w-full h-[520px] bg-[#090a0c]/60 border border-gray-800 rounded-2xl overflow-hidden relative"
      onClick={onBackgroundClick}
    >
      {connectSourceId && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-success/90 text-white text-[11px] font-bold shadow-lg"
        >
          Chọn class đích...
        </div>
      )}
      <svg width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
        {diagram.edges.map((edge) => {
          const fromNode = nodesById.get(edge.from);
          const toNode = nodesById.get(edge.to);
          if (!fromNode || !toNode) return null;
          const attachedNode = edge.attachedClassId ? nodesById.get(edge.attachedClassId) : undefined;
          return (
            <CanvasEdge
              key={edge.id}
              edge={edge}
              fromNode={fromNode}
              toNode={toNode}
              attachedNode={attachedNode}
              selected={selectedId === edge.id}
              highlighted={highlightSubjectId === edge.id}
              onSelect={onEdgeClick}
            />
          );
        })}
        {diagram.nodes.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            selected={selectedId === node.id}
            highlighted={highlightSubjectId === node.id}
            onSelect={onNodeClick}
            onStartConnect={onNodeClick}
            isConnectSource={connectSourceId === node.id}
          />
        ))}
      </svg>

      {editingEdge && editorFromNode && editorToNode && editorPos && (
        <div style={{ position: 'absolute', left: editorPos.left, top: editorPos.top }}>
          <EdgeEndEditor
            edge={editingEdge}
            fromNode={editorFromNode}
            toNode={editorToNode}
            onUpdate={onEdgeUpdate}
            onDelete={onEdgeDelete}
            onClose={onEditorClose}
          />
        </div>
      )}
    </div>
  );
}

export default function ClassDiagramCanvas({
  diagram,
  onChange,
  palette,
  selectedId,
  onSelect,
  highlightSubjectId,
  mode,
}: ClassDiagramCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [addingClass, setAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const undoSnapshotRef = useRef<DiagramState | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function commit(next: DiagramState) {
    undoSnapshotRef.current = diagram;
    onChange(next);
  }

  function undo() {
    if (!undoSnapshotRef.current) return;
    onChange(undoSnapshotRef.current);
    undoSnapshotRef.current = null;
  }

  const editingEdge = editingEdgeId ? diagram.edges.find((e) => e.id === editingEdgeId) ?? null : null;

  function handleNodeClick(nodeId: string) {
    if (connectSourceId && connectSourceId !== nodeId) {
      const newEdge: DiagramEdge = { id: uid('edge'), from: connectSourceId, to: nodeId, type: 'association' };
      commit({ ...diagram, edges: [...diagram.edges, newEdge] });
      setConnectSourceId(null);
      onSelect(newEdge.id);
      setEditingEdgeId(newEdge.id);
      return;
    }
    if (connectSourceId === nodeId) {
      setConnectSourceId(null);
      onSelect(nodeId);
      return;
    }
    setConnectSourceId(nodeId);
    setEditingEdgeId(null);
    onSelect(nodeId);
  }

  function handleEdgeClick(edgeId: string) {
    setConnectSourceId(null);
    onSelect(edgeId);
    setEditingEdgeId(edgeId);
  }

  function handleBackgroundClick() {
    setConnectSourceId(null);
    setEditingEdgeId(null);
    onSelect(null);
  }

  function handleEdgeUpdate(patch: Partial<DiagramEdge>) {
    if (!editingEdgeId) return;
    commit({
      ...diagram,
      edges: diagram.edges.map((e) => (e.id === editingEdgeId ? { ...e, ...patch } : e)),
    });
  }

  function handleEdgeDelete() {
    if (!editingEdgeId) return;
    commit({ ...diagram, edges: diagram.edges.filter((e) => e.id !== editingEdgeId) });
    setEditingEdgeId(null);
    onSelect(null);
  }

  function removeSelected() {
    if (!selectedId) return;
    const isNode = diagram.nodes.some((n) => n.id === selectedId);
    if (isNode) {
      commit({
        nodes: diagram.nodes.filter((n) => n.id !== selectedId),
        edges: diagram.edges
          .filter((e) => e.from !== selectedId && e.to !== selectedId)
          .map((e) => (e.attachedClassId === selectedId ? { ...e, attachedClassId: undefined } : e)),
      });
    } else {
      commit({ ...diagram, edges: diagram.edges.filter((e) => e.id !== selectedId) });
    }
    setSelectedIdAfterDelete();
  }

  function setSelectedIdAfterDelete() {
    setConnectSourceId(null);
    setEditingEdgeId(null);
    onSelect(null);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isEditable = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isEditable) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        removeSelected();
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        undo();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeData = active.data.current as { kind: string; nodeId?: string; item?: PaletteItem } | undefined;
    if (!activeData) return;

    if (activeData.kind === 'move-node' && activeData.nodeId) {
      const nodeId = activeData.nodeId;
      commit({
        ...diagram,
        nodes: diagram.nodes.map((n) =>
          n.id === nodeId ? { ...n, x: Math.max(0, n.x + event.delta.x), y: Math.max(0, n.y + event.delta.y) } : n
        ),
      });
      return;
    }

    if (activeData.kind === 'palette-item' && activeData.item && over?.id === 'canvas-root') {
      const item = activeData.item;
      const activeRect = active.rect.current.translated;
      const canvasEl = containerRef.current;
      if (!activeRect || !canvasEl) return;
      const bounds = canvasEl.getBoundingClientRect();
      const dropX = activeRect.left + activeRect.width / 2 - bounds.left;
      const dropY = activeRect.top + activeRect.height / 2 - bounds.top;

      // Resolve which existing node (if any) the drop point landed on directly from
      // diagram state — geometry we own — rather than a second dnd-kit droppable
      // nested inside canvas-root (dnd-kit's collision detection doesn't reliably
      // disambiguate nested droppable rects).
      const targetNode = diagram.nodes.find(
        (n) => dropX >= n.x && dropX <= n.x + NODE_WIDTH && dropY >= n.y && dropY <= n.y + nodeHeight(n.attributes.length)
      );

      if (item.kind === 'attribute') {
        if (!targetNode) return;
        commit({
          ...diagram,
          nodes: diagram.nodes.map((n) =>
            n.id === targetNode.id ? { ...n, attributes: [...n.attributes, { id: uid('attr'), name: item.label }] } : n
          ),
        });
        return;
      }

      if (item.kind === 'class' || item.kind === 'verb-trap' || item.kind === 'attribute-trap') {
        const x = Math.min(Math.max(dropX - NODE_WIDTH / 2, 0), bounds.width - NODE_WIDTH);
        const y = Math.min(Math.max(dropY - nodeHeight(0) / 2, 0), Math.max(bounds.height - nodeHeight(0), 0));

        commit({
          ...diagram,
          nodes: [...diagram.nodes, { id: uid('node'), type: 'class', name: item.label, attributes: [], x, y }],
        });
      }
    }
  }

  function addTypedClass() {
    const name = newClassName.trim();
    if (!name) return;
    const idx = diagram.nodes.length;
    commit({
      ...diagram,
      nodes: [
        ...diagram.nodes,
        { id: uid('node'), type: 'class', name, attributes: [], x: 24 + (idx % 4) * 40, y: 24 + (idx % 5) * 30 },
      ],
    });
    setNewClassName('');
    setAddingClass(false);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="md:w-40 flex-shrink-0 flex flex-row md:flex-col flex-wrap gap-2">
          {palette.map((item, idx) => (
            <PaletteChip key={idx} item={item} index={idx} />
          ))}
          {mode === 'pe' && (
            <div className="flex flex-col gap-2">
              {addingClass ? (
                <div className="flex flex-col gap-1">
                  <input
                    autoFocus
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addTypedClass();
                      if (e.key === 'Escape') setAddingClass(false);
                    }}
                    placeholder="Tên class..."
                    className="px-2 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addTypedClass}
                    className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                  >
                    Thêm
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingClass(true)}
                  className="px-3 py-2 rounded-xl border border-dashed border-gray-700 text-xs font-semibold text-gray-400 hover:border-gray-500 hover:text-gray-200"
                >
                  + Thêm class
                </button>
              )}
            </div>
          )}
          <button
            onClick={undo}
            disabled={!undoSnapshotRef.current}
            className="px-3 py-1.5 rounded-xl border border-gray-700 text-[11px] font-semibold text-gray-400 hover:text-gray-200 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ↺ Hoàn tác
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <CanvasSurface
            diagram={diagram}
            selectedId={selectedId}
            highlightSubjectId={highlightSubjectId}
            connectSourceId={connectSourceId}
            editingEdge={editingEdge}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onBackgroundClick={handleBackgroundClick}
            onEdgeUpdate={handleEdgeUpdate}
            onEdgeDelete={handleEdgeDelete}
            onEditorClose={() => setEditingEdgeId(null)}
            containerRef={containerRef}
          />
        </div>
      </div>
    </DndContext>
  );
}
