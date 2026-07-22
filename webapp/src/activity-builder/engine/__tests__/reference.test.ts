import { describe, it, expect } from 'vitest';
import { buildReferenceDiagram } from '../reference';
import { scoreDiagram } from '../scoring';
import { diffDiagram } from '../validate';
import { lesson } from './fixtures';

describe('buildReferenceDiagram', () => {
  it('auto-generates a diagram that scores exactly 100 for its own lesson', () => {
    const ref = buildReferenceDiagram(lesson);
    const result = scoreDiagram(ref, lesson);
    expect(result.total).toBeCloseTo(100, 5);
  });

  it('auto-generates a diagram with zero warn/error feedback for its own lesson', () => {
    const ref = buildReferenceDiagram(lesson);
    const items = diffDiagram(ref, lesson);
    expect(items.filter((i) => i.severity === 'warn' || i.severity === 'error')).toHaveLength(0);
  });

  it('is deterministic — same lesson produces the same node/edge counts every call', () => {
    const a = buildReferenceDiagram(lesson);
    const b = buildReferenceDiagram(lesson);
    expect(a.nodes.length).toBe(b.nodes.length);
    expect(a.edges.length).toBe(b.edges.length);
  });

  it('has exactly one initial and at least one final node', () => {
    const ref = buildReferenceDiagram(lesson);
    expect(ref.nodes.filter((n) => n.type === 'initial')).toHaveLength(1);
    expect(ref.nodes.filter((n) => n.type === 'final').length).toBeGreaterThanOrEqual(1);
  });
});
