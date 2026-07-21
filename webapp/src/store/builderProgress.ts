import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiagramState } from '../builder/engine/types';

export type BuilderMode = 'guided' | 'pe';

interface ModeProgress {
  diagram: DiagramState;
  stepIndex: number;
}

interface BuilderProgressState {
  guided: ModeProgress | null;
  pe: ModeProgress | null;
  saveProgress: (mode: BuilderMode, diagram: DiagramState, stepIndex: number) => void;
  resetProgress: (mode: BuilderMode) => void;
}

// Builder progress is intentionally separate from useProgressStore — the builder
// doesn't award XP or touch completedLessons (PE Review sits outside the main
// course path, same as the rest of /pe-review).
export const useBuilderProgressStore = create<BuilderProgressState>()(
  persist(
    (set) => ({
      guided: null,
      pe: null,
      saveProgress: (mode, diagram, stepIndex) => set((state) => ({ ...state, [mode]: { diagram, stepIndex } })),
      resetProgress: (mode) => set((state) => ({ ...state, [mode]: null })),
    }),
    { name: 'swd392-builder-progress' }
  )
);
