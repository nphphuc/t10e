import { useState, useEffect, useRef } from 'react';
import { useProgressStore } from '../store/progress';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import manifestData from '../content/manifest.json';
import FoxMascot from '../components/FoxMascot';
import { isMuted, setMuted } from '../engine/sound';
import { useMistakesStore } from '../store/mistakes';

// Dynamically discover all implemented lessons in the content/lessons directory
const lessonFiles = import.meta.glob('../content/lessons/*.json', { eager: true });
const IMPLEMENTED_LESSONS = Object.keys(lessonFiles).map(path => {
  const match = path.match(/\/([^/]+)\.json$/);
  return match ? match[1] : '';
}).filter(Boolean);
const NODE_OFFSET = 40;

export default function CourseMap() {
  const { completedLessons, totalXp, streak, resetProgress, completeLesson } = useProgressStore();
  const mistakesCount = useMistakesStore((s) => s.getMistakesCount());
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();

  // Snapshot navigation state MỘT LẦN khi mount: ngay sau đó state bị clear
  // (navigate replace) để refresh không replay animation. Nếu đọc trực tiếp
  // location.state, các effect phụ thuộc sẽ bị cleanup ngay khi state thành {}.
  const [entryState] = useState(() => ({
    justCompleted: (location.state?.justCompleted as string | undefined) || null,
    streakIncreased: Boolean(location.state?.streakIncreased),
    xpGained: Number(location.state?.xpGained) || 0,
  }));
  const justCompletedId = entryState.justCompleted;
  const streakIncreased = entryState.streakIncreased;
  const xpGained = entryState.xpGained;

  const [animatingLessonId, setAnimatingLessonId] = useState<string | null>(justCompletedId);
  const [animState, setAnimState] = useState<'idle' | 'pedestal' | 'connector' | 'nextActive' | 'done'>('idle');
  const [flashLevelId, setFlashLevelId] = useState<string | null>(null);
  const [animateStreak, setAnimateStreak] = useState(false);

  // XP count-up: bắt đầu từ giá trị TRƯỚC khi cộng, chạy lên totalXp
  const [displayXp, setDisplayXp] = useState(totalXp - xpGained);
  const [xpCounting, setXpCounting] = useState(false);

  const course = manifestData.course;
  const levels = course.levels;

  // Flatten all lessons to determine locks and the single active lesson
  const allLessons = levels.flatMap((level) => level.lessons);

  // Find next lesson after the completed one
  const completedIdx = allLessons.findIndex(l => l.id === animatingLessonId);
  const nextLessonId = completedIdx !== -1 && completedIdx < allLessons.length - 1 ? allLessons[completedIdx + 1].id : null;

  // Find completed level to check for level completion confetti
  const completedLevel = levels.find(l => l.lessons.some(less => less.id === justCompletedId));
  const levelImplLessons = completedLevel ? completedLevel.lessons.filter(l => IMPLEMENTED_LESSONS.includes(l.id)) : [];
  const isLastImpl = completedLevel && levelImplLessons.length > 0 && levelImplLessons[levelImplLessons.length - 1].id === justCompletedId;

  // Clear navigation state so it doesn't replay on refresh
  useEffect(() => {
    if (location.state?.justCompleted || location.state?.streakIncreased) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Handle animation sequence
  useEffect(() => {
    if (justCompletedId && !shouldReduceMotion) {
      setAnimatingLessonId(justCompletedId);
      setAnimState('pedestal');
      
      const t1 = setTimeout(() => {
        setAnimState('connector');
      }, 800);

      const t2 = setTimeout(() => {
        setAnimState('nextActive');
      }, 1400);

      const t3 = setTimeout(() => {
        setAnimState('done');
        setAnimatingLessonId(null);
      }, 2200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setAnimState('done');
      setAnimatingLessonId(null);
    }
  }, [justCompletedId, shouldReduceMotion]);

  // Handle Level completion confetti & pill flash
  useEffect(() => {
    if (justCompletedId && completedLevel && isLastImpl && !shouldReduceMotion) {
      const tFlash = setTimeout(() => {
        setFlashLevelId(completedLevel.id);
        
        const pillEl = document.getElementById(`pill-${completedLevel.id}`);
        if (pillEl) {
          const rect = pillEl.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          confetti({
            particleCount: 45,
            spread: 55,
            origin: { x, y }
          });
        }

        setTimeout(() => {
          setFlashLevelId(null);
        }, 1000);
      }, 1500);

      return () => clearTimeout(tFlash);
    }
  }, [justCompletedId, completedLevel, isLastImpl, shouldReduceMotion]);

  // Handle Streak scale-pop
  useEffect(() => {
    if (streakIncreased && !shouldReduceMotion) {
      setAnimateStreak(true);
      const timer = setTimeout(() => {
        setAnimateStreak(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [streakIncreased, shouldReduceMotion]);

  // Handle XP count-up (delay 600ms cho khớp với unlock animation)
  useEffect(() => {
    if (xpGained <= 0 || shouldReduceMotion) {
      setDisplayXp(totalXp);
      return;
    }
    const prevXp = totalXp - xpGained;
    const delay = 600;
    const duration = 900;
    const start = Date.now();
    let frameId: number;
    setXpCounting(true);

    const tick = () => {
      const t = Math.min(Math.max(Date.now() - start - delay, 0) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplayXp(Math.round(prevXp + eased * xpGained));
      if (t < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setXpCounting(false);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
    // Chạy đúng 1 lần khi mount — entryState là snapshot bất biến
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to determine if a level is unlocked dynamically
  const isLevelUnlocked = (lvlId: string) => {
    const lvlIdx = levels.findIndex(l => l.id === lvlId);
    if (lvlIdx === 0) return true;

    // A level is unlocked if all implemented lessons in all previous levels are completed
    for (let i = 0; i < lvlIdx; i++) {
      const prevLvl = levels[i];
      const prevImplLessons = prevLvl.lessons.filter(l => IMPLEMENTED_LESSONS.includes(l.id));
      const allCompleted = prevImplLessons.every(l => completedLessons.includes(l.id));
      if (!allCompleted) return false;
    }
    return true;
  };

  const getLessonStatus = (lessonId: string) => {
    const isCompleted = completedLessons.includes(lessonId);
    const isImplemented = IMPLEMENTED_LESSONS.includes(lessonId);

    // Find the level this lesson belongs to
    const level = levels.find(lvl => lvl.lessons.some(l => l.id === lessonId));
    const isLvlUnlocked = level ? isLevelUnlocked(level.id) : false;

    let isUnlocked = false;
    if (isLvlUnlocked) {
      if (isImplemented) {
        // Implemented lessons in an unlocked level unlock sequentially
        const levelImplLessons = level.lessons.filter(l => IMPLEMENTED_LESSONS.includes(l.id));
        const implIdx = levelImplLessons.findIndex(l => l.id === lessonId);
        if (implIdx === 0) {
          isUnlocked = true;
        } else {
          const prevImpl = levelImplLessons[implIdx - 1];
          isUnlocked = completedLessons.includes(prevImpl.id);
        }
      } else {
        // Unimplemented lessons in an unlocked level display as "Đang sản xuất"
        isUnlocked = true;
      }
    } else {
      isUnlocked = false;
    }

    return {
      isCompleted,
      isUnlocked,
      isImplemented,
    };
  };

  // DEV/TEST ONLY: force-complete mọi bài đã implement ở các level trước `levelIdx`
  // để mở khóa level đó ngay lập tức, phục vụ test — cộng XP tương ứng như hoàn thành thật.
  const handleDevUnlockLevel = (levelIdx: number) => {
    const confirmed = window.confirm(
      `[Dev/Test] Đánh dấu hoàn thành toàn bộ bài đã có ở các level trước LEVEL ${levelIdx + 1} để mở khóa? Thao tác này sẽ cộng XP như hoàn thành thật.`
    );
    if (!confirmed) return;
    for (let i = 0; i < levelIdx; i++) {
      levels[i].lessons.forEach((l) => {
        if (IMPLEMENTED_LESSONS.includes(l.id) && !completedLessons.includes(l.id)) {
          completeLesson(l.id, l.xp);
        }
      });
    }
  };

  // Find the single active lesson (first unlocked, implemented, and not completed)
  const activeLesson = allLessons.find((lesson) => {
    const { isCompleted, isUnlocked, isImplemented } = getLessonStatus(lesson.id);
    return isUnlocked && isImplemented && !isCompleted;
  });

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [foxMoving, setFoxMoving] = useState(false);
  const [soundMuted, setSoundMuted] = useState(isMuted());
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    setMuted(next);
  };

  // Set initial selected lesson. Nếu vừa hoàn thành 1 bài, fox đứng lại ở ải
  // VỪA XONG trước (không nhảy thẳng tới ải mới) để có điểm xuất phát cho màn
  // "nhảy xuống ải kế" bên dưới. Vào bản đồ bình thường thì chọn thẳng activeLesson.
  useEffect(() => {
    if (selectedLessonId) return;
    if (justCompletedId) {
      setSelectedLessonId(justCompletedId);
    } else if (activeLesson) {
      setSelectedLessonId(activeLesson.id);
    }
  }, [activeLesson, selectedLessonId, justCompletedId]);

  // Đích fox sẽ nhảy tới: ưu tiên nextLessonId nếu bài đó đã implement (playable),
  // fallback về activeLesson để không nhảy tới node "Đang sản xuất" (không render fox).
  const foxTravelTarget =
    nextLessonId && IMPLEMENTED_LESSONS.includes(nextLessonId)
      ? nextLessonId
      : activeLesson?.id ?? null;

  // Chỉ tự động dời fox sang ải kế ĐÚNG MỘT LẦN cho lần hoàn thành bài vừa
  // rồi (khi animState chạy qua 'nextActive' → 'done'). Nếu không chặn bằng
  // ref này, effect sẽ re-run mỗi khi selectedLessonId đổi — kể cả khi người
  // dùng tự bấm chọn 1 ải cũ đã unlock — và kéo selection về lại chỗ fox
  // đang đứng ngay lập tức (bug: click ải cũ bị "kéo xuống" chỗ fox).
  const hasAppliedCompletionSelectionRef = useRef(false);
  useEffect(() => {
    if (hasAppliedCompletionSelectionRef.current) return;
    if (animState === 'nextActive' && foxTravelTarget) {
      setSelectedLessonId(foxTravelTarget);
      hasAppliedCompletionSelectionRef.current = true;
    } else if (animState === 'done') {
      // Safety net: đảm bảo fox luôn kết thúc đúng ở ải active (kể cả khi
      // reduced-motion bỏ qua animState 'nextActive'). Chỉ set 1 lần duy nhất.
      if (activeLesson) {
        setSelectedLessonId(activeLesson.id);
      }
      hasAppliedCompletionSelectionRef.current = true;
    }
  }, [animState, foxTravelTarget, activeLesson]);

  // Vị trí DOM của từng node bài học, để cuộn màn hình tới đúng chỗ con fox
  // đang đứng thay vì luôn cuộn về đầu course path.
  const lessonNodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Mỗi khi fox đổi vị trí (vào bản đồ lần đầu, hoặc vừa nhảy sang ải kế),
  // cuộn màn hình tới đúng node đó.
  useEffect(() => {
    if (!selectedLessonId) return;
    const t = setTimeout(() => {
      const el = lessonNodeRefs.current[selectedLessonId];
      el?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'center' });
    }, 50);
    return () => clearTimeout(t);
  }, [selectedLessonId, shouldReduceMotion]);

  // Animate mascot state on selection change (simulating Run/Walk to the new node)
  useEffect(() => {
    if (selectedLessonId) {
      setFoxMoving(true);
      const timer = setTimeout(() => {
        setFoxMoving(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [selectedLessonId]);

  const selectedLesson = allLessons.find((lesson) => lesson.id === selectedLessonId) || activeLesson;

  const playableCompletedCount = IMPLEMENTED_LESSONS.filter((id) =>
    completedLessons.includes(id)
  ).length;

  return (
    <div className="min-h-screen bg-[#0c0d0e] pb-24 text-gray-200 relative">
      {/* Background Dot Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
        }}
      />
      {/* Floating background glowing ambient blobs */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[300px] h-[300px] rounded-full bg-purple-900/10 blur-[100px] top-[10%] left-[10%] animate-blob-float" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-900/10 blur-[120px] bottom-[20%] right-[10%] animate-blob-float-delayed" />
          <div className="absolute w-[250px] h-[250px] rounded-full bg-cyan-900/10 blur-[90px] top-[50%] left-[50%] animate-blob-float-fast" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10 items-start relative z-10">
        
        {/* Left Column: Sticky Course Info */}
        <aside className="w-full md:w-80 sticky top-4 z-20 flex-shrink-0 space-y-6">
          <div className="p-6 rounded-3xl bg-gray-900/40 border border-gray-800 space-y-6 backdrop-blur">
            {/* Back to landing */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-gray-300 transition-colors duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại trang chủ
            </button>

            <div>
              <div className="w-28 h-28 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 p-2">
                <img
                  src={`${import.meta.env.BASE_URL}baihoc.png`}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight leading-snug font-display">
                {course.title}
              </h1>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {course.subtitle}
              </p>
            </div>
 
            {/* Gamification Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex flex-col items-center justify-center text-center">
                <motion.span
                  className="text-lg"
                  animate={animateStreak ? { scale: [1, 1.6, 1], rotate: [0, 15, -15, 0] } : {}}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  🔥
                </motion.span>
                <span className="text-sm font-bold text-orange-400 mt-1">{streak} Ngày</span>
                <span className="text-[9px] text-gray-500 uppercase font-semibold mt-0.5">Streak</span>
              </div>
              <div className="p-3 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 flex flex-col items-center justify-center text-center">
                <span className="text-lg">⚡</span>
                <motion.span
                  className="text-sm font-bold text-yellow-400 mt-1"
                  animate={xpCounting && !shouldReduceMotion ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {displayXp} XP
                </motion.span>
                <span className="text-[9px] text-gray-500 uppercase font-semibold mt-0.5">Tổng điểm</span>
              </div>
            </div>

            {/* Progress status */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400 font-semibold">
                <span>Tiến độ bài học</span>
                <span>{playableCompletedCount} / {IMPLEMENTED_LESSONS.length}</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  initial={
                    shouldReduceMotion || xpGained <= 0
                      ? false
                      : { width: `${(Math.max(playableCompletedCount - 1, 0) / IMPLEMENTED_LESSONS.length) * 100}%` }
                  }
                  animate={{ width: `${(playableCompletedCount / IMPLEMENTED_LESSONS.length) * 100}%` }}
                  transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>



            {/* Luyện điểm yếu card — chỉ hiện khi có mistake */}
            {mistakesCount > 0 && (
              <Link
                to="/practice"
                className="block w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-700/40 hover:border-orange-600/60 text-center transition-all duration-200 group"
              >
                <span className="block text-xs font-extrabold text-orange-400 group-hover:text-orange-300 uppercase tracking-wider flex items-center justify-center gap-2">
                  <span>🔁 Luyện Điểm Yếu</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold border border-orange-500/30">
                    {mistakesCount}
                  </span>
                </span>
                <span className="block text-[9px] text-gray-500 mt-0.5">
                  Ôn lại câu sai — luyện đến khi nắm chắc
                </span>
              </Link>
            )}

            {/* Reset progress */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ tiến trình để test lại từ đầu không?')) {
                    resetProgress();
                  }
                }}
                className="text-[10px] text-gray-600 hover:text-gray-400 underline transition-colors"
              >
                Đặt lại toàn bộ tiến độ
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column: Serpentine Learning Path */}
        <main className="flex-grow w-full space-y-12">
          {levels.map((level, levelIdx) => {
            return (
              <div 
                key={level.id} 
                className={`p-6 rounded-[32px] border transition-all duration-500 space-y-8 ${
                  levelIdx % 3 === 0 
                    ? 'bg-purple-950/10 border-purple-900/10' 
                    : levelIdx % 3 === 1 
                      ? 'bg-indigo-950/10 border-indigo-900/10' 
                      : 'bg-cyan-950/10 border-cyan-900/10'
                }`}
              >
                {/* Level Title Pill */}
                <div className="flex justify-start items-center gap-2 flex-wrap">
                  <div
                    id={`pill-${level.id}`}
                    className={`px-4 py-2 rounded-full border text-xs font-bold tracking-wide flex items-center gap-2 transition-all duration-500 font-display ${
                      flashLevelId === level.id
                        ? 'border-purple-400 bg-purple-900/30 shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-105'
                        : 'border-purple-500/30 bg-purple-950/10 backdrop-blur text-purple-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    LEVEL {levelIdx + 1}: {level.title}
                  </div>
                  {!isLevelUnlocked(level.id) && (
                    <button
                      onClick={() => handleDevUnlockLevel(levelIdx)}
                      className="px-3 py-1.5 rounded-full border border-dashed border-amber-600/50 bg-amber-950/20 text-[10px] font-bold text-amber-400 hover:bg-amber-900/30 hover:border-amber-500 transition-colors"
                      title="Chỉ dùng để test — đánh dấu hoàn thành các bài trước đó"
                    >
                      🔓 Mở khóa (test)
                    </button>
                  )}
                </div>

                {/* Vertical Winding Path of Lessons */}
                <div className="relative flex flex-col gap-16 py-4">

                  {level.lessons.map((lesson, lessonIdx) => {
                    const status = getLessonStatus(lesson.id);
                    let isCompletedDynamic = status.isCompleted;
                    let isActiveDynamic = activeLesson && activeLesson.id === lesson.id;
                    const isReviewNode = lesson.type === 'review';
                    const activeLessonData = (lessonFiles[`../content/lessons/${lesson.id}.json`] as any)?.default;
                    const objectiveText = activeLessonData?.objective || lesson.title;
                    const blurbText = objectiveText;

                    if (animatingLessonId) {
                      if (lesson.id === animatingLessonId) {
                        if (animState === 'pedestal') {
                          isCompletedDynamic = false;
                          isActiveDynamic = true;
                        } else {
                          isCompletedDynamic = true;
                          isActiveDynamic = false;
                        }
                      } else if (lesson.id === nextLessonId) {
                        if (animState === 'pedestal' || animState === 'connector') {
                          isCompletedDynamic = false;
                          isActiveDynamic = false;
                        } else if (animState === 'nextActive' || animState === 'done') {
                          isCompletedDynamic = false;
                          isActiveDynamic = true;
                        }
                      }
                    }

                    const isPlayable = status.isImplemented && (status.isCompleted || status.isUnlocked);
                    const loadedData = (lessonFiles[`../content/lessons/${lesson.id}.json`] as any)?.default;
                    const needsReview = loadedData?.needsReview;

                    // Alternating shifts using NODE_OFFSET
                    const xShift = lessonIdx % 2 === 0 ? `-${NODE_OFFSET}px` : `${NODE_OFFSET}px`;

                    let statusLabel = '';
                    if (status.isUnlocked && !status.isImplemented) {
                      statusLabel = 'Đang sản xuất';
                    }

                    const toPath = lesson.type === 'review'
                      ? `/review/${level.id}`
                      : `/lesson/${lesson.id}`;

                    const isSelected = lesson.id === selectedLessonId;

                    const handleNodeClick = (e: React.MouseEvent | React.KeyboardEvent) => {
                      if (!isPlayable) return;
                      if (isSelected) {
                        navigate(toPath);
                      } else {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedLessonId(lesson.id);
                      }
                    };

                    // Construct 3D isometric pedestal rendering elements
                    let pedestalElement;
                    if (isCompletedDynamic) {
                      if (isReviewNode) {
                        pedestalElement = (
                          <motion.div
                            initial={lesson.id === animatingLessonId && !shouldReduceMotion ? { scale: 1.2, opacity: 0.5 } : false}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-28 h-28 relative flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                          >
                            {/* Outer shadow */}
                            <div className="absolute bottom-2 w-24 h-6 bg-black/50 blur-sm rounded-[50%]" />
                            {/* Depth / Side wall */}
                            <div className="absolute bottom-4 w-24 h-12 bg-[#b45309] rounded-[50%] border-b-[5px] border-[#78350f]" />
                            {/* Top surface */}
                            <div className="absolute bottom-5 w-24 h-12 bg-gradient-to-b from-yellow-400 to-amber-500 border border-yellow-300 rounded-[50%] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_0_15px_rgba(245,158,11,0.3)] overflow-hidden">
                              {/* Shine Sweep Overlay */}
                              {!shouldReduceMotion && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine-sweep" />
                              )}
                              {/* Inner concentric ring */}
                              <div className="w-[70%] h-[70%] bg-amber-950/80 rounded-[50%] flex items-center justify-center text-yellow-400 border border-yellow-400/20">
                                <span className="text-base font-extrabold">👑</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      } else {
                        pedestalElement = (
                          <motion.div
                            initial={lesson.id === animatingLessonId && !shouldReduceMotion ? { scale: 1.2, opacity: 0.5 } : false}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-24 h-24 relative flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                          >
                            {/* Outer shadow */}
                            <div className="absolute bottom-2 w-20 h-5 bg-black/40 blur-sm rounded-[50%]" />
                            {/* Depth / Side wall */}
                            <div className="absolute bottom-4 w-20 h-10 bg-[#5b21b6] rounded-[50%] border-b-[5px] border-[#4c1d95]" />
                            {/* Top surface */}
                            <div className="absolute bottom-5 w-20 h-10 bg-gradient-to-b from-purple-500 to-indigo-600 border border-purple-400 rounded-[50%] flex items-center justify-center shadow-[inset_0_2px_3px_rgba(255,255,255,0.2)] overflow-hidden">
                              {/* Shine Sweep Overlay */}
                              {!shouldReduceMotion && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine-sweep" />
                              )}
                              {/* Inner concentric ring */}
                              <div className="w-[70%] h-[70%] bg-purple-950/60 rounded-[50%] flex items-center justify-center text-white border border-purple-400/20">
                                <span className="text-sm font-bold">✓</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }
                    } else if (isActiveDynamic) {
                      if (isReviewNode) {
                        pedestalElement = (
                          <motion.div
                            initial={lesson.id === nextLessonId && !shouldReduceMotion ? { y: 15, opacity: 0 } : false}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-28 h-32 relative flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                          >
                            {/* Glow Shadow */}
                            <div className="absolute bottom-2 w-26 h-7 bg-yellow-500/20 blur-md rounded-[50%]" />
                            {/* Depth / Side wall */}
                            <div className="absolute bottom-4 w-24 h-12 bg-amber-950 rounded-[50%] border-b-[6px] border-[#451a03]" />
                            {/* Top surface */}
                            <div className="absolute bottom-5 w-24 h-12 bg-gradient-to-b from-yellow-400 to-amber-500 border border-yellow-300 rounded-[50%] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_0_15px_rgba(245,158,11,0.3)]" />
                            {/* Light beam cylinder */}
                            {!shouldReduceMotion && (
                              <div className="absolute bottom-[28px] w-18 h-20 bg-gradient-to-t from-yellow-400/20 via-yellow-400/5 to-transparent pointer-events-none rounded-[50%/20%] blur-[1px]" />
                            )}
                          </motion.div>
                        );
                      } else {
                        pedestalElement = (
                          <motion.div
                            initial={lesson.id === nextLessonId && !shouldReduceMotion ? { y: 15, opacity: 0 } : false}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-24 h-28 relative flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                          >
                            {/* Glow Shadow */}
                            <div className="absolute bottom-2 w-22 h-6 bg-cyan-500/20 blur-md rounded-[50%]" />
                            {/* Depth / Side wall */}
                            <div className="absolute bottom-4 w-20 h-10 bg-indigo-950 rounded-[50%] border-b-[6px] border-[#1e1b4b]" />
                            {/* Top surface */}
                            <div className="absolute bottom-5 w-20 h-10 bg-gradient-to-b from-purple-500 to-indigo-600 border border-purple-300 rounded-[50%] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]">
                              {/* Inner core - glowing cyan circle */}
                              <div className="w-[70%] h-[70%] bg-cyan-400 rounded-[50%] shadow-[0_0_15px_#22d3ee] border border-white/50 flex items-center justify-center animate-glow-pulse" />
                            </div>
                            {/* Light beam cylinder */}
                            {!shouldReduceMotion && (
                              <div className="absolute bottom-[24px] w-14 h-16 bg-gradient-to-t from-cyan-400/20 via-cyan-400/5 to-transparent pointer-events-none rounded-[50%/20%] blur-[1px]" />
                            )}
                          </motion.div>
                        );
                      }
                    } else if (status.isUnlocked && !status.isImplemented) {
                      if (isReviewNode) {
                        pedestalElement = (
                          <div className="w-28 h-28 relative flex items-center justify-center hover:scale-102 transition-transform duration-200">
                            {/* Shadow */}
                            <div className="absolute bottom-2 w-24 h-6 bg-black/40 blur-sm rounded-[50%]" />
                            {/* Depth / Side wall */}
                            <div className="absolute bottom-4 w-24 h-12 bg-[#92400e] rounded-[50%] border-b-[5px] border-[#78350f]" />
                            {/* Top surface */}
                            <div className="absolute bottom-5 w-24 h-12 bg-gradient-to-b from-[#f59e0b] to-[#d97706] border border-[#fef08a]/60 rounded-[50%] flex items-center justify-center shadow-[inset_0_2px_3px_rgba(255,255,255,0.3),0_0_15px_rgba(245,158,11,0.2)]">
                              {/* Inner Core */}
                              <div className="w-[70%] h-[70%] bg-[#451a03] rounded-[50%] flex items-center justify-center text-[#f59e0b] border border-[#d97706]/30">
                                <span className="text-sm font-bold">🛠️</span>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        pedestalElement = (
                          <div className="w-24 h-24 relative flex items-center justify-center hover:scale-102 transition-transform duration-200">
                            {/* Shadow */}
                            <div className="absolute bottom-2 w-20 h-5 bg-black/40 blur-sm rounded-[50%]" />
                            {/* Depth / Side wall */}
                            <div className="absolute bottom-4 w-20 h-10 bg-[#92400e] rounded-[50%] border-b-[5px] border-[#78350f]" />
                            {/* Top surface */}
                            <div className="absolute bottom-5 w-20 h-10 bg-gradient-to-b from-[#f59e0b] to-[#d97706] border border-[#fef08a]/60 rounded-[50%] flex items-center justify-center shadow-[inset_0_2px_3px_rgba(255,255,255,0.3),0_0_15px_rgba(245,158,11,0.2)]">
                              {/* Inner Core */}
                              <div className="w-[70%] h-[70%] bg-[#451a03] rounded-[50%] flex items-center justify-center text-[#f59e0b] border border-[#d97706]/30">
                                <span className="text-xs font-bold">🛠️</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    } else {
                      if (isReviewNode) {
                        pedestalElement = (
                          <div className="w-28 h-28 relative flex items-center justify-center hover:scale-102 transition-transform duration-200">
                            {/* Shadow */}
                            <div className="absolute bottom-2 w-24 h-6 bg-black/30 blur-sm rounded-[50%]" />
                            {/* Depth / Side wall */}
                            <div className="absolute bottom-4 w-24 h-12 bg-slate-700 rounded-[50%] border-b-[5px] border-slate-800" />
                            {/* Top surface */}
                            <div className="absolute bottom-5 w-24 h-12 bg-gradient-to-b from-slate-300 to-slate-500 border border-slate-200 rounded-[50%] flex items-center justify-center shadow-[inset_0_2px_3px_rgba(255,255,255,0.4),0_0_12px_rgba(148,163,184,0.15)]">
                              {/* Inner Core */}
                              <div className="w-[70%] h-[70%] bg-slate-900/90 rounded-[50%] flex items-center justify-center text-slate-500 border border-slate-650/40">
                                <span className="text-sm font-bold">🔒</span>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        pedestalElement = (
                          <div className="w-24 h-24 relative flex items-center justify-center hover:scale-102 transition-transform duration-200">
                            {/* Shadow */}
                            <div className="absolute bottom-2 w-20 h-5 bg-black/30 blur-sm rounded-[50%]" />
                            {/* Depth / Side wall */}
                            <div className="absolute bottom-4 w-20 h-10 bg-slate-700 rounded-[50%] border-b-[5px] border-slate-800" />
                            {/* Top surface */}
                            <div className="absolute bottom-5 w-20 h-10 bg-gradient-to-b from-slate-300 to-slate-500 border border-slate-200 rounded-[50%] flex items-center justify-center shadow-[inset_0_2px_3px_rgba(255,255,255,0.4),0_0_12px_rgba(148,163,184,0.15)]">
                              {/* Inner Core */}
                              <div className="w-[70%] h-[70%] bg-slate-900/90 rounded-[50%] flex items-center justify-center text-slate-500 border border-slate-650/40">
                                <span className="text-xs font-black font-mono">{lessonIdx + 1}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    }

                    const svgWidth = 160;
                    const svgCenter = svgWidth / 2;
                    const startX = svgCenter + (lessonIdx % 2 === 0 ? -NODE_OFFSET : NODE_OFFSET);
                    const endX = svgCenter + (lessonIdx % 2 === 0 ? NODE_OFFSET : -NODE_OFFSET);

                    return (
                      <div
                        key={lesson.id}
                        ref={(el) => { lessonNodeRefs.current[lesson.id] = el; }}
                        className="grid grid-cols-[1fr_96px_1fr] items-center gap-4 relative w-full max-w-md mx-auto z-10"
                      >
                        {/* Curved serpentine connection line to the next node */}
                        {lessonIdx < level.lessons.length - 1 && (
                          <svg
                            className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none -z-10 overflow-visible"
                            style={{ width: `${svgWidth}px`, height: '144px' }}
                          >
                            <defs>
                              <linearGradient id={`grad-completed-${lesson.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#06b6d4" />
                              </linearGradient>
                            </defs>
                            {lesson.id === animatingLessonId && animState === 'pedestal' ? (
                              <path
                                d={`M ${startX} 12 C ${startX} 72, ${endX} 72, ${endX} 132`}
                                fill="none"
                                stroke="#374151"
                                strokeWidth="4"
                                strokeDasharray="4 4"
                                strokeLinecap="round"
                                className="opacity-60"
                              />
                            ) : lesson.id === animatingLessonId && animState === 'connector' ? (
                              <>
                                <path
                                  d={`M ${startX} 12 C ${startX} 72, ${endX} 72, ${endX} 132`}
                                  fill="none"
                                  stroke="#374151"
                                  strokeWidth="4"
                                  strokeDasharray="4 4"
                                  strokeLinecap="round"
                                  className="opacity-60"
                                />
                                <motion.path
                                  d={`M ${startX} 12 C ${startX} 72, ${endX} 72, ${endX} 132`}
                                  fill="none"
                                  stroke={`url(#grad-completed-${lesson.id})`}
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 0.6, ease: "easeInOut" }}
                                  style={{ filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.5))' }}
                                />
                              </>
                            ) : (
                              (() => {
                                const leadsToActive = activeLesson && activeLesson.id === level.lessons[lessonIdx + 1]?.id;
                                if (isCompletedDynamic) {
                                  if (leadsToActive) {
                                    return (
                                      <motion.path
                                        d={`M ${startX} 12 C ${startX} 72, ${endX} 72, ${endX} 132`}
                                        fill="none"
                                        stroke={`url(#grad-completed-${lesson.id})`}
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeDasharray="6 6"
                                        animate={!shouldReduceMotion ? { strokeDashoffset: [0, -20] } : {}}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        style={{ filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.5))' }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <path
                                        d={`M ${startX} 12 C ${startX} 72, ${endX} 72, ${endX} 132`}
                                        fill="none"
                                        stroke={`url(#grad-completed-${lesson.id})`}
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        style={{ filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.4))' }}
                                      />
                                    );
                                  }
                                } else {
                                  return (
                                    <path
                                      d={`M ${startX} 12 C ${startX} 72, ${endX} 72, ${endX} 132`}
                                      fill="none"
                                      stroke="#374151"
                                      strokeWidth="4"
                                      strokeDasharray="4 4"
                                      strokeLinecap="round"
                                      className="opacity-60"
                                    />
                                  );
                                }
                              })()
                            )}
                          </svg>
                        )}

                        {/* Left Column: Label for Even items / Blurb Bubble for Odd items */}
                        <div className={`relative flex items-center justify-start w-full ${lessonIdx % 2 === 0 ? 'text-right pr-12' : 'text-left'}`}>
                          {lessonIdx % 2 === 0 ? (
                            <div className="space-y-1 w-full">
                              <span className={`text-[10px] uppercase font-extrabold tracking-wider block ${isActiveDynamic ? 'text-cyan-400' : 'text-gray-500'}`}>
                                {lesson.id}
                              </span>
                              <h4 className={`leading-snug transition-all duration-200 font-display ${
                                isActiveDynamic
                                  ? 'text-sm font-extrabold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                                  : 'text-xs font-bold text-gray-200'
                              }`}>
                                {lesson.title}
                                {needsReview && (
                                  <span className="ml-1.5 inline-block text-[9px] px-1 py-0.2 rounded bg-red-500/25 text-red-400 border border-red-500/30 font-bold uppercase tracking-wider">
                                    Draft
                                  </span>
                                )}
                              </h4>
                              {statusLabel && (
                                <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-semibold">
                                  {statusLabel}
                                </span>
                              )}
                            </div>
                          ) : (
                            isSelected && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-64 z-30 pointer-events-auto">
                                <motion.div
                                  initial={!shouldReduceMotion ? { opacity: 0, scale: 0.95, x: 10 } : false}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  transition={{ duration: 0.35 }}
                                  className="p-3 rounded-2xl bg-gray-950/95 border border-cyan-500/30 text-left shadow-xl animate-float"
                                  role="tooltip"
                                  aria-live="polite"
                                >
                                  {/* Speech bubble arrow pointing right to center */}
                                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-950 border-r border-t border-cyan-500/30 rotate-45 pointer-events-none" />
                                  <div className="relative z-10 space-y-1">
                                    <span className="text-[9px] uppercase font-black text-cyan-400 tracking-wider block font-display">
                                      Học gì bài này
                                    </span>
                                    <p className="text-[11px] text-gray-200 leading-normal font-semibold">
                                      {blurbText}
                                    </p>
                                    <Link
                                      to={toPath}
                                      className="mt-2.5 w-full text-center block btn-3d px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[10px] [--btn-shadow:#1e3a8a] transition-all"
                                    >
                                      {isReviewNode ? 'Vào ôn tập' : 'Vào học ngay'}
                                    </Link>
                                  </div>
                                </motion.div>
                              </div>
                            )
                          )}
                        </div>

                        {/* Center Column: Circle Node */}
                        <div
                          className="flex justify-center items-center relative"
                          style={{ transform: `translateX(${xShift})` }}
                        >
                          {isActiveDynamic && (
                            <div className="absolute w-28 h-28 bg-cyan-500/10 blur-xl rounded-full pointer-events-none animate-pulse -z-10" />
                          )}
                          {isCompletedDynamic && (
                            <div className="absolute w-24 h-24 bg-purple-500/5 blur-lg rounded-full pointer-events-none -z-10" />
                          )}
                          {isPlayable ? (
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={handleNodeClick}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleNodeClick(e as any);
                                }
                              }}
                              aria-label={`Bài học ${lesson.id}: ${lesson.title}. Trạng thái: ${
                                isCompletedDynamic ? 'Đã hoàn thành' : 'Sẵn sàng học'
                              }. ${isSelected ? 'Nhấn thêm lần nữa để vào học.' : 'Nhấn để xem chi tiết.'}`}
                              className={`focus:outline-none rounded-full cursor-pointer relative transition-all duration-300 ${
                                isSelected ? 'scale-105 filter drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]' : ''
                              }`}
                            >
                              {pedestalElement}
                              {isSelected && (
                                <div className="absolute inset-x-0 bottom-[28px] z-20 pointer-events-none flex justify-center">
                                  <motion.div
                                    layoutId={!shouldReduceMotion ? "fox-mascot" : undefined}
                                    className={`flex items-center justify-center ${
                                      isReviewNode ? 'w-20 h-20' : 'w-16 h-16'
                                    }`}
                                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                                  >
                                    <FoxMascot
                                      animation={
                                        animatingLessonId && lesson.id === nextLessonId && animState === 'nextActive'
                                          ? 'Jump'
                                          : foxMoving
                                            ? 'Walk'
                                            : 'Sit'
                                      }
                                      className="w-full h-full"
                                    />
                                  </motion.div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              aria-label={`Bài học ${lesson.id}: ${lesson.title}. Trạng thái: Khóa.`}
                              aria-disabled="true"
                              className="relative"
                            >
                              {pedestalElement}
                            </div>
                          )}
                        </div>

                        {/* Right Column: Label for Odd items / Blurb Bubble for Even items */}
                        <div className={`relative flex items-center justify-end w-full ${lessonIdx % 2 !== 0 ? 'text-left pl-12' : 'text-right'}`}>
                          {lessonIdx % 2 !== 0 ? (
                            <div className="space-y-1 w-full">
                              <span className={`text-[10px] uppercase font-extrabold tracking-wider block ${isActiveDynamic ? 'text-cyan-400' : 'text-gray-500'}`}>
                                {lesson.id}
                              </span>
                              <h4 className={`leading-snug transition-all duration-200 font-display ${
                                isActiveDynamic
                                  ? 'text-sm font-extrabold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                                  : 'text-xs font-bold text-gray-200'
                              }`}>
                                {lesson.title}
                                {needsReview && (
                                  <span className="ml-1.5 inline-block text-[9px] px-1 py-0.2 rounded bg-red-500/25 text-red-400 border border-red-500/30 font-bold uppercase tracking-wider">
                                    Draft
                                  </span>
                                )}
                              </h4>
                              {statusLabel && (
                                <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-semibold">
                                  {statusLabel}
                                </span>
                              )}
                            </div>
                          ) : (
                            isSelected && (
                              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-64 z-30 pointer-events-auto">
                                <motion.div
                                  initial={!shouldReduceMotion ? { opacity: 0, scale: 0.95, x: -10 } : false}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  transition={{ duration: 0.35 }}
                                  className="p-3 rounded-2xl bg-gray-950/95 border border-cyan-500/30 text-left shadow-xl animate-float"
                                  role="tooltip"
                                  aria-live="polite"
                                  >
                                  {/* Speech bubble arrow pointing left to center */}
                                  <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-950 border-l border-b border-cyan-500/30 rotate-45 pointer-events-none" />
                                  <div className="relative z-10 space-y-1">
                                    <span className="text-[9px] uppercase font-black text-cyan-400 tracking-wider block font-display">
                                      Học gì bài này
                                    </span>
                                    <p className="text-[11px] text-gray-200 leading-normal font-semibold">
                                      {blurbText}
                                    </p>
                                    <Link
                                      to={toPath}
                                      className="mt-2.5 w-full text-center block btn-3d px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[10px] [--btn-shadow:#1e3a8a] transition-all"
                                    >
                                      {isReviewNode ? 'Vào ôn tập' : 'Vào học ngay'}
                                    </Link>
                                  </div>
                                </motion.div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </main>
      </div>

      {/* Floating Sound Toggle — icon nhỏ ở góc trái */}
      <button
        onClick={toggleSound}
        className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-gray-900/80 border border-gray-700/50 hover:border-gray-400 flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg hover:scale-110 active:scale-90"
        aria-label={soundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
      >
        <span className="text-xl leading-none">{soundMuted ? '🔇' : '🔊'}</span>
      </button>

      {/* Floating Active Lesson Card ("Start Card") */}
      {selectedLesson ? (
        <div className="fixed bottom-6 right-6 max-w-sm w-full z-40 p-4 rounded-3xl bg-gray-900/95 border border-purple-900/40 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 animate-slideUp">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-purple-400 tracking-wider">
              {selectedLesson.id === activeLesson?.id ? 'Bài tiếp theo' : 'Bài đã chọn'} • {selectedLesson.id}
            </span>
            <h4 className="font-bold text-xs text-white leading-snug line-clamp-1 font-display">
              {selectedLesson.title}
            </h4>
          </div>
          <Link
            to={
              selectedLesson.type === 'review'
                ? `/review/${selectedLesson.id.split('-')[0]}`
                : `/lesson/${selectedLesson.id}`
            }
            className="btn-3d px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs [--btn-shadow:#4c1d95]"
          >
            {completedLessons.includes(selectedLesson.id) ? 'Học lại' : 'Bắt đầu'}
          </Link>
        </div>
      ) : (
        <div className="fixed bottom-6 right-6 max-w-sm w-full z-40 p-4 rounded-3xl bg-gray-900/95 border border-success/30 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-success tracking-wider">
              Tất cả đã hoàn thành!
            </span>
            <h4 className="font-bold text-xs text-white leading-snug">
              Bạn đã học xong toàn bộ bài mẫu.
            </h4>
          </div>
          <span className="text-xl">🏆</span>
        </div>
      )}
    </div>
  );
}
