import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useMistakesStore } from '../store/mistakes';
import { EMPTY_DIAGRAM, useBuilderProgress } from '../store/builderProgress';
import ClassDiagramCanvas from './canvas/ClassDiagramCanvas';
import { buildReferenceDiagram } from './engine/reference';
import { createDiagramHistoryState, diagramHistoryReducer } from './engine/history';
import { scoreDiagram } from './engine/scoring';
import type { BuilderLesson, DiagramState, FeedbackItem } from './engine/types';
import { canAdvance, STEP_VALIDATORS } from './engine/validate';
import LessonContentPanel from './LessonContentPanel';

const rubricLabels: Record<string, string> = {
  classes: 'Tập class',
  attributes: 'Attribute đúng class',
  associations: 'Tập association',
  multiplicity: 'Multiplicity từng đầu',
  edgeTypes: 'Loại quan hệ',
  associationClass: 'Association class',
};

function fitForReview(diagram: DiagramState): DiagramState {
  return {
    edges: diagram.edges,
    nodes: diagram.nodes.map((node, index) => ({
      ...node,
      x: 18 + (index % 3) * 160,
      y: 30 + Math.floor(index / 3) * 165,
    })),
  };
}

export default function ClassDiagramBuilderScreen({ lesson, onExit }: { lesson: BuilderLesson; onExit: () => void }) {
  const saved = useBuilderProgress((state) => state.lessons[lesson.id]);
  const save = useBuilderProgress((state) => state.save);
  const complete = useBuilderProgress((state) => state.complete);
  const reset = useBuilderProgress((state) => state.reset);
  const [{ present: diagram, history }, dispatchDiagram] = useReducer(
    diagramHistoryReducer,
    saved?.diagram ?? EMPTY_DIAGRAM,
    createDiagramHistoryState,
  );
  const [stepIndex, setStepIndex] = useState(() => Math.min(saved?.stepIndex ?? 0, lesson.steps.length - 1));
  const [focusSubject, setFocusSubject] = useState<{ id: string; request: number }>();
  const recorded = useRef(new Set<string>());
  const step = lesson.steps[stepIndex];
  const validator = STEP_VALIDATORS[step];
  const feedback = useMemo<FeedbackItem[]>(() => validator?.(diagram, lesson) ?? [], [diagram, lesson, validator]);
  const score = useMemo(() => scoreDiagram(diagram, lesson), [diagram, lesson]);
  const isReview = step === 'compare' || step === 'review';
  const reference = useMemo(() => fitForReview(buildReferenceDiagram(lesson)), [lesson]);
  const fittedUser = useMemo(() => fitForReview(diagram), [diagram]);
  const commitDiagram = useCallback((next: DiagramState) => dispatchDiagram({ type: 'commit', next }), []);
  const undoDiagram = useCallback(() => dispatchDiagram({ type: 'undo' }), []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const forceReducedMotion = import.meta.env.DEV
      && new URLSearchParams(window.location.search).get('testReducedMotion') === '1';

    // The builder owns the desktop viewport and scrolls each pane independently.
    // Locking the document prevents a second page scrollbar from exposing the
    // body background when the browser restores an old scroll position.
    root.classList.add('cdb-builder-active');
    body.classList.add('cdb-builder-active');
    if (forceReducedMotion) root.classList.add('cdb-test-reduced-motion');
    root.scrollTop = 0;
    body.scrollTop = 0;

    return () => {
      root.classList.remove('cdb-builder-active');
      root.classList.remove('cdb-test-reduced-motion');
      body.classList.remove('cdb-builder-active');
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
  }, []);

  useEffect(() => {
    save(lesson.id, {
      stepIndex,
      diagram,
      completedSteps: lesson.steps.slice(0, stepIndex),
    });
  }, [diagram, lesson.id, lesson.steps, save, stepIndex]);

  useEffect(() => {
    for (const item of feedback) {
      if (!item.tag || (item.severity !== 'warn' && item.severity !== 'error')) continue;
      const key = `${step}:${item.tag}`;
      if (recorded.current.has(key)) continue;
      recorded.current.add(key);
      useMistakesStore.getState().addMistake({
        lessonId: lesson.id,
        // mistakes.ts dedupes by lessonId + screenId, so include the tag to preserve
        // the handoff contract: one entry for each (step, tag) in an attempt.
        screenId: `${step}::${item.tag}`,
        questionText: item.message,
        type: 'class-diagram-builder',
        explanation: 'Đối chiếu brief và cấu trúc graph; vị trí pixel không ảnh hưởng kết quả.',
        misconceptionTags: [item.tag],
      });
    }
  }, [feedback, lesson.id, step]);

  const continueLesson = () => {
    if (stepIndex < lesson.steps.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }
    complete(lesson.id, lesson.mode === 'pe' ? score.total : undefined);
    onExit();
  };
  const canContinue = step === 'free-build'
    ? diagram.nodes.length > 0
    : isReview || canAdvance(feedback);

  return (
    <main className="cdb-builder-screen">
      <LessonContentPanel lesson={lesson} step={step} stepIndex={stepIndex} feedback={feedback} canContinue={canContinue} onContinue={continueLesson} onExit={onExit} onFeedbackSelect={(id) => setFocusSubject((current) => ({ id, request: (current?.request ?? 0) + 1 }))} />
      <section className="cdb-workspace">
        <header className="cdb-workspace-header">
          <div><span>{lesson.mode === 'pe' ? 'PE FREE BUILD' : 'GUIDED MODE'}</span><strong>{lesson.title}</strong></div>
          <button type="button" onClick={() => { reset(lesson.id); dispatchDiagram({ type: 'reset', next: EMPTY_DIAGRAM }); setStepIndex(0); }}>Làm mới</button>
        </header>
        {isReview ? (
          <div className="cdb-review-area">
            {lesson.mode === 'pe' && <section className="cdb-score-card">
              <div><span>Điểm cấu trúc</span><strong>{score.total}/100</strong><em className={score.passed ? 'is-pass' : 'is-retry'}>{score.passed ? 'Đạt ngưỡng 75' : 'Chưa đạt ngưỡng 75'}</em></div>
              <div className="cdb-rubric-grid">{score.groups.map((group) => <article key={group.key}><span>{rubricLabels[group.key]}</span><b>{group.points.toFixed(1)}/{group.weight}</b><i><span style={{ width: `${group.ratio * 100}%` }} /></i></article>)}</div>
              <p>Máy chấm là gợi ý, không phải phán quyết.</p>
            </section>}
            <div className="cdb-review-grid">
              <section><header><strong>Bản của bạn</strong><span>{diagram.nodes.length} nodes · {diagram.edges.length} edges</span></header><ClassDiagramCanvas value={fittedUser} onChange={() => undefined} readOnly compact title="Bản class diagram của bạn" /></section>
              <section><header><strong>Bản tham chiếu</strong><span>Target graph</span></header><ClassDiagramCanvas value={reference} onChange={() => undefined} readOnly compact title="Bản class diagram tham chiếu" /></section>
            </div>
            <section className="cdb-diff-list"><header><strong>Diff cụ thể</strong><span>{score.feedback.length} mục</span></header>{score.feedback.length === 0 ? <p className="is-perfect">✓ Không còn warn/error; cấu trúc khớp target.</p> : score.feedback.map((item, index) => <article key={`${item.message}-${index}`}><b>{item.severity.toUpperCase()}</b><span>{item.message}</span>{item.tag && <code>{item.tag}</code>}</article>)}</section>
          </div>
        ) : (
          <ClassDiagramCanvas value={diagram} onChange={commitDiagram} onUndo={undoDiagram} undoCount={history.length} focusSubjectId={focusSubject?.id} focusRequest={focusSubject?.request} palette={lesson.palette} title={`${lesson.title}, bước ${stepIndex + 1}`} />
        )}
      </section>
    </main>
  );
}
