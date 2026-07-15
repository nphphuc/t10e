import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedLessons: string[];
  totalXp: number;
  streak: number;
  lastActiveDate: string | null; // format: YYYY-MM-DD
  completeLesson: (lessonId: string, xpEarned: number) => void;
  resetProgress: () => void;
}

const getTodayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getYesterdayString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      totalXp: 0,
      streak: 0,
      lastActiveDate: null,

      completeLesson: (lessonId, xpEarned) =>
        set((state) => {
          const isAlreadyCompleted = state.completedLessons.includes(lessonId);
          const nextCompleted = isAlreadyCompleted
            ? state.completedLessons
            : [...state.completedLessons, lessonId];

          const today = getTodayString();
          const yesterday = getYesterdayString();

          let nextStreak = state.streak;
          if (state.lastActiveDate === null) {
            nextStreak = 1;
          } else if (state.lastActiveDate === yesterday) {
            nextStreak = state.streak + 1;
          } else if (state.lastActiveDate !== today) {
            // Missed a day or more, reset streak
            nextStreak = 1;
          }
          // If state.lastActiveDate === today, streak stays the same (already counted for today)

          return {
            completedLessons: nextCompleted,
            totalXp: state.totalXp + (isAlreadyCompleted ? 0 : xpEarned),
            streak: nextStreak,
            lastActiveDate: today,
          };
        }),

      resetProgress: () =>
        set({
          completedLessons: [],
          totalXp: 0,
          streak: 0,
          lastActiveDate: null,
        }),
    }),
    {
      name: 'swd392-progress-store',
    }
  )
);
