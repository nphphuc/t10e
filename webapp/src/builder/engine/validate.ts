import type {
  BuilderLesson,
  DiagramEdge,
  DiagramNode,
  DiagramState,
  EdgeType,
  FeedbackItem,
  Multiplicity,
  TargetClass,
  TargetEdge,
} from './types';
import { match } from './normalize';

export function isAssociationClassKey(target: BuilderLesson['target'], key: string): boolean {
  return target.edges.some((e) => e.associationClassKey === key);
}

export function findTargetClassForNode(target: BuilderLesson['target'], node: DiagramNode): TargetClass | undefined {
  return target.classes.find((tc) => match(node.name, tc.name));
}

export function findEdgeForPair(diagram: DiagramState, fromNode: DiagramNode, toNode: DiagramNode, directed: boolean): DiagramEdge | undefined {
  return diagram.edges.find((e) => {
    if (directed) return e.from === fromNode.id && e.to === toNode.id;
    return (e.from === fromNode.id && e.to === toNode.id) || (e.from === toNode.id && e.to === fromNode.id);
  });
}

function attributeFeedback(node: DiagramNode, targetClass: TargetClass, subjectId: string): FeedbackItem[] {
  const items: FeedbackItem[] = [];
  for (const attr of targetClass.attributes) {
    const found = node.attributes.find((a) => match(a.name, attr.name));
    if (attr.requirement === 'required' && !found) {
      items.push({
        severity: 'warn',
        message: `Class '${targetClass.name.canonical}' còn thiếu attribute '${attr.name.canonical}'.`,
        subjectId,
      });
    }
    if (attr.requirement === 'forbidden' && found) {
      items.push({
        severity: 'warn',
        message: attr.forbiddenReason || `Attribute '${attr.name.canonical}' không thuộc về class '${targetClass.name.canonical}'.`,
        tag: attr.forbiddenTag,
        subjectId,
      });
    }
  }
  return items;
}

export function findClasses(d: DiagramState, t: BuilderLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [];
  const requiredClasses = t.target.classes.filter(
    (c) => c.requirement === 'required' && !isAssociationClassKey(t.target, c.key)
  );

  for (const tc of requiredClasses) {
    const node = d.nodes.find((n) => n.type === 'class' && match(n.name, tc.name));
    if (!node) {
      items.push({ severity: 'warn', message: `Còn thiếu class '${tc.name.canonical}' trên canvas.` });
    }
  }

  for (const node of d.nodes) {
    if (node.type !== 'class') continue;
    const matchesTarget = requiredClasses.some((tc) => match(node.name, tc.name));
    if (matchesTarget) continue;

    const trap = t.palette.find(
      (p) => (p.kind === 'verb-trap' || p.kind === 'attribute-trap') && match(node.name, { canonical: p.label, accepted: [] })
    );
    if (trap) {
      items.push({
        severity: trap.kind === 'verb-trap' ? 'warn' : 'hint',
        message: trap.trapMessage || `'${trap.label}' không phải là một class.`,
        tag: trap.trapTag,
        subjectId: node.id,
      });
    } else {
      items.push({
        severity: 'warn',
        message: `'${node.name}' không khớp với class nào trong bài — kiểm tra lại chính tả hoặc bỏ khỏi canvas.`,
        subjectId: node.id,
      });
    }
  }

  return items;
}

export function placeAttributes(d: DiagramState, t: BuilderLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [];
  for (const tc of t.target.classes) {
    const expectedType = isAssociationClassKey(t.target, tc.key) ? 'associationClass' : 'class';
    const node = d.nodes.find((n) => n.type === expectedType && match(n.name, tc.name));
    if (!node) {
      // The class itself is missing (e.g. deleted after an earlier step already let it
      // through) — nothing to flag if it has no required attributes anyway, otherwise
      // this step must block instead of silently having nothing to iterate over.
      if (tc.attributes.some((a) => a.requirement === 'required')) {
        items.push({
          severity: 'warn',
          message: `Class '${tc.name.canonical}' chưa có trên canvas nên chưa thể đặt attribute.`,
        });
      }
      continue;
    }
    items.push(...attributeFeedback(node, tc, node.id));
  }
  return items;
}

export function resolveEdgeEndpoints(d: DiagramState, t: BuilderLesson, te: TargetEdge) {
  const fromTc = t.target.classes.find((c) => c.key === te.fromKey);
  const toTc = t.target.classes.find((c) => c.key === te.toKey);
  if (!fromTc || !toTc) return null;
  const fromNode = d.nodes.find((n) => match(n.name, fromTc.name));
  const toNode = d.nodes.find((n) => match(n.name, toTc.name));
  return { fromTc, toTc, fromNode, toNode };
}

export function drawAssociations(d: DiagramState, t: BuilderLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [];
  const requiredEdges = t.target.edges.filter((e) => e.requirement === 'required');

  for (const te of requiredEdges) {
    const resolved = resolveEdgeEndpoints(d, t, te);
    if (!resolved) continue;
    const { fromTc, toTc, fromNode, toNode } = resolved;
    // Endpoint class(es) missing entirely (e.g. deleted while parked on this step) is
    // still "a relationship is missing" from this step's point of view — must block,
    // not silently skip just because we can't resolve node ids yet.
    if (!fromNode || !toNode) {
      items.push({
        severity: 'warn',
        message: `Giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}' còn thiếu một quan hệ.`,
      });
      continue;
    }
    const directed = te.type === 'generalization';
    const edge = findEdgeForPair(d, fromNode, toNode, directed);
    if (!edge) {
      items.push({
        severity: 'warn',
        message: `Giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}' còn thiếu một quan hệ.`,
      });
      continue;
    }
    if (te.name && !edge.name?.trim()) {
      items.push({
        severity: 'hint',
        message: `Quan hệ giữa '${resolved.fromTc.name.canonical}' và '${resolved.toTc.name.canonical}' nên có tên (vd '${te.name.canonical}').`,
        subjectId: edge.id,
      });
    }
  }

  // extra/forbidden edges: edges in diagram whose class-pair is not a required/optional target edge
  for (const edge of d.edges) {
    const fromNode = d.nodes.find((n) => n.id === edge.from);
    const toNode = d.nodes.find((n) => n.id === edge.to);
    if (!fromNode || !toNode) continue;
    const fromTc = findTargetClassForNode(t.target, fromNode);
    const toTc = findTargetClassForNode(t.target, toNode);
    if (!fromTc || !toTc) continue;

    const matchingTarget = t.target.edges.find(
      (te) =>
        (te.fromKey === fromTc.key && te.toKey === toTc.key) ||
        (te.type !== 'generalization' && te.fromKey === toTc.key && te.toKey === fromTc.key)
    );

    if (matchingTarget?.requirement === 'forbidden') {
      items.push({
        severity: 'warn',
        message: matchingTarget.reason || `Quan hệ giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}' không nên có.`,
        tag: matchingTarget.wrongTypeTag,
        subjectId: edge.id,
      });
    } else if (!matchingTarget) {
      items.push({
        severity: 'warn',
        message: `Quan hệ giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}' không có trong đề bài — kiểm tra lại.`,
        subjectId: edge.id,
      });
    }
  }

  return items;
}

function multiplicityLabel(m: Multiplicity): string {
  return m;
}

export function setMultiplicity(d: DiagramState, t: BuilderLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [];
  const requiredEdges = t.target.edges.filter((e) => e.requirement === 'required' && e.multiplicity);

  for (const te of requiredEdges) {
    const resolved = resolveEdgeEndpoints(d, t, te);
    if (!resolved || !te.multiplicity) continue;
    const { fromTc, toTc, fromNode, toNode } = resolved;

    if (!fromNode || !toNode) {
      items.push({
        severity: 'warn',
        message: `Chưa thể kiểm tra multiplicity giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}' vì còn thiếu class.`,
        tag: te.wrongMultiplicityTag || 'multiplicity-fk',
      });
      continue;
    }
    const edge = findEdgeForPair(d, fromNode, toNode, te.type === 'generalization');
    if (!edge) {
      items.push({
        severity: 'warn',
        message: `Giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}' chưa có quan hệ để đặt multiplicity.`,
        tag: te.wrongMultiplicityTag || 'multiplicity-fk',
      });
      continue;
    }

    if (!edge.multiplicity) {
      items.push({
        severity: 'warn',
        message: `Quan hệ giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}' chưa chọn multiplicity.`,
        tag: te.wrongMultiplicityTag || 'multiplicity-fk',
        subjectId: edge.id,
      });
      continue;
    }

    const sameDirection = edge.from === fromNode.id;
    const actualFrom = sameDirection ? edge.multiplicity.from : edge.multiplicity.to;
    const actualTo = sameDirection ? edge.multiplicity.to : edge.multiplicity.from;

    if (actualFrom !== te.multiplicity.from) {
      items.push({
        severity: 'warn',
        message: `Multiplicity phía '${resolved.fromTc.name.canonical}' đang là '${multiplicityLabel(actualFrom)}', cần là '${multiplicityLabel(te.multiplicity.from)}'.`,
        tag: te.wrongMultiplicityTag || 'multiplicity-fk',
        subjectId: edge.id,
      });
    }
    if (actualTo !== te.multiplicity.to) {
      items.push({
        severity: 'warn',
        message: `Multiplicity phía '${resolved.toTc.name.canonical}' đang là '${multiplicityLabel(actualTo)}', cần là '${multiplicityLabel(te.multiplicity.to)}'.`,
        tag: te.wrongMultiplicityTag || 'multiplicity-fk',
        subjectId: edge.id,
      });
    }
  }

  return items;
}

export function chooseEdgeTypes(d: DiagramState, t: BuilderLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [];
  const requiredEdges = t.target.edges.filter((e) => e.requirement === 'required');

  for (const te of requiredEdges) {
    const resolved = resolveEdgeEndpoints(d, t, te);
    if (!resolved) continue;
    const { fromTc, toTc, fromNode, toNode } = resolved;

    if (!fromNode || !toNode) {
      items.push({
        severity: 'warn',
        message: `Chưa thể kiểm tra loại quan hệ giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}' vì còn thiếu class.`,
        tag: te.wrongTypeTag,
      });
      continue;
    }
    const edge = findEdgeForPair(d, fromNode, toNode, te.type === 'generalization');
    if (!edge) {
      items.push({
        severity: 'warn',
        message: `Giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}' chưa có quan hệ để xác định loại.`,
        tag: te.wrongTypeTag,
      });
      continue;
    }

    const accepted = te.acceptedTypes ?? [te.type];
    if (!accepted.includes(edge.type)) {
      const tag = pickWrongTypeTag(te, edge.type);
      items.push({
        severity: 'warn',
        message:
          te.reason ||
          `Quan hệ giữa '${resolved.fromTc.name.canonical}' và '${resolved.toTc.name.canonical}' nên là '${te.type}', không phải '${edge.type}'.`,
        tag,
        subjectId: edge.id,
      });
    }
  }

  return items;
}

function pickWrongTypeTag(te: TargetEdge, actualType: EdgeType): string | undefined {
  const wholePartTypes: EdgeType[] = ['aggregation', 'composition'];
  if (wholePartTypes.includes(te.type) && wholePartTypes.includes(actualType)) {
    return te.wrongTypeTag || 'aggregation-equals-composition';
  }
  if (te.type === 'generalization' || actualType === 'generalization') {
    return te.wrongTypeTag || 'inheritance-for-reuse-only';
  }
  return te.wrongTypeTag;
}

export function associationClassStep(d: DiagramState, t: BuilderLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [];
  const edgesWithAssocClass = t.target.edges.filter((e) => e.associationClassKey);

  for (const te of edgesWithAssocClass) {
    const acKey = te.associationClassKey!;
    const acTarget = t.target.classes.find((c) => c.key === acKey);
    if (!acTarget) continue;

    const resolved = resolveEdgeEndpoints(d, t, te);
    if (!resolved) continue;
    const { fromTc, toTc, fromNode, toNode } = resolved;
    const acNode = d.nodes.find((n) => n.type === 'associationClass' && match(n.name, acTarget.name));

    // Attribute misplacement: required attrs of the association class found on the endpoint classes instead
    if (fromNode && toNode) {
      for (const attr of acTarget.attributes) {
        if (attr.requirement !== 'required' && attr.requirement !== 'optional') continue;
        const onFrom = fromNode.attributes.find((a) => match(a.name, attr.name));
        const onTo = toNode.attributes.find((a) => match(a.name, attr.name));
        if (onFrom) {
          items.push({
            severity: 'warn',
            message: `Attribute '${attr.name.canonical}' thuộc về quan hệ (association class '${acTarget.name.canonical}'), không phải '${fromTc.name.canonical}'.`,
            tag: 'relationship-data',
            subjectId: fromNode.id,
          });
        }
        if (onTo) {
          items.push({
            severity: 'warn',
            message: `Attribute '${attr.name.canonical}' thuộc về quan hệ (association class '${acTarget.name.canonical}'), không phải '${toTc.name.canonical}'.`,
            tag: 'relationship-data',
            subjectId: toNode.id,
          });
        }
      }
    }

    if (!acNode) {
      items.push({
        severity: 'warn',
        message: `Còn thiếu association class '${acTarget.name.canonical}' gắn vào quan hệ giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}'.`,
      });
      continue;
    }

    if (!fromNode || !toNode) {
      // acNode exists but the classes it's supposed to attach between are gone —
      // can't possibly be attached to the right edge right now.
      items.push({
        severity: 'warn',
        message: `Chưa thể kiểm tra việc gắn '${acTarget.name.canonical}' vì còn thiếu class '${fromTc.name.canonical}' hoặc '${toTc.name.canonical}'.`,
        subjectId: acNode.id,
      });
    } else {
      const edge = findEdgeForPair(d, fromNode, toNode, false);
      if (!edge || edge.attachedClassId !== acNode.id) {
        items.push({
          severity: 'warn',
          message: `'${acTarget.name.canonical}' cần được gắn vào đúng quan hệ giữa '${fromTc.name.canonical}' và '${toTc.name.canonical}'.`,
          subjectId: acNode.id,
        });
      }
    }

    items.push(...attributeFeedback(acNode, acTarget, acNode.id));
  }

  return items;
}

export function diffDiagram(d: DiagramState, t: BuilderLesson): FeedbackItem[] {
  return [
    ...findClasses(d, t),
    ...placeAttributes(d, t),
    ...drawAssociations(d, t),
    ...setMultiplicity(d, t),
    ...chooseEdgeTypes(d, t),
    ...associationClassStep(d, t),
  ];
}

export const STEP_VALIDATORS: Partial<Record<string, (d: DiagramState, t: BuilderLesson) => FeedbackItem[]>> = {
  'find-classes': findClasses,
  'place-attributes': placeAttributes,
  'draw-associations': drawAssociations,
  'set-multiplicity': setMultiplicity,
  'choose-edge-types': chooseEdgeTypes,
  'association-class': associationClassStep,
  compare: diffDiagram,
  review: diffDiagram,
};
