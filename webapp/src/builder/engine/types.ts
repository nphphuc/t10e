// Class Diagram Builder — pure domain types. No React imports here (kept vitest-testable in isolation).

export type NodeType = 'class' | 'associationClass';
export type EdgeType = 'association' | 'aggregation' | 'composition' | 'generalization';
export type Multiplicity = '1' | '0..1' | '1..*' | '0..*';

export interface DiagramNode {
  id: string;
  type: NodeType;
  name: string;
  attributes: { id: string; name: string }[];
  x: number;
  y: number;
}

// multiplicity.from is the label drawn at the `from` end (count of `from`-side
// instances per one instance at the `to` end), multiplicity.to is the label at
// the `to` end — standard UML placement (label near a class counts instances
// of THAT class per one instance of the other class).
export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  type: EdgeType;
  name?: string;
  multiplicity?: { from: Multiplicity; to: Multiplicity };
  attachedClassId?: string;
}

export interface DiagramState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface NameMatcher {
  canonical: string;
  accepted: string[];
}

export interface TargetAttribute {
  name: NameMatcher;
  requirement: 'required' | 'optional' | 'forbidden';
  forbiddenTag?: string;
  forbiddenReason?: string;
}

export interface TargetClass {
  key: string;
  name: NameMatcher;
  requirement: 'required' | 'optional';
  attributes: TargetAttribute[];
}

export interface TargetEdge {
  fromKey: string;
  toKey: string;
  type: EdgeType;
  acceptedTypes?: EdgeType[];
  name?: NameMatcher;
  multiplicity?: { from: Multiplicity; to: Multiplicity };
  requirement: 'required' | 'optional' | 'forbidden';
  wrongTypeTag?: string;
  wrongMultiplicityTag?: string;
  reason?: string;
  associationClassKey?: string; // key of the TargetClass (type='associationClass') attached to this edge, if any
}

export interface PaletteItem {
  label: string;
  kind: 'class' | 'attribute' | 'verb-trap' | 'attribute-trap';
  targetClassKey?: string;
  trapTag?: string;
  trapMessage?: string;
}

export type BuilderStepId =
  | 'find-classes'
  | 'place-attributes'
  | 'draw-associations'
  | 'set-multiplicity'
  | 'choose-edge-types'
  | 'association-class'
  | 'compare'
  | 'free-build'
  | 'review';

export interface BuilderLesson {
  id: string;
  mode: 'guided' | 'pe';
  title: string;
  brief: string[];
  palette: PaletteItem[];
  steps: BuilderStepId[];
  target: { classes: TargetClass[]; edges: TargetEdge[] };
  passThreshold: number;
  sourceRefs: string[];
}

export interface FeedbackItem {
  severity: 'ok' | 'hint' | 'warn' | 'error';
  message: string;
  tag?: string;
  subjectId?: string;
}

export type StepValidator = (d: DiagramState, t: BuilderLesson) => FeedbackItem[];
