import { describe, expect, it } from 'vitest';
import { match, normalizeName } from './normalize';
import { passesThreshold, scoreDiagram } from './scoring';
import type { BuilderLesson, DiagramState } from './types';
import {
  associationClassStep,
  chooseEdgeTypes,
  diffDiagram,
  drawAssociations,
  findClasses,
  placeAttributes,
  setMultiplicity,
} from './validate';

const fixture: BuilderLesson = {
  id: 'engine-fixture',
  mode: 'guided',
  title: 'Fixture độc lập',
  brief: [],
  palette: [
    { label: 'Đặt hàng', kind: 'verb-trap', trapTag: 'class-is-object', trapMessage: 'Đây là hành vi.' },
    { label: 'quantity', kind: 'attribute-trap', trapTag: 'relationship-data' },
  ],
  steps: ['find-classes'],
  passThreshold: 75,
  sourceRefs: ['fixture'],
  target: {
    classes: [
      { key: 'Customer', name: { canonical: 'Customer', accepted: ['khách hàng'] }, requirement: 'required', attributes: [{ name: { canonical: 'name', accepted: ['tên'] }, requirement: 'required' }] },
      { key: 'Order', name: { canonical: 'Order', accepted: ['đơn hàng'] }, requirement: 'required', attributes: [{ name: { canonical: 'orderDate', accepted: ['ngày đặt'] }, requirement: 'required' }] },
      { key: 'Product', name: { canonical: 'Product', accepted: ['sản phẩm'] }, requirement: 'required', attributes: [
        { name: { canonical: 'productName', accepted: ['tên sản phẩm'] }, requirement: 'required' },
        { name: { canonical: 'quantity', accepted: ['số lượng'] }, requirement: 'forbidden', forbiddenTag: 'relationship-data', forbiddenReason: 'Số lượng thay đổi theo từng giao dịch.' },
      ] },
      { key: 'Address', name: { canonical: 'Address', accepted: ['địa chỉ'] }, requirement: 'required', attributes: [{ name: { canonical: 'street', accepted: ['đường'] }, requirement: 'required' }] },
      { key: 'VipCustomer', name: { canonical: 'VipCustomer', accepted: ['khách vip'] }, requirement: 'required', attributes: [] },
      { key: 'OrderLine', name: { canonical: 'OrderLine', accepted: ['dòng đơn hàng'] }, requirement: 'required', attributes: [
        { name: { canonical: 'quantity', accepted: ['số lượng'] }, requirement: 'required' },
        { name: { canonical: 'priceAtPurchase', accepted: ['giá lúc mua'] }, requirement: 'required' },
      ] },
    ],
    edges: [
      { fromKey: 'Customer', toKey: 'Order', type: 'association', name: { canonical: 'places', accepted: ['đặt'] }, multiplicity: { from: '1', to: '0..*' }, requirement: 'required', wrongMultiplicityTag: 'multiplicity-fk' },
      { fromKey: 'Order', toKey: 'Product', type: 'association', multiplicity: { from: '0..*', to: '0..*' }, requirement: 'required', associationClassKey: 'OrderLine' },
      { fromKey: 'Customer', toKey: 'Address', type: 'composition', multiplicity: { from: '1', to: '0..1' }, requirement: 'required', wrongTypeTag: 'aggregation-equals-composition' },
      { fromKey: 'VipCustomer', toKey: 'Customer', type: 'generalization', requirement: 'required', wrongTypeTag: 'inheritance-for-reuse-only' },
      { fromKey: 'Product', toKey: 'Customer', type: 'association', requirement: 'forbidden', wrongTypeTag: 'association-is-link', reason: 'Brief không mô tả liên kết trực tiếp này.' },
    ],
  },
};

const perfect: DiagramState = {
  nodes: [
    { id: 'customer', type: 'class', name: 'Customer', attributes: [{ id: 'a1', name: 'name' }], x: 0, y: 0 },
    { id: 'order', type: 'class', name: 'Order', attributes: [{ id: 'a2', name: 'orderDate' }], x: 900, y: 900 },
    { id: 'product', type: 'class', name: 'Product', attributes: [{ id: 'a3', name: 'productName' }], x: 20, y: 20 },
    { id: 'address', type: 'class', name: 'Address', attributes: [{ id: 'a4', name: 'street' }], x: 30, y: 30 },
    { id: 'vip', type: 'class', name: 'VipCustomer', attributes: [], x: 40, y: 40 },
    { id: 'line', type: 'associationClass', name: 'OrderLine', attributes: [{ id: 'a5', name: 'quantity' }, { id: 'a6', name: 'priceAtPurchase' }], x: 50, y: 50 },
  ],
  edges: [
    { id: 'customer-order', from: 'customer', to: 'order', type: 'association', name: 'places', multiplicity: { from: '1', to: '0..*' } },
    { id: 'order-product', from: 'order', to: 'product', type: 'association', multiplicity: { from: '0..*', to: '0..*' }, attachedClassId: 'line' },
    { id: 'customer-address', from: 'customer', to: 'address', type: 'composition', multiplicity: { from: '1', to: '0..1' } },
    { id: 'vip-customer', from: 'vip', to: 'customer', type: 'generalization' },
  ],
};

const copy = (): DiagramState => structuredClone(perfect);

describe('normalize', () => {
  it('matches accepted names through case, Vietnamese marks and whitespace', () => {
    expect(normalizeName('  KHÁCH   HÀNG ')).toBe('khachhang');
    expect(match(' KHÁCH HÀNG ', fixture.target.classes[0].name)).toBe(true);
    expect(match('customer', fixture.target.classes[0].name)).toBe(true);
    expect(match('supplier', fixture.target.classes[0].name)).toBe(false);
  });
});

describe('step validators', () => {
  it('V2 accepts required classes, reports a missing name and tags a verb trap', () => {
    expect(findClasses(perfect, fixture)).toEqual([]);
    const missing = copy();
    missing.nodes = missing.nodes.filter((node) => node.id !== 'order');
    expect(findClasses(missing, fixture).some((item) => item.message.includes("'Order'"))).toBe(true);
    missing.nodes.push({ id: 'verb', type: 'class', name: 'Đặt hàng', attributes: [], x: 0, y: 0 });
    expect(findClasses(missing, fixture).some((item) => item.tag === 'class-is-object')).toBe(true);
  });

  it('V3 accepts correct ownership and catches forbidden relationship data', () => {
    expect(placeAttributes(perfect, fixture)).toEqual([]);
    const wrong = copy();
    wrong.nodes.find((node) => node.id === 'product')!.attributes.push({ id: 'bad', name: 'quantity' });
    expect(placeAttributes(wrong, fixture).some((item) => item.tag === 'relationship-data')).toBe(true);
  });

  it('V4 reports missing and forbidden edges and catches reversed generalization', () => {
    const missing = copy();
    missing.edges = missing.edges.filter((edge) => edge.id !== 'customer-order');
    expect(drawAssociations(missing, fixture).some((item) => item.message.includes("'Customer'") && item.message.includes("'Order'"))).toBe(true);
    const forbidden = copy();
    forbidden.edges.push({ id: 'extra', from: 'product', to: 'customer', type: 'association' });
    expect(drawAssociations(forbidden, fixture).some((item) => item.tag === 'association-is-link')).toBe(true);
    const reverse = copy();
    reverse.edges.find((edge) => edge.id === 'vip-customer')!.from = 'customer';
    reverse.edges.find((edge) => edge.id === 'vip-customer')!.to = 'vip';
    expect(drawAssociations(reverse, fixture).some((item) => item.tag === 'inheritance-for-reuse-only')).toBe(true);
  });

  it('V5 emits one tagged item for each incorrect multiplicity end', () => {
    const wrong = copy();
    wrong.edges.find((edge) => edge.id === 'customer-order')!.multiplicity = { from: '0..*', to: '1' };
    const items = setMultiplicity(wrong, fixture).filter((item) => item.subjectId === 'customer-order');
    expect(items).toHaveLength(2);
    expect(items.every((item) => item.tag === 'multiplicity-fk')).toBe(true);
  });

  it('V6 distinguishes aggregation from composition', () => {
    const wrong = copy();
    wrong.edges.find((edge) => edge.id === 'customer-address')!.type = 'aggregation';
    expect(chooseEdgeTypes(wrong, fixture).some((item) => item.tag === 'aggregation-equals-composition')).toBe(true);
  });

  it('V7 catches endpoint data and accepts a correctly attached association class', () => {
    expect(associationClassStep(perfect, fixture)).toEqual([]);
    const wrong = copy();
    wrong.nodes.find((node) => node.id === 'product')!.attributes.push({ id: 'q', name: 'quantity' });
    expect(associationClassStep(wrong, fixture).some((item) => item.tag === 'relationship-data')).toBe(true);
  });
});

describe('diff and scoring', () => {
  it('lists all required class/edge targets for an empty diagram and has no blocking diff when perfect', () => {
    const empty = diffDiagram({ nodes: [], edges: [] }, fixture);
    for (const name of ['Customer', 'Order', 'Product', 'Address', 'VipCustomer', 'OrderLine']) {
      expect(empty.some((item) => item.message.includes(name))).toBe(true);
    }
    expect(diffDiagram(perfect, fixture).filter((item) => item.severity === 'warn' || item.severity === 'error')).toEqual([]);
  });

  it('scores perfect=100, empty=0 and missing all multiplicities loses exactly 20 points', () => {
    expect(scoreDiagram(perfect, fixture).total).toBe(100);
    expect(scoreDiagram({ nodes: [], edges: [] }, fixture).total).toBe(0);
    const noMultiplicity = copy();
    noMultiplicity.edges.forEach((edge) => { delete edge.multiplicity; });
    expect(scoreDiagram(noMultiplicity, fixture).total).toBe(80);
  });

  it('uses an inclusive threshold boundary', () => {
    expect(passesThreshold(74.9, 75)).toBe(false);
    expect(passesThreshold(75, 75)).toBe(true);
  });
});
