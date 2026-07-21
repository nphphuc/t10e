import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActivityDiagramState } from '../activity-builder/engine/types';

export type ActivityBuilderMode = 'guided' | 'pe';

interface ModeProgress {
  diagram: ActivityDiagramState;
  stepIndex: number;
}

interface ActivityProgressState {
  guided: ModeProgress | null;
  pe: ModeProgress | null;
  saveProgress: (mode: ActivityBuilderMode, diagram: ActivityDiagramState, stepIndex: number) => void;
  resetProgress: (mode: ActivityBuilderMode) => void;
}

// Separate store, separate localStorage key from the class-diagram builder's
// builderProgress.ts (teammate 1's territory) — no shared state, no XP/completedLessons
// coupling (Activity Diagram Builder sits outside the main course path, same as the
// rest of /pe-review).
export const useActivityProgressStore = create<ActivityProgressState>()(
  persist(
    (set) => ({
      guided: null,
      pe: null,
      saveProgress: (mode, diagram, stepIndex) => set((state) => ({ ...state, [mode]: { diagram, stepIndex } })),
      resetProgress: (mode) => set((state) => ({ ...state, [mode]: null })),
    }),
    { name: 'swd392-activity-builder-progress' }
  )
);
