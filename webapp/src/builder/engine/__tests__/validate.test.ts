import { describe, it, expect } from 'vitest';
import { findClasses, placeAttributes, drawAssociations, setMultiplicity, chooseEdgeTypes, associationClassStep, diffDiagram } from '../validate';
import { lesson, emptyDiagram, perfectDiagram } from './fixtures';
import type { DiagramState } from '../types';

describe('V2 findClasses', () => {
  it('passes (no warn/error) when every required class is present', () => {
    const items = findClasses(perfectDiagram(), lesson);
    expect(items.filter((i) => i.severity === 'warn' || i.severity === 'error')).toHaveLength(0);
  });

  it('reports the missing class by name when one is absent, blocking (warn) not just hinting', () => {
    const d = perfectDiagram();
    d.nodes = d.nodes.filter((n) => n.name !== 'Project');
    const items = findClasses(d, lesson);
    const missing = items.find((i) => i.message.includes('Project'));
    expect(missing).toBeDefined();
    expect(missing?.severity).toBe('warn');
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

  it('blocks (warn, not hint) when a required attribute is missing', () => {
    const d = perfectDiagram();
    const employee = d.nodes.find((n) => n.name === 'Employee')!;
    employee.attributes = [];
    const items = placeAttributes(d, lesson);
    const missing = items.find((i) => i.message.includes('name'));
    expect(missing?.severity).toBe('warn');
  });
});

describe('V4 drawAssociations', () => {
  it('reports the missing class pair when a required edge is absent, blocking (warn)', () => {
    const d = perfectDiagram();
    d.edges = d.edges.filter((e) => e.id !== 'e-worksIn');
    const items = drawAssociations(d, lesson);
    const missing = items.find((i) => i.message.includes('Employee') && i.message.includes('Department'));
    expect(missing).toBeDefined();
    expect(missing?.severity).toBe('warn');
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

  it('blocks when the edge exists but multiplicity has not been set yet (regression: freshly click-to-connected edges have no multiplicity)', () => {
    const d = perfectDiagram();
    const worksIn = d.edges.find((e) => e.id === 'e-worksIn')!;
    delete worksIn.multiplicity;
    const items = setMultiplicity(d, lesson);
    expect(items.some((i) => i.severity === 'warn' && i.subjectId === 'e-worksIn')).toBe(true);
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

  it('blocks (warn, not hint) when the association class node is missing entirely', () => {
    const d = perfectDiagram();
    d.nodes = d.nodes.filter((n) => n.name !== 'Staffing');
    const items = associationClassStep(d, lesson);
    const missing = items.find((i) => i.message.includes('Staffing'));
    expect(missing?.severity).toBe('warn');
  });
});

describe('guided step gating (regression: a step must not be skippable while its own requirement is unmet)', () => {
  const isBlocked = (items: ReturnType<typeof findClasses>) => items.some((i) => i.severity === 'warn' || i.severity === 'error');

  it('find-classes blocks on an empty diagram, and clears once all required classes are placed', () => {
    expect(isBlocked(findClasses(emptyDiagram(), lesson))).toBe(true);
    const classesOnly: DiagramState = { nodes: perfectDiagram().nodes, edges: [] };
    expect(isBlocked(findClasses(classesOnly, lesson))).toBe(false);
  });

  it('place-attributes still blocks with classes present but attributes missing (V2 passing must not fake V3 passing)', () => {
    const classesOnly: DiagramState = {
      nodes: perfectDiagram().nodes.map((n) => ({ ...n, attributes: [] })),
      edges: [],
    };
    expect(isBlocked(placeAttributes(classesOnly, lesson))).toBe(true);
  });

  it('draw-associations still blocks with classes+attributes present but no edges drawn (regression for the bug found in manual QA)', () => {
    const noEdges: DiagramState = { nodes: perfectDiagram().nodes, edges: [] };
    expect(isBlocked(drawAssociations(noEdges, lesson))).toBe(true);
  });

  it('association-class still blocks with everything else present but the association class node missing', () => {
    const d = perfectDiagram();
    d.nodes = d.nodes.filter((n) => n.name !== 'Staffing');
    expect(isBlocked(associationClassStep(d, lesson))).toBe(true);
  });

  // Regression: a real user reported reaching a later step (place-attributes,
  // draw-associations, set-multiplicity, choose-edge-types), deleting everything on
  // the canvas, and still being able to click "Tiếp" through. Root cause: each of
  // those validators only iterated diagram.nodes/edges that *existed*, so an empty
  // diagram gave them literally nothing to loop over and they returned zero
  // warnings. The canvas is live/editable regardless of which step is displayed —
  // nothing stops a learner from deleting a class while parked on any step — so
  // every validator must independently detect its own missing prerequisites rather
  // than assuming an earlier step already guaranteed them.
  it('every per-step validator blocks standalone on a totally empty diagram (not just find-classes)', () => {
    const validators = [findClasses, placeAttributes, drawAssociations, setMultiplicity, chooseEdgeTypes, associationClassStep];
    for (const validator of validators) {
      const items = validator(emptyDiagram(), lesson);
      expect(isBlocked(items), `${validator.name} must block on an empty diagram`).toBe(true);
    }
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
