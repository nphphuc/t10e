import { describe, it, expect } from 'vitest';
import {
  placeActions,
  checkMainSequence,
  decisionsGuards,
  forkJoinAndReachability,
  diffDiagram,
} from '../validate';
import { lesson, emptyDiagram, perfectDiagram } from './fixtures';

const isBlocked = (items: ReturnType<typeof placeActions>) => items.some((i) => i.severity === 'warn' || i.severity === 'error');

describe('V2 placeActions', () => {
  it('passes when every required action is present', () => {
    expect(isBlocked(placeActions(perfectDiagram(), lesson))).toBe(false);
  });

  it('blocks (warn) when a required action is missing', () => {
    const d = perfectDiagram();
    d.nodes = d.nodes.filter((n) => n.name !== 'Cập nhật kho');
    const items = placeActions(d, lesson);
    const missing = items.find((i) => i.message.includes('Cập nhật kho'));
    expect(missing?.severity).toBe('warn');
  });

  it('flags a forbidden noun-trap action if placed, with its tag', () => {
    const d = perfectDiagram();
    d.nodes.push({ id: 'trap1', type: 'action', name: 'Hóa đơn', x: 0, y: 0 });
    const items = placeActions(d, lesson);
    expect(items.some((i) => i.tag === 'noun-not-verb')).toBe(true);
  });

  it('flags two nodes sharing the same action name, since findActionNode only ever resolves the first one', () => {
    const d = perfectDiagram();
    const original = d.nodes.find((n) => n.name === 'Trả sách')!;
    d.nodes.push({ id: 'dup1', type: 'action', name: original.name, x: 999, y: 999 });
    const items = placeActions(d, lesson);
    const dup = items.find((i) => i.tag === 'duplicate-action-name');
    expect(dup?.severity).toBe('warn');
    expect(dup?.message).toContain('Trả sách');
  });

  it('flags a second initial node even while still on the place-actions step (regression: this used to only surface at fork-join/compare)', () => {
    const d = perfectDiagram();
    d.nodes.push({ id: 'dup-initial', type: 'initial', x: 999, y: 999 });
    const items = placeActions(d, lesson);
    const dup = items.find((i) => i.tag === 'duplicate-initial');
    expect(dup?.severity).toBe('warn');
    expect(dup?.message).toContain('2');
  });
});

describe('V3 checkMainSequence', () => {
  it('passes on a perfect diagram', () => {
    expect(isBlocked(checkMainSequence(perfectDiagram(), lesson))).toBe(false);
  });

  it('blocks (warn) when two main-sequence actions are connected in the wrong order', () => {
    const d = perfectDiagram();
    const returnBook = d.nodes.find((n) => n.name === 'Trả sách')!;
    const inspect = d.nodes.find((n) => n.name === 'Kiểm tra tình trạng')!;
    d.edges = d.edges.filter((e) => !(e.from === returnBook.id && e.to === inspect.id));
    const items = checkMainSequence(d, lesson);
    const wrongOrder = items.find((i) => i.message.includes('Trả sách') && i.message.includes('Kiểm tra tình trạng'));
    expect(wrongOrder?.severity).toBe('warn');
  });
});

describe('V4 decisionsGuards', () => {
  it('passes on a perfect diagram', () => {
    expect(isBlocked(decisionsGuards(perfectDiagram(), lesson))).toBe(false);
  });

  it('blocks (warn) when a guard branch is missing entirely', () => {
    const d = perfectDiagram();
    const chargeFee = d.nodes.find((n) => n.name === 'Thu phí hư hỏng')!;
    d.edges = d.edges.filter((e) => e.to !== chargeFee.id);
    const items = decisionsGuards(d, lesson);
    const missing = items.find((i) => i.message.includes('Hư hỏng'));
    expect(missing?.severity).toBe('warn');
  });

  it('flags an outgoing decision edge with no guard text', () => {
    const d = perfectDiagram();
    const decisionNode = d.nodes.find((n) => n.type === 'decision')!;
    const edge = d.edges.find((e) => e.from === decisionNode.id)!;
    edge.guard = undefined;
    const items = decisionsGuards(d, lesson);
    expect(items.some((i) => i.tag === 'missing-guard')).toBe(true);
  });

  it('flags two decision nodes both connected from the same "after" action, since only the first is ever checked', () => {
    const d = perfectDiagram();
    const inspect = d.nodes.find((n) => n.name === 'Kiểm tra tình trạng')!;
    const dupDecision = { id: 'dup-decision', type: 'decision' as const, x: 999, y: 999 };
    d.nodes.push(dupDecision);
    d.edges.push({ id: 'dup-decision-edge', from: inspect.id, to: dupDecision.id });
    const items = decisionsGuards(d, lesson);
    expect(items.some((i) => i.tag === 'duplicate-decision')).toBe(true);
  });
});

describe('V5 forkJoinAndReachability', () => {
  it('passes on a perfect diagram', () => {
    expect(isBlocked(forkJoinAndReachability(perfectDiagram(), lesson))).toBe(false);
  });

  it('blocks (warn) when initial count is not exactly 1', () => {
    const d = perfectDiagram();
    d.nodes = d.nodes.filter((n) => n.type !== 'initial');
    const items = forkJoinAndReachability(d, lesson);
    expect(items.some((i) => i.message.includes('initial'))).toBe(true);
  });

  it('blocks (warn) on an orphan node unreachable from initial', () => {
    const d = perfectDiagram();
    d.nodes.push({ id: 'orphan1', type: 'action', name: 'Không nối gì cả', x: 999, y: 999 });
    const items = forkJoinAndReachability(d, lesson);
    expect(items.some((i) => i.tag === 'orphan-node')).toBe(true);
  });

  it('blocks (warn) when the fork exists but lanes never converge into a join node', () => {
    const d = perfectDiagram();
    d.nodes = d.nodes.filter((n) => n.type !== 'join');
    const items = forkJoinAndReachability(d, lesson);
    expect(items.some((i) => i.message.includes('hội tụ'))).toBe(true);
  });

  it('flags two fork nodes both connected from the same "after" action, since only the first is ever checked', () => {
    const d = perfectDiagram();
    const updateCatalog = d.nodes.find((n) => n.name === 'Cập nhật kho')!;
    const dupFork = { id: 'dup-fork', type: 'fork' as const, x: 999, y: 999 };
    d.nodes.push(dupFork);
    d.edges.push({ id: 'dup-fork-edge', from: updateCatalog.id, to: dupFork.id });
    const items = forkJoinAndReachability(d, lesson);
    expect(items.some((i) => i.tag === 'duplicate-fork')).toBe(true);
  });
});

describe('guided step gating (regression: a step must not be skippable while its own requirement is unmet)', () => {
  // A real bug from the class-diagram builder: validators that only looped over
  // nodes/edges that already existed silently passed on an empty diagram because
  // there was nothing to loop over. The canvas stays live/editable regardless of
  // which step is displayed, so every validator must independently detect its own
  // missing prerequisites rather than assuming an earlier step already gated them.
  it('every per-step validator blocks standalone on a totally empty diagram', () => {
    const validators = [placeActions, checkMainSequence, decisionsGuards, forkJoinAndReachability];
    for (const validator of validators) {
      const items = validator(emptyDiagram(), lesson);
      expect(isBlocked(items), `${validator.name} must block on an empty diagram`).toBe(true);
    }
  });
});

describe('diffDiagram', () => {
  it('lists issues for an empty diagram', () => {
    const items = diffDiagram(emptyDiagram(), lesson);
    expect(items.length).toBeGreaterThan(0);
  });

  it('has zero warn/error items for a perfect diagram', () => {
    const items = diffDiagram(perfectDiagram(), lesson);
    expect(items.filter((i) => i.severity === 'warn' || i.severity === 'error')).toHaveLength(0);
  });
});
