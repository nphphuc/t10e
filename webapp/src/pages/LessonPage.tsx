import { useParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import LessonPlayer from '../engine/LessonPlayer';
import { useProgressStore } from '../store/progress';

// Eagerly import all lessons to dynamically resolve lesson data (e.g. L03-03.json)
const lessonFiles = import.meta.glob('../content/lessons/*.json', { eager: true });

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const completeLesson = useProgressStore((state) => state.completeLesson);
  const shouldReduceMotion = useReducedMotion();

  const lessonData = lessonId ? (lessonFiles[`../content/lessons/${lessonId}.json`] as any)?.default : null;

  if (!lessonData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0d0e] p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-200">Không Tìm Thấy Bài Học</h2>
        <p className="text-gray-400">Bài học "{lessonId}" chưa có nội dung hoặc đang được sản xuất.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition-all"
        >
          Trở Lại Bản Đồ
        </button>
      </div>
    );
  }

  const handleComplete = (scorePercentage: number, xpEarned: number, isMastered: boolean) => {
    console.log(`[LessonPage] Completed: Score ${scorePercentage}%, XP Earned: ${xpEarned}, Mastered: ${isMastered}`);

    const prevState = useProgressStore.getState();
    const wasCompleted = prevState.completedLessons.includes(lessonData.id);
    const prevStreak = prevState.streak;

    // Complete lesson in progress store
    completeLesson(lessonData.id, xpEarned);

    const nextStreak = useProgressStore.getState().streak;
    const streakIncreased = nextStreak > prevStreak;

    // Redirect back to CourseMap with state
    navigate('/', {
      state: {
        justCompleted: lessonData.id,
        streakIncreased,
        // XP thực sự được cộng (0 nếu bài đã hoàn thành trước đó)
        xpGained: wasCompleted ? 0 : xpEarned,
      }
    });
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <LessonPlayer
        lesson={lessonData}
        onComplete={handleComplete}
      />
    </motion.div>
  );
}
