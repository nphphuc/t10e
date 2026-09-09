import { describe, expect, it } from 'vitest';
import guidedData from '../../content/builder/cdb-fos-guided.json';
import peData from '../../content/builder/cdb-fos-pe.json';
import { match, normalizeName } from './normalize';
import { createDiagramHistoryState, diagramHistoryReducer, HISTORY_LIMIT } from './history';
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
      { fromKey: 'Order', toKey: 'Product', type: 'association', multiplicity: { from: '0..*', to: '1..*' }, requirement: 'required', associationClassKey: 'OrderLine' },
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
    { id: 'order-product', from: 'order', to: 'product', type: 'association', multiplicity: { from: '0..*', to: '1..*' }, attachedClassId: 'line' },
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

describe('diagram history', () => {
  it('undoes each logical mutation once and never toggles into redo', () => {
    const empty: DiagramState = { nodes: [], edges: [] };
    const withClass: DiagramState = { nodes: [{ id: 'customer', type: 'class', name: 'Customer', attributes: [], x: 0, y: 0 }], edges: [] };
    const withEdge: DiagramState = { ...withClass, nodes: [...withClass.nodes, { id: 'order', type: 'class', name: 'Order', attributes: [], x: 300, y: 0 }], edges: [{ id: 'places', from: 'customer', to: 'order', type: 'association' }] };
    const withMultiplicity: DiagramState = { ...withEdge, edges: [{ ...withEdge.edges[0], multiplicity: { from: '1', to: '0..*' } }] };
    const withName: DiagramState = { ...withMultiplicity, edges: [{ ...withMultiplicity.edges[0], name: 'places' }] };

    let state = createDiagramHistoryState(empty);
    for (const next of [withClass, withEdge, withMultiplicity, withName]) state = diagramHistoryReducer(state, { type: 'commit', next });
    expect(state.history).toHaveLength(4);
    for (const expected of [withMultiplicity, withEdge, withClass, empty]) {
      state = diagramHistoryReducer(state, { type: 'undo' });
      expect(state.present).toEqual(expected);
    }
    const exhausted = diagramHistoryReducer(state, { type: 'undo' });
    expect(exhausted).toBe(state);
    expect(exhausted.present).toEqual(empty);
  });

  it('caps snapshots with FIFO eviction', () => {
    let state = createDiagramHistoryState({ nodes: [], edges: [] });
    for (let index = 0; index < HISTORY_LIMIT + 5; index += 1) {
      state = diagramHistoryReducer(state, { type: 'commit', next: { nodes: [], edges: [], marker: index } as unknown as DiagramState });
    }
    expect(state.history).toHaveLength(HISTORY_LIMIT);
    expect((state.history[0] as DiagramState & { marker?: number }).marker).toBe(4);
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

  it('V7 gives a three-step action and points feedback at the Order–Product edge', () => {
    const missing = copy();
    missing.nodes = missing.nodes.filter((node) => node.id !== 'line');
    const item = associationClassStep(missing, fixture)[0];
    expect(item).toMatchInlineSnapshot(`
      {
        "message": "Dữ liệu như 'quantity', 'priceAtPurchase' thuộc về CHÍNH quan hệ Order–Product — không thuộc riêng Order hay Product. Cách dựng: (1) tạo node loại Association class tên OrderLine (ô 'Tên class…' → chọn loại), (2) click đường nối Order–Product, (3) trong bảng chỉnh quan hệ, mục Association class → chọn OrderLine.",
        "severity": "warn",
        "subjectId": "order-product",
        "tag": "relationship-data",
      }
    `);
  });
});

describe('approved FOS target content', () => {
  it.each([guidedData, peData])('matches the approved target and source references for $id', (data) => {
    expect(data).not.toHaveProperty('needsReview');
    expect(data).not.toHaveProperty('status');
    expect(data.sourceRefs).toEqual([
      'slide_texts/Ch07_Static_Modeling.txt#slide-11',
      'slide_texts/Ch07_Static_Modeling.txt#slide-13',
      'slide_texts/Ch07_Static_Modeling.txt#slide-14',
      'content/lessons/L04-03.json',
    ]);
    expect(data.target.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({ fromKey: 'Customer', toKey: 'Order', type: 'association', multiplicity: { from: '1', to: '0..*' } }),
      expect.objectContaining({ fromKey: 'Order', toKey: 'Product', type: 'association', multiplicity: { from: '0..*', to: '1..*' }, associationClassKey: 'OrderLine' }),
      expect.objectContaining({ fromKey: 'Customer', toKey: 'ShippingAddress', type: 'composition', multiplicity: { from: '1', to: '0..1' } }),
    ]));
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
