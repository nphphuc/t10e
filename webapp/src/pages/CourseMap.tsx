import { useProgressStore } from '../store/progress';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import manifestData from '../content/manifest.json';

// Dynamically discover all implemented lessons in the content/lessons directory
const lessonFiles = import.meta.glob('../content/lessons/*.json', { eager: true });
const IMPLEMENTED_LESSONS = Object.keys(lessonFiles).map(path => {
  const match = path.match(/\/([^/]+)\.json$/);
  return match ? match[1] : '';
}).filter(Boolean);

export default function CourseMap() {
  const { completedLessons, totalXp, streak, resetProgress } = useProgressStore();
  const shouldReduceMotion = useReducedMotion();

  const course = manifestData.course;
  const levels = course.levels;

  // Flatten all lessons to determine locks and the single active lesson
  const allLessons = levels.flatMap((level) => level.lessons);

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

  // Find the single active lesson (first unlocked, implemented, and not completed)
  const activeLesson = allLessons.find((lesson) => {
    const { isCompleted, isUnlocked, isImplemented } = getLessonStatus(lesson.id);
    return isUnlocked && isImplemented && !isCompleted;
  });

  const playableCompletedCount = IMPLEMENTED_LESSONS.filter((id) =>
    completedLessons.includes(id)
  ).length;

  return (
    <div className="min-h-screen bg-[#0c0d0e] pb-24 text-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10 items-start">
        
        {/* Left Column: Sticky Course Info */}
        <aside className="w-full md:w-80 md:sticky md:top-8 flex-shrink-0 space-y-6">
          <div className="p-6 rounded-3xl bg-gray-900/40 border border-gray-800 space-y-6 backdrop-blur">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xl mb-4">
                🎓
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight leading-snug">
                {course.title}
              </h1>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {course.subtitle}
              </p>
            </div>

            {/* Gamification Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex flex-col items-center justify-center text-center">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-bold text-orange-400 mt-1">{streak} Ngày</span>
                <span className="text-[9px] text-gray-500 uppercase font-semibold mt-0.5">Streak</span>
              </div>
              <div className="p-3 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 flex flex-col items-center justify-center text-center">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-bold text-yellow-400 mt-1">{totalXp} XP</span>
                <span className="text-[9px] text-gray-500 uppercase font-semibold mt-0.5">Tổng điểm</span>
              </div>
            </div>

            {/* Progress status */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400 font-semibold">
                <span>Tiến độ bài học mẫu</span>
                <span>{playableCompletedCount} / 4</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${(playableCompletedCount / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* PE Review Entry Button */}
            <Link
              to="/pe-review"
              className="block w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800/40 hover:border-blue-700/60 text-center transition-all duration-200 group"
            >
              <span className="block text-xs font-extrabold text-blue-400 group-hover:text-blue-300 uppercase tracking-wider">
                🚀 Ôn Thi PE (Practical)
              </span>
              <span className="block text-[9px] text-gray-500 mt-0.5">
                Practice Exam Review Sets
              </span>
            </Link>

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
              <div key={level.id} className="space-y-8">
                {/* Level Title Pill */}
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-full border border-purple-500/30 bg-purple-950/10 backdrop-blur text-xs font-bold tracking-wide text-purple-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    LEVEL {levelIdx + 1}: {level.title}
                  </div>
                </div>

                {/* Vertical Winding Path of Lessons */}
                <div className="relative flex flex-col gap-16 py-4">

                  {level.lessons.map((lesson, lessonIdx) => {
                    const { isCompleted, isUnlocked, isImplemented } = getLessonStatus(lesson.id);
                    const isPlayable = true; // All lessons are clickable
                    const isActive = activeLesson && activeLesson.id === lesson.id;

                    const loadedData = (lessonFiles[`../content/lessons/${lesson.id}.json`] as any)?.default;
                    const needsReview = loadedData?.needsReview;

                    // Alternating shifts: -28px, 28px, -28px, 28px...
                    const xShift = lessonIdx % 2 === 0 ? '-28px' : '28px';


                    let statusLabel = '';
                    if (isUnlocked && !isImplemented) {
                      statusLabel = 'Đang sản xuất';
                    }

                    const toPath = lesson.type === 'review'
                      ? `/review/${level.id}`
                      : `/lesson/${lesson.id}`;

                    // Construct 3D isometric pedestal rendering elements
                    let pedestalElement;
                    if (isCompleted) {
                      pedestalElement = (
                        <div className="w-24 h-24 relative flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
                          {/* Outer shadow */}
                          <div className="absolute bottom-2 w-20 h-5 bg-black/40 blur-sm rounded-[50%]" />
                          {/* Depth / Side wall */}
                          <div className="absolute bottom-4 w-20 h-10 bg-[#5b21b6] rounded-[50%] border-b-[5px] border-[#4c1d95]" />
                          {/* Top surface */}
                          <div className="absolute bottom-5 w-20 h-10 bg-gradient-to-b from-purple-500 to-indigo-600 border border-purple-400 rounded-[50%] flex items-center justify-center shadow-[inset_0_2px_3px_rgba(255,255,255,0.2)]">
                            {/* Inner concentric ring */}
                            <div className="w-[70%] h-[70%] bg-purple-950/60 rounded-[50%] flex items-center justify-center text-white border border-purple-400/20">
                              <span className="text-sm font-bold">✓</span>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (isActive) {
                      pedestalElement = (
                        <div className="w-24 h-28 relative flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
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
                          {/* Floating Badge (Green diamond with white inner square and black dot) */}
                          <div className="absolute bottom-[36px] z-20 animate-float pointer-events-none">
                            <div className="w-8 h-8 bg-[#22c55e] rounded-lg rotate-45 flex items-center justify-center border border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.5)]">
                              <div className="w-3.5 h-3.5 bg-white rounded flex items-center justify-center -rotate-45">
                                <div className="w-1.5 h-1.5 bg-black rounded-sm" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (isUnlocked && !isImplemented) {
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

                    return (
                      <div
                        key={lesson.id}
                        className="grid grid-cols-[1fr_96px_1fr] items-center gap-4 relative w-full max-w-lg mx-auto z-10"
                      >
                        {/* Curved serpentine connection line to the next node */}
                        {lessonIdx < level.lessons.length - 1 && (
                          <svg
                            className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none -z-10 overflow-visible"
                            style={{ width: '128px', height: '144px' }}
                          >
                            <path
                              d={`M ${lessonIdx % 2 === 0 ? -28 : 28} 12 C ${lessonIdx % 2 === 0 ? -28 : 28} 72, ${lessonIdx % 2 === 0 ? 28 : -28} 72, ${lessonIdx % 2 === 0 ? 28 : -28} 132`}
                              fill="none"
                              stroke={isCompleted ? "#a855f7" : "#1f2937"}
                              strokeWidth="6"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}

                        {/* Left Column: Label for Odd items */}
                        <div className="text-right pr-2">
                          {lessonIdx % 2 === 0 && (
                            <div className="space-y-1">
                              <span className={`text-[10px] uppercase font-extrabold tracking-wider block ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
                                {lesson.id}
                              </span>
                              <h4 className={`leading-snug transition-all duration-200 ${
                                isActive
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
                          )}
                        </div>

                        {/* Center Column: Circle Node */}
                        <div
                          className="flex justify-center items-center relative"
                          style={{ transform: `translateX(${xShift})` }}
                        >
                          {isActive && (
                            <div className="absolute w-28 h-28 bg-cyan-500/10 blur-xl rounded-full pointer-events-none animate-pulse -z-10" />
                          )}
                          {isCompleted && (
                            <div className="absolute w-24 h-24 bg-purple-500/5 blur-lg rounded-full pointer-events-none -z-10" />
                          )}
                          {isPlayable ? (
                            <Link
                              to={toPath}
                              aria-label={`Bài học ${lesson.id}: ${lesson.title}. Trạng thái: ${
                                isCompleted ? 'Đã hoàn thành' : 'Sẵn sàng học'
                              }`}
                              className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full"
                            >
                              {pedestalElement}
                            </Link>
                          ) : (
                            <div
                              aria-label={`Bài học ${lesson.id}: ${lesson.title}. Trạng thái: Khóa.`}
                              aria-disabled="true"
                            >
                              {pedestalElement}
                            </div>
                          )}
                        </div>

                        {/* Right Column: Label for Even items */}
                        <div className="text-left pl-2">
                          {lessonIdx % 2 !== 0 && (
                            <div className="space-y-1">
                              <span className={`text-[10px] uppercase font-extrabold tracking-wider block ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
                                {lesson.id}
                              </span>
                              <h4 className={`leading-snug transition-all duration-200 ${
                                isActive
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

      {/* Floating Active Lesson Card ("Start Card") */}
      {activeLesson ? (
        <div className="fixed bottom-6 right-6 max-w-sm w-full z-40 p-4 rounded-3xl bg-gray-900/95 border border-purple-900/40 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 animate-slideUp">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-purple-400 tracking-wider">
              Bài tiếp theo • {activeLesson.id}
            </span>
            <h4 className="font-bold text-xs text-white leading-snug line-clamp-1">
              {activeLesson.title}
            </h4>
          </div>
          <Link
            to={
              activeLesson.type === 'review'
                ? `/review/${activeLesson.id.split('-')[0]}`
                : `/lesson/${activeLesson.id}`
            }
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all duration-200 active:scale-95"
          >
            Bắt đầu
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
