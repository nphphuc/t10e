import type { DiagramEdge, DiagramNode, EdgeType, Multiplicity } from '../engine/types';
import InstancePreview from './InstancePreview';
import DeleteWholeSim from './DeleteWholeSim';

interface EdgeEndEditorProps {
  edge: DiagramEdge;
  fromNode: DiagramNode;
  toNode: DiagramNode;
  onUpdate: (patch: Partial<DiagramEdge>) => void;
  onDelete: () => void;
  onClose: () => void;
}

const MULTIPLICITY_OPTIONS: Multiplicity[] = ['1', '0..1', '1..*', '0..*'];

const EDGE_TYPES: { value: EdgeType; label: string; icon: string }[] = [
  { value: 'association', label: 'Association', icon: '——' },
  { value: 'aggregation', label: 'Aggregation', icon: '◇——' },
  { value: 'composition', label: 'Composition', icon: '◆——' },
  { value: 'generalization', label: 'Generalization', icon: '▷——' },
];

export default function EdgeEndEditor({ edge, fromNode, toNode, onUpdate, onDelete, onClose }: EdgeEndEditorProps) {
  const multiplicity = edge.multiplicity ?? { from: '1' as Multiplicity, to: '0..*' as Multiplicity };

  return (
    <div
      role="dialog"
      aria-label={`Chỉnh sửa quan hệ giữa ${fromNode.name} và ${toNode.name}`}
      className="absolute z-40 w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4 space-y-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-gray-200">
          {fromNode.name} → {toNode.name}
        </div>
        <button onClick={onClose} aria-label="Đóng" className="text-gray-500 hover:text-gray-300 text-sm">
          ✕
        </button>
      </div>

      <div>
        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">Tên quan hệ</label>
        <input
          value={edge.name ?? ''}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="vd. places, includes..."
          className="w-full px-2 py-1.5 rounded-lg bg-gray-950 border border-gray-700 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <fieldset>
        <legend className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Loại quan hệ</legend>
        <div className="grid grid-cols-2 gap-1.5">
          {EDGE_TYPES.map((t) => (
            <label
              key={t.value}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-semibold cursor-pointer ${
                edge.type === t.value ? 'border-blue-500 bg-blue-500/10 text-blue-200' : 'border-gray-700 text-gray-400'
              }`}
            >
              <input
                type="radio"
                name={`edge-type-${edge.id}`}
                className="sr-only"
                checked={edge.type === t.value}
                onChange={() => onUpdate({ type: t.value })}
              />
              <span aria-hidden="true">{t.icon}</span>
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      {edge.type !== 'generalization' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
              Multiplicity ({fromNode.name})
            </label>
            <select
              value={multiplicity.from}
              onChange={(e) => onUpdate({ multiplicity: { ...multiplicity, from: e.target.value as Multiplicity } })}
              className="w-full px-2 py-1.5 rounded-lg bg-gray-950 border border-gray-700 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MULTIPLICITY_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
              Multiplicity ({toNode.name})
            </label>
            <select
              value={multiplicity.to}
              onChange={(e) => onUpdate({ multiplicity: { ...multiplicity, to: e.target.value as Multiplicity } })}
              className="w-full px-2 py-1.5 rounded-lg bg-gray-950 border border-gray-700 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MULTIPLICITY_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {edge.type !== 'generalization' && (
        <InstancePreview fromLabel={fromNode.name} toLabel={toNode.name} multiplicity={multiplicity} />
      )}

      {(edge.type === 'composition' || edge.type === 'aggregation') && (
        <DeleteWholeSim wholeLabel={fromNode.name} partLabel={toNode.name} relationship={edge.type} />
      )}

      <button
        onClick={onDelete}
        className="w-full px-3 py-1.5 rounded-lg bg-error/10 hover:bg-error/20 border border-error/40 text-red-300 text-[11px] font-bold"
      >
        🗑️ Xóa quan hệ này
      </button>
    </div>
  );
}
