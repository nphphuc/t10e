import { useEffect, useMemo, useRef, useState } from 'react';
import ClassDiagramCanvas from './canvas/ClassDiagramCanvas';
import LessonContentPanel from './LessonContentPanel';
import ReviewScreen from './ReviewScreen';
import { STEP_VALIDATORS, diffDiagram } from './engine/validate';
import { scoreDiagram } from './engine/scoring';
import { buildReferenceDiagram } from './engine/reference';
import type { BuilderLesson, DiagramState, FeedbackItem } from './engine/types';
import { useMistakesStore } from '../store/mistakes';

interface ClassDiagramBuilderScreenProps {
  lesson: BuilderLesson;
  initialDiagram?: DiagramState;
  initialStepIndex?: number;
  onProgress?: (diagram: DiagramState, stepIndex: number) => void;
  onComplete?: () => void;
}

function emptyDiagram(): DiagramState {
  return { nodes: [], edges: [] };
}

// PE's free-build step is intentionally ungated (no "Kiểm tra" button, no incremental
// hints) — feedback and scoring only appear once the learner reaches 'review'.
const UNGATED_STEPS = new Set(['free-build']);
const REVIEW_STEPS = new Set(['compare', 'review']);

export default function ClassDiagramBuilderScreen({
  lesson,
  initialDiagram,
  initialStepIndex = 0,
  onProgress,
  onComplete,
}: ClassDiagramBuilderScreenProps) {
  const [diagram, setDiagram] = useState<DiagramState>(initialDiagram ?? emptyDiagram());
  const [stepIndex, setStepIndex] = useState(initialStepIndex);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const addMistake = useMistakesStore((s) => s.addMistake);
  const seenTagsRef = useRef<Set<string>>(new Set());

  const stepId = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;
  const isUngated = UNGATED_STEPS.has(stepId);
  const isReviewStep = REVIEW_STEPS.has(stepId);

  const feedback = useMemo<FeedbackItem[]>(() => {
    if (isUngated) return [];
    const validator = STEP_VALIDATORS[stepId] ?? diffDiagram;
    return validator(diagram, lesson);
  }, [diagram, lesson, stepId, isUngated]);

  // PE's 'review' step is diagnostic, not a gate ("máy chấm là gợi ý, không phải phán
  // quyết") — the learner decides when they're done, regardless of remaining diff
  // items. Guided's 'compare' step keeps requiring a clean diff before "Hoàn thành",
  // since guided mode's whole premise is steering the learner to full correctness.
  const isUngatedCompletion = isUngated || (lesson.mode === 'pe' && stepId === 'review');
  const canAdvance = isUngatedCompletion || feedback.every((f) => f.severity !== 'warn' && f.severity !== 'error');
  const highlightSubjectId = feedback.find((f) => f.subjectId)?.subjectId ?? null;

  const referenceDiagram = useMemo(() => buildReferenceDiagram(lesson), [lesson]);
  const score = useMemo(() => (isReviewStep ? scoreDiagram(diagram, lesson) : null), [isReviewStep, diagram, lesson]);

  useEffect(() => {
    for (const item of feedback) {
      if ((item.severity !== 'warn' && item.severity !== 'error') || !item.tag) continue;
      const dedupeKey = `${stepId}::${item.tag}`;
      if (seenTagsRef.current.has(dedupeKey)) continue;
      seenTagsRef.current.add(dedupeKey);
      addMistake({
        lessonId: lesson.id,
        screenId: stepId,
        questionText: item.message,
        type: 'builder-step',
        misconceptionTags: [item.tag],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, stepId]);

  useEffect(() => {
    onProgress?.(diagram, stepIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagram, stepIndex]);

  function handleNext() {
    if (!canAdvance) return;
    if (isLastStep) {
      onComplete?.();
      return;
    }
    setStepIndex((i) => i + 1);
    seenTagsRef.current.clear();
  }

  function handlePrev() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleFeedbackItemClick(subjectId?: string) {
    if (subjectId) setSelectedId(subjectId);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-6xl mx-auto p-4 md:p-6">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-colors, .transition-shadow, .transition-all, .transition-transform { transition: none !important; }
        }
        .canvas-focusable:focus-visible, [tabindex]:focus-visible {
          outline: 2px solid #60a5fa;
          outline-offset: 2px;
        }
      `}</style>
      <LessonContentPanel
        title={lesson.title}
        brief={lesson.brief}
        stepId={stepId}
        stepIndex={stepIndex}
        totalSteps={lesson.steps.length}
        feedback={feedback}
        canAdvance={canAdvance}
        isLastStep={isLastStep}
        onNext={handleNext}
        onFeedbackItemClick={handleFeedbackItemClick}
      />
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        {isReviewStep ? (
          <div className="space-y-3">
            {stepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl border border-gray-700 text-[11px] font-semibold text-gray-400 hover:text-gray-200 hover:border-gray-500"
              >
                ← Quay lại chỉnh sửa
              </button>
            )}
            <ReviewScreen
              userDiagram={diagram}
              referenceDiagram={referenceDiagram}
              score={score ?? undefined}
              passThreshold={lesson.passThreshold}
            />
          </div>
        ) : (
          <ClassDiagramCanvas
            diagram={diagram}
            onChange={setDiagram}
            palette={lesson.palette}
            selectedId={selectedId}
            onSelect={setSelectedId}
            highlightSubjectId={highlightSubjectId}
            mode={lesson.mode}
          />
        )}
      </div>
    </div>
  );
}
