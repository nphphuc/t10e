import type { BuilderStepId, FeedbackItem } from './engine/types';

interface LessonContentPanelProps {
  title: string;
  brief: string[];
  stepId: BuilderStepId;
  stepIndex: number;
  totalSteps: number;
  feedback: FeedbackItem[];
  canAdvance: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onFeedbackItemClick?: (subjectId?: string) => void;
}

const STEP_INSTRUCTIONS: Record<BuilderStepId, string> = {
  'find-classes': 'Kéo các class cần thiết từ palette vào canvas. Cẩn thận: không phải mọi thẻ trong palette đều là class!',
  'place-attributes': 'Kéo từng attribute vào đúng class tương ứng.',
  'draw-associations': 'Click vào 1 class rồi click class kia để nối quan hệ (association).',
  'set-multiplicity': 'Mở từng quan hệ (click vào đường nối) và chọn multiplicity đúng cho mỗi đầu.',
  'choose-edge-types': 'Xác định quan hệ nào là composition/aggregation (whole-part) và chỉnh loại quan hệ cho đúng.',
  'association-class':
    'Với dữ liệu thuộc về quan hệ (không thuộc riêng class nào): kéo class đó vào canvas, bấm biểu tượng ◇ ở góc trên-phải để đánh dấu là association class, rồi click vào class đó và click vào quan hệ cần gắn.',
  compare: 'So sánh bài làm của bạn với bản tham chiếu bên dưới.',
  'free-build': 'Tự dựng toàn bộ class diagram theo mô tả nghiệp vụ.',
  review: 'Xem điểm và đối chiếu với bản tham chiếu.',
};

const SEVERITY_STYLES: Record<FeedbackItem['severity'], string> = {
  ok: 'border-success/40 bg-success/5 text-emerald-300',
  hint: 'border-blue-500/40 bg-blue-500/5 text-blue-300',
  warn: 'border-control/50 bg-control/10 text-amber-300',
  error: 'border-error/50 bg-error/10 text-red-300',
};

const SEVERITY_ICON: Record<FeedbackItem['severity'], string> = {
  ok: '✓',
  hint: '💡',
  warn: '⚠️',
  error: '✕',
};

export default function LessonContentPanel({
  title,
  brief,
  stepId,
  stepIndex,
  totalSteps,
  feedback,
  canAdvance,
  isLastStep,
  onNext,
  onFeedbackItemClick,
}: LessonContentPanelProps) {
  const blockingItem = feedback.find((f) => f.severity === 'warn' || f.severity === 'error');

  return (
    <div className="w-full md:w-[360px] flex-shrink-0 flex flex-col gap-4 bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
      <div>
        <h2 className="text-sm font-extrabold text-gray-100">{title}</h2>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          Bước {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      <div className="space-y-1.5">
        {brief.map((line, idx) => (
          <p key={idx} className="text-xs text-gray-400 leading-relaxed">
            {line}
          </p>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-blue-950/10 border border-blue-900/20 text-xs text-blue-200 leading-relaxed">
        {STEP_INSTRUCTIONS[stepId]}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5" aria-live="polite">
        {feedback.length === 0 && (
          <div className="text-xs text-gray-500 italic p-2">Chưa có phản hồi — hãy bắt đầu dựng diagram.</div>
        )}
        {feedback.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onFeedbackItemClick?.(item.subjectId)}
            className={`w-full text-left px-3 py-2 rounded-xl border text-[11px] leading-relaxed transition-colors ${SEVERITY_STYLES[item.severity]}`}
          >
            <span className="mr-1.5" aria-hidden="true">
              {SEVERITY_ICON[item.severity]}
            </span>
            {item.message}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!canAdvance}
        title={!canAdvance && blockingItem ? blockingItem.message : undefined}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
          canAdvance
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLastStep ? 'Hoàn thành' : 'Tiếp ➔'}
      </button>
    </div>
  );
}
