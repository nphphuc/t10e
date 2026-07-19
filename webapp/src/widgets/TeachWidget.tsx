import {
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useEffect,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { track } from '../engine/analytics';

// ── Block type definitions ────────────────────────────────────────────────────

export interface TextBlock {
  kind: 'text';
  text: string;
}

export interface RevealBlock {
  kind: 'reveal';
  items: string[];
}

export interface FigureBlock {
  kind: 'figure';
  visual: {
    variant: string;
    sandbox?: true;
    [key: string]: unknown;
  };
}

export interface PredictBlock {
  kind: 'predict';
  prompt: string;
  options: string[];
  /** Short summary shown after reveal: "correct answer was X" */
  outcome: string;
  /** Longer explanation of why */
  explain: string;
  /** Misconception tag theo option index (giữ từ màn quiz gốc khi convert) */
  distractorTags?: Record<string, string | null>;
  /** Index option "đúng như dự đoán" (từ field correct của quiz gốc) — để prefix + highlight */
  expected?: number;
}

export type TeachBlock = TextBlock | RevealBlock | FigureBlock | PredictBlock;

export interface TeachScreen {
  id: string;
  role: string;
  type: 'teach';
  title?: string;
  blocks: TeachBlock[];
  /** For analytics only — the lesson id this screen belongs to */
  _lessonId?: string;
}

// ── Ref handle exposed to LessonPlayer ───────────────────────────────────────
export interface TeachWidgetHandle {
  /**
   * Called when the user presses the single CTA button (or Enter).
   * Returns `true`  → still advancing through reveal / predict — button stays "Tiếp tục"
   *         `false` → screen is finished — LessonPlayer should advance to next screen
   */
  next: () => boolean;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TextBlockView({ block }: { block: TextBlock }) {
  return (
    <p className="text-gray-200 leading-relaxed text-[15px] whitespace-pre-line">
      {block.text}
    </p>
  );
}

interface RevealBlockViewProps {
  block: RevealBlock;
  /** @deprecated không còn dùng — reveal hiện tất cả ngay */
  revealedCount: number;
}
function RevealBlockView({ block }: RevealBlockViewProps) {
  const shouldReduceMotion = useReducedMotion();
  // Hiện TẤT CẢ đoạn cùng lúc, vào so le 120ms/đoạn — không bắt người học
  // bấm từng đoạn (feedback: 3 lần bấm chỉ để đọc là friction).
  return (
    <div className="space-y-3">
      {block.items.map((item, idx) => (
        <motion.p
          key={idx}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            delay: shouldReduceMotion ? 0 : idx * 0.12,
          }}
          className="text-gray-200 leading-relaxed text-[15px]"
        >
          {item}
        </motion.p>
      ))}
    </div>
  );
}

interface PredictBlockViewProps {
  block: PredictBlock;
  revealed: boolean;
  selectedIdx: number | null;
  onSelect: (idx: number) => void;
}
function PredictBlockView({
  block,
  revealed,
  selectedIdx,
  onSelect,
}: PredictBlockViewProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-4">
      <p className="text-gray-300 font-semibold text-sm leading-relaxed">
        {block.prompt}
      </p>
      <div className="space-y-2">
        {block.options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const hasExpected = typeof block.expected === 'number';
          const isExpected = hasExpected && block.expected === idx;

          let cls = 'border-gray-700 bg-gray-800/40 text-gray-300 hover:border-gray-600 hover:bg-gray-800/70';
          if (!revealed && isSelected) {
            cls = 'border-blue-500 bg-blue-500/15 text-blue-100';
          } else if (revealed) {
            if (isExpected) {
              // Đáp án khớp outcome: highlight success (không phạt option khác)
              cls = 'border-success bg-success/10 text-success font-semibold';
            } else if (isSelected) {
              cls = 'border-blue-500/50 bg-blue-500/10 text-blue-300';
            } else {
              cls = 'border-gray-800 bg-gray-900/30 text-gray-500';
            }
          }
          return (
            <button
              key={idx}
              disabled={revealed}
              onClick={() => onSelect(idx)}
              aria-pressed={isSelected}
              className={`w-full text-left px-4 py-3 rounded-xl border text-[14px] font-medium transition-all ${cls}`}
            >
              <span className="flex items-start gap-2">
                {revealed && isExpected && <span aria-hidden="true">✓</span>}
                {revealed && isSelected && !isExpected && <span aria-hidden="true">→</span>}
                <span>{opt}</span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && (() => {
          const hasExpected = typeof block.expected === 'number';
          const matched = hasExpected && selectedIdx === block.expected;
          const prefix = !hasExpected
            ? null
            : matched
              ? 'Đúng như bạn dự đoán!'
              : 'Hơi khác dự đoán của bạn — cùng xem:';
          return (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className={`rounded-2xl border p-4 space-y-2 ${
                matched
                  ? 'border-success/40 bg-success/10'
                  : 'border-blue-500/30 bg-blue-500/10'
              }`}
              role="status"
              aria-live="polite"
            >
              {prefix && (
                <div className={`font-bold text-xs uppercase tracking-wide ${matched ? 'text-success' : 'text-blue-400'}`}>
                  {prefix}
                </div>
              )}
              <div className={`font-bold text-sm flex items-center gap-1.5 ${matched ? 'text-success' : 'text-blue-300'}`}>
                <span>🔍</span>
                <span>{block.outcome}</span>
              </div>
              <p className="text-gray-300 text-[14px] leading-relaxed">
                {block.explain}
              </p>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// ── Main TeachWidget ──────────────────────────────────────────────────────────

interface TeachWidgetProps {
  screen: TeachScreen;
}

const TeachWidget = forwardRef<TeachWidgetHandle, TeachWidgetProps>(
  function TeachWidget({ screen }, ref) {
    // For multi-block screens we track: which block we're "in" and sub-state per block
    const blocks = screen.blocks;

    // reveal items hiện tất cả ngay khi vào màn — không cần state đếm nữa

    // predictState[blockIdx] = { selected: number|null, revealed: boolean }
    const [predictStates, setPredictStates] = useState<
      { selected: number | null; revealed: boolean }[]
    >(blocks.map(() => ({ selected: null, revealed: false })));

    // Reset on screen change
    useEffect(() => {
      setPredictStates(blocks.map(() => ({ selected: null, revealed: false })));
    }, [screen.id]);

    // Expose next() to parent (LessonPlayer)
    useImperativeHandle(
      ref,
      () => ({
        next(): boolean {
          // Find the first block that still has "more to do"
          for (let i = 0; i < blocks.length; i++) {
            const b = blocks[i];

            // reveal: mọi đoạn hiện ngay khi vào màn (stagger) — CTA không quản lý nữa

            if (b.kind === 'predict') {
              const state = predictStates[i];
              // Outcome hiện NGAY khi chọn option (trong handlePredictSelect).
              // Ở đây chỉ chặn chuyển màn khi người học chưa chọn.
              if (!state.revealed) {
                return true; // must engage with predict first
              }
            }
          }

          // All blocks exhausted → tell LessonPlayer to advance
          return false;
        },
      }),
      [blocks, predictStates, screen]
    );

    const handlePredictSelect = useCallback(
      (blockIdx: number, optionIdx: number) => {
        const b = blocks[blockIdx];
        if (!b || b.kind !== 'predict') return;
        let didReveal = false;
        setPredictStates((prev) => {
          if (prev[blockIdx].revealed) return prev; // already revealed, ignore
          didReveal = true;
          const next = [...prev];
          // Chọn là reveal outcome NGAY — một chạm, không cần bấm CTA thêm
          next[blockIdx] = { selected: optionIdx, revealed: true };
          return next;
        });
        if (didReveal) {
          // Fire analytics with graded:false flag so misconception data isn't lost
          const selTag = b.distractorTags?.[String(optionIdx)];
          track('interaction_answered', {
            itemId: `${screen._lessonId ?? ''}-${screen.id}-predict-${blockIdx}`,
            type: 'predict',
            correct: null, // predict has no correct/wrong
            attempt: 1,
            hintUsed: 0,
            misconceptionTags: selTag ? [selTag] : [],
            durationMs: 0,
            lessonId: screen._lessonId ?? '',
            graded: false,
          });
        }
      },
      [blocks, screen]
    );

    // Lazy-load VisualWidget to avoid circular import
    const [VisualWidgetComp, setVisualWidgetComp] = useState<React.ComponentType<any> | null>(null);
    useEffect(() => {
      import('../widgets/VisualWidget').then((m) =>
        setVisualWidgetComp(() => m.default)
      );
    }, []);

    return (
      <div className="space-y-6" role="article" aria-label={screen.title ?? 'Màn học'}>
        {blocks.map((block, idx) => {
          if (block.kind === 'text') {
            return <TextBlockView key={idx} block={block} />;
          }

          if (block.kind === 'reveal') {
            return (
              <RevealBlockView
                key={idx}
                block={block}
                revealedCount={block.items.length}
              />
            );
          }

          if (block.kind === 'figure') {
            if (!VisualWidgetComp) {
              return (
                <div key={idx} className="text-gray-500 text-sm italic">
                  Đang tải hình minh hoạ...
                </div>
              );
            }
            const fakeData = {
              prompt: screen.title ?? '',
              visual: { ...block.visual, sandbox: true },
            };
            return (
              <div key={idx} className="rounded-2xl overflow-hidden border border-gray-700/60">
                <VisualWidgetComp
                  data={fakeData}
                  selectedAnswer={null}
                  onAnswer={() => {}}
                  isSubmitted={false}
                  disabledOptions={[]}
                  sandbox={true}
                />
              </div>
            );
          }

          if (block.kind === 'predict') {
            return (
              <PredictBlockView
                key={idx}
                block={block}
                revealed={predictStates[idx]?.revealed ?? false}
                selectedIdx={predictStates[idx]?.selected ?? null}
                onSelect={(optIdx) => handlePredictSelect(idx, optIdx)}
              />
            );
          }


          return null;
        })}
      </div>
    );
  }
);

export default TeachWidget;
