import { describe, it, expect } from 'vitest';
import { buildReferenceDiagram } from '../reference';
import { scoreDiagram } from '../scoring';
import { diffDiagram } from '../validate';
import type { ActivityLesson } from '../types';
import guidedData from '../../../content/activity-builder/adb-fos-guided.json';
import peData from '../../../content/activity-builder/adb-fos-pe.json';

// Sanity check on the REAL lesson content (not the hand-written engine fixtures) —
// catches schema drift or authoring mistakes (typo'd actionKey, dangling rejoinAt,
// etc.) that would otherwise only surface manually in the browser.
describe.each([
  ['adb-fos-guided', guidedData],
  ['adb-fos-pe', peData],
])('%s content', (_name, data) => {
  const lesson = data as unknown as ActivityLesson;

  it('auto-generates a reference diagram that scores 100 for itself', () => {
    const ref = buildReferenceDiagram(lesson);
    const result = scoreDiagram(ref, lesson);
    expect(result.total).toBeCloseTo(100, 5);
  });

  it('auto-generates a reference diagram with zero warn/error feedback', () => {
    const ref = buildReferenceDiagram(lesson);
    const items = diffDiagram(ref, lesson);
    expect(items.filter((i) => i.severity === 'warn' || i.severity === 'error')).toHaveLength(0);
  });
});
