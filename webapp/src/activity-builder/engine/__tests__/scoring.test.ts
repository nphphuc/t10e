import { describe, it, expect } from 'vitest';
import { scoreDiagram } from '../scoring';
import { lesson, emptyDiagram, perfectDiagram } from './fixtures';

describe('scoreDiagram', () => {
  it('scores a perfect diagram at exactly 100 and passes', () => {
    const result = scoreDiagram(perfectDiagram(), lesson);
    expect(result.total).toBeCloseTo(100, 5);
    expect(result.passed).toBe(true);
  });

  it('scores a totally empty diagram far below the pass threshold', () => {
    const result = scoreDiagram(emptyDiagram(), lesson);
    expect(result.total).toBeLessThan(20);
    expect(result.passed).toBe(false);
  });

  it('boundary: losing the whole decision/guard group (25%) via mismatched guard text lands exactly at 75 and still passes', () => {
    // Mutate the guard TEXT on both decision-outgoing edges (topology stays fully
    // connected — no orphan/dead-end side effects on the other rubric groups), so
    // decisionsGuards scores 0/2 in isolation: lose exactly 25 of 100 points.
    const d = perfectDiagram();
    const decisionNode = d.nodes.find((n) => n.type === 'decision')!;
    for (const e of d.edges) {
      if (e.from === decisionNode.id) e.guard = 'khong-khop-voi-guard-nao-ca';
    }
    const result = scoreDiagram(d, lesson);
    expect(result.total).toBeCloseTo(75, 5);
    expect(result.passed).toBe(true); // >= threshold
  });

  it('boundary: the same guard-text loss plus a placed forbidden trap drops below 75 and fails', () => {
    // Same 25-point guard loss as above, plus wiring in the forbidden trap action
    // fully connected (initial -> trap -> final) so it costs only noForbidden's 10
    // points, without orphaning/dead-ending anything else.
    const d = perfectDiagram();
    const decisionNode = d.nodes.find((n) => n.type === 'decision')!;
    for (const e of d.edges) {
      if (e.from === decisionNode.id) e.guard = 'khong-khop-voi-guard-nao-ca';
    }
    const initial = d.nodes.find((n) => n.type === 'initial')!;
    const final = d.nodes.find((n) => n.type === 'final')!;
    const trap = { id: 'trap-node', type: 'action' as const, name: 'Hóa đơn', x: 999, y: 999 };
    d.nodes.push(trap);
    d.edges.push({ id: 'trap-in', from: initial.id, to: trap.id }, { id: 'trap-out', from: trap.id, to: final.id });

    const result = scoreDiagram(d, lesson);
    expect(result.total).toBeCloseTo(65, 5);
    expect(result.passed).toBe(false);
  });
});
