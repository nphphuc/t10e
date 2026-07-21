import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiagramState } from '../builder/engine/types';

export interface BuilderAttempt {
  lessonId: string;
  completedAt: number;
  score?: number;
}

export interface LessonBuilderProgress {
  stepIndex: number;
  diagram: DiagramState;
  completedSteps: string[];
  updatedAt: number;
}

interface BuilderProgressState {
  lessons: Record<string, LessonBuilderProgress>;
  attempts: BuilderAttempt[];
  save: (lessonId: string, progress: Omit<LessonBuilderProgress, 'updatedAt'>) => void;
  complete: (lessonId: string, score?: number) => void;
  reset: (lessonId: string) => void;
}

export const EMPTY_DIAGRAM: DiagramState = { nodes: [], edges: [] };

export const useBuilderProgress = create<BuilderProgressState>()(
  persist(
    (set) => ({
      lessons: {},
      attempts: [],
      save: (lessonId, progress) => set((state) => ({
        lessons: { ...state.lessons, [lessonId]: { ...progress, updatedAt: Date.now() } },
      })),
      complete: (lessonId, score) => set((state) => ({
        attempts: [...state.attempts, { lessonId, score, completedAt: Date.now() }],
      })),
      reset: (lessonId) => set((state) => {
        const lessons = { ...state.lessons };
        delete lessons[lessonId];
        return { lessons };
      }),
    }),
    { name: 'swd392-class-diagram-builder-progress' },
  ),
);
