import { describe, it, expect } from 'vitest';
import { buildReferenceDiagram } from '../reference';
import { diffDiagram } from '../validate';
import { scoreDiagram } from '../scoring';
import { lesson } from './fixtures';

describe('buildReferenceDiagram', () => {
  it('produces a diagram that scores 100 and has zero warn/error diff against its own lesson', () => {
    const ref = buildReferenceDiagram(lesson);
    const score = scoreDiagram(ref, lesson);
    expect(score.total).toBe(100);
    const items = diffDiagram(ref, lesson);
    expect(items.filter((i) => i.severity === 'warn' || i.severity === 'error')).toHaveLength(0);
  });

  it('includes every required class exactly once, including the association class', () => {
    const ref = buildReferenceDiagram(lesson);
    const requiredCount = lesson.target.classes.filter((c) => c.requirement === 'required').length;
    expect(ref.nodes).toHaveLength(requiredCount);
  });

  it('attaches the association class node to the correct edge', () => {
    const ref = buildReferenceDiagram(lesson);
    const acNode = ref.nodes.find((n) => n.type === 'associationClass');
    expect(acNode).toBeDefined();
    const edge = ref.edges.find((e) => e.attachedClassId === acNode!.id);
    expect(edge).toBeDefined();
  });
});
