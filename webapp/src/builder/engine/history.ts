import type { DiagramState } from './types';

export const HISTORY_LIMIT = 30;

export interface DiagramHistoryState {
  present: DiagramState;
  history: DiagramState[];
}

export type DiagramHistoryAction =
  | { type: 'commit'; next: DiagramState }
  | { type: 'undo' }
  | { type: 'reset'; next: DiagramState };

export function createDiagramHistoryState(present: DiagramState): DiagramHistoryState {
  return { present: structuredClone(present), history: [] };
}

export function diagramHistoryReducer(state: DiagramHistoryState, action: DiagramHistoryAction): DiagramHistoryState {
  if (action.type === 'reset') return createDiagramHistoryState(action.next);
  if (action.type === 'undo') {
    if (state.history.length === 0) return state;
    const snapshot = state.history[state.history.length - 1];
    return {
      present: structuredClone(snapshot),
      history: state.history.slice(0, -1),
    };
  }
  if (action.next === state.present) return state;
  return {
    present: action.next,
    history: [...state.history, structuredClone(state.present)].slice(-HISTORY_LIMIT),
  };
}
