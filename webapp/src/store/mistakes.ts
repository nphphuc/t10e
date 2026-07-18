import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MistakeEntry {
  id: string; // `${lessonId}__${screenId}__${timestamp}`
  lessonId: string;
  screenId: string;
  questionText: string;
  type: string; // 'choice' | 'multi' | 'truefalse' | etc.
  options?: string[];
  correct?: any;
  correctSet?: number[];
  correctOrder?: string[];
  pairs?: Record<string, string>;
  accepted?: string[];
  explanation?: string;
  feedbackCorrect?: string;
  misconceptionTags: string[];
  timestamp: number;
  reviewedCorrectly?: boolean;
}

interface MistakesState {
  mistakes: MistakeEntry[];
  addMistake: (entry: Omit<MistakeEntry, 'id' | 'timestamp' | 'reviewedCorrectly'>) => void;
  markReviewed: (id: string) => void;
  removeMistake: (id: string) => void;
  clearMistakes: () => void;
  getMistakesCount: () => number;
}

export const useMistakesStore = create<MistakesState>()(
  persist(
    (set, get) => ({
      mistakes: [],

      addMistake: (entry) => {
        const id = `${entry.lessonId}__${entry.screenId}__${Date.now()}`;
        // Tránh duplicate: nếu câu này đã có trong danh sách chưa review, bỏ qua
        const existing = get().mistakes.find(
          (m) => m.lessonId === entry.lessonId && m.screenId === entry.screenId && !m.reviewedCorrectly
        );
        if (existing) return;

        set((state) => ({
          mistakes: [
            ...state.mistakes,
            { ...entry, id, timestamp: Date.now(), reviewedCorrectly: false },
          ],
        }));
      },

      markReviewed: (id) =>
        set((state) => ({
          mistakes: state.mistakes.map((m) =>
            m.id === id ? { ...m, reviewedCorrectly: true } : m
          ),
        })),

      removeMistake: (id) =>
        set((state) => ({
          mistakes: state.mistakes.filter((m) => m.id !== id),
        })),

      clearMistakes: () => set({ mistakes: [] }),

      getMistakesCount: () => get().mistakes.filter((m) => !m.reviewedCorrectly).length,
    }),
    {
      name: 'swd392-mistakes-store',
    }
  )
);
