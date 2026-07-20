import type { BuilderLesson, DiagramState } from './types';
import { match } from './normalize';
import { isAssociationClassKey, resolveEdgeEndpoints, findEdgeForPair, diffDiagram } from './validate';

export interface RubricGroupScore {
  key: 'classes' | 'attributes' | 'associations' | 'multiplicity' | 'edgeTypes' | 'associationClass';
  weight: number;
  ratio: number; // 0..1
  points: number;
}

export interface ScoreResult {
  total: number; // 0..100 (unrounded — round only for display)
  passed: boolean;
  groups: RubricGroupScore[];
  feedback: ReturnType<typeof diffDiagram>;
}

const WEIGHTS = {
  classes: 20,
  attributes: 20,
  associations: 20,
  multiplicity: 20,
  edgeTypes: 10,
  associationClass: 10,
} as const;

function ratio(satisfied: number, total: number): number {
  if (total === 0) return 1;
  return Math.max(0, Math.min(1, satisfied / total));
}

function group(key: RubricGroupScore['key'], satisfied: number, total: number): RubricGroupScore {
  const weight = WEIGHTS[key];
  const r = ratio(satisfied, total);
  return { key, weight, ratio: r, points: weight * r };
}

export function scoreDiagram(d: DiagramState, t: BuilderLesson): ScoreResult {
  // --- Group 1: required classes present (incl. association classes) ---
  let classesSatisfied = 0;
  for (const tc of t.target.classes) {
    if (tc.requirement !== 'required') continue;
    const expectedType = isAssociationClassKey(t.target, tc.key) ? 'associationClass' : 'class';
    if (d.nodes.some((n) => n.type === expectedType && match(n.name, tc.name))) classesSatisfied++;
  }
  const classesTotal = t.target.classes.filter((c) => c.requirement === 'required').length;

  // --- Group 2: attributes correctly placed (required present, forbidden absent) ---
  let attrsSatisfied = 0;
  let attrsTotal = 0;
  for (const tc of t.target.classes) {
    const expectedType = isAssociationClassKey(t.target, tc.key) ? 'associationClass' : 'class';
    const node = d.nodes.find((n) => n.type === expectedType && match(n.name, tc.name));
    for (const attr of tc.attributes) {
      if (attr.requirement === 'optional') continue;
      attrsTotal++;
      if (!node) continue; // class not on canvas yet — neither required-present nor forbidden-avoided is earned
      const present = node.attributes.some((a) => match(a.name, attr.name));
      const ok = attr.requirement === 'required' ? present : !present;
      if (ok) attrsSatisfied++;
    }
  }

  // --- Group 3: required associations exist between the right class pair ---
  const requiredEdges = t.target.edges.filter((e) => e.requirement === 'required');
  let assocSatisfied = 0;
  for (const te of requiredEdges) {
    const resolved = resolveEdgeEndpoints(d, t, te);
    if (!resolved?.fromNode || !resolved.toNode) continue;
    const edge = findEdgeForPair(d, resolved.fromNode, resolved.toNode, te.type === 'generalization');
    if (edge) assocSatisfied++;
  }
  const assocTotal = requiredEdges.length;

  // --- Group 4: multiplicity correct at each end ---
  const edgesWithMultiplicity = requiredEdges.filter((e) => e.multiplicity);
  let multSatisfied = 0;
  const multTotal = edgesWithMultiplicity.length * 2;
  for (const te of edgesWithMultiplicity) {
    const resolved = resolveEdgeEndpoints(d, t, te);
    if (!resolved?.fromNode || !resolved.toNode || !te.multiplicity) continue;
    const edge = findEdgeForPair(d, resolved.fromNode, resolved.toNode, te.type === 'generalization');
    if (!edge?.multiplicity) continue;
    const sameDirection = edge.from === resolved.fromNode.id;
    const actualFrom = sameDirection ? edge.multiplicity.from : edge.multiplicity.to;
    const actualTo = sameDirection ? edge.multiplicity.to : edge.multiplicity.from;
    if (actualFrom === te.multiplicity.from) multSatisfied++;
    if (actualTo === te.multiplicity.to) multSatisfied++;
  }

  // --- Group 5: edge type correct (association/aggregation/composition/generalization) ---
  let typeSatisfied = 0;
  for (const te of requiredEdges) {
    const resolved = resolveEdgeEndpoints(d, t, te);
    if (!resolved?.fromNode || !resolved.toNode) continue;
    const edge = findEdgeForPair(d, resolved.fromNode, resolved.toNode, te.type === 'generalization');
    if (!edge) continue;
    const accepted = te.acceptedTypes ?? [te.type];
    if (accepted.includes(edge.type)) typeSatisfied++;
  }
  const typeTotal = requiredEdges.length;

  // --- Group 6: association class attached to the right edge ---
  const edgesWithAssocClass = requiredEdges.filter((e) => e.associationClassKey);
  let acSatisfied = 0;
  for (const te of edgesWithAssocClass) {
    const acTarget = t.target.classes.find((c) => c.key === te.associationClassKey);
    if (!acTarget) continue;
    const acNode = d.nodes.find((n) => n.type === 'associationClass' && match(n.name, acTarget.name));
    if (!acNode) continue;
    const resolved = resolveEdgeEndpoints(d, t, te);
    if (!resolved?.fromNode || !resolved.toNode) continue;
    const edge = findEdgeForPair(d, resolved.fromNode, resolved.toNode, false);
    if (edge?.attachedClassId === acNode.id) acSatisfied++;
  }
  const acTotal = edgesWithAssocClass.length;

  const groups: RubricGroupScore[] = [
    group('classes', classesSatisfied, classesTotal),
    group('attributes', attrsSatisfied, attrsTotal),
    group('associations', assocSatisfied, assocTotal),
    group('multiplicity', multSatisfied, multTotal),
    group('edgeTypes', typeSatisfied, typeTotal),
    group('associationClass', acSatisfied, acTotal),
  ];

  const total = groups.reduce((sum, g) => sum + g.points, 0);
  const passed = total >= t.passThreshold;

  return { total, passed, groups, feedback: diffDiagram(d, t) };
}
