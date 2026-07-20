import { describe, it, expect } from 'vitest';
import { findClasses, placeAttributes, drawAssociations, setMultiplicity, chooseEdgeTypes, associationClassStep, diffDiagram } from '../validate';
import { lesson, emptyDiagram, perfectDiagram } from './fixtures';
import type { DiagramState } from '../types';

describe('V2 findClasses', () => {
  it('passes (no warn/error) when every required class is present', () => {
    const items = findClasses(perfectDiagram(), lesson);
    expect(items.filter((i) => i.severity === 'warn' || i.severity === 'error')).toHaveLength(0);
  });

  it('reports the missing class by name when one is absent', () => {
    const d = perfectDiagram();
    d.nodes = d.nodes.filter((n) => n.name !== 'Project');
    const items = findClasses(d, lesson);
    expect(items.some((i) => i.message.includes('Project'))).toBe(true);
  });

  it('tags a dragged verb-trap with its misconception tag', () => {
    const d: DiagramState = {
      nodes: [{ id: 'n1', type: 'class', name: 'Tuyển dụng', attributes: [], x: 0, y: 0 }],
      edges: [],
    };
    const items = findClasses(d, lesson);
    const trapItem = items.find((i) => i.tag === 'class-is-object');
    expect(trapItem).toBeDefined();
    expect(trapItem?.severity).toBe('warn');
  });
});

describe('V3 placeAttributes', () => {
  it('passes when required attributes are on the right class', () => {
    const items = placeAttributes(perfectDiagram(), lesson);
    expect(items.filter((i) => i.severity === 'warn' || i.severity === 'error')).toHaveLength(0);
  });

  it('flags a forbidden attribute with the relationship-data tag', () => {
    const d = perfectDiagram();
    const employee = d.nodes.find((n) => n.name === 'Employee')!;
    employee.attributes.push({ id: 'a-budget', name: 'budget' });
    const items = placeAttributes(d, lesson);
    expect(items.some((i) => i.tag === 'relationship-data')).toBe(true);
  });
});

describe('V4 drawAssociations', () => {
  it('reports the missing class pair when a required edge is absent', () => {
    const d = perfectDiagram();
    d.edges = d.edges.filter((e) => e.id !== 'e-worksIn');
    const items = drawAssociations(d, lesson);
    expect(items.some((i) => i.message.includes('Employee') && i.message.includes('Department'))).toBe(true);
  });

  it('flags an extra edge not present in the target', () => {
    const d = perfectDiagram();
    d.edges.push({ id: 'e-extra', from: 'n-manager', to: 'n-project', type: 'association' });
    const items = drawAssociations(d, lesson);
    expect(items.some((i) => i.subjectId === 'e-extra')).toBe(true);
  });

  it('catches a generalization drawn in the wrong direction', () => {
    const d = perfectDiagram();
    const gen = d.edges.find((e) => e.id === 'e-gen')!;
    gen.from = 'n-employee';
    gen.to = 'n-manager';
    const items = drawAssociations(d, lesson);
    expect(items.length).toBeGreaterThan(0);
  });
});

describe('V5 setMultiplicity', () => {
  it('reports each wrong end separately with the configured tag', () => {
    const d = perfectDiagram();
    const worksIn = d.edges.find((e) => e.id === 'e-worksIn')!;
    worksIn.multiplicity = { from: '1', to: '0..*' };
    const items = setMultiplicity(d, lesson);
    expect(items).toHaveLength(2);
    expect(items.every((i) => i.tag === 'department-fk')).toBe(true);
  });

  it('falls back to the generic multiplicity-fk tag when no override is set', () => {
    const d = perfectDiagram();
    const office = d.edges.find((e) => e.id === 'e-office')!;
    office.multiplicity = { from: '0..1', to: '0..*' };
    const items = setMultiplicity(d, lesson);
    expect(items.some((i) => i.tag === 'multiplicity-fk')).toBe(true);
  });
});

describe('V6 chooseEdgeTypes', () => {
  it('flags composition declared as aggregation', () => {
    const d = perfectDiagram();
    const office = d.edges.find((e) => e.id === 'e-office')!;
    office.type = 'aggregation';
    const items = chooseEdgeTypes(d, lesson);
    expect(items.some((i) => i.tag === 'aggregation-equals-composition')).toBe(true);
  });
});

describe('V7 associationClassStep', () => {
  it('flags a relationship attribute placed on one of the endpoint classes', () => {
    const d = perfectDiagram();
    const staffing = d.nodes.find((n) => n.name === 'Staffing')!;
    staffing.attributes = [];
    const employee = d.nodes.find((n) => n.name === 'Employee')!;
    employee.attributes.push({ id: 'a-role', name: 'role' });
    const items = associationClassStep(d, lesson);
    expect(items.some((i) => i.tag === 'relationship-data' && i.subjectId === employee.id)).toBe(true);
  });

  it('passes when the association class is correctly attached', () => {
    const items = associationClassStep(perfectDiagram(), lesson);
    expect(items.filter((i) => i.severity === 'warn' || i.severity === 'error')).toHaveLength(0);
  });
});

describe('diffDiagram', () => {
  it('lists every required element for an empty diagram', () => {
    const items = diffDiagram(emptyDiagram(), lesson);
    expect(items.length).toBeGreaterThanOrEqual(lesson.target.classes.length);
  });

  it('has zero warn/error items for a perfect diagram', () => {
    const items = diffDiagram(perfectDiagram(), lesson);
    expect(items.filter((i) => i.severity === 'warn' || i.severity === 'error')).toHaveLength(0);
  });
});
