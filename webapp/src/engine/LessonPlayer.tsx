import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { track } from './analytics';
import { calculateLessonScore } from './scoring';
import type { AnswerState } from './scoring';
import { getHintForAttempt, getDisabledDistractors } from './hints';
import { playSelect, playCorrect, playWrong, playFanfare, isMuted, setMuted } from './sound';
import FoxMascot from '../components/FoxMascot';
import { useMistakesStore } from '../store/mistakes';

// Widgets
import ChoiceWidget from '../widgets/ChoiceWidget';
import MultiWidget from '../widgets/MultiWidget';
import TrueFalseWidget from '../widgets/TrueFalseWidget';
import FillWidget from '../widgets/FillWidget';
import OrderWidget from '../widgets/OrderWidget';
import MatchWidget from '../widgets/MatchWidget';
import ScenarioWidget from '../widgets/ScenarioWidget';
import VisualWidget from '../widgets/VisualWidget';
import TeachWidget, { type TeachWidgetHandle } from '../widgets/TeachWidget';

interface Screen {
  id: string;
  role: 'hook' | 'explore' | 'feedback' | 'contrast' | 'apply' | 'transfer' | 'retrieve' | 'takeaway';
  type: 'choice' | 'multi' | 'truefalse' | 'fill' | 'order' | 'match' | 'visual' | 'scenario' | 'takeaway' | 'teach';
  /** Required for quiz types; absent on teach/takeaway */
  prompt?: string;
  /** Optional heading for teach screens (no question mark tone) */
  title?: string;
  /** teach blocks: text | reveal | figure | predict */
  blocks?: any[];
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
  const addMistake = useMistakesStore((s) => s.addMistake);
  const shouldReduceMotion = useReducedMotion();
  const [currentScreenIdx, setCurrentScreenIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  /** Ref to the currently-mounted TeachWidget, so we can call next() from the CTA button */
  const teachWidgetRef = useRef<TeachWidgetHandle>(null);
  
  // Current screen state
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [exitTicketText, setExitTicketText] = useState("");
  const [soundMuted, setSoundMuted] = useState(isMuted());
  
  const [exitStage, setExitStage] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [foxAnim, setFoxAnim] = useState<'Sit' | 'Jump' | 'Howl' | 'Bark' | 'Run' | 'Walk' | 'Fall'>('Sit');

  const scoreResult = calculateLessonScore(lesson.screens, answers, lesson.xp);
  const answeredScreens = Object.values(answers);
  const isPerfect =
    scoreResult.isMastered &&
    answeredScreens.length > 0 &&
    answeredScreens.every((a) => a.hintsUsed === 0 && !a.revealed);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    setMuted(next);
  };

  // Timing
  const screenStartTime = useRef<number>(Date.now());
  const lessonStartTime = useRef<number>(Date.now());
  const [showExitScreen, setShowExitScreen] = useState(false);

  useEffect(() => {
    if (showExitScreen) {
      if (shouldReduceMotion) {
        setDisplayScore(Math.round(scoreResult.percentage));
        setExitStage(3);
        return;
      }
      setDisplayScore(0);
      setExitStage(0);
      const duration = 1000; // ms for count-up
      const start = Date.now();
      const target = Math.round(scoreResult.percentage);
      let frameId: number;

      const updateCount = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        setDisplayScore(Math.round(progress * target));

        if (progress < 1) {
          frameId = requestAnimationFrame(updateCount);
        } else {
          // Trigger stage 1 (XP spring scale-in)
          setTimeout(() => {
            setExitStage(1);
            // Trigger stage 2 (Mastery stamp down)
            setTimeout(() => {
              setExitStage(2);
              // Trigger stage 3 (Buttons fade-in)
              setTimeout(() => {
                setExitStage(3);
              }, 400);
            }, 400);
          }, 200);
        }
      };

      frameId = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(frameId);
    }
  }, [showExitScreen, shouldReduceMotion, scoreResult.percentage]);

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
    setFoxAnim('Sit');
    screenStartTime.current = Date.now();
  }, [currentScreenIdx]);

  useEffect(() => {
    if (isSubmitted && isCorrect === false && !shouldReduceMotion) {
      setFoxAnim('Bark');
      const timer = setTimeout(() => {
        setFoxAnim('Sit');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, isCorrect, attempts, shouldReduceMotion]);

  useEffect(() => {
    if (isSubmitted && isCorrect === true && !shouldReduceMotion) {
      setFoxAnim('Jump');
      const timer = setTimeout(() => {
        setFoxAnim('Sit');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, isCorrect, shouldReduceMotion]);

  const handleAnswerSelect = (val: any) => {
    if (isSubmitted) return;
    playSelect();
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
      playCorrect();
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
      playWrong();
      if (newAttempts >= 3) {
        // Solution escalation (Revealed) — ghi vào mistakes store
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
        // Ghi mistake để luyện lại sau
        addMistake({
          lessonId: lesson.id,
          screenId: currentScreen.id,
          questionText: currentScreen.prompt,
          type: currentScreen.type,
          options: currentScreen.options,
          correct: currentScreen.correct,
          correctSet: currentScreen.correctSet,
          correctOrder: currentScreen.correctOrder,
          pairs: currentScreen.pairs,
          accepted: currentScreen.accepted,
          explanation: currentScreen.explanation,
          feedbackCorrect: currentScreen.feedbackCorrect,
          misconceptionTags: misconceptionTags,
        });
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
    track('lesson_mastered', {
      score: scoreResult.percentage,
      durationMs: Date.now() - lessonStartTime.current,
      retryCount: 0,
    });

    // isPerfect là computed constant ở trên — tự cập nhật khi answers thay đổi
    if (scoreResult.isMastered) {
      playFanfare();
      confetti({
        particleCount: isPerfect ? 200 : 120,
        spread: isPerfect ? 100 : 80,
        origin: { y: 0.6 },
      });
    }

    setShowExitScreen(true);
  };

  const handleFinishConfirm = () => {
    onComplete(scoreResult.percentage, scoreResult.xpEarned, scoreResult.isMastered);
  };

  const handleRetryLesson = () => {
    // Reset play states
    setAnswers({});
    setCurrentScreenIdx(0);
    setShowExitScreen(false);
    setExitStage(0);
    setDisplayScore(0);
    // isPerfect là computed từ answers — tự reset khi answers = {}
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
                  Exit Ticket (không bắt buộc): {currentScreen.exitTicket}
                </label>
                <textarea
                  value={exitTicketText}
                  onChange={(e) => setExitTicketText(e.target.value)}
                  placeholder="Nhập câu trả lời của bạn vào đây (có thể bỏ qua)..."
                  rows={3}
                  className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-800/40 text-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        );
      case 'teach':
        return (
          <TeachWidget
            ref={teachWidgetRef}
            screen={{ ...currentScreen, _lessonId: lesson.id } as any}
          />
        );
      default:
        return <div>Widget không khả dụng.</div>;
    }
  };


  // Exit screen rendering
  if (showExitScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0d0e] px-4 py-8">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div>
            {scoreResult.isMastered ? (
              <div className="h-32 mx-auto" aria-hidden="true">
                <FoxMascot animation={isPerfect ? 'Jump' : 'Howl'} />
              </div>
            ) : (
              <span className="text-6xl">🏆</span>
            )}
            <h2 className="text-3xl font-extrabold mt-4 font-display text-white">Kết Quả Bài Học</h2>
            <p className="text-sm text-gray-400 mt-1">{lesson.title}</p>
            {isPerfect && (
              <p className="text-sm font-semibold text-amber-400 mt-2">
                🌟 Hoàn hảo — không cần gợi ý!
              </p>
            )}
          </div>

          <div className="py-4 border-y border-gray-800 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-gray-200">{displayScore}%</div>
              <div className="text-xs text-gray-500 uppercase mt-0.5 font-medium">Điểm Đạt Được</div>
            </div>
            
            <div className="text-center flex flex-col justify-center items-center">
              {exitStage >= 1 ? (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="text-3xl font-extrabold text-blue-400">+{scoreResult.xpEarned}</div>
                  <div className="text-xs text-gray-500 uppercase mt-0.5 font-medium">XP Nhận Được</div>
                </motion.div>
              ) : (
                <div className="h-[52px]" /> // placeholder to prevent layout shift
              )}
            </div>
          </div>

          <div className="relative min-h-[76px] flex items-center justify-center">
            {exitStage >= 2 ? (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className="w-full"
              >
                <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800">
                  {scoreResult.isMastered ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="text-success font-semibold flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                        <span>Chúc mừng! Bạn đã đạt Mastery.</span>
                      </div>
                      {isPerfect && (
                        <div className="mt-1 px-4 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-400/30 text-yellow-300 text-sm font-bold flex items-center gap-1.5 animate-fadeIn">
                          <span>🌟</span>
                          <span>Perfect! Không dùng hint nào!</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-error font-semibold flex flex-col items-center gap-1">
                      <span>Chưa đạt Mastery (Cần ≥ 80% &amp; đúng Transfer).</span>
                      <span className="text-xs text-gray-500">Bạn chỉ nhận được 50% XP của bài học.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : null}
          </div>

          <div className="min-h-[56px]">
            {exitStage >= 3 ? (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-2 pt-2"
              >
                {scoreResult.isMastered ? (
                  <button
                    onClick={handleFinishConfirm}
                    className="btn-3d btn-3d-primary w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                  >
                    Tiếp Tục Bản Đồ Khóa Học
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleRetryLesson}
                      className="btn-3d btn-3d-primary w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
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
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // Get active hint state
  const activeHint = getHintForAttempt(currentScreen, attempts);
  const isCorrectSubmitted = isSubmitted && isCorrect;

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
          {/* Progress bar segmented: mỗi segment = 1 màn hình */}
          <div className="flex gap-1 h-2" role="progressbar" aria-valuemin={0} aria-valuemax={lesson.screens.length} aria-valuenow={currentScreenIdx + 1} aria-label="Tiến độ bài học">
            {lesson.screens.map((screen, idx) => {
              const isFilled = idx < currentScreenIdx;
              const isCurrent = idx === currentScreenIdx;
              return (
                <div
                  key={screen.id}
                  className={`flex-1 rounded-full transition-colors duration-300 ${
                    isFilled
                      ? 'bg-blue-500'
                      : isCurrent
                        ? `bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)] ${!shouldReduceMotion ? 'animate-segment-pop' : ''}`
                        : 'bg-gray-800'
                  }`}
                />
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            title={soundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="text-sm w-8 h-8 rounded-full border border-gray-700 bg-gray-800/40 hover:bg-gray-800 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {soundMuted ? '🔇' : '🔊'}
          </button>
          <div className="text-xs font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full flex items-center gap-1">
            <span>⚡</span>
            <span>{lesson.xp} XP</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow max-w-[680px] w-full mx-auto p-6 space-y-6 pb-40 flex flex-col justify-start">
        {/* Prompt / Title */}
        <div className="space-y-3">
          {import.meta.env.DEV && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border inline-block ${
              currentScreen.type === 'teach'
                ? 'bg-blue-950 text-blue-400 border-blue-800/60'
                : 'bg-gray-800 text-gray-400 border-gray-700/60'
            }`}>
              {currentScreen.type === 'teach' ? '📖 teach' : currentScreen.role}
            </span>
          )}
          {currentScreen.type === 'teach' ? (
            // Teach screens: show optional title as a small heading (not a question)
            currentScreen.title ? (
              <h1 className="text-base md:text-lg font-semibold font-display leading-snug text-blue-300">
                {currentScreen.title}
              </h1>
            ) : null
          ) : (
            // Quiz / scenario screens: show full prompt as h1
            <>
              <h1 className="text-xl md:text-2xl font-bold font-display leading-snug text-gray-100">
                {currentScreen.prompt}
              </h1>
              {wordWarning && import.meta.env.DEV && (
                <span className="text-[10px] text-yellow-500/60 block">
                  [Pedagogy Check: Prompt contains {wordCount} words, slightly over the 45-word rule]
                </span>
              )}
            </>
          )}
        </div>

        {/* Interactive widget */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 shadow-xl min-h-[300px] flex flex-col justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen.id}
              initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeInOut" }}
              className="w-full h-full flex flex-col justify-center"
            >
              {renderWidget()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fox mascot hint/solution companion — hidden on teach screens */}
        {currentScreen.type !== 'teach' && !isCorrectSubmitted && attempts > 0 && activeHint && (
          <div className={`flex gap-4 items-end mt-6 ${!shouldReduceMotion ? 'animate-fadeIn' : ''}`}>
            <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 relative">
              <FoxMascot animation={foxAnim} className="w-full h-full" />
            </div>
            <div 
              className="flex-1 bg-gray-900 border border-gray-800 rounded-3xl p-5 relative shadow-xl text-gray-200 text-[15px] leading-relaxed"
              role="status"
              aria-live="polite"
            >
              {/* Triangle/Speech bubble tail pointing to Fox */}
              <div className="absolute left-[-8px] bottom-[28px] w-4 h-4 bg-gray-900 border-l border-b border-gray-800 rotate-45 transform pointer-events-none" />
              <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5 font-display text-base">
                <span>🦊</span>
                <span>{attempts >= 3 ? "Lời giải mẫu (Worked Example):" : `Fox gợi ý (Tầng ${attempts}):`}</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed">{activeHint.text}</p>
            </div>
          </div>
        )}
      </main>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d0e]/95 border-t border-gray-800/80 shadow-2xl backdrop-blur-md">
        <div className="max-w-[680px] w-full mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left side: Hint / Feedback */}
          <div className="flex-1 min-w-0">
            {/* Correct Feedback */}
            {isCorrectSubmitted && (currentScreen.feedbackCorrect || currentScreen.explanation) && (
              <div className="text-success text-[15px] md:text-base leading-relaxed md:leading-loose whitespace-pre-line animate-fadeIn">
                <div className="font-bold mb-1 flex items-center gap-1.5 text-base">
                  <span>✓</span>
                  <span>Đúng!</span>
                </div>
                <p>{currentScreen.feedbackCorrect || currentScreen.explanation}</p>
              </div>
            )}
          </div>

          {/* Right side: Action Button */}
          <div className="flex-shrink-0 md:pl-4 flex items-center justify-end">
            {currentScreen.type === 'teach' ? (
              /* Teach: single CTA — advances reveal or moves to next screen */
              <button
                onClick={() => {
                  const stillAdvancing = teachWidgetRef.current?.next();
                  if (stillAdvancing === false) {
                    handleNext();
                  }
                }}
                className="btn-3d btn-3d-primary w-full md:w-auto px-8 py-3.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 text-base"
              >
                {currentScreenIdx === lesson.screens.length - 1 ? 'Hoàn Thành' : 'Tiếp Tục'}
              </button>
            ) : currentScreen.type === 'takeaway' ? (
              /* Takeaway/Exit ticket: không chấm điểm, không ép trả lời, không tính vào Luyện Điểm Yếu.
                 Bấm để qua tiếp bất kể exit ticket có được điền hay không. */
              <button
                onClick={handleNext}
                className="btn-3d btn-3d-primary w-full md:w-auto px-8 py-3.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 text-base"
              >
                {currentScreenIdx === lesson.screens.length - 1 ? 'Hoàn Thành' : 'Tiếp Tục'}
              </button>
            ) : !isSubmitted ? (
              <button
                disabled={currentAnswer === null}
                onClick={handleCheck}
                className="btn-3d btn-3d-primary w-full md:w-auto px-8 py-3.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-base"
              >
                Kiểm Tra
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-3d btn-3d-success w-full md:w-auto px-8 py-3.5 rounded-xl font-bold bg-success text-black hover:bg-opacity-90 text-base"
              >
                {currentScreenIdx === lesson.screens.length - 1 ? 'Hoàn Thành' : 'Tiếp Tục'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
