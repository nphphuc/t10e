import type { ActivityDiagramState, ActivityEdge, ActivityLesson, ActivityNode } from './types';

const TRUNK_X = 320;
const BRANCH_X_STEP = 220;
const ROW_HEIGHT = 110;

// Builds a canonical, auto-laid-out diagram directly from a lesson's target spec —
// used as the "reference answer" shown next to the learner's diagram in PE review.
// Pure and deterministic: same lesson always produces the same reference diagram.
//
// Design note: the main-sequence trunk is always wired with direct, unconditional
// edges (initial -> seq[0] -> seq[1] -> ... -> final). Decision/guard and fork/join
// structure is layered on as an ADDITIONAL path alongside the trunk (decision hangs
// off the "after" action, its merge reconnects into the declared rejoinAt action)
// rather than replacing a trunk edge. That keeps main-sequence reachability correct
// even if a branch's rejoinAt isn't literally the very next trunk step.
export function buildReferenceDiagram(lesson: ActivityLesson): ActivityDiagramState {
  const nodes: ActivityNode[] = [];
  const edges: ActivityEdge[] = [];
  const actionNodeByKey = new Map<string, ActivityNode>();
  const danglingEnds: ActivityNode[] = [];
  let idSeq = 0;
  let row = 0;

  function nextId(prefix: string): string {
    idSeq += 1;
    return `ref-${prefix}-${idSeq}`;
  }

  function actionNode(key: string, x = TRUNK_X): ActivityNode {
    const existing = actionNodeByKey.get(key);
    if (existing) return existing;
    const ta = lesson.target.actions.find((a) => a.key === key);
    const node: ActivityNode = {
      id: nextId('action'),
      type: 'action',
      name: ta?.name.canonical ?? key,
      x,
      y: 60 + row * ROW_HEIGHT,
    };
    row++;
    actionNodeByKey.set(key, node);
    nodes.push(node);
    return node;
  }

  function addEdge(from: string, to: string, guard?: string) {
    edges.push({ id: nextId('edge'), from, to, guard });
  }

  const initial: ActivityNode = { id: nextId('initial'), type: 'initial', x: TRUNK_X, y: 0 };
  nodes.push(initial);

  // Trunk: initial -> mainSequence[0] -> ... -> mainSequence[last], all direct edges.
  let trunkCursor: ActivityNode = initial;
  const mainSeq = lesson.target.mainSequence;
  mainSeq.forEach((key) => {
    const node = actionNode(key);
    addEdge(trunkCursor.id, node.id);
    trunkCursor = node;
  });

  // Decision branches: hang off the trunk action they follow, converge back via a merge.
  for (const branch of lesson.target.branches) {
    const afterNode = actionNode(branch.decisionAfter);
    const decisionNode: ActivityNode = {
      id: nextId('decision'),
      type: 'decision',
      x: afterNode.x,
      y: afterNode.y + ROW_HEIGHT / 2,
    };
    nodes.push(decisionNode);
    addEdge(afterNode.id, decisionNode.id);

    let mergeNode: ActivityNode | undefined;

    branch.guards.forEach((gb, gi) => {
      let branchCursor: ActivityNode = decisionNode;
      gb.sequence.forEach((sKey, si) => {
        const sNode = actionNode(sKey, TRUNK_X + (gi + 1) * BRANCH_X_STEP);
        addEdge(branchCursor.id, sNode.id, si === 0 ? gb.guard.canonical : undefined);
        branchCursor = sNode;
      });

      if (gb.rejoinAt) {
        if (!mergeNode) {
          mergeNode = { id: nextId('merge'), type: 'merge', x: afterNode.x, y: decisionNode.y + ROW_HEIGHT };
          nodes.push(mergeNode);
          addEdge(mergeNode.id, actionNode(gb.rejoinAt).id);
        }
        addEdge(branchCursor.id, mergeNode.id);
      } else {
        danglingEnds.push(branchCursor);
      }
    });
  }

  // Fork/join: hang off the trunk action it follows, lanes converge into one join node.
  const concurrent = lesson.target.concurrent;
  if (concurrent) {
    const afterNode = actionNode(concurrent.forkAfter);
    const forkNode: ActivityNode = { id: nextId('fork'), type: 'fork', x: afterNode.x, y: afterNode.y + ROW_HEIGHT / 2 };
    nodes.push(forkNode);
    addEdge(afterNode.id, forkNode.id);

    const joinNode: ActivityNode = { id: nextId('join'), type: 'join', x: afterNode.x, y: forkNode.y + ROW_HEIGHT * 2 };
    nodes.push(joinNode);

    concurrent.lanes.forEach((lane, li) => {
      let laneCursor: ActivityNode = forkNode;
      lane.forEach((lKey) => {
        const lNode = actionNode(lKey, TRUNK_X + (li + 1) * BRANCH_X_STEP);
        addEdge(laneCursor.id, lNode.id);
        laneCursor = lNode;
      });
      addEdge(laneCursor.id, joinNode.id);
    });

    addEdge(joinNode.id, actionNode(concurrent.join).id);
  }

  const final: ActivityNode = { id: nextId('final'), type: 'final', x: TRUNK_X, y: trunkCursor.y + ROW_HEIGHT };
  nodes.push(final);
  addEdge(trunkCursor.id, final.id);
  for (const dangling of danglingEnds) {
    addEdge(dangling.id, final.id);
  }

  return { nodes, edges };
}
