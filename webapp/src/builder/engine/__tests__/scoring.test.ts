import { describe, it, expect } from 'vitest';
import { scoreDiagram } from '../scoring';
import { lesson, emptyDiagram, perfectDiagram } from './fixtures';

describe('scoreDiagram', () => {
  it('scores a perfect diagram at 100', () => {
    const result = scoreDiagram(perfectDiagram(), lesson);
    expect(result.total).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('scores an empty diagram at 0', () => {
    const result = scoreDiagram(emptyDiagram(), lesson);
    expect(result.total).toBe(0);
    expect(result.passed).toBe(false);
  });

  it('loses exactly the multiplicity group weight (20%) when every multiplicity end is wrong', () => {
    const d = perfectDiagram();
    const worksIn = d.edges.find((e) => e.id === 'e-worksIn')!;
    worksIn.multiplicity = { from: '1', to: '0..*' };
    const office = d.edges.find((e) => e.id === 'e-office')!;
    office.multiplicity = { from: '0..*', to: '1' };
    const worksOn = d.edges.find((e) => e.id === 'e-worksOn')!;
    worksOn.multiplicity = { from: '1', to: '1' };

    const result = scoreDiagram(d, lesson);
    expect(result.total).toBe(80);
    expect(result.groups.find((g) => g.key === 'multiplicity')?.points).toBe(0);
  });

  it('passThreshold blocks exactly at the boundary (>= passes, just above fails)', () => {
    const result = scoreDiagram(perfectDiagram(), lesson);
    const total = result.total;
    expect(scoreDiagram(perfectDiagram(), { ...lesson, passThreshold: total }).passed).toBe(true);
    expect(scoreDiagram(perfectDiagram(), { ...lesson, passThreshold: total + 0.1 }).passed).toBe(false);
  });
});
