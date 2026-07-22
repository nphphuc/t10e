import type { ActivityEdge, ActivityNode } from '../engine/types';

interface GuardEditorProps {
  edge: ActivityEdge;
  fromNode: ActivityNode;
  toNode: ActivityNode;
  fromIsDecision: boolean;
  onUpdate: (patch: Partial<ActivityEdge>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function GuardEditor({ edge, fromNode, toNode, fromIsDecision, onUpdate, onDelete, onClose }: GuardEditorProps) {
  const fromLabel = fromNode.name ?? fromNode.type;
  const toLabel = toNode.name ?? toNode.type;

  return (
    <div
      role="dialog"
      aria-label={`Chỉnh sửa luồng từ ${fromLabel} tới ${toLabel}`}
      className="absolute z-40 w-64 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4 space-y-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-gray-200">
          {fromLabel} → {toLabel}
        </div>
        <button onClick={onClose} aria-label="Đóng" className="text-gray-500 hover:text-gray-300 text-sm">
          ✕
        </button>
      </div>

      <div>
        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
          Điều kiện (guard){fromIsDecision ? ' — bắt buộc' : ' — tùy chọn'}
        </label>
        <input
          autoFocus
          value={edge.guard ?? ''}
          onChange={(e) => onUpdate({ guard: e.target.value || undefined })}
          placeholder={fromIsDecision ? 'vd. [Hư hỏng]' : '(để trống nếu không cần)'}
          className="w-full px-2 py-1.5 rounded-lg bg-gray-950 border border-gray-700 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {fromIsDecision && !edge.guard && (
          <p className="text-[10px] text-amber-400 mt-1">Nhánh ra khỏi decision cần có điều kiện.</p>
        )}
      </div>

      <button
        onClick={onDelete}
        className="w-full px-2 py-1.5 rounded-lg bg-error/20 hover:bg-error/30 text-red-300 text-[11px] font-bold"
      >
        🗑️ Xóa luồng này
      </button>
    </div>
  );
}
