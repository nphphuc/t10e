import { useEffect, useMemo, useRef, useState } from 'react';
import ClassDiagramCanvas from './canvas/ClassDiagramCanvas';
import LessonContentPanel from './LessonContentPanel';
import { STEP_VALIDATORS, diffDiagram } from './engine/validate';
import type { BuilderLesson, DiagramState } from './engine/types';
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

  const feedback = useMemo(() => {
    const validator = STEP_VALIDATORS[stepId] ?? diffDiagram;
    return validator(diagram, lesson);
  }, [diagram, lesson, stepId]);

  const canAdvance = feedback.every((f) => f.severity !== 'warn' && f.severity !== 'error');
  const highlightSubjectId = feedback.find((f) => f.subjectId)?.subjectId ?? null;

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

  function handleFeedbackItemClick(subjectId?: string) {
    if (subjectId) setSelectedId(subjectId);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-6xl mx-auto p-4 md:p-6">
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
      <div className="flex-1 min-w-0">
        <ClassDiagramCanvas
          diagram={diagram}
          onChange={setDiagram}
          palette={lesson.palette}
          selectedId={selectedId}
          onSelect={setSelectedId}
          highlightSubjectId={highlightSubjectId}
          mode={lesson.mode}
        />
      </div>
    </div>
  );
}
