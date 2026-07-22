import type { BuilderLesson, BuilderStepId, FeedbackItem } from './engine/types';

const STEP_META: Record<BuilderStepId, { eyebrow: string; title: string; instruction: string }> = {
  'find-classes': { eyebrow: 'V2 · Danh từ', title: 'Tìm tập class', instruction: 'Kéo các danh từ miền nghiệp vụ vào canvas. Thử cả bẫy để quan sát phản hồi có lý do.' },
  'place-attributes': { eyebrow: 'V3 · Trách nhiệm', title: 'Đặt attribute đúng chủ', instruction: 'Kéo attribute trúng class hoặc nhập trực tiếp. Click vào attribute đã tạo để sửa ngay.' },
  'draw-associations': { eyebrow: 'V4 · Cấu trúc', title: 'Nối các quan hệ', instruction: 'Chọn class nguồn, bấm Nối hoặc phím N, rồi chọn class đích. Tên association nên là động từ.' },
  'set-multiplicity': { eyebrow: 'V5 · Lực lượng', title: 'Đặt multiplicity từng đầu', instruction: 'Chọn từng edge và điều chỉnh hai đầu. Instance Preview sẽ diễn đạt lựa chọn ở mức object.' },
  'choose-edge-types': { eyebrow: 'V6 · Vòng đời', title: 'Phân biệt loại quan hệ', instruction: 'Dùng thí nghiệm xóa whole để phân biệt aggregation và composition; kiểm tra chiều generalization.' },
  'association-class': { eyebrow: 'V7 · Dữ liệu quan hệ', title: 'Gắn association class', instruction: 'Tạo Association class, thêm dữ liệu giao dịch, rồi chọn edge để gắn class đó.' },
  compare: { eyebrow: 'Compare · Evidence', title: 'Đối chiếu cấu trúc', instruction: 'So bản của bạn với target graph. Máy chấm là gợi ý, không phải phán quyết.' },
  'free-build': { eyebrow: 'PE · Constructed response', title: 'Tự dựng diagram', instruction: 'Tự gõ class/attribute và dựng toàn bộ cấu trúc từ brief. Không có palette gợi ý.' },
  review: { eyebrow: 'PE · Rubric', title: 'Rubric và đối chiếu', instruction: 'Xem điểm từng nhóm, diff cụ thể và target graph. Máy chấm là gợi ý, không phải phán quyết.' },
};

export default function LessonContentPanel({
  lesson,
  step,
  stepIndex,
  feedback,
  canContinue,
  onContinue,
  onExit,
  onFeedbackSelect,
}: {
  lesson: BuilderLesson;
  step: BuilderStepId;
  stepIndex: number;
  feedback: FeedbackItem[];
  canContinue: boolean;
  onContinue: () => void;
  onExit: () => void;
  onFeedbackSelect: (subjectId: string) => void;
}) {
  const meta = STEP_META[step];
  const blockers = feedback.filter((item) => item.severity === 'warn' || item.severity === 'error');
  return (
    <aside className="cdb-lesson-panel">
      <button type="button" className="cdb-back-link" onClick={onExit}>← Builder Hub</button>
      <div className="cdb-step-progress"><span>{meta.eyebrow}</span><span>Bước {stepIndex + 1}/{lesson.steps.length}</span></div>
      <div className="cdb-progress-track"><i style={{ width: `${((stepIndex + 1) / lesson.steps.length) * 100}%` }} /></div>
      <h1>{meta.title}</h1>
      <p className="cdb-instruction">{meta.instruction}</p>
      <details open className="cdb-brief"><summary>Brief nghiệp vụ</summary><ul>{lesson.brief.map((line) => <li key={line}>{line}</li>)}</ul></details>
      <section className="cdb-feedback" aria-live="polite">
        <header><span>Live structural feedback</span><span>{blockers.length ? `${blockers.length} việc cần xử lý` : 'Sẵn sàng tiếp tục'}</span></header>
        {feedback.length === 0 ? (
          <div className="cdb-feedback-item is-ok"><b>✓ Principle đã đứng vững</b><p>Cấu trúc hiện tại đáp ứng yêu cầu của bước này.</p></div>
        ) : feedback.map((item, index) => {
          const content = <><b>{item.severity === 'hint' ? 'Gợi ý' : item.severity === 'warn' ? 'Cần xem lại' : 'Thông tin'}</b><p>{item.message}</p>{item.tag && <code>{item.tag}</code>}</>;
          return item.subjectId ? (
            <button
              type="button"
              className={`cdb-feedback-item is-${item.severity}`}
              key={`${item.tag ?? 'item'}-${item.subjectId}-${item.message}-${index}`}
              onClick={() => onFeedbackSelect(item.subjectId!)}
              title="Hiển thị phần tử này trên canvas"
            >
              {content}
            </button>
          ) : (
            <div className={`cdb-feedback-item is-${item.severity}`} key={`${item.tag ?? 'item'}-none-${item.message}-${index}`}>{content}</div>
          );
        })}
      </section>
      <button
        type="button"
        className="cdb-primary-action"
        disabled={!canContinue}
        title={!canContinue ? blockers[0]?.message : undefined}
        onClick={onContinue}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          onContinue();
        }}
      >
        {step === 'free-build' ? 'Chấm theo rubric →' : step === 'review' || step === 'compare' ? 'Hoàn thành →' : 'Tiếp tục với artifact này →'}
      </button>
      {!canContinue && blockers[0] && <p className="cdb-lock-note">Nút đang khóa: {blockers[0].message}</p>}
    </aside>
  );
}
