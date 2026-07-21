import type { BuilderLesson, DiagramEdge, DiagramNode, DiagramState } from './types';
import { isAssociationClassKey } from './validate';

export function buildReferenceDiagram(lesson: BuilderLesson): DiagramState {
  const byKey = new Map<string, DiagramNode>();
  const ordinary = lesson.target.classes.filter((candidate) => !isAssociationClassKey(lesson.target, candidate.key));
  ordinary.forEach((targetClass, index) => byKey.set(targetClass.key, {
    id: `reference-${targetClass.key}`,
    type: 'class',
    name: targetClass.name.canonical,
    attributes: targetClass.attributes
      .filter((attribute) => attribute.requirement === 'required')
      .map((attribute, attributeIndex) => ({ id: `reference-${targetClass.key}-${attributeIndex}`, name: attribute.name.canonical })),
    x: 50 + (index % 3) * 230,
    y: 50 + Math.floor(index / 3) * 190,
  }));

  const edges: DiagramEdge[] = lesson.target.edges
    .filter((edge) => edge.requirement === 'required')
    .flatMap((targetEdge, index) => {
      const from = byKey.get(targetEdge.fromKey);
      const to = byKey.get(targetEdge.toKey);
      return from && to ? [{
        id: `reference-edge-${index}`,
        from: from.id,
        to: to.id,
        type: targetEdge.type,
        name: targetEdge.name?.canonical,
        multiplicity: targetEdge.multiplicity,
      }] : [];
    });

  lesson.target.classes.filter((candidate) => isAssociationClassKey(lesson.target, candidate.key)).forEach((targetClass, index) => {
    const targetEdge = lesson.target.edges.find((edge) => edge.associationClassKey === targetClass.key);
    if (!targetEdge) return;
    const from = byKey.get(targetEdge.fromKey);
    const to = byKey.get(targetEdge.toKey);
    const node: DiagramNode = {
      id: `reference-${targetClass.key}`,
      type: 'associationClass',
      name: targetClass.name.canonical,
      attributes: targetClass.attributes
        .filter((attribute) => attribute.requirement === 'required')
        .map((attribute, attributeIndex) => ({ id: `reference-${targetClass.key}-${attributeIndex}`, name: attribute.name.canonical })),
      x: from && to ? (from.x + to.x) / 2 : 280,
      y: from && to ? Math.max(from.y, to.y) + 190 : 300 + index * 170,
    };
    byKey.set(targetClass.key, node);
    const edge = edges.find((candidate) => candidate.from === from?.id && candidate.to === to?.id);
    if (edge) edge.attachedClassId = node.id;
  });
  return { nodes: [...byKey.values()], edges };
}
