// Hand-written fixture domain (Company/Department/Employee/Manager/Project/Staffing/Office) — deliberately
// NOT copied from content/builder/cdb-fos-*.json so engine tests stay stable across content edits (handoff §9.2).
import type { BuilderLesson, DiagramState } from '../types';

export const lesson: BuilderLesson = {
  id: 'test-fixture',
  mode: 'guided',
  title: 'Fixture lesson',
  brief: ['Fixture domain for engine unit tests.'],
  palette: [
    { label: 'Tuyển dụng', kind: 'verb-trap', trapTag: 'class-is-object', trapMessage: "'Tuyển dụng' là hành vi, không phải class." },
    { label: 'Chức vụ', kind: 'attribute-trap', targetClassKey: 'Employee', trapMessage: "'Chức vụ' nên là attribute của Employee." },
  ],
  steps: ['find-classes', 'place-attributes', 'draw-associations', 'set-multiplicity', 'choose-edge-types', 'association-class', 'compare'],
  target: {
    classes: [
      {
        key: 'Department',
        name: { canonical: 'Department', accepted: ['phong ban'] },
        requirement: 'required',
        attributes: [{ name: { canonical: 'name', accepted: ['ten'] }, requirement: 'required' }],
      },
      {
        key: 'Employee',
        name: { canonical: 'Employee', accepted: ['nhan vien'] },
        requirement: 'required',
        attributes: [
          { name: { canonical: 'name', accepted: ['ten'] }, requirement: 'required' },
          {
            name: { canonical: 'budget', accepted: [] },
            requirement: 'forbidden',
            forbiddenTag: 'relationship-data',
            forbiddenReason: "'budget' thuộc về Staffing (association class), không phải Employee.",
          },
        ],
      },
      {
        key: 'Manager',
        name: { canonical: 'Manager', accepted: ['quan ly'] },
        requirement: 'required',
        attributes: [],
      },
      {
        key: 'Project',
        name: { canonical: 'Project', accepted: ['du an'] },
        requirement: 'required',
        attributes: [],
      },
      {
        key: 'Staffing',
        name: { canonical: 'Staffing', accepted: ['phan cong'] },
        requirement: 'required',
        attributes: [
          { name: { canonical: 'role', accepted: ['vai tro'] }, requirement: 'required' },
          { name: { canonical: 'startDate', accepted: [] }, requirement: 'optional' },
        ],
      },
      {
        key: 'Company',
        name: { canonical: 'Company', accepted: ['cong ty'] },
        requirement: 'required',
        attributes: [],
      },
      {
        key: 'Office',
        name: { canonical: 'Office', accepted: ['van phong'] },
        requirement: 'required',
        attributes: [],
      },
    ],
    edges: [
      {
        fromKey: 'Employee',
        toKey: 'Department',
        type: 'association',
        name: { canonical: 'worksIn', accepted: ['works in'] },
        multiplicity: { from: '0..*', to: '1' },
        requirement: 'required',
        wrongMultiplicityTag: 'department-fk',
      },
      {
        fromKey: 'Company',
        toKey: 'Office',
        type: 'composition',
        multiplicity: { from: '1', to: '0..*' },
        requirement: 'required',
      },
      {
        fromKey: 'Employee',
        toKey: 'Project',
        type: 'association',
        name: { canonical: 'worksOn', accepted: ['works on'] },
        multiplicity: { from: '0..*', to: '0..*' },
        requirement: 'required',
        associationClassKey: 'Staffing',
      },
      {
        fromKey: 'Manager',
        toKey: 'Employee',
        type: 'generalization',
        requirement: 'required',
      },
    ],
  },
  passThreshold: 75,
  sourceRefs: ['fixture'],
};

export function emptyDiagram(): DiagramState {
  return { nodes: [], edges: [] };
}

// Builds a diagram that fully satisfies `lesson`'s target.
export function perfectDiagram(): DiagramState {
  const department = { id: 'n-department', type: 'class' as const, name: 'Department', attributes: [{ id: 'a1', name: 'name' }], x: 0, y: 0 };
  const employee = {
    id: 'n-employee',
    type: 'class' as const,
    name: 'Employee',
    attributes: [{ id: 'a2', name: 'name' }],
    x: 0,
    y: 0,
  };
  const manager = { id: 'n-manager', type: 'class' as const, name: 'Manager', attributes: [], x: 0, y: 0 };
  const project = { id: 'n-project', type: 'class' as const, name: 'Project', attributes: [], x: 0, y: 0 };
  const staffing = {
    id: 'n-staffing',
    type: 'associationClass' as const,
    name: 'Staffing',
    attributes: [{ id: 'a3', name: 'role' }],
    x: 0,
    y: 0,
  };
  const company = { id: 'n-company', type: 'class' as const, name: 'Company', attributes: [], x: 0, y: 0 };
  const office = { id: 'n-office', type: 'class' as const, name: 'Office', attributes: [], x: 0, y: 0 };

  const worksOnEdge = {
    id: 'e-worksOn',
    from: 'n-employee',
    to: 'n-project',
    type: 'association' as const,
    name: 'worksOn',
    multiplicity: { from: '0..*' as const, to: '0..*' as const },
    attachedClassId: 'n-staffing',
  };

  return {
    nodes: [department, employee, manager, project, staffing, company, office],
    edges: [
      {
        id: 'e-worksIn',
        from: 'n-employee',
        to: 'n-department',
        type: 'association',
        name: 'worksIn',
        multiplicity: { from: '0..*', to: '1' },
      },
      {
        id: 'e-office',
        from: 'n-company',
        to: 'n-office',
        type: 'composition',
        multiplicity: { from: '1', to: '0..*' },
      },
      worksOnEdge,
      { id: 'e-gen', from: 'n-manager', to: 'n-employee', type: 'generalization' },
    ],
  };
}
