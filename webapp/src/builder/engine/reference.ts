import type { BuilderLesson, DiagramEdge, DiagramNode, DiagramState } from './types';
import { isAssociationClassKey } from './validate';

const COL_WIDTH = 220;
const ROW_HEIGHT = 150;
const COLS = 3;

// Builds a canonical, auto-laid-out diagram directly from a lesson's target spec —
// used as the "reference answer" shown next to the learner's diagram in PE review.
// Pure and deterministic: same lesson always produces the same reference diagram.
export function buildReferenceDiagram(lesson: BuilderLesson): DiagramState {
  const baseClasses = lesson.target.classes.filter((c) => !isAssociationClassKey(lesson.target, c.key));
  const associationClasses = lesson.target.classes.filter((c) => isAssociationClassKey(lesson.target, c.key));

  const nodesByKey = new Map<string, DiagramNode>();

  baseClasses.forEach((tc, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    nodesByKey.set(tc.key, {
      id: `ref-${tc.key}`,
      type: 'class',
      name: tc.name.canonical,
      attributes: tc.attributes
        .filter((a) => a.requirement !== 'forbidden')
        .map((a, ai) => ({ id: `ref-${tc.key}-a${ai}`, name: a.name.canonical })),
      x: 40 + col * COL_WIDTH,
      y: 40 + row * ROW_HEIGHT,
    });
  });

  const edges: DiagramEdge[] = [];
  lesson.target.edges.forEach((te, idx) => {
    const fromNode = nodesByKey.get(te.fromKey);
    const toNode = nodesByKey.get(te.toKey);
    if (!fromNode || !toNode) return;
    edges.push({
      id: `ref-edge-${idx}`,
      from: fromNode.id,
      to: toNode.id,
      type: te.type,
      name: te.name?.canonical,
      multiplicity: te.multiplicity,
    });
  });

  associationClasses.forEach((ac, i) => {
    const te = lesson.target.edges.find((e) => e.associationClassKey === ac.key);
    if (!te) return;
    const fromNode = nodesByKey.get(te.fromKey);
    const toNode = nodesByKey.get(te.toKey);
    const edge = edges.find((e) => e.from === fromNode?.id && e.to === toNode?.id);
    const midX = fromNode && toNode ? (fromNode.x + toNode.x) / 2 : 40;
    const midY = fromNode && toNode ? Math.max(fromNode.y, toNode.y) + ROW_HEIGHT : 40 + i * ROW_HEIGHT;

    const node: DiagramNode = {
      id: `ref-${ac.key}`,
      type: 'associationClass',
      name: ac.name.canonical,
      attributes: ac.attributes
        .filter((a) => a.requirement !== 'forbidden')
        .map((a, ai) => ({ id: `ref-${ac.key}-a${ai}`, name: a.name.canonical })),
      x: midX,
      y: midY,
    };
    nodesByKey.set(ac.key, node);
    if (edge) edge.attachedClassId = node.id;
  });

  return { nodes: [...nodesByKey.values()], edges };
}
