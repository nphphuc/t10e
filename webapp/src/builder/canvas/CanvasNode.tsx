import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import type { DiagramNode } from '../engine/types';
import type { NodeSize } from './CanvasEdge';

interface CanvasNodeProps {
  node: DiagramNode;
  selected: boolean;
  connecting: boolean;
  connectionActive: boolean;
  readOnly?: boolean;
  compact?: boolean;
  edgeCount: number;
  onSelect: () => void;
  onStartConnect: () => void;
  onDelete: () => void;
  onAddAttribute: (name: string) => void;
  onRenameAttribute: (attributeId: string, name: string) => void;
  onDeleteAttribute: (attributeId: string) => void;
  onSizeChange: (nodeId: string, size: NodeSize) => void;
}

function EditableAttribute({ nodeName, attributeId, name, onCommit }: {
  nodeName: string;
  attributeId: string;
  name: string;
  onCommit: (attributeId: string, name: string) => void;
}) {
  const [draft, setDraft] = useState(name);
  const cancelNextCommit = useRef(false);
  useEffect(() => setDraft(name), [name]);
  const commit = () => {
    if (cancelNextCommit.current) { cancelNextCommit.current = false; return; }
    const nextName = draft.trim();
    if (!nextName) { setDraft(name); return; }
    if (nextName !== name) onCommit(attributeId, nextName);
  };
  return <input
    aria-label={`Sửa attribute ${name} của ${nodeName}`}
    value={draft}
    onClick={(event) => event.stopPropagation()}
    onBlur={commit}
    onKeyDown={(event) => {
      event.stopPropagation();
      if (event.key === 'Enter') event.currentTarget.blur();
      if (event.key === 'Escape') { cancelNextCommit.current = true; setDraft(name); event.currentTarget.blur(); }
    }}
    onChange={(event) => setDraft(event.target.value)}
  />;
}

export default function CanvasNode({
  node,
  selected,
  connecting,
  connectionActive,
  readOnly,
  compact,
  edgeCount,
  onSelect,
  onStartConnect,
  onDelete,
  onAddAttribute,
  onRenameAttribute,
  onDeleteAttribute,
  onSizeChange,
}: CanvasNodeProps) {
  const [draft, setDraft] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const draggable = useDraggable({
    id: `move:${node.id}`,
    data: { kind: 'node', nodeId: node.id },
    disabled: readOnly,
  });
  const droppable = useDroppable({ id: `node:${node.id}`, data: { kind: 'node-drop', nodeId: node.id } });
  const style = { left: node.x, top: node.y, width: compact ? 112 : undefined, transform: draggable.transform ? `translate3d(${draggable.transform.x}px, ${draggable.transform.y}px, 0)` : undefined };
  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onAddAttribute(value);
    setDraft('');
  };
  const requestDelete = () => {
    if (edgeCount > 0) {
      setConfirmingDelete(true);
      return;
    }
    onDelete();
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const reportSize = () => onSizeChange(node.id, { width: element.offsetWidth, height: element.offsetHeight });
    reportSize();
    const observer = new ResizeObserver(reportSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [node.id, onSizeChange]);

  return (
    <article
      ref={(element) => { elementRef.current = element; draggable.setNodeRef(element); droppable.setNodeRef(element); }}
      style={style}
      className={`cdb-node ${compact ? 'is-compact' : ''} ${node.type === 'associationClass' ? 'cdb-node--association' : ''} ${selected ? 'is-selected' : ''} ${connecting ? 'is-connecting' : ''} ${droppable.isOver ? 'is-drop-target' : ''}`}
      role="group"
      aria-label={`${node.type === 'associationClass' ? 'Association class' : 'Class'} ${node.name}, ${node.attributes.length} thuộc tính`}
      tabIndex={0}
      onClick={(event) => { event.stopPropagation(); onSelect(); }}
      onKeyDownCapture={(event) => {
        if (event.key !== 'Enter' || !connectionActive || connecting) return;
        const tagName = (event.target as HTMLElement).tagName;
        if (tagName === 'INPUT' || tagName === 'BUTTON' || tagName === 'SELECT') return;
        event.preventDefault();
        event.stopPropagation();
        onSelect();
      }}
      onKeyDown={(event) => {
        if ((event.key === 'n' || event.key === 'N') && !readOnly) { event.preventDefault(); onStartConnect(); }
        if ((event.key === 'Delete' || event.key === 'Backspace') && !readOnly && event.target === event.currentTarget) {
          event.preventDefault();
          event.stopPropagation();
          requestDelete();
        }
      }}
    >
      {!readOnly && <button type="button" className="cdb-node__delete-trigger" aria-label={`Xóa class ${node.name}`} title="Xóa class" onClick={(event) => { event.stopPropagation(); requestDelete(); }}>🗑</button>}
      {confirmingDelete && <div className="cdb-node__delete-confirm" role="alertdialog" aria-label={`Xác nhận xóa class ${node.name}`} onClick={(event) => event.stopPropagation()}>
        <p>Xóa {node.name}? {edgeCount} quan hệ nối vào sẽ bị xóa theo.</p>
        <div><button type="button" className="cdb-danger-button" onClick={onDelete}>Xóa</button><button type="button" onClick={() => setConfirmingDelete(false)}>Hủy</button></div>
      </div>}
      <header className="cdb-node__header" {...(!readOnly ? draggable.listeners : {})} {...(!readOnly ? draggable.attributes : {})}>
        <span><small>{node.type === 'associationClass' ? '«association class»' : 'class'}</small>{node.name}</span>
        {!readOnly && <span className="cdb-drag-hint" aria-hidden="true">⠿ Kéo</span>}
      </header>
      <div className="cdb-node__attributes">
        {node.attributes.length === 0 && <p className="cdb-empty-row">attributes…</p>}
        {node.attributes.map((attribute) => (
          <div className="cdb-attribute-row" key={attribute.id}>
            <span aria-hidden="true">+</span>
            {readOnly ? <span>{attribute.name}</span> : (
              <EditableAttribute nodeName={node.name} attributeId={attribute.id} name={attribute.name} onCommit={onRenameAttribute} />
            )}
            {!readOnly && (
              <button type="button" className="cdb-icon-button" aria-label={`Xóa attribute ${attribute.name}`} onClick={(event) => { event.stopPropagation(); onDeleteAttribute(attribute.id); }}>×</button>
            )}
          </div>
        ))}
      </div>
      {!readOnly && (
        <div className="cdb-node__tools" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={onStartConnect} title="Phím tắt N">Nối</button>
          <input
            value={draft}
            placeholder="attribute"
            aria-label={`Attribute mới cho ${node.name}`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => { event.stopPropagation(); if (event.key === 'Enter') add(); }}
          />
          <button type="button" onClick={add} aria-label={`Thêm attribute vào ${node.name}`}>+</button>
        </div>
      )}
    </article>
  );
}
