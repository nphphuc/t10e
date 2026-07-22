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
import type { ActivityDiagramState, ActivityEdge as ActivityEdgeModel, ActivityNodeType, PaletteItem } from '../engine/types';
import ActivityNode from './ActivityNode';
import ActivityEdge from './ActivityEdge';
import GuardEditor from './GuardEditor';
import { nodeBox, nodeCenter } from './layout';

export interface ActivityCanvasProps {
  diagram: ActivityDiagramState;
  onChange: (next: ActivityDiagramState) => void;
  palette: PaletteItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  highlightSubjectId?: string | null;
  mode: 'guided' | 'pe';
}

// Structural control-flow nodes are generic UML elements, always available
// regardless of which lesson is loaded — not part of the lesson's JSON palette
// (which only lists domain action verbs + noun-trap decoys).
const STRUCTURAL_PALETTE: { type: ActivityNodeType; label: string }[] = [
  { type: 'initial', label: '● Bắt đầu' },
  { type: 'decision', label: '◆ Decision' },
  { type: 'merge', label: '◇ Merge' },
  { type: 'fork', label: '▬ Fork' },
  { type: 'join', label: '▬ Join' },
  { type: 'final', label: '◉ Kết thúc' },
];

type LiftedItem = { source: 'lesson'; index: number } | { source: 'structural'; index: number };

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

// Default placement for a new node when it isn't dropped at a specific point (typed
// "+ Thêm hành động", or keyboard-drop onto "vùng canvas trống"). A tight modulo-based
// grid whose step is smaller than the node's own box just stacks nodes on top of each
// other once there are more than a handful — space columns/rows by the actual action
// box size (plus a margin) instead, and never wrap rows so it keeps growing downward.
const GRID_COLS = 5;
function defaultGridPlacement(idx: number): { x: number; y: number } {
  const box = nodeBox('action');
  const col = idx % GRID_COLS;
  const row = Math.floor(idx / GRID_COLS);
  return { x: 24 + col * (box.width + 24), y: 24 + row * (box.height + 40) };
}

function PaletteChip({
  label,
  dragId,
  dragData,
  isLifted,
  onToggleLift,
  variant = 'action',
}: {
  label: string;
  dragId: string;
  dragData: Record<string, unknown>;
  isLifted: boolean;
  onToggleLift: () => void;
  variant?: 'action' | 'trap' | 'structural';
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: dragId, data: dragData });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50, position: 'relative' as const }
    : undefined;

  const variantStyles: Record<typeof variant, string> = {
    action: 'border-boundary/60 bg-boundary/10 text-violet-200',
    trap: 'border-control/50 bg-control/10 text-amber-200',
    structural: 'border-gray-600 bg-gray-800/60 text-gray-300',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      tabIndex={0}
      role="button"
      aria-label={`Palette item ${label}${isLifted ? ' — đã nhấc, chọn nơi thả bên dưới' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleLift();
        }
      }}
      className={`canvas-focusable px-3 py-2 rounded-xl border text-xs font-semibold cursor-grab active:cursor-grabbing select-none transition-shadow ${variantStyles[variant]} ${isDragging ? 'opacity-60 shadow-lg' : ''} ${isLifted ? 'ring-2 ring-success' : ''}`}
    >
      {label}
    </div>
  );
}

// Generous margin so there's always room to keep dragging/dropping past the last node —
// dnd-kit's built-in autoScroll then scrolls the now-scrollable container as the pointer
// nears its edge, echoing draw.io's "drag near the edge to reveal more canvas". Used for
// the drawable SVG size, NOT for "Fit" zoom (see tightContentBounds below) — folding this
// same generous padding into the fit calculation would zoom out much further than needed
// to actually see the diagram, since it'd treat 300px of empty drag-room per node as
// content that has to fit on screen too.
const CANVAS_MARGIN = 300;
function contentBounds(diagram: ActivityDiagramState): { width: number; height: number } {
  const width = Math.max(0, ...diagram.nodes.map((n) => n.x + nodeBox(n.type).width + CANVAS_MARGIN));
  const height = Math.max(0, ...diagram.nodes.map((n) => n.y + nodeBox(n.type).height + CANVAS_MARGIN));
  return { width, height };
}

const FIT_MARGIN = 60;
function tightContentBounds(diagram: ActivityDiagramState): { width: number; height: number } {
  const width = Math.max(1, ...diagram.nodes.map((n) => n.x + nodeBox(n.type).width + FIT_MARGIN));
  const height = Math.max(1, ...diagram.nodes.map((n) => n.y + nodeBox(n.type).height + FIT_MARGIN));
  return { width, height };
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
  onStartConnectFromToolbar,
  onDeleteSelected,
  focusedNodeId,
  onFocusNode,
  onBlurNode,
  containerRef,
  zoom,
}: {
  diagram: ActivityDiagramState;
  selectedId: string | null;
  highlightSubjectId?: string | null;
  connectSourceId: string | null;
  editingEdge: ActivityEdgeModel | null;
  onNodeClick: (id: string) => void;
  onEdgeClick: (id: string) => void;
  onBackgroundClick: () => void;
  onEdgeUpdate: (patch: Partial<ActivityEdgeModel>) => void;
  onEdgeDelete: () => void;
  onEditorClose: () => void;
  onStartConnectFromToolbar: (nodeId: string) => void;
  onDeleteSelected: (nodeId: string) => void;
  focusedNodeId: string | null;
  onFocusNode: (id: string) => void;
  onBlurNode: () => void;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  zoom: number;
}) {
  const { setNodeRef } = useDroppable({ id: 'canvas-root', data: { kind: 'canvas' } });
  const [viewport, setViewport] = useState({ width: 1100, height: 780 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setViewport({ width: Math.max(entry.contentRect.width, 320), height: Math.max(entry.contentRect.height, 780) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  // The drawing surface grows to fit however far the diagram actually extends —
  // otherwise a handful of nodes fill the fixed-size box and everything after
  // that overlaps with no way to reach it. `viewport` stays the minimum visible
  // window; the container scrolls once content exceeds it.
  const content = contentBounds(diagram);
  const size = { width: Math.max(viewport.width, content.width), height: Math.max(viewport.height, content.height) };

  const nodesById = new Map(diagram.nodes.map((n) => [n.id, n]));
  const editorFromNode = editingEdge ? nodesById.get(editingEdge.from) : undefined;
  const editorToNode = editingEdge ? nodesById.get(editingEdge.to) : undefined;
  const editorPos =
    editingEdge && editorFromNode && editorToNode
      ? (() => {
          const from = nodeCenter(editorFromNode.x, editorFromNode.y, editorFromNode.type);
          const to = nodeCenter(editorToNode.x, editorToNode.y, editorToNode.type);
          return { left: (from.cx + to.cx) / 2, top: (from.cy + to.cy) / 2 };
        })()
      : null;

  const toolbarNodeId = focusedNodeId ?? (selectedId && diagram.nodes.some((n) => n.id === selectedId) ? selectedId : null);
  const toolbarNode = toolbarNodeId ? nodesById.get(toolbarNodeId) : undefined;

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        setNodeRef(el);
      }}
      className="w-full h-[780px] bg-[#090a0c]/60 border border-gray-800 rounded-2xl overflow-auto relative"
      onClick={onBackgroundClick}
    >
      {connectSourceId && (
        <div
          role="status"
          aria-live="polite"
          className="sticky top-2 left-1/2 -translate-x-1/2 z-30 w-fit px-3 py-1.5 rounded-full bg-success/90 text-white text-[11px] font-bold shadow-lg"
        >
          Chọn node đích để nối luồng...
        </div>
      )}
      <svg width={size.width * zoom} height={size.height * zoom} viewBox={`0 0 ${size.width} ${size.height}`}>
        {diagram.edges.map((edge) => {
          const fromNode = nodesById.get(edge.from);
          const toNode = nodesById.get(edge.to);
          if (!fromNode || !toNode) return null;
          return (
            <ActivityEdge
              key={edge.id}
              edge={edge}
              fromNode={fromNode}
              toNode={toNode}
              selected={selectedId === edge.id}
              highlighted={highlightSubjectId === edge.id}
              onSelect={onEdgeClick}
            />
          );
        })}
        {diagram.nodes.map((node) => (
          <ActivityNode
            key={node.id}
            node={node}
            selected={selectedId === node.id}
            highlighted={highlightSubjectId === node.id}
            onSelect={onNodeClick}
            onStartConnect={onStartConnectFromToolbar}
            isConnectSource={connectSourceId === node.id}
            onFocusNode={onFocusNode}
            onBlurNode={onBlurNode}
          />
        ))}
      </svg>

      {editingEdge && editorFromNode && editorToNode && editorPos && (
        <div style={{ position: 'absolute', left: editorPos.left * zoom, top: editorPos.top * zoom }}>
          <GuardEditor
            edge={editingEdge}
            fromNode={editorFromNode}
            toNode={editorToNode}
            fromIsDecision={editorFromNode.type === 'decision'}
            onUpdate={onEdgeUpdate}
            onDelete={onEdgeDelete}
            onClose={onEditorClose}
          />
        </div>
      )}

      {toolbarNode && (
        <div
          style={{ position: 'absolute', left: toolbarNode.x * zoom, top: Math.max(toolbarNode.y - 34, 0) * zoom }}
          className="flex gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {connectSourceId !== toolbarNode.id && (
            <button
              onClick={() => onStartConnectFromToolbar(toolbarNode.id)}
              className="canvas-focusable px-2 py-1 rounded-lg bg-success/90 hover:bg-success text-white text-[10px] font-bold shadow"
            >
              🔗 Nối luồng
            </button>
          )}
          <button
            onClick={() => onDeleteSelected(toolbarNode.id)}
            className="canvas-focusable px-2 py-1 rounded-lg bg-error/90 hover:bg-error text-white text-[10px] font-bold shadow"
          >
            🗑️ Xóa
          </button>
        </div>
      )}
    </div>
  );
}

export default function ActivityCanvas({
  diagram,
  onChange,
  palette,
  selectedId,
  onSelect,
  highlightSubjectId,
  mode,
}: ActivityCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [addingAction, setAddingAction] = useState(false);
  const [newActionName, setNewActionName] = useState('');
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [liftedItem, setLiftedItem] = useState<LiftedItem | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const undoSnapshotRef = useRef<ActivityDiagramState | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function commit(next: ActivityDiagramState) {
    undoSnapshotRef.current = diagram;
    onChange(next);
  }

  function undo() {
    if (!undoSnapshotRef.current) return;
    onChange(undoSnapshotRef.current);
    undoSnapshotRef.current = null;
  }

  const editingEdge = editingEdgeId ? diagram.edges.find((e) => e.id === editingEdgeId) ?? null : null;

  function armConnect(nodeId: string) {
    setConnectSourceId(nodeId);
    setEditingEdgeId(null);
    onSelect(nodeId);
  }

  function handleNodeClick(nodeId: string) {
    if (connectSourceId && connectSourceId !== nodeId) {
      const newEdge: ActivityEdgeModel = { id: uid('edge'), from: connectSourceId, to: nodeId };
      commit({ ...diagram, edges: [...diagram.edges, newEdge] });
      setAnnouncement('Đã nối luồng');
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
    // Same split as the class-diagram canvas: Guided mode arms connect-mode on the
    // very first click (click nguồn -> click đích). PE mode requires the explicit
    // toolbar button/N key, since plain clicks there just select for now.
    if (mode === 'guided') {
      armConnect(nodeId);
      return;
    }
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

  function handleEdgeUpdate(patch: Partial<ActivityEdgeModel>) {
    if (!editingEdgeId) return;
    commit({ ...diagram, edges: diagram.edges.map((e) => (e.id === editingEdgeId ? { ...e, ...patch } : e)) });
  }

  function handleEdgeDelete() {
    if (!editingEdgeId) return;
    commit({ ...diagram, edges: diagram.edges.filter((e) => e.id !== editingEdgeId) });
    setEditingEdgeId(null);
    onSelect(null);
  }

  function removeNode(nodeId: string) {
    const node = diagram.nodes.find((n) => n.id === nodeId);
    commit({
      nodes: diagram.nodes.filter((n) => n.id !== nodeId),
      edges: diagram.edges.filter((e) => e.from !== nodeId && e.to !== nodeId),
    });
    setAnnouncement(`Đã xóa ${node?.name ?? node?.type}`);
    if (selectedId === nodeId) setSelectedIdAfterDelete();
    if (connectSourceId === nodeId) setConnectSourceId(null);
  }

  function removeSelected() {
    if (!selectedId) return;
    const isNode = diagram.nodes.some((n) => n.id === selectedId);
    if (isNode) {
      removeNode(selectedId);
      return;
    }
    commit({ ...diagram, edges: diagram.edges.filter((e) => e.id !== selectedId) });
    setAnnouncement('Đã xóa luồng');
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
      if (e.key === 'Escape' && liftedItem !== null) {
        e.preventDefault();
        setLiftedItem(null);
      } else if (e.key === 'Escape' && connectSourceId) {
        e.preventDefault();
        setConnectSourceId(null);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
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

  // Only clamps the lower bound (never place a node off the top/left edge). No upper
  // bound: the canvas grows and scrolls to fit its content, so there's no fixed
  // viewport size to cap positions against — capping to the visible height was
  // exactly what caused new nodes to pile up on top of existing ones once there
  // were more than fit in one screenful.
  function clampToCanvas(x: number, y: number, _type: ActivityNodeType): { x: number; y: number } {
    return { x: Math.max(x, 0), y: Math.max(y, 0) };
  }

  function createActionAt(label: string, x: number, y: number) {
    const pos = clampToCanvas(x, y, 'action');
    commit({ ...diagram, nodes: [...diagram.nodes, { id: uid('node'), type: 'action', name: label, ...pos }] });
    setAnnouncement(`Đã thêm hành động ${label} vào canvas`);
  }

  function createStructuralAt(type: ActivityNodeType, x: number, y: number) {
    const pos = clampToCanvas(x, y, type);
    commit({ ...diagram, nodes: [...diagram.nodes, { id: uid('node'), type, ...pos }] });
    setAnnouncement(`Đã thêm node ${type}`);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeData = active.data.current as
      | { kind: 'move-node'; nodeId?: string }
      | { kind: 'palette-action'; item: PaletteItem }
      | { kind: 'palette-structural'; type: ActivityNodeType }
      | undefined;
    if (!activeData) return;

    if (activeData.kind === 'move-node' && activeData.nodeId) {
      const nodeId = activeData.nodeId;
      const node = diagram.nodes.find((n) => n.id === nodeId);
      if (!node) return;
      commit({
        ...diagram,
        nodes: diagram.nodes.map((n) =>
          n.id === nodeId
            ? { ...n, x: Math.max(0, n.x + event.delta.x / zoom), y: Math.max(0, n.y + event.delta.y / zoom) }
            : n
        ),
      });
      return;
    }

    if (over?.id !== 'canvas-root') return;
    const activeRect = active.rect.current.translated;
    const canvasEl = containerRef.current;
    if (!activeRect || !canvasEl) return;
    const bounds = canvasEl.getBoundingClientRect();
    // Screen-space offset within the visible viewport, PLUS however far the container
    // is currently scrolled, converted from screen pixels back to diagram coordinates
    // by dividing out the zoom factor — without the scroll term this silently placed
    // nodes at the wrong spot any time the canvas was scrolled away from the top-left.
    const dropX = (activeRect.left + activeRect.width / 2 - bounds.left + canvasEl.scrollLeft) / zoom;
    const dropY = (activeRect.top + activeRect.height / 2 - bounds.top + canvasEl.scrollTop) / zoom;

    if (activeData.kind === 'palette-action') {
      createActionAt(activeData.item.label, dropX - nodeBox('action').width / 2, dropY - nodeBox('action').height / 2);
    } else if (activeData.kind === 'palette-structural') {
      const box = nodeBox(activeData.type);
      createStructuralAt(activeData.type, dropX - box.width / 2, dropY - box.height / 2);
    }
  }

  function handleKeyboardDrop(target: { kind: 'canvas' } | { kind: 'node'; nodeId: string }) {
    if (!liftedItem) return;
    const idx = diagram.nodes.length;
    const basePos = target.kind === 'node' ? diagram.nodes.find((n) => n.id === target.nodeId) : undefined;
    const grid = defaultGridPlacement(idx);
    const x = basePos ? basePos.x + 24 : grid.x;
    const y = basePos ? basePos.y + 24 : grid.y;
    setLiftedItem(null);

    if (liftedItem.source === 'lesson') {
      const item = palette[liftedItem.index];
      if (item) createActionAt(item.label, x, y);
    } else {
      const entry = STRUCTURAL_PALETTE[liftedItem.index];
      if (entry) createStructuralAt(entry.type, x, y);
    }
  }

  function toggleLift(item: LiftedItem) {
    setLiftedItem((current) => (current && current.source === item.source && current.index === item.index ? null : item));
    setConnectSourceId(null);
  }

  function addTypedAction() {
    const name = newActionName.trim();
    if (!name) return;
    const grid = defaultGridPlacement(diagram.nodes.length);
    createActionAt(name, grid.x, grid.y);
    setNewActionName('');
    setAddingAction(false);
  }

  const ZOOM_MIN = 0.25;
  const ZOOM_MAX = 2;

  function zoomBy(delta: number) {
    setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + delta) * 100) / 100)));
  }

  function zoomToFit() {
    const el = containerRef.current;
    if (!el || diagram.nodes.length === 0) {
      setZoom(1);
      return;
    }
    const content = tightContentBounds(diagram);
    const fitW = el.clientWidth / content.width;
    const fitH = el.clientHeight / content.height;
    setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.min(fitW, fitH))));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="md:w-44 flex-shrink-0 flex flex-col gap-3">
          <div className="flex flex-row md:flex-col flex-wrap gap-2">
            {palette.map((item, idx) => (
              <PaletteChip
                key={`lesson-${idx}`}
                label={item.label}
                dragId={`palette-lesson-${idx}`}
                dragData={{ kind: 'palette-action', item }}
                isLifted={liftedItem?.source === 'lesson' && liftedItem.index === idx}
                onToggleLift={() => toggleLift({ source: 'lesson', index: idx })}
                variant={item.kind === 'noun-trap' ? 'trap' : 'action'}
              />
            ))}
          </div>

          <div className="border-t border-gray-800 pt-2 flex flex-row md:flex-col flex-wrap gap-2">
            {STRUCTURAL_PALETTE.map((entry, idx) => (
              <PaletteChip
                key={`structural-${idx}`}
                label={entry.label}
                dragId={`palette-structural-${idx}`}
                dragData={{ kind: 'palette-structural', type: entry.type }}
                isLifted={liftedItem?.source === 'structural' && liftedItem.index === idx}
                onToggleLift={() => toggleLift({ source: 'structural', index: idx })}
                variant="structural"
              />
            ))}
          </div>

          {liftedItem !== null && (
            <div
              role="group"
              aria-label="Chọn nơi thả"
              className="flex flex-col gap-1.5 p-2 rounded-xl border border-success/40 bg-success/5"
            >
              <div className="text-[10px] font-bold text-emerald-300">Chọn nơi thả (Enter), Esc để hủy:</div>
              <button
                className="canvas-focusable px-2 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] text-gray-200 text-left"
                onClick={() => handleKeyboardDrop({ kind: 'canvas' })}
              >
                🖐️ Vùng canvas trống
              </button>
              {diagram.nodes.map((n) => (
                <button
                  key={n.id}
                  className="canvas-focusable px-2 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] text-gray-200 text-left"
                  onClick={() => handleKeyboardDrop({ kind: 'node', nodeId: n.id })}
                >
                  📦 {n.name ?? n.type}
                </button>
              ))}
            </div>
          )}

          {mode === 'pe' && (
            <div className="flex flex-col gap-2">
              {addingAction ? (
                <div className="flex flex-col gap-1">
                  <input
                    autoFocus
                    value={newActionName}
                    onChange={(e) => setNewActionName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addTypedAction();
                      if (e.key === 'Escape') setAddingAction(false);
                    }}
                    placeholder="Tên hành động..."
                    className="px-2 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addTypedAction}
                    className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                  >
                    Thêm
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingAction(true)}
                  className="px-3 py-2 rounded-xl border border-dashed border-gray-700 text-xs font-semibold text-gray-400 hover:border-gray-500 hover:text-gray-200"
                >
                  + Thêm hành động
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

        <div className="flex-1 min-w-0 relative">
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
            onStartConnectFromToolbar={armConnect}
            onDeleteSelected={removeNode}
            focusedNodeId={focusedNodeId}
            onFocusNode={setFocusedNodeId}
            onBlurNode={() => setFocusedNodeId(null)}
            containerRef={containerRef}
            zoom={zoom}
          />

          {/* Anchored to the top (not bottom) of the canvas box — on mobile the box is
              taller than the viewport, so a bottom-anchored control would sit below the
              fold until the user scrolls all the way down just to find the zoom buttons. */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1 px-1.5 py-1 rounded-xl bg-gray-900/90 border border-gray-700 shadow-lg">
            <button
              onClick={() => zoomBy(-0.1)}
              disabled={zoom <= ZOOM_MIN}
              aria-label="Thu nhỏ"
              className="w-7 h-7 rounded-lg text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
            >
              −
            </button>
            <button
              onClick={() => setZoom(1)}
              aria-label="Đặt lại 100%"
              className="px-2 h-7 rounded-lg text-[11px] font-bold text-gray-300 hover:bg-gray-800 tabular-nums"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => zoomBy(0.1)}
              disabled={zoom >= ZOOM_MAX}
              aria-label="Phóng to"
              className="w-7 h-7 rounded-lg text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
            >
              +
            </button>
            <div className="w-px h-5 bg-gray-700 mx-0.5" />
            <button
              onClick={zoomToFit}
              aria-label="Thu phóng vừa khung hình"
              title="Xem toàn bộ diagram"
              className="px-2 h-7 rounded-lg text-[11px] font-bold text-gray-300 hover:bg-gray-800"
            >
              ⤢ Fit
            </button>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
