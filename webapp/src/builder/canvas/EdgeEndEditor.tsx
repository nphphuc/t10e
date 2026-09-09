import { useEffect, useRef, useState } from 'react';
import type { DiagramEdge, DiagramNode, EdgeType, Multiplicity } from '../engine/types';
import DeleteWholeSim from './DeleteWholeSim';
import InstancePreview from './InstancePreview';

const multiplicities: Multiplicity[] = ['1', '0..1', '1..*', '0..*'];
const edgeTypes: { value: EdgeType; label: string }[] = [
  { value: 'association', label: '— Association' },
  { value: 'aggregation', label: '◇ Aggregation' },
  { value: 'composition', label: '◆ Composition' },
  { value: 'generalization', label: '△ Generalization' },
];

export default function EdgeEndEditor({
  edge,
  from,
  to,
  associationClasses,
  onChange,
  onDelete,
}: {
  edge: DiagramEdge;
  from: DiagramNode;
  to: DiagramNode;
  associationClasses: DiagramNode[];
  onChange: (edge: DiagramEdge) => void;
  onDelete: () => void;
}) {
  const [nameDraft, setNameDraft] = useState(edge.name ?? '');
  const cancelNextNameCommit = useRef(false);
  useEffect(() => setNameDraft(edge.name ?? ''), [edge.id, edge.name]);

  const commitName = () => {
    if (cancelNextNameCommit.current) { cancelNextNameCommit.current = false; return; }
    const nextName = nameDraft.trim();
    if (nextName !== (edge.name ?? '')) onChange({ ...edge, name: nextName });
  };
  const updateMultiplicity = (side: 'from' | 'to', value: Multiplicity) => onChange({
    ...edge,
    multiplicity: { from: edge.multiplicity?.from ?? '1', to: edge.multiplicity?.to ?? '1', [side]: value },
  });
  const reverseEdge = () => onChange({
    ...edge,
    from: edge.to,
    to: edge.from,
    multiplicity: edge.multiplicity
      ? { from: edge.multiplicity.to, to: edge.multiplicity.from }
      : undefined,
  });
  return (
    <aside className="cdb-edge-editor" aria-label={`Chỉnh quan hệ ${from.name} đến ${to.name}`}>
      <div className="cdb-editor-heading"><strong>{from.name} ↔ {to.name}</strong><div><button type="button" onClick={reverseEdge}>Đảo chiều</button><button type="button" className="cdb-danger-button" onClick={onDelete}>Xóa edge</button></div></div>
      <label>Tên quan hệ<input
        value={nameDraft}
        onChange={(event) => setNameDraft(event.target.value)}
        onBlur={commitName}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
          if (event.key === 'Escape') { cancelNextNameCommit.current = true; setNameDraft(edge.name ?? ''); event.currentTarget.blur(); }
        }}
        placeholder="places, includes…"
      /></label>
      <fieldset>
        <legend>Loại quan hệ</legend>
        <div className="cdb-radio-grid">{edgeTypes.map((type) => <label key={type.value}><input type="radio" name={`edge-type-${edge.id}`} checked={edge.type === type.value} onChange={() => onChange({ ...edge, type: type.value, multiplicity: type.value === 'generalization' ? undefined : edge.multiplicity })} />{type.label}</label>)}</div>
      </fieldset>
      {edge.type !== 'generalization' && <div className="cdb-multiplicity-grid">
        <label>Phía {from.name}<select value={edge.multiplicity?.from ?? '1'} onChange={(event) => updateMultiplicity('from', event.target.value as Multiplicity)}>{multiplicities.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Phía {to.name}<select value={edge.multiplicity?.to ?? '1'} onChange={(event) => updateMultiplicity('to', event.target.value as Multiplicity)}>{multiplicities.map((value) => <option key={value}>{value}</option>)}</select></label>
      </div>}
      {(edge.type === 'aggregation' || edge.type === 'composition') && <p className="cdb-whole-part-note"><b>{edge.type === 'composition' ? '◆' : '◇'}</b> nằm phía <strong>{from.name}</strong> — {from.name} là whole (chứa), {to.name} là part.</p>}
      <label>Association class<select value={edge.attachedClassId ?? ''} onChange={(event) => onChange({ ...edge, attachedClassId: event.target.value || undefined })}><option value="">Không gắn</option>{associationClasses.map((node) => <option key={node.id} value={node.id}>{node.name}</option>)}</select></label>
      <InstancePreview edge={edge} from={from} to={to} />
      <DeleteWholeSim edge={edge} whole={from} part={to} />
    </aside>
  );
}
