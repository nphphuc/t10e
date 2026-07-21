import type { ActivityDiagramState, ActivityLesson } from '../types';
import { buildReferenceDiagram } from '../reference';

// Independent fixture domain (Library Book Return) — never copied from the real
// FOS lesson content, per the "hand-written fixtures" rule.
export const lesson: ActivityLesson = {
  id: 'test-library-return',
  mode: 'guided',
  title: 'Library Book Return (test fixture)',
  brief: ['Trả sách và cập nhật kho.'],
  palette: [],
  steps: ['place-actions', 'main-sequence', 'decisions-guards', 'fork-join', 'compare'],
  target: {
    actions: [
      { key: 'return_book', name: { canonical: 'Trả sách', accepted: [] }, requirement: 'required' },
      { key: 'inspect_condition', name: { canonical: 'Kiểm tra tình trạng', accepted: [] }, requirement: 'required' },
      { key: 'charge_fee', name: { canonical: 'Thu phí hư hỏng', accepted: [] }, requirement: 'required' },
      { key: 'waive_fee', name: { canonical: 'Miễn phí', accepted: [] }, requirement: 'required' },
      { key: 'update_catalog', name: { canonical: 'Cập nhật kho', accepted: [] }, requirement: 'required' },
      { key: 'send_receipt_email', name: { canonical: 'Gửi email xác nhận', accepted: [] }, requirement: 'required' },
      { key: 'restock_shelf', name: { canonical: 'Xếp lại kệ sách', accepted: [] }, requirement: 'required' },
      { key: 'close_session', name: { canonical: 'Đóng phiên trả sách', accepted: [] }, requirement: 'required' },
      {
        key: 'invoice_noun_trap',
        name: { canonical: 'Hóa đơn', accepted: [] },
        requirement: 'forbidden',
        forbiddenTag: 'noun-not-verb',
        forbiddenReason: 'Danh từ tĩnh, không phải hành động.',
      },
    ],
    mainSequence: ['return_book', 'inspect_condition', 'update_catalog', 'close_session'],
    branches: [
      {
        decisionAfter: 'inspect_condition',
        guards: [
          { guard: { canonical: 'Hư hỏng', accepted: ['hong', 'damaged'] }, sequence: ['charge_fee'], rejoinAt: 'update_catalog' },
          { guard: { canonical: 'Không hư hỏng', accepted: ['khong hu hong', 'ok'] }, sequence: ['waive_fee'], rejoinAt: 'update_catalog' },
        ],
      },
    ],
    concurrent: {
      forkAfter: 'update_catalog',
      join: 'close_session',
      lanes: [['send_receipt_email'], ['restock_shelf']],
    },
  },
  passThreshold: 75,
  sourceRefs: ['test-fixture'],
};

export function emptyDiagram(): ActivityDiagramState {
  return { nodes: [], edges: [] };
}

export function perfectDiagram(): ActivityDiagramState {
  return buildReferenceDiagram(lesson);
}
