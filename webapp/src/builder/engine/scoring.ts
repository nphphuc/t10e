import { match } from './normalize';
import { diffDiagram, findEdgeForPair, isAssociationClassKey, resolveEdgeEndpoints } from './validate';
import type { BuilderLesson, DiagramState } from './types';

export type RubricKey = 'classes' | 'attributes' | 'associations' | 'multiplicity' | 'edgeTypes' | 'associationClass';

export interface RubricGroupScore {
  key: RubricKey;
  weight: number;
  ratio: number;
  points: number;
}

export interface ScoreResult {
  total: number;
  passed: boolean;
  groups: RubricGroupScore[];
  feedback: ReturnType<typeof diffDiagram>;
}

export const RUBRIC_WEIGHTS: Record<RubricKey, number> = {
  classes: 20,
  attributes: 20,
  associations: 20,
  multiplicity: 20,
  edgeTypes: 10,
  associationClass: 10,
};

const group = (key: RubricKey, correct: number, total: number): RubricGroupScore => {
  const ratio = total <= 0 ? 0 : Math.max(0, Math.min(1, correct / total));
  return { key, weight: RUBRIC_WEIGHTS[key], ratio, points: RUBRIC_WEIGHTS[key] * ratio };
};

export function passesThreshold(total: number, threshold: number): boolean {
  return total >= threshold;
}

export function scoreDiagram(diagram: DiagramState, lesson: BuilderLesson): ScoreResult {
  const requiredClasses = lesson.target.classes.filter((candidate) => candidate.requirement === 'required');
  const classCorrect = requiredClasses.filter((targetClass) => {
    const expectedType = isAssociationClassKey(lesson.target, targetClass.key) ? 'associationClass' : 'class';
    return diagram.nodes.some((node) => node.type === expectedType && match(node.name, targetClass.name));
  }).length;
  const extraClasses = diagram.nodes.filter((node) => !lesson.target.classes.some((targetClass) => {
    const expectedType = isAssociationClassKey(lesson.target, targetClass.key) ? 'associationClass' : 'class';
    return node.type === expectedType && match(node.name, targetClass.name);
  })).length;

  let requiredAttributes = 0;
  let attributeCorrect = 0;
  let attributePenalties = 0;
  for (const targetClass of lesson.target.classes) {
    const expectedType = isAssociationClassKey(lesson.target, targetClass.key) ? 'associationClass' : 'class';
    const node = diagram.nodes.find((candidate) => candidate.type === expectedType && match(candidate.name, targetClass.name));
    for (const attribute of targetClass.attributes.filter((candidate) => candidate.requirement === 'required')) {
      requiredAttributes++;
      if (node?.attributes.some((candidate) => match(candidate.name, attribute.name))) attributeCorrect++;
    }
    if (!node) continue;
    for (const candidate of node.attributes) {
      const spec = targetClass.attributes.find((attribute) => match(candidate.name, attribute.name));
      if (!spec || spec.requirement === 'forbidden') attributePenalties++;
    }
  }

  const requiredEdges = lesson.target.edges.filter((candidate) => candidate.requirement === 'required');
  let associationCorrect = 0;
  let edgeTypeCorrect = 0;
  let multiplicityCorrect = 0;
  let associationClassCorrect = 0;
  const multiplicityTotal = requiredEdges.filter((candidate) => candidate.multiplicity).length * 2;
  const associationClassTotal = requiredEdges.filter((candidate) => candidate.associationClassKey).length;
  const matchedEdgeIds = new Set<string>();

  for (const targetEdge of requiredEdges) {
    const resolved = resolveEdgeEndpoints(diagram, lesson, targetEdge);
    if (!resolved?.fromNode || !resolved.toNode) continue;
    const edge = findEdgeForPair(diagram, resolved.fromNode, resolved.toNode, targetEdge.type === 'generalization');
    if (!edge) continue;
    matchedEdgeIds.add(edge.id);
    associationCorrect++;
    if ((targetEdge.acceptedTypes ?? [targetEdge.type]).includes(edge.type)) edgeTypeCorrect++;
    if (targetEdge.multiplicity && edge.multiplicity) {
      const sameDirection = edge.from === resolved.fromNode.id;
      const from = sameDirection ? edge.multiplicity.from : edge.multiplicity.to;
      const to = sameDirection ? edge.multiplicity.to : edge.multiplicity.from;
      if (from === targetEdge.multiplicity.from) multiplicityCorrect++;
      if (to === targetEdge.multiplicity.to) multiplicityCorrect++;
    }
    if (targetEdge.associationClassKey) {
      const targetClass = lesson.target.classes.find((candidate) => candidate.key === targetEdge.associationClassKey);
      const associationNode = targetClass && diagram.nodes.find((node) =>
        node.type === 'associationClass' && match(node.name, targetClass.name));
      if (associationNode && edge.attachedClassId === associationNode.id) associationClassCorrect++;
    }
  }
  const extraEdges = diagram.edges.filter((edge) => !matchedEdgeIds.has(edge.id)).length;

  const groups = [
    group('classes', classCorrect, requiredClasses.length + extraClasses),
    group('attributes', attributeCorrect, requiredAttributes + attributePenalties),
    group('associations', associationCorrect, requiredEdges.length + extraEdges),
    group('multiplicity', multiplicityCorrect, multiplicityTotal),
    group('edgeTypes', edgeTypeCorrect, requiredEdges.length),
    group('associationClass', associationClassCorrect, associationClassTotal),
  ];
  const total = Number(groups.reduce((sum, item) => sum + item.points, 0).toFixed(2));
  return {
    total,
    passed: passesThreshold(total, lesson.passThreshold),
    groups,
    feedback: diffDiagram(diagram, lesson),
  };
}
