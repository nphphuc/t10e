// Activity Diagram Builder — pure domain types. No React imports here (kept vitest-testable in isolation).

export type ActivityNodeType = 'initial' | 'action' | 'decision' | 'merge' | 'fork' | 'join' | 'final';

export interface ActivityNode {
  id: string;
  type: ActivityNodeType;
  name?: string; // only 'action' (and optionally a decision question label); initial/final/fork/join carry none
  x: number;
  y: number;
}

export interface ActivityEdge {
  id: string;
  from: string;
  to: string;
  guard?: string; // required on every edge leaving a 'decision' node
}

export interface ActivityDiagramState {
  nodes: ActivityNode[];
  edges: ActivityEdge[];
}

export interface NameMatcher {
  canonical: string;
  accepted: string[];
}

export interface TargetAction {
  key: string;
  name: NameMatcher;
  requirement: 'required' | 'optional' | 'forbidden';
  forbiddenTag?: string;
  forbiddenReason?: string;
}

export interface TargetGuardBranch {
  guard: NameMatcher;
  sequence: string[]; // actionKeys, in order, taken on this branch
  rejoinAt?: string; // actionKey where this branch rejoins the main flow via a merge node
}

export interface TargetBranch {
  decisionAfter: string; // actionKey the decision node immediately follows
  guards: TargetGuardBranch[];
}

export interface TargetConcurrent {
  forkAfter: string; // actionKey the fork node immediately follows
  join: string; // actionKey reached right after the join node
  lanes: string[][]; // parallel actionKey sequences, one per fork branch
}

export interface PaletteItem {
  label: string;
  kind: 'action' | 'noun-trap'; // noun-trap: a static noun, not an action verb (e.g. "Hóa đơn")
  targetActionKey?: string;
  trapTag?: string;
  trapMessage?: string;
}

export type ActivityStepId =
  | 'place-actions'
  | 'main-sequence'
  | 'decisions-guards'
  | 'fork-join'
  | 'compare'
  | 'free-build'
  | 'review';

export interface ActivityTargetSpec {
  actions: TargetAction[];
  mainSequence: string[]; // actionKeys, in order, for the primary flow
  branches: TargetBranch[];
  concurrent?: TargetConcurrent;
}

export interface ActivityLesson {
  id: string;
  mode: 'guided' | 'pe';
  title: string;
  brief: string[];
  palette: PaletteItem[];
  steps: ActivityStepId[];
  target: ActivityTargetSpec;
  passThreshold: number;
  sourceRefs: string[];
  needsReview?: boolean; // draft content awaiting product-owner sign-off
}

export interface FeedbackItem {
  severity: 'ok' | 'hint' | 'warn' | 'error';
  message: string;
  tag?: string;
  subjectId?: string;
}

export type StepValidator = (d: ActivityDiagramState, t: ActivityLesson) => FeedbackItem[];
