import { match } from './normalize';
import type {
  ActivityDiagramState,
  ActivityLesson,
  ActivityNode,
  ActivityTargetSpec,
  FeedbackItem,
  StepValidator,
  TargetAction,
} from './types';

export function buildAdjacency(d: ActivityDiagramState): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const e of d.edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from)!.push(e.to);
  }
  return adj;
}

export function reachableSet(d: ActivityDiagramState, startId: string): Set<string> {
  const adj = buildAdjacency(d);
  const seen = new Set<string>([startId]);
  const queue = [startId];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const next of adj.get(cur) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen;
}

export function canReach(d: ActivityDiagramState, fromId: string, toId: string): boolean {
  if (fromId === toId) return true;
  return reachableSet(d, fromId).has(toId);
}

export function findActionByKey(target: ActivityTargetSpec, key: string): TargetAction | undefined {
  return target.actions.find((a) => a.key === key);
}

export function findActionNode(d: ActivityDiagramState, ta: TargetAction | undefined): ActivityNode | undefined {
  if (!ta) return undefined;
  return d.nodes.find((n) => n.type === 'action' && n.name && match(n.name, ta.name));
}

// Walks a sequence of actionKeys starting from `startNodeId`, requiring each step to be
// reachable (graph-wise, not by coordinates) from the previous one. Stops at the first
// broken link so callers get one precise, actionable message instead of a wall of noise.
export function verifySequencePath(
  d: ActivityDiagramState,
  target: ActivityTargetSpec,
  startNodeId: string,
  keys: string[]
): { ok: boolean; items: FeedbackItem[]; lastNodeId?: string } {
  const items: FeedbackItem[] = [];
  let cur = startNodeId;
  for (const key of keys) {
    const ta = findActionByKey(target, key);
    const node = findActionNode(d, ta);
    if (!node) {
      items.push({ severity: 'warn', message: `Hành động '${ta?.name.canonical ?? key}' chưa có trên canvas.` });
      return { ok: false, items };
    }
    if (!canReach(d, cur, node.id)) {
      items.push({
        severity: 'warn',
        message: `Chưa nối đúng thứ tự tới '${ta!.name.canonical}'.`,
        subjectId: node.id,
      });
      return { ok: false, items };
    }
    cur = node.id;
  }
  return { ok: true, items, lastNodeId: cur };
}

// Two nodes sharing the same name/role silently confuse every validator that resolves
// them via findActionNode()/find() on edges — those always resolve to whichever match
// comes first, so the OTHER copy (however correctly it's wired up) is invisible to
// grading. Runs from EVERY step's validator (not just place-actions) so a duplicate
// created while parked on a later step — the canvas stays live/editable regardless of
// which step is displayed — gets flagged immediately instead of staying silent until
// the learner happens to step back to place-actions or reaches the orphan-node check.
function duplicateNodeWarnings(d: ActivityDiagramState, t: ActivityLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [];
  for (const ta of t.target.actions) {
    const matches = d.nodes.filter((n) => n.type === 'action' && n.name && match(n.name, ta.name));
    if (matches.length > 1) {
      items.push({
        severity: 'warn',
        message: `Có ${matches.length} node cùng tên '${ta.name.canonical}' trên canvas — hệ thống chỉ nhận diện 1, hãy xóa bớt node thừa.`,
        tag: 'duplicate-action-name',
      });
    }
  }
  for (const branch of t.target.branches) {
    const afterNode = findActionNode(d, findActionByKey(t.target, branch.decisionAfter));
    if (!afterNode) continue;
    const decisionEdges = d.edges.filter(
      (e) => e.from === afterNode.id && d.nodes.find((n) => n.id === e.to)?.type === 'decision'
    );
    if (decisionEdges.length > 1) {
      items.push({
        severity: 'warn',
        message: `Có ${decisionEdges.length} node decision cùng nối sau '${afterNode.name}' — hệ thống chỉ nhận diện 1, hãy xóa bớt node thừa.`,
        tag: 'duplicate-decision',
      });
    }
  }
  const c = t.target.concurrent;
  if (c) {
    const afterNode = findActionNode(d, findActionByKey(t.target, c.forkAfter));
    if (afterNode) {
      const forkEdges = d.edges.filter(
        (e) => e.from === afterNode.id && d.nodes.find((n) => n.id === e.to)?.type === 'fork'
      );
      if (forkEdges.length > 1) {
        items.push({
          severity: 'warn',
          message: `Có ${forkEdges.length} node fork cùng nối sau '${afterNode.name}' — hệ thống chỉ nhận diện 1, hãy xóa bớt node thừa.`,
          tag: 'duplicate-fork',
        });
      }
    }
  }
  // initial is checked by COUNT (not name/edge matching), so unlike the cases above it
  // was never at risk of one copy silently hiding another — but the "must be exactly 1"
  // check previously only lived inside forkJoinAndReachability, i.e. only surfaced at the
  // fork-join/compare steps. A second initial dropped by accident while still on an
  // earlier step (the structural palette is available from step 1 onward) went
  // unflagged until much later. Surface the "too many" half of that check everywhere;
  // forkJoinAndReachability still separately owns the "must have at least 1" half, since
  // that's expected/normal to be unmet on every step before the diagram is finished.
  const initials = d.nodes.filter((n) => n.type === 'initial');
  if (initials.length > 1) {
    items.push({
      severity: 'warn',
      message: `Có ${initials.length} node bắt đầu (initial) trên canvas — chỉ được có đúng 1, hãy xóa bớt node thừa.`,
      tag: 'duplicate-initial',
    });
  }
  // UML in general allows more than one activity-final node (a flow can legitimately
  // terminate at more than one point) — but none of THIS engine's target specs model
  // multiple intended endings: mainSequence/branches/concurrent always reconverge into
  // one continuous trunk ending at a single final. TargetSpec has no field to say
  // "this lesson expects N endings", so for every lesson this validates today, a second
  // final is a stray node from clicking/dragging the wrong thing, not a valid design.
  const finals = d.nodes.filter((n) => n.type === 'final');
  if (finals.length > 1) {
    items.push({
      severity: 'warn',
      message: `Có ${finals.length} node kết thúc (final) trên canvas — bài này chỉ có 1 luồng kết thúc, hãy xóa bớt node thừa.`,
      tag: 'duplicate-final',
    });
  }
  return items;
}

export function placeActions(d: ActivityDiagramState, t: ActivityLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [...duplicateNodeWarnings(d, t)];
  for (const ta of t.target.actions) {
    const matches = d.nodes.filter((n) => n.type === 'action' && n.name && match(n.name, ta.name));
    if (ta.requirement === 'required' && matches.length === 0) {
      items.push({ severity: 'warn', message: `Hành động '${ta.name.canonical}' chưa có trên canvas.` });
    }
    if (ta.requirement === 'forbidden' && matches.length > 0) {
      items.push({
        severity: 'warn',
        message: `'${ta.name.canonical}' không phải là hành động cần có ở đây.`,
        tag: ta.forbiddenTag,
        subjectId: matches[0].id,
      });
    }
  }
  return items;
}

export function checkMainSequence(d: ActivityDiagramState, t: ActivityLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [...duplicateNodeWarnings(d, t)];
  const seq = t.target.mainSequence;
  const initial = d.nodes.find((n) => n.type === 'initial');
  if (!initial) {
    items.push({ severity: 'warn', message: 'Canvas chưa có node bắt đầu (initial).' });
  }

  const actionNodes = seq.map((key) => findActionNode(d, findActionByKey(t.target, key)));
  seq.forEach((key, i) => {
    if (!actionNodes[i]) {
      const ta = findActionByKey(t.target, key);
      items.push({
        severity: 'warn',
        message: `Hành động '${ta?.name.canonical ?? key}' chưa có trên canvas nên chưa thể kiểm tra thứ tự.`,
      });
    }
  });

  if (initial && actionNodes[0]) {
    if (!canReach(d, initial.id, actionNodes[0]!.id)) {
      const ta = findActionByKey(t.target, seq[0]);
      items.push({
        severity: 'warn',
        message: `Chưa có đường đi từ điểm bắt đầu tới '${ta?.name.canonical}'.`,
        subjectId: actionNodes[0]!.id,
      });
    }
  }

  for (let i = 0; i < actionNodes.length - 1; i++) {
    const a = actionNodes[i];
    const b = actionNodes[i + 1];
    if (a && b && !canReach(d, a.id, b.id)) {
      const taA = findActionByKey(t.target, seq[i]);
      const taB = findActionByKey(t.target, seq[i + 1]);
      items.push({
        severity: 'warn',
        message: `Chưa nối đúng thứ tự: '${taA?.name.canonical}' phải dẫn tới '${taB?.name.canonical}'.`,
        subjectId: b.id,
      });
    }
  }

  return items;
}

export function decisionsGuards(d: ActivityDiagramState, t: ActivityLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [...duplicateNodeWarnings(d, t)];
  // Multiple guards on the same branch commonly share one rejoinAt (e.g. both the
  // "> 1.000.000" and "≤ 1.000.000" branches here rejoin at the same next action) — the
  // redundant-direct-edge check below would otherwise fire once per guard that shares
  // it, repeating an identical warning.
  const reportedRedundantEdges = new Set<string>();
  for (const branch of t.target.branches) {
    const afterTa = findActionByKey(t.target, branch.decisionAfter);
    const afterNode = findActionNode(d, afterTa);
    if (!afterNode) {
      items.push({
        severity: 'warn',
        message: `Hành động '${afterTa?.name.canonical ?? branch.decisionAfter}' chưa có trên canvas nên chưa thể kiểm tra decision.`,
      });
      continue;
    }

    const decisionEdges = d.edges.filter(
      (e) => e.from === afterNode.id && d.nodes.find((n) => n.id === e.to)?.type === 'decision'
    );
    const decisionNode = decisionEdges[0] && d.nodes.find((n) => n.id === decisionEdges[0].to);
    if (!decisionNode) {
      items.push({ severity: 'warn', message: `Chưa có decision ngay sau '${afterTa!.name.canonical}'.` });
      continue;
    }

    const outgoing = d.edges.filter((e) => e.from === decisionNode.id);
    if (outgoing.length < 2) {
      items.push({
        severity: 'warn',
        message: `Decision sau '${afterTa!.name.canonical}' cần ít nhất 2 nhánh.`,
        subjectId: decisionNode.id,
      });
    }

    for (const e of outgoing) {
      if (!e.guard || e.guard.trim() === '') {
        items.push({
          severity: 'warn',
          message: 'Nhánh ra khỏi decision thiếu điều kiện (guard).',
          subjectId: e.id,
          tag: 'missing-guard',
        });
      }
    }

    for (const gb of branch.guards) {
      const matchedEdge = outgoing.find((e) => e.guard && match(e.guard, gb.guard));
      if (!matchedEdge) {
        items.push({
          severity: 'warn',
          message: `Thiếu nhánh có guard '${gb.guard.canonical}'.`,
          subjectId: decisionNode.id,
        });
        continue;
      }

      const result = verifySequencePath(d, t.target, matchedEdge.to, gb.sequence);
      items.push(...result.items);

      if (result.ok && gb.rejoinAt && result.lastNodeId) {
        const rejoinTa = findActionByKey(t.target, gb.rejoinAt);
        const rejoinNode = findActionNode(d, rejoinTa);
        if (!rejoinNode) {
          items.push({ severity: 'warn', message: `Hành động '${rejoinTa?.name.canonical ?? gb.rejoinAt}' chưa có trên canvas.` });
        } else {
          const mergeOk = d.nodes.some(
            (n) => n.type === 'merge' && canReach(d, result.lastNodeId!, n.id) && canReach(d, n.id, rejoinNode.id)
          );
          if (!mergeOk) {
            items.push({
              severity: 'warn',
              message: `Nhánh guard '${gb.guard.canonical}' chưa nối lại (qua merge) tới '${rejoinTa!.name.canonical}'.`,
              tag: 'missing-rejoin',
            });
          } else {
            // Once the decision->guard->merge structure genuinely reconnects to
            // rejoinAt, a LEFTOVER plain edge straight from afterNode to that same
            // action is a second unconditional path out of a non-fork action node —
            // that's not just redundant, it's structurally wrong UML (it implies
            // unintended concurrency instead of a conditional branch). This is
            // exactly the "Đặt hàng" -> "Xác nhận đơn hàng" edge a learner draws at
            // the main-sequence step, before the decision exists yet — once the
            // decision is built, that earlier edge needs to go.
            const redundantEdge = d.edges.find((e) => e.from === afterNode.id && e.to === rejoinNode.id);
            if (redundantEdge && !reportedRedundantEdges.has(redundantEdge.id)) {
              reportedRedundantEdges.add(redundantEdge.id);
              items.push({
                severity: 'warn',
                message: `Luồng nối thẳng từ '${afterTa!.name.canonical}' tới '${rejoinTa!.name.canonical}' không cần thiết nữa — mọi đường đi nên qua decision, hãy xóa luồng nối thẳng đó.`,
                subjectId: redundantEdge.id,
                tag: 'redundant-direct-edge',
              });
            }
          }
        }
      }
    }
  }
  return items;
}

export function forkJoinAndReachability(d: ActivityDiagramState, t: ActivityLesson): FeedbackItem[] {
  const items: FeedbackItem[] = [...duplicateNodeWarnings(d, t)];
  const initials = d.nodes.filter((n) => n.type === 'initial');
  const finals = d.nodes.filter((n) => n.type === 'final');

  if (initials.length !== 1) {
    items.push({ severity: 'warn', message: `Cần đúng 1 node bắt đầu (initial), hiện có ${initials.length}.` });
  }
  if (finals.length < 1) {
    items.push({ severity: 'warn', message: 'Cần ít nhất 1 node kết thúc (final).' });
  }

  if (initials.length === 1) {
    const reach = reachableSet(d, initials[0].id);
    for (const n of d.nodes) {
      if (n.id !== initials[0].id && !reach.has(n.id)) {
        items.push({
          severity: 'warn',
          message: `Node '${n.name ?? n.type}' không thể tới được từ điểm bắt đầu (mồ côi).`,
          subjectId: n.id,
          tag: 'orphan-node',
        });
      }
    }
    if (finals.length > 0) {
      for (const n of d.nodes) {
        if (n.type === 'final') continue;
        const canReachAnyFinal = finals.some((f) => canReach(d, n.id, f.id));
        if (!canReachAnyFinal) {
          items.push({
            severity: 'warn',
            message: `Node '${n.name ?? n.type}' không có đường tới kết thúc (dead-end).`,
            subjectId: n.id,
            tag: 'dead-end-node',
          });
        }
      }
    }
  }

  const c = t.target.concurrent;
  if (c) {
    const afterTa = findActionByKey(t.target, c.forkAfter);
    const afterNode = findActionNode(d, afterTa);
    if (!afterNode) {
      items.push({
        severity: 'warn',
        message: `Hành động '${afterTa?.name.canonical ?? c.forkAfter}' chưa có trên canvas nên chưa thể kiểm tra fork/join.`,
      });
    } else {
      const forkEdges = d.edges.filter(
        (e) => e.from === afterNode.id && d.nodes.find((n) => n.id === e.to)?.type === 'fork'
      );
      const forkNode = forkEdges[0] && d.nodes.find((n) => n.id === forkEdges[0].to);
      if (!forkNode) {
        items.push({ severity: 'warn', message: `Chưa có fork ngay sau '${afterTa!.name.canonical}'.` });
      } else {
        const forkOutgoing = d.edges.filter((e) => e.from === forkNode.id);
        if (forkOutgoing.length < c.lanes.length) {
          items.push({
            severity: 'warn',
            message: `Fork cần tách thành ${c.lanes.length} nhánh song song.`,
            subjectId: forkNode.id,
          });
        }

        const laneEnds: string[] = [];
        for (const lane of c.lanes) {
          let laneOk = false;
          for (const e of forkOutgoing) {
            const result = verifySequencePath(d, t.target, e.to, lane);
            if (result.ok && result.lastNodeId) {
              laneOk = true;
              laneEnds.push(result.lastNodeId);
              break;
            }
          }
          if (!laneOk) {
            items.push({
              severity: 'warn',
              message: `Nhánh song song [${lane.join(' → ')}] chưa đúng.`,
              subjectId: forkNode.id,
            });
          }
        }

        const joinTa = findActionByKey(t.target, c.join);
        const joinActionNode = findActionNode(d, joinTa);
        if (joinActionNode && laneEnds.length === c.lanes.length) {
          const joinOk = d.nodes.some(
            (n) => n.type === 'join' && laneEnds.every((le) => canReach(d, le, n.id)) && canReach(d, n.id, joinActionNode.id)
          );
          if (!joinOk) {
            items.push({
              severity: 'warn',
              message: `Các nhánh song song chưa hội tụ đúng tại 1 node join trước khi tới '${joinTa!.name.canonical}'.`,
            });
          } else {
            // Same issue as the decision/merge case: once fork->lanes->join genuinely
            // reconnects to concurrent.join, a leftover plain edge straight from the
            // fork-after action to that same action is a second, structurally-wrong
            // unconditional path (on top of the fork's own split) — clean it up.
            const redundantEdge = d.edges.find((e) => e.from === afterNode.id && e.to === joinActionNode.id);
            if (redundantEdge) {
              items.push({
                severity: 'warn',
                message: `Luồng nối thẳng từ '${afterTa!.name.canonical}' tới '${joinTa!.name.canonical}' không cần thiết nữa — mọi đường đi nên qua fork/join, hãy xóa luồng nối thẳng đó.`,
                subjectId: redundantEdge.id,
                tag: 'redundant-direct-edge',
              });
            }
          }
        }
      }
    }
  }

  return items;
}

export function diffDiagram(d: ActivityDiagramState, t: ActivityLesson): FeedbackItem[] {
  const combined = [
    ...placeActions(d, t),
    ...checkMainSequence(d, t),
    ...decisionsGuards(d, t),
    ...forkJoinAndReachability(d, t),
  ];
  // Every validator independently runs duplicateNodeWarnings() so it fires no matter
  // which step is on screen — combining all 4 for the full diff would otherwise repeat
  // the exact same "2 node cùng tên..." message up to 4 times.
  const seen = new Set<string>();
  return combined.filter((item) => {
    const key = `${item.tag ?? ''}::${item.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const STEP_VALIDATORS: Record<string, StepValidator> = {
  'place-actions': placeActions,
  'main-sequence': checkMainSequence,
  'decisions-guards': decisionsGuards,
  'fork-join': forkJoinAndReachability,
};
