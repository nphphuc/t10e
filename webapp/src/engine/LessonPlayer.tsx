import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { track } from './analytics';
import { calculateLessonScore } from './scoring';
import type { AnswerState } from './scoring';
import { getHintForAttempt, getDisabledDistractors } from './hints';

// Widgets
import ChoiceWidget from '../widgets/ChoiceWidget';
import MultiWidget from '../widgets/MultiWidget';
import TrueFalseWidget from '../widgets/TrueFalseWidget';
import FillWidget from '../widgets/FillWidget';
import OrderWidget from '../widgets/OrderWidget';
import MatchWidget from '../widgets/MatchWidget';
import ScenarioWidget from '../widgets/ScenarioWidget';
import VisualWidget from '../widgets/VisualWidget';

interface Screen {
  id: string;
  role: 'hook' | 'explore' | 'feedback' | 'contrast' | 'apply' | 'transfer' | 'retrieve' | 'takeaway';
  type: 'choice' | 'multi' | 'truefalse' | 'fill' | 'order' | 'match' | 'visual' | 'scenario' | 'takeaway';
  prompt: string;
  options?: string[];
  correct?: any;
  correctSet?: number[];
  correctOrder?: string[];
  pairs?: Record<string, string>;
  accepted?: string[];
  visual?: any;
  hints?: string[];
  solution?: string;
  feedbackCorrect?: string;
  feedbackWrongByItem?: Record<string, string>;
  explanation?: string;
  consequence?: string;
  distractorTags?: Record<string, string | null>;
  weight?: number;
  text?: string;
  exitTicket?: string;
}

interface LessonPlayerProps {
  lesson: {
    id: string;
    title: string;
    xp: number;
    objective: string;
    misconceptions: string[];
    screens: Screen[];
  };
  onComplete: (scorePercentage: number, xpEarned: number, isMastered: boolean) => void;
}

export default function LessonPlayer({ lesson, onComplete }: LessonPlayerProps) {
  const navigate = useNavigate();
  const [currentScreenIdx, setCurrentScreenIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  
  // Current screen state
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [exitTicketText, setExitTicketText] = useState("");

  // Timing
  const screenStartTime = useRef<number>(Date.now());
  const lessonStartTime = useRef<number>(Date.now());
  const [showExitScreen, setShowExitScreen] = useState(false);

  const currentScreen = lesson.screens[currentScreenIdx];

  // Log lesson started
  useEffect(() => {
    track('lesson_started', {
      courseId: 'swd392-brilliant',
      levelId: lesson.id.split('-')[0],
      lessonId: lesson.id,
      priorMastery: false, // In MVP context
    });
    lessonStartTime.current = Date.now();
    screenStartTime.current = Date.now();
  }, [lesson.id]);

  // Reset answer states on slide change
  useEffect(() => {
    setCurrentAnswer(null);
    setAttempts(0);
    setIsSubmitted(false);
    setIsCorrect(null);
    setDisabledOptions([]);
    screenStartTime.current = Date.now();
  }, [currentScreenIdx]);

  const handleAnswerSelect = (val: any) => {
    if (isSubmitted) return;
    setCurrentAnswer(val);
  };

  // Helper to validate correctness
  const checkAnswerCorrectness = (answer: any, screen: Screen): boolean => {
    if (screen.type === 'choice' || screen.type === 'scenario') {
      return Number(answer) === Number(screen.correct);
    }
    if (screen.type === 'truefalse') {
      return Boolean(answer) === Boolean(screen.correct);
    }
    if (screen.type === 'multi') {
      const selected = (answer as number[]) || [];
      const correct = screen.correctSet || [];
      if (selected.length !== correct.length) return false;
      return selected.every((s) => correct.includes(s));
    }
    if (screen.type === 'fill') {
      const cleanUser = (answer as string).trim().toLowerCase().replace(/\s+/g, '');
      const accepted = screen.accepted || [];
      return accepted.some(
        (item) => item.trim().toLowerCase().replace(/\s+/g, '') === cleanUser
      );
    }
    if (screen.type === 'order') {
      const ordered = (answer as string[]) || [];
      const correct = screen.correctOrder || [];
      if (ordered.length !== correct.length) return false;
      return ordered.every((item, idx) => correct[idx] === item);
    }
    if (screen.type === 'match') {
      const matches = (answer as Record<string, string>) || {};
      const pairs = screen.pairs || {};
      const keys = Object.keys(pairs);
      if (Object.keys(matches).length !== keys.length) return false;
      return keys.every((k) => matches[k] === pairs[k]);
    }
    if (screen.type === 'visual') {
      if (screen.visual?.variant === 'boundary-sort') {
        const selected = (answer as number[]) || [];
        const items = screen.visual.items || [];
        const correctOutside = screen.visual.correctOutside || [];
        const correctSet = items
          .map((item, idx) => (correctOutside.includes(item) ? idx : -1))
          .filter((idx) => idx !== -1);

        if (selected.length !== correctSet.length) return false;
        return selected.every((s) => correctSet.includes(s));
      }
      if (screen.visual?.variant === 'state-machine-runner') {
        return answer === screen.correct;
      }
      if (screen.visual?.variant === 'static-diagram' ||
          screen.visual?.variant === 'view-switcher' ||
          screen.visual?.variant === 'class-object-card' ||
          screen.visual?.variant === 'association-multiplicity' ||
          screen.visual?.variant === 'composition-lifetime' ||
          screen.visual?.variant === 'association-class' ||
          screen.visual?.variant === 'sequence-communication' ||
          screen.visual?.variant === 'architecture-view-switcher' ||
          screen.visual?.variant === 'relational-mapping' ||
          screen.visual?.variant === 'transaction-failure' ||
          screen.visual?.variant === 'sync-async-timeline' ||
          screen.visual?.variant === 'tradeoff-radar' ||
          screen.visual?.variant === 'rds-trace') {
        return Number(answer) === Number(screen.correct);
      }
      if (screen.visual?.variant === 'subsystem-partition') {
        const userPart = (answer as Record<string, string>) || {};
        const correctPart = screen.visual.correctPartition || {};
        const keys = Object.keys(correctPart);
        if (keys.length === 0) return false;
        return keys.every((key) => userPart[key] === correctPart[key]);
      }
      if (screen.visual?.variant === 'activity-flow' ||
          screen.visual?.variant === 'service-broker') {
        const ordered = (answer as string[]) || [];
        const correct = screen.visual.correctOrder || [];
        if (ordered.length !== correct.length) return false;
        return ordered.every((item, idx) => correct[idx] === item);
      }
      if (screen.visual?.variant === 'bec-sorter' ||
          screen.visual?.variant === 'pattern-pressure') {
        const placements = (answer as Record<string, string>) || {};
        const correctMapping = screen.visual.correctMapping || {};
        const keys = Object.keys(correctMapping);
        if (keys.length === 0) return false;
        return keys.every((key) => placements[key] === correctMapping[key]);
      }
    }

    return false;
  };

  const handleCheck = () => {
    if (currentAnswer === null && currentScreen.type !== 'takeaway') return;

    const correct = checkAnswerCorrectness(currentAnswer, currentScreen);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Calculate duration
    const durationMs = Date.now() - screenStartTime.current;

    // Track misconception tag if wrong and tag is available
    let misconceptionTags: string[] = [];
    if (!correct && currentScreen.distractorTags) {
      if (currentScreen.type === 'choice' || currentScreen.type === 'scenario') {
        const tag = currentScreen.distractorTags[String(currentAnswer)];
        if (tag) misconceptionTags.push(tag);
      } else if (currentScreen.type === 'multi') {
        const selected = (currentAnswer as number[]) || [];
        selected.forEach((idx) => {
          const tag = currentScreen.distractorTags?.[String(idx)];
          if (tag) misconceptionTags.push(tag);
        });
      }
    }
    // Fallback if no tags derived but screen objective has them
    if (misconceptionTags.length === 0 && !correct) {
      misconceptionTags = currentScreen.distractorTags
        ? Object.values(currentScreen.distractorTags).filter(Boolean) as string[]
        : lesson.misconceptions;
    }

    track('interaction_answered', {
      itemId: `${lesson.id}-${currentScreen.id}`,
      type: currentScreen.type,
      correct,
      attempt: newAttempts,
      hintUsed: newAttempts - 1,
      misconceptionTags,
      durationMs,
      lessonId: lesson.id, // 8th field
    });

    if (correct) {
      setIsCorrect(true);
      setIsSubmitted(true);
      setAnswers((prev) => ({
        ...prev,
        [currentScreen.id]: {
          correct: true,
          attempts: newAttempts,
          hintsUsed: newAttempts - 1,
          revealed: false,
        },
      }));
    } else {
      if (newAttempts >= 3) {
        // Solution escalation (Revealed)
        setIsCorrect(false);
        setIsSubmitted(true);
        setAnswers((prev) => ({
          ...prev,
          [currentScreen.id]: {
            correct: false,
            attempts: newAttempts,
            hintsUsed: 3,
            revealed: true,
          },
        }));
      } else {
        // Normal hint escalation
        if (newAttempts === 2) {
          const disabled = getDisabledDistractors(currentScreen, newAttempts);
          setDisabledOptions(disabled);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentScreenIdx < lesson.screens.length - 1) {
      setCurrentAnswer(null);
      setAttempts(0);
      setIsSubmitted(false);
      setIsCorrect(null);
      setDisabledOptions([]);
      screenStartTime.current = Date.now();
      setCurrentScreenIdx((prev) => prev + 1);
    } else {
      // Completed last screen
      handleFinishLesson();
    }
  };

  const handleFinishLesson = () => {
    const scoreResult = calculateLessonScore(lesson.screens, answers, lesson.xp);
    
    track('lesson_mastered', {
      score: scoreResult.percentage,
      durationMs: Date.now() - lessonStartTime.current,
      retryCount: 0,
    });

    if (scoreResult.isMastered) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    setShowExitScreen(true);
  };

  const handleFinishConfirm = () => {
    const scoreResult = calculateLessonScore(lesson.screens, answers, lesson.xp);
    onComplete(scoreResult.percentage, scoreResult.xpEarned, scoreResult.isMastered);
  };

  const handleRetryLesson = () => {
    // Reset play states
    setAnswers({});
    setCurrentScreenIdx(0);
    setShowExitScreen(false);
    lessonStartTime.current = Date.now();
    screenStartTime.current = Date.now();
  };

  const renderWidget = () => {
    switch (currentScreen.type) {
      case 'choice':
        return (
          <ChoiceWidget
            data={currentScreen as any}
            selectedAnswer={currentAnswer}
            onAnswer={handleAnswerSelect}
            isSubmitted={isSubmitted}
            disabledOptions={disabledOptions}
          />
        );
      case 'multi':
        return (
          <MultiWidget
            data={currentScreen as any}
            selectedAnswer={currentAnswer}
            onAnswer={handleAnswerSelect}
            isSubmitted={isSubmitted}
            disabledOptions={disabledOptions}
          />
        );
      case 'truefalse':
        return (
          <TrueFalseWidget
            data={currentScreen as any}
            selectedAnswer={currentAnswer}
            onAnswer={handleAnswerSelect}
            isSubmitted={isSubmitted}
          />
        );
      case 'fill':
        return (
          <FillWidget
            data={currentScreen as any}
            selectedAnswer={currentAnswer}
            onAnswer={handleAnswerSelect}
            isSubmitted={isSubmitted}
          />
        );
      case 'order':
        return (
          <OrderWidget
            data={currentScreen as any}
            selectedAnswer={currentAnswer}
            onAnswer={handleAnswerSelect}
            isSubmitted={isSubmitted}
          />
        );
      case 'match':
        return (
          <MatchWidget
            data={currentScreen as any}
            selectedAnswer={currentAnswer}
            onAnswer={handleAnswerSelect}
            isSubmitted={isSubmitted}
          />
        );
      case 'scenario':
        return (
          <ScenarioWidget
            data={currentScreen as any}
            selectedAnswer={currentAnswer}
            onAnswer={handleAnswerSelect}
            isSubmitted={isSubmitted}
            disabledOptions={disabledOptions}
          />
        );
      case 'visual':
        return (
          <VisualWidget
            data={currentScreen as any}
            selectedAnswer={currentAnswer}
            onAnswer={handleAnswerSelect}
            isSubmitted={isSubmitted}
            disabledOptions={disabledOptions}
          />
        );
      case 'takeaway':
        return (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 text-gray-300 leading-relaxed font-medium">
              {currentScreen.text}
            </div>
            {currentScreen.exitTicket && (
              <div className="space-y-2 mt-4">
                <label className="text-sm font-semibold text-gray-400 block">
                  Exit Ticket: {currentScreen.exitTicket}
                </label>
                <textarea
                  value={exitTicketText}
                  onChange={(e) => setExitTicketText(e.target.value)}
                  placeholder="Nhập câu trả lời của bạn vào đây..."
                  rows={3}
                  className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-800/40 text-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        );
      default:
        return <div>Widget không khả dụng.</div>;
    }
  };

  // Exit screen rendering
  if (showExitScreen) {
    const scoreResult = calculateLessonScore(lesson.screens, answers, lesson.xp);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0d0e] px-4 py-8">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div>
            <span className="text-6xl">🏆</span>
            <h2 className="text-3xl font-extrabold mt-4">Kết Quả Bài Học</h2>
            <p className="text-sm text-gray-400 mt-1">{lesson.title}</p>
          </div>

          <div className="py-4 border-y border-gray-800 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-200">{Math.round(scoreResult.percentage)}%</div>
              <div className="text-xs text-gray-500 uppercase mt-0.5">Điểm Đạt Được</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">+{scoreResult.xpEarned}</div>
              <div className="text-xs text-gray-500 uppercase mt-0.5">XP Nhận Được</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800">
            {scoreResult.isMastered ? (
              <div className="text-success font-semibold flex items-center justify-center gap-2">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
                <span>Chúc mừng! Bạn đã đạt Mastery.</span>
              </div>
            ) : (
              <div className="text-error font-semibold flex flex-col items-center gap-1">
                <span>Chưa đạt Mastery (Cần ≥ 80% & đúng Transfer).</span>
                <span className="text-xs text-gray-500">Bạn chỉ nhận được 50% XP của bài học.</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {scoreResult.isMastered ? (
              <button
                onClick={handleFinishConfirm}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
              >
                Tiếp Tục Bản Đồ Khóa Học
              </button>
            ) : (
              <>
                <button
                  onClick={handleRetryLesson}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
                >
                  Luyện Tập Lại
                </button>
                <button
                  onClick={handleFinishConfirm}
                  className="w-full py-4 rounded-xl border border-gray-700 bg-gray-800/40 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold transition-all"
                >
                  Bỏ Qua
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Get active hint state
  const activeHint = getHintForAttempt(currentScreen, attempts);
  const isCorrectSubmitted = isSubmitted && isCorrect;
  const isWrongSubmitted = isSubmitted && isCorrect === false;

  // Word count check warning for pedagogy rule (max 45 Vietnamese words)
  const isHookOrExplore = currentScreen.role === 'hook' || currentScreen.role === 'explore';
  const wordCount = currentScreen.prompt ? currentScreen.prompt.split(/\s+/).length : 0;
  const wordWarning = isHookOrExplore && wordCount > 45;

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d0e]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-800 flex items-center justify-between gap-4 bg-gray-900/60 backdrop-blur">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1.5 focus:outline-none"
        >
          &larr; <span className="hidden sm:inline">Bản đồ</span>
        </button>
        <div className="flex-1 max-w-xl mx-4">
          <div className="text-xs text-gray-500 font-semibold mb-1 text-center truncate">
            {lesson.title} — Màn {currentScreenIdx + 1}/{lesson.screens.length}
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentScreenIdx + 1) / lesson.screens.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-xs font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full flex items-center gap-1">
          <span>⚡</span>
          <span>{lesson.xp} XP</span>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-6 gap-8 items-stretch justify-center">
        {/* Left pane: prompt & diagram */}
        <div className="flex-1 flex flex-col justify-center space-y-6 md:max-w-xl">
          <div className="space-y-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-800 text-gray-400 border border-gray-700/60 inline-block">
              {currentScreen.role}
            </span>
            <h1 className="text-xl md:text-2xl font-bold leading-snug text-gray-100">
              {currentScreen.prompt}
            </h1>
            {wordWarning && (
              <span className="text-[10px] text-yellow-500/60 block">
                [Pedagogy Check: Prompt contains {wordCount} words, slightly over the 45-word rule]
              </span>
            )}
          </div>

          {/* Solution Worked Example Block */}
          {isWrongSubmitted && currentScreen.solution && (
            <div className="p-5 rounded-2xl bg-yellow-950/15 border border-yellow-900/40 text-yellow-100/90 text-sm animate-fadeIn">
              <div className="font-bold text-yellow-400 flex items-center gap-1.5 mb-1.5">
                <span>💡</span>
                <span>Lời giải mẫu (Worked Example):</span>
              </div>
              <p>{currentScreen.solution}</p>
            </div>
          )}
        </div>

        {/* Right pane: widgets & inputs */}
        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto md:mx-0">
          <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 shadow-xl flex-grow flex flex-col justify-between min-h-[350px]">
            <div className="flex-grow flex flex-col justify-center">
              {renderWidget()}
            </div>

            {/* Hint & Feedback output block */}
            <div className="mt-6 space-y-4">
              {/* Correct Feedback */}
              {isCorrectSubmitted && (currentScreen.feedbackCorrect || currentScreen.explanation) && (
                <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-success text-xs leading-relaxed animate-fadeIn">
                  <div className="font-bold mb-1">Đúng!</div>
                  <p>{currentScreen.feedbackCorrect || currentScreen.explanation}</p>
                </div>
              )}

              {/* Hints Escalation Output */}
              {!isCorrectSubmitted && activeHint && (
                <div className="p-4 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-300 text-xs leading-relaxed animate-fadeIn">
                  <div className="font-bold text-blue-400 mb-1 flex items-center gap-1">
                    <span>💡</span>
                    <span>{attempts >= 3 ? "Giải đáp" : `Gợi ý tầng ${attempts}`}</span>
                  </div>
                  <p>{activeHint.text}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2">
                {!isSubmitted ? (
                  <button
                    disabled={currentAnswer === null && currentScreen.type !== 'takeaway'}
                    onClick={handleCheck}
                    className="w-full py-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Kiểm Tra
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full py-4 rounded-xl font-bold bg-success text-black hover:bg-opacity-90 transition-opacity"
                  >
                    {currentScreenIdx === lesson.screens.length - 1 ? "Hoàn Thành" : "Tiếp Tục"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
