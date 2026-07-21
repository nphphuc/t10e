import { match } from './normalize';
import type {
  BuilderLesson,
  DiagramEdge,
  DiagramNode,
  DiagramState,
  FeedbackItem,
  TargetClass,
  TargetEdge,
} from './types';

const blocking = (items: FeedbackItem[]) => items.filter((item) => item.severity === 'warn' || item.severity === 'error');

export function isAssociationClassKey(target: BuilderLesson['target'], key: string): boolean {
  return target.edges.some((edge) => edge.associationClassKey === key);
}

export function findTargetClassForNode(target: BuilderLesson['target'], node: DiagramNode): TargetClass | undefined {
  return target.classes.find((candidate) => match(node.name, candidate.name));
}

export function findEdgeForPair(
  diagram: DiagramState,
  fromNode: DiagramNode,
  toNode: DiagramNode,
  directed = false,
): DiagramEdge | undefined {
  return diagram.edges.find((edge) => directed
    ? edge.from === fromNode.id && edge.to === toNode.id
    : (edge.from === fromNode.id && edge.to === toNode.id)
      || (edge.from === toNode.id && edge.to === fromNode.id));
}

export function resolveEdgeEndpoints(diagram: DiagramState, lesson: BuilderLesson, targetEdge: TargetEdge) {
  const fromTarget = lesson.target.classes.find((candidate) => candidate.key === targetEdge.fromKey);
  const toTarget = lesson.target.classes.find((candidate) => candidate.key === targetEdge.toKey);
  if (!fromTarget || !toTarget) return null;
  return {
    fromTarget,
    toTarget,
    fromNode: diagram.nodes.find((node) => match(node.name, fromTarget.name)),
    toNode: diagram.nodes.find((node) => match(node.name, toTarget.name)),
  };
}

function targetForPair(lesson: BuilderLesson, from: TargetClass, to: TargetClass, directed: boolean) {
  return lesson.target.edges.find((edge) => directed
    ? edge.fromKey === from.key && edge.toKey === to.key
    : (edge.fromKey === from.key && edge.toKey === to.key)
      || (edge.fromKey === to.key && edge.toKey === from.key));
}

function trapForNode(lesson: BuilderLesson, node: DiagramNode) {
  return lesson.palette.find((item) =>
    (item.kind === 'verb-trap' || item.kind === 'attribute-trap')
      && match(node.name, { canonical: item.label, accepted: [] }));
}

export function findClasses(diagram: DiagramState, lesson: BuilderLesson): FeedbackItem[] {
  const result: FeedbackItem[] = [];
  const expected = lesson.target.classes.filter((candidate) =>
    candidate.requirement === 'required' && !isAssociationClassKey(lesson.target, candidate.key));

  for (const targetClass of expected) {
    if (!diagram.nodes.some((node) => node.type === 'class' && match(node.name, targetClass.name))) {
      result.push({ severity: 'warn', message: `Còn thiếu class '${targetClass.name.canonical}' trên canvas.` });
    }
  }

  for (const node of diagram.nodes.filter((candidate) => candidate.type === 'class')) {
    if (expected.some((candidate) => match(node.name, candidate.name))) continue;
    const trap = trapForNode(lesson, node);
    result.push(trap ? {
      severity: trap.kind === 'verb-trap' ? 'warn' : 'hint',
      message: trap.trapMessage ?? `'${trap.label}' chưa phải là một class trong brief.`,
      tag: trap.trapTag,
      subjectId: node.id,
    } : {
      severity: 'warn',
      message: `Class '${node.name}' không khớp brief; hãy kiểm tra lại danh từ miền nghiệp vụ.`,
      tag: 'class-is-object',
      subjectId: node.id,
    });
  }
  return result;
}

function requiredAttributeFeedback(node: DiagramNode, targetClass: TargetClass): FeedbackItem[] {
  const result: FeedbackItem[] = [];
  for (const attribute of targetClass.attributes) {
    const found = node.attributes.some((candidate) => match(candidate.name, attribute.name));
    if (attribute.requirement === 'required' && !found) {
      result.push({
        severity: 'warn',
        message: `Class '${targetClass.name.canonical}' còn thiếu attribute '${attribute.name.canonical}'.`,
        subjectId: node.id,
      });
    }
    if (attribute.requirement === 'forbidden' && found) {
      result.push({
        severity: 'warn',
        message: attribute.forbiddenReason
          ?? `Attribute '${attribute.name.canonical}' không thuộc class '${targetClass.name.canonical}'.`,
        tag: attribute.forbiddenTag,
        subjectId: node.id,
      });
    }
  }
  return result;
}

export function placeAttributes(diagram: DiagramState, lesson: BuilderLesson): FeedbackItem[] {
  const result: FeedbackItem[] = [];
  for (const node of diagram.nodes) {
    const owner = findTargetClassForNode(lesson.target, node);
    if (!owner) continue;
    result.push(...requiredAttributeFeedback(node, owner));
    for (const attribute of node.attributes) {
      if (owner.attributes.some((candidate) => match(attribute.name, candidate.name))) continue;
      const expectedOwner = lesson.target.classes.find((candidate) =>
        candidate.key !== owner.key
        && candidate.attributes.some((item) => item.requirement !== 'forbidden' && match(attribute.name, item.name)));
      result.push({
        severity: 'warn',
        message: expectedOwner
          ? `Attribute '${attribute.name}' đang ở '${owner.name.canonical}', nhưng thuộc '${expectedOwner.name.canonical}'.`
          : `Attribute '${attribute.name}' chưa có căn cứ trong brief của '${owner.name.canonical}'.`,
        tag: expectedOwner && isAssociationClassKey(lesson.target, expectedOwner.key)
          ? 'relationship-data'
          : 'attribute-owner',
        subjectId: node.id,
      });
    }
  }
  return result;
}

export function drawAssociations(diagram: DiagramState, lesson: BuilderLesson): FeedbackItem[] {
  const result: FeedbackItem[] = [];
  for (const targetEdge of lesson.target.edges.filter((edge) => edge.requirement === 'required')) {
    const resolved = resolveEdgeEndpoints(diagram, lesson, targetEdge);
    if (!resolved) continue;
    if (!resolved.fromNode || !resolved.toNode) {
      result.push({
        severity: 'warn',
        message: `Giữa '${resolved.fromTarget.name.canonical}' và '${resolved.toTarget.name.canonical}' còn thiếu một quan hệ.`,
      });
      continue;
    }
    const edge = findEdgeForPair(diagram, resolved.fromNode, resolved.toNode, targetEdge.type === 'generalization');
    if (!edge) {
      result.push({
        severity: 'warn',
        message: `Giữa '${resolved.fromTarget.name.canonical}' và '${resolved.toTarget.name.canonical}' còn thiếu một quan hệ.`,
      });
    } else if (targetEdge.name && !edge.name?.trim()) {
      result.push({
        severity: 'hint',
        message: `Quan hệ '${resolved.fromTarget.name.canonical}–${resolved.toTarget.name.canonical}' nên có tên động từ, ví dụ '${targetEdge.name.canonical}'.`,
        subjectId: edge.id,
      });
    }
  }

  for (const edge of diagram.edges) {
    const fromNode = diagram.nodes.find((node) => node.id === edge.from);
    const toNode = diagram.nodes.find((node) => node.id === edge.to);
    if (!fromNode || !toNode) continue;
    const fromTarget = findTargetClassForNode(lesson.target, fromNode);
    const toTarget = findTargetClassForNode(lesson.target, toNode);
    if (!fromTarget || !toTarget) continue;
    const targetEdge = targetForPair(lesson, fromTarget, toTarget, edge.type === 'generalization');
    if (!targetEdge || targetEdge.requirement === 'forbidden') {
      const reverseGeneralization = lesson.target.edges.find((candidate) =>
        candidate.type === 'generalization'
        && candidate.fromKey === toTarget.key
        && candidate.toKey === fromTarget.key);
      result.push({
        severity: 'warn',
        message: reverseGeneralization
          ? `Generalization '${fromTarget.name.canonical} → ${toTarget.name.canonical}' đang ngược chiều subclass → superclass.`
          : targetEdge?.reason ?? `Quan hệ '${fromTarget.name.canonical}–${toTarget.name.canonical}' không có trong brief.`,
        tag: reverseGeneralization?.wrongTypeTag ?? targetEdge?.wrongTypeTag ?? 'association-is-link',
        subjectId: edge.id,
      });
    }
  }
  return result;
}

export function chooseEdgeTypes(diagram: DiagramState, lesson: BuilderLesson): FeedbackItem[] {
  const result: FeedbackItem[] = [];
  for (const targetEdge of lesson.target.edges.filter((edge) => edge.requirement === 'required')) {
    const resolved = resolveEdgeEndpoints(diagram, lesson, targetEdge);
    if (!resolved?.fromNode || !resolved.toNode) continue;
    const edge = findEdgeForPair(diagram, resolved.fromNode, resolved.toNode, targetEdge.type === 'generalization');
    if (!edge || (targetEdge.acceptedTypes ?? [targetEdge.type]).includes(edge.type)) continue;
    let tag = targetEdge.wrongTypeTag;
    if (['aggregation', 'composition'].includes(targetEdge.type) && ['aggregation', 'composition'].includes(edge.type)) {
      tag ??= 'aggregation-equals-composition';
    } else if (targetEdge.type === 'generalization' || edge.type === 'generalization') {
      tag ??= 'inheritance-for-reuse-only';
    }
    result.push({
      severity: 'warn',
      message: targetEdge.reason
        ?? `Quan hệ '${resolved.fromTarget.name.canonical}–${resolved.toTarget.name.canonical}' cần loại '${targetEdge.type}', không phải '${edge.type}'.`,
      tag,
      subjectId: edge.id,
    });
  }
  return result;
}

export function setMultiplicity(diagram: DiagramState, lesson: BuilderLesson): FeedbackItem[] {
  const result: FeedbackItem[] = [];
  for (const targetEdge of lesson.target.edges.filter((edge) => edge.requirement === 'required' && edge.multiplicity)) {
    const resolved = resolveEdgeEndpoints(diagram, lesson, targetEdge);
    if (!resolved?.fromNode || !resolved.toNode || !targetEdge.multiplicity) continue;
    const edge = findEdgeForPair(diagram, resolved.fromNode, resolved.toNode, targetEdge.type === 'generalization');
    if (!edge) continue;
    const sameDirection = edge.from === resolved.fromNode.id;
    const actualFrom = edge.multiplicity && (sameDirection ? edge.multiplicity.from : edge.multiplicity.to);
    const actualTo = edge.multiplicity && (sameDirection ? edge.multiplicity.to : edge.multiplicity.from);
    if (actualFrom !== targetEdge.multiplicity.from) {
      result.push({
        severity: 'warn',
        message: `Quan hệ '${resolved.fromTarget.name.canonical}–${resolved.toTarget.name.canonical}': multiplicity phía '${resolved.fromTarget.name.canonical}' là '${actualFrom ?? 'chưa đặt'}', cần '${targetEdge.multiplicity.from}'.`,
        tag: targetEdge.wrongMultiplicityTag ?? 'multiplicity-fk',
        subjectId: edge.id,
      });
    }
    if (actualTo !== targetEdge.multiplicity.to) {
      result.push({
        severity: 'warn',
        message: `Quan hệ '${resolved.fromTarget.name.canonical}–${resolved.toTarget.name.canonical}': multiplicity phía '${resolved.toTarget.name.canonical}' là '${actualTo ?? 'chưa đặt'}', cần '${targetEdge.multiplicity.to}'.`,
        tag: targetEdge.wrongMultiplicityTag ?? 'multiplicity-fk',
        subjectId: edge.id,
      });
    }
  }
  return result;
}

export function associationClassStep(diagram: DiagramState, lesson: BuilderLesson): FeedbackItem[] {
  const result: FeedbackItem[] = [];
  for (const targetEdge of lesson.target.edges.filter((edge) => edge.associationClassKey)) {
    const associationTarget = lesson.target.classes.find((candidate) => candidate.key === targetEdge.associationClassKey);
    const resolved = resolveEdgeEndpoints(diagram, lesson, targetEdge);
    if (!associationTarget || !resolved) continue;

    for (const endpoint of [resolved.fromNode, resolved.toNode].filter(Boolean) as DiagramNode[]) {
      for (const attribute of associationTarget.attributes.filter((candidate) => candidate.requirement === 'required')) {
        if (endpoint.attributes.some((candidate) => match(candidate.name, attribute.name))) {
          result.push({
            severity: 'warn',
            message: `Attribute '${attribute.name.canonical}' mô tả quan hệ, nên thuộc association class '${associationTarget.name.canonical}', không thuộc '${endpoint.name}'.`,
            tag: 'relationship-data',
            subjectId: endpoint.id,
          });
        }
      }
    }

    const associationNode = diagram.nodes.find((node) =>
      node.type === 'associationClass' && match(node.name, associationTarget.name));
    if (!associationNode) {
      result.push({
        severity: 'warn',
        message: `Còn thiếu association class '${associationTarget.name.canonical}' gắn vào quan hệ '${resolved.fromTarget.name.canonical}–${resolved.toTarget.name.canonical}'.`,
      });
      continue;
    }
    if (resolved.fromNode && resolved.toNode) {
      const edge = findEdgeForPair(diagram, resolved.fromNode, resolved.toNode);
      if (!edge || edge.attachedClassId !== associationNode.id) {
        result.push({
          severity: 'warn',
          message: `'${associationTarget.name.canonical}' cần gắn vào đúng quan hệ '${resolved.fromTarget.name.canonical}–${resolved.toTarget.name.canonical}'.`,
          tag: 'relationship-data',
          subjectId: associationNode.id,
        });
      }
    }
    result.push(...requiredAttributeFeedback(associationNode, associationTarget));
  }
  return result;
}

function dedupe(items: FeedbackItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = [item.severity, item.tag ?? '', item.subjectId ?? '', item.message].join('\u0000');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Stable diff order: class → attribute → edge → type → multiplicity → association class. */
export function diffDiagram(diagram: DiagramState, lesson: BuilderLesson): FeedbackItem[] {
  return dedupe([
    ...findClasses(diagram, lesson),
    ...placeAttributes(diagram, lesson),
    ...drawAssociations(diagram, lesson),
    ...chooseEdgeTypes(diagram, lesson),
    ...setMultiplicity(diagram, lesson),
    ...associationClassStep(diagram, lesson),
  ]);
}

export function canAdvance(items: FeedbackItem[]): boolean {
  return blocking(items).length === 0;
}

export const STEP_VALIDATORS: Partial<Record<string, (diagram: DiagramState, lesson: BuilderLesson) => FeedbackItem[]>> = {
  'find-classes': findClasses,
  'place-attributes': placeAttributes,
  'draw-associations': drawAssociations,
  'set-multiplicity': setMultiplicity,
  'choose-edge-types': chooseEdgeTypes,
  'association-class': associationClassStep,
  compare: diffDiagram,
  review: diffDiagram,
};
