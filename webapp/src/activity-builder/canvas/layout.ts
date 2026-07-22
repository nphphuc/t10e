import type { ActivityNodeType } from '../engine/types';

// Shared layout constants so ActivityNode/ActivityEdge agree on node geometry.
// Unlike class boxes (which grow with attribute count), every activity node type
// has a fixed UML-standard size.
export const ACTION_WIDTH = 168;
export const ACTION_HEIGHT = 56;
export const DECISION_SIZE = 60; // diamond bounding box (square)
export const INITIAL_SIZE = 26; // filled circle diameter
export const FINAL_SIZE = 30; // circle-in-circle diameter
export const FORKJOIN_LENGTH = 96; // thick bar length
export const FORKJOIN_THICKNESS = 12;

export interface NodeBox {
  width: number;
  height: number;
}

export function nodeBox(type: ActivityNodeType): NodeBox {
  switch (type) {
    case 'action':
      return { width: ACTION_WIDTH, height: ACTION_HEIGHT };
    case 'decision':
    case 'merge':
      return { width: DECISION_SIZE, height: DECISION_SIZE };
    case 'initial':
      return { width: INITIAL_SIZE, height: INITIAL_SIZE };
    case 'final':
      return { width: FINAL_SIZE, height: FINAL_SIZE };
    case 'fork':
    case 'join':
      return { width: FORKJOIN_LENGTH, height: FORKJOIN_THICKNESS };
  }
}

export function nodeCenter(x: number, y: number, type: ActivityNodeType): { cx: number; cy: number } {
  const box = nodeBox(type);
  return { cx: x + box.width / 2, cy: y + box.height / 2 };
}
