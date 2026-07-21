export type NodeType = 'class' | 'associationClass';
export type EdgeType = 'association' | 'aggregation' | 'composition' | 'generalization';
export type Multiplicity = '1' | '0..1' | '1..*' | '0..*';

export interface DiagramAttribute {
  id: string;
  name: string;
}

export interface DiagramNode {
  id: string;
  type: NodeType;
  name: string;
  attributes: DiagramAttribute[];
  x: number;
  y: number;
}

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
  /** Mapping required to validate DiagramEdge.attachedClassId. */
  associationClassKey?: string;
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
  status?: string;
  needsReview?: boolean;
}

export interface FeedbackItem {
  severity: 'ok' | 'hint' | 'warn' | 'error';
  message: string;
  tag?: string;
  subjectId?: string;
}

export type StepValidator = (diagram: DiagramState, lesson: BuilderLesson) => FeedbackItem[];
