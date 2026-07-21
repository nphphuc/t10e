import type { ActivityDiagramState, ActivityLesson } from './types';
import { match } from './normalize';
import { canReach, diffDiagram, findActionByKey, findActionNode, reachableSet, verifySequencePath } from './validate';

export interface RubricGroupScore {
  key: 'actionSet' | 'mainSequence' | 'decisionsGuards' | 'forkJoinReachability' | 'noForbidden';
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
  actionSet: 25,
  mainSequence: 25,
  decisionsGuards: 25,
  forkJoinReachability: 15,
  noForbidden: 10,
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

export function scoreDiagram(d: ActivityDiagramState, t: ActivityLesson): ScoreResult {
  const requiredActions = t.target.actions.filter((a) => a.requirement === 'required');
  const forbiddenActions = t.target.actions.filter((a) => a.requirement === 'forbidden');

  // --- Group 1: required actions present ---
  const actionSetSatisfied = requiredActions.filter((a) => findActionNode(d, a)).length;

  // --- Group 2: no forbidden action placed ---
  const noForbiddenSatisfied = forbiddenActions.filter((a) => !findActionNode(d, a)).length;

  // --- Group 3: main sequence order, step by step from initial ---
  const initial = d.nodes.find((n) => n.type === 'initial');
  const seq = t.target.mainSequence;
  const actionNodes = seq.map((key) => findActionNode(d, findActionByKey(t.target, key)));
  let mainSeqSatisfied = 0;
  actionNodes.forEach((node, i) => {
    if (!node) return;
    const prev = i === 0 ? initial : actionNodes[i - 1];
    if (prev && canReach(d, prev.id, node.id)) mainSeqSatisfied++;
  });
  const mainSeqTotal = seq.length;

  // --- Group 4: decision branches — each guard's edge + sequence + rejoin ---
  let decisionsSatisfied = 0;
  let decisionsTotal = 0;
  for (const branch of t.target.branches) {
    const afterNode = findActionNode(d, findActionByKey(t.target, branch.decisionAfter));
    for (const gb of branch.guards) {
      decisionsTotal++;
      if (!afterNode) continue;
      const decisionEdge = d.edges.find(
        (e) => e.from === afterNode.id && d.nodes.find((n) => n.id === e.to)?.type === 'decision'
      );
      const decisionNode = decisionEdge && d.nodes.find((n) => n.id === decisionEdge.to);
      if (!decisionNode) continue;
      const outgoing = d.edges.filter((e) => e.from === decisionNode.id);
      const chosenEdge = outgoing.find((e) => e.guard && match(e.guard, gb.guard));
      if (!chosenEdge) continue;
      const result = verifySequencePath(d, t.target, chosenEdge.to, gb.sequence);
      if (!result.ok || !result.lastNodeId) continue;
      if (gb.rejoinAt) {
        const rejoinNode = findActionNode(d, findActionByKey(t.target, gb.rejoinAt));
        const mergeOk =
          !!rejoinNode &&
          d.nodes.some((n) => n.type === 'merge' && canReach(d, result.lastNodeId!, n.id) && canReach(d, n.id, rejoinNode.id));
        if (!mergeOk) continue;
      }
      decisionsSatisfied++;
    }
  }

  // --- Group 5: fork/join + initial/final + reachability ---
  let structureSatisfied = 0;
  let structureTotal = 2; // exactly-1-initial, at-least-1-final
  const initials = d.nodes.filter((n) => n.type === 'initial');
  const finals = d.nodes.filter((n) => n.type === 'final');
  if (initials.length === 1) structureSatisfied++;
  if (finals.length >= 1) structureSatisfied++;

  if (initials.length === 1) {
    structureTotal += 2; // no-orphans, no-dead-ends
    const reach = reachableSet(d, initials[0].id);
    const noOrphans = d.nodes.every((n) => n.id === initials[0].id || reach.has(n.id));
    if (noOrphans) structureSatisfied++;
    const noDeadEnds = finals.length === 0 || d.nodes.every((n) => n.type === 'final' || finals.some((f) => canReach(d, n.id, f.id)));
    if (noDeadEnds) structureSatisfied++;
  }

  if (t.target.concurrent) {
    structureTotal++;
    const c = t.target.concurrent;
    const afterNode = findActionNode(d, findActionByKey(t.target, c.forkAfter));
    const forkEdge = afterNode && d.edges.find((e) => e.from === afterNode.id && d.nodes.find((n) => n.id === e.to)?.type === 'fork');
    const forkNode = forkEdge && d.nodes.find((n) => n.id === forkEdge.to);
    if (forkNode) {
      const forkOutgoing = d.edges.filter((e) => e.from === forkNode.id);
      const laneEnds: string[] = [];
      let allLanesOk = true;
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
        if (!laneOk) allLanesOk = false;
      }
      const joinNode = findActionNode(d, findActionByKey(t.target, c.join));
      const joinOk =
        allLanesOk &&
        !!joinNode &&
        d.nodes.some((n) => n.type === 'join' && laneEnds.every((le) => canReach(d, le, n.id)) && canReach(d, n.id, joinNode.id));
      if (joinOk) structureSatisfied++;
    }
  }

  const groups: RubricGroupScore[] = [
    group('actionSet', actionSetSatisfied, requiredActions.length),
    group('mainSequence', mainSeqSatisfied, mainSeqTotal),
    group('decisionsGuards', decisionsSatisfied, decisionsTotal),
    group('forkJoinReachability', structureSatisfied, structureTotal),
    group('noForbidden', noForbiddenSatisfied, forbiddenActions.length),
  ];

  const total = groups.reduce((sum, g) => sum + g.points, 0);
  const passed = total >= t.passThreshold;

  return { total, passed, groups, feedback: diffDiagram(d, t) };
}
