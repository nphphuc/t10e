import type { ActivityDiagramState, ActivityEdge, ActivityLesson, ActivityNode } from './types';

const TRUNK_X = 320;
const BRANCH_X_STEP = 220;
const ROW_HEIGHT = 110;

// Builds a canonical, auto-laid-out diagram directly from a lesson's target spec —
// used as the "reference answer" shown next to the learner's diagram in PE review.
// Pure and deterministic: same lesson always produces the same reference diagram.
//
// Design notes:
// - The main-sequence trunk is wired with direct, unconditional edges (initial ->
//   seq[0] -> seq[1] -> ... -> final) EXCEPT for a hop whose source action has a
//   decision/fork hanging off it AND whose merge/join demonstrably reconnects to
//   the very next trunk action — in that case the direct edge is skipped, since
//   keeping both would give that action two unconditional outgoing edges (a
//   structurally-wrong implication of unintended concurrency, not valid UML for a
//   simple conditional branch). If a branch's rejoinAt ISN'T literally the next
//   trunk step, the direct edge is kept so main-sequence reachability still holds.
// - Layout uses ONE monotonically-increasing vertical cursor shared across the
//   trunk and every branch/concurrent block hanging off it, so a decision's
//   merge and a nearby fork/join never land on the same coordinates — each
//   structure fully consumes its own vertical footprint before the next trunk
//   row (or the next structure) is placed.
export function buildReferenceDiagram(lesson: ActivityLesson): ActivityDiagramState {
  const nodes: ActivityNode[] = [];
  const edges: ActivityEdge[] = [];
  const actionNodeByKey = new Map<string, ActivityNode>();
  const danglingEnds: ActivityNode[] = [];
  let idSeq = 0;

  function nextId(prefix: string): string {
    idSeq += 1;
    return `ref-${prefix}-${idSeq}`;
  }

  function actionNode(key: string, x: number, y: number): ActivityNode {
    const existing = actionNodeByKey.get(key);
    if (existing) return existing;
    const ta = lesson.target.actions.find((a) => a.key === key);
    const node: ActivityNode = { id: nextId('action'), type: 'action', name: ta?.name.canonical ?? key, x, y };
    actionNodeByKey.set(key, node);
    nodes.push(node);
    return node;
  }

  function addEdge(from: string, to: string, guard?: string) {
    edges.push({ id: nextId('edge'), from, to, guard });
  }

  const branchByDecisionAfter = new Map(lesson.target.branches.map((b) => [b.decisionAfter, b]));
  const concurrent = lesson.target.concurrent;

  const initial: ActivityNode = { id: nextId('initial'), type: 'initial', x: TRUNK_X, y: 0 };
  nodes.push(initial);

  let trunkCursor: ActivityNode = initial;
  let y = ROW_HEIGHT;
  const mainSeq = lesson.target.mainSequence;
  // Set true when a branch/concurrent block hanging off the CURRENT key already
  // reconnects into the NEXT trunk key — skips the redundant direct trunk edge for
  // that one hop (see design notes above).
  let skipNextTrunkEdge = false;

  mainSeq.forEach((key, i) => {
    const node = actionNode(key, TRUNK_X, y);
    if (!skipNextTrunkEdge) {
      addEdge(trunkCursor.id, node.id);
    }
    trunkCursor = node;
    skipNextTrunkEdge = false;
    y += ROW_HEIGHT;
    const nextKey = mainSeq[i + 1];

    const branch = branchByDecisionAfter.get(key);
    if (branch) {
      const decisionNode: ActivityNode = { id: nextId('decision'), type: 'decision', x: TRUNK_X, y };
      nodes.push(decisionNode);
      addEdge(node.id, decisionNode.id);
      y += ROW_HEIGHT;

      let mergeNode: ActivityNode | undefined;
      let branchBottom = y;

      branch.guards.forEach((gb, gi) => {
        let branchCursor: ActivityNode = decisionNode;
        let branchY = y;
        let guardAttached = false;
        gb.sequence.forEach((sKey, si) => {
          const sNode = actionNode(sKey, TRUNK_X + (gi + 1) * BRANCH_X_STEP, branchY);
          addEdge(branchCursor.id, sNode.id, si === 0 ? gb.guard.canonical : undefined);
          guardAttached = true;
          branchCursor = sNode;
          branchY += ROW_HEIGHT;
        });
        branchBottom = Math.max(branchBottom, branchY);

        if (gb.rejoinAt) {
          if (!mergeNode) {
            mergeNode = { id: nextId('merge'), type: 'merge', x: TRUNK_X, y: 0 };
            nodes.push(mergeNode);
          }
          // An empty sequence (guard rejoins immediately, no intermediate action) never
          // got a chance to carry the guard text via the loop above — attach it here
          // instead so the decision-outgoing edge is never left unguarded.
          addEdge(branchCursor.id, mergeNode.id, guardAttached ? undefined : gb.guard.canonical);
        } else {
          danglingEnds.push(branchCursor);
        }
      });

      if (mergeNode) {
        mergeNode.y = branchBottom;
        const rejoinKeys = new Set(branch.guards.map((g) => g.rejoinAt).filter((k): k is string => !!k));
        for (const rk of rejoinKeys) {
          addEdge(mergeNode.id, actionNode(rk, TRUNK_X, mergeNode.y + ROW_HEIGHT).id);
        }
        branchBottom = mergeNode.y + ROW_HEIGHT;
        if (nextKey && rejoinKeys.has(nextKey)) {
          skipNextTrunkEdge = true;
        }
      }

      y = branchBottom + ROW_HEIGHT / 2;
    }

    if (concurrent && concurrent.forkAfter === key) {
      const forkNode: ActivityNode = { id: nextId('fork'), type: 'fork', x: TRUNK_X, y };
      nodes.push(forkNode);
      addEdge(node.id, forkNode.id);
      y += ROW_HEIGHT;

      const joinNode: ActivityNode = { id: nextId('join'), type: 'join', x: TRUNK_X, y: 0 };
      let laneBottom = y;
      const laneEndCursors: ActivityNode[] = [];

      concurrent.lanes.forEach((lane, li) => {
        let laneCursor: ActivityNode = forkNode;
        let laneY = y;
        lane.forEach((lKey) => {
          const lNode = actionNode(lKey, TRUNK_X + (li + 1) * BRANCH_X_STEP, laneY);
          addEdge(laneCursor.id, lNode.id);
          laneCursor = lNode;
          laneY += ROW_HEIGHT;
        });
        laneBottom = Math.max(laneBottom, laneY);
        laneEndCursors.push(laneCursor);
      });

      joinNode.y = laneBottom;
      nodes.push(joinNode);
      for (const lc of laneEndCursors) addEdge(lc.id, joinNode.id);
      addEdge(joinNode.id, actionNode(concurrent.join, TRUNK_X, joinNode.y + ROW_HEIGHT).id);
      if (nextKey && concurrent.join === nextKey) {
        skipNextTrunkEdge = true;
      }

      y = joinNode.y + ROW_HEIGHT * 2;
    }
  });

  const final: ActivityNode = { id: nextId('final'), type: 'final', x: TRUNK_X, y: Math.max(trunkCursor.y + ROW_HEIGHT, y) };
  nodes.push(final);
  if (!skipNextTrunkEdge) {
    addEdge(trunkCursor.id, final.id);
  }
  for (const dangling of danglingEnds) {
    addEdge(dangling.id, final.id);
  }

  return { nodes, edges };
}
