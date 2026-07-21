import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import type { DiagramNode } from '../engine/types';
import type { NodeSize } from './CanvasEdge';

interface CanvasNodeProps {
  node: DiagramNode;
  selected: boolean;
  connecting: boolean;
  readOnly?: boolean;
  compact?: boolean;
  onSelect: () => void;
  onStartConnect: () => void;
  onDelete: () => void;
  onAddAttribute: (name: string) => void;
  onRenameAttribute: (attributeId: string, name: string) => void;
  onDeleteAttribute: (attributeId: string) => void;
  onSizeChange: (nodeId: string, size: NodeSize) => void;
}

export default function CanvasNode({
  node,
  selected,
  connecting,
  readOnly,
  compact,
  onSelect,
  onStartConnect,
  onDelete,
  onAddAttribute,
  onRenameAttribute,
  onDeleteAttribute,
  onSizeChange,
}: CanvasNodeProps) {
  const [draft, setDraft] = useState('');
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
      onKeyDown={(event) => {
        if ((event.key === 'n' || event.key === 'N') && !readOnly) { event.preventDefault(); onStartConnect(); }
        if ((event.key === 'Delete' || event.key === 'Backspace') && !readOnly && event.target === event.currentTarget) { event.preventDefault(); onDelete(); }
        if (event.key === 'Enter' && connecting) { event.preventDefault(); onSelect(); }
      }}
    >
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
              <input
                aria-label={`Sửa attribute ${attribute.name} của ${node.name}`}
                value={attribute.name}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                onChange={(event) => onRenameAttribute(attribute.id, event.target.value)}
              />
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
          <button type="button" className="cdb-danger-button" onClick={onDelete} aria-label={`Xóa class ${node.name}`}>⌫</button>
        </div>
      )}
    </article>
  );
}
