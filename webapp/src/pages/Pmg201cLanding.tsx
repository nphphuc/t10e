import SubjectPage, { countOf } from '../ui/SubjectPage';
import type { IconName } from '../ui/Icon';
import { pmg201cMap } from './ReviewPage';

const TOPICS: { id: string; icon: IconName }[] = [
  { id: 'topic-overview', icon: 'compass' },
  { id: 'topic-scope-schedule', icon: 'calendar' },
  { id: 'topic-cost', icon: 'coins' },
  { id: 'topic-evm', icon: 'chart' },
  { id: 'topic-quality', icon: 'check' },
  { id: 'topic-hr', icon: 'users' },
  { id: 'topic-communication', icon: 'message' },
  { id: 'topic-risk', icon: 'alert' },
  { id: 'topic-stakeholder', icon: 'network' },
];

export default function Pmg201cLanding() {
  return (
    <SubjectPage
      code="PMG201c"
      name="Project Management"
      icon="kanban"
      intro="Ba đề thi thật (FA25, SP26 FE, SP26 RE), giữ nguyên thứ tự và đáp án gốc."
      sections={[
        {
          title: 'Đề thi thật',
          decks: [
            { to: '/pmg201c/mix', title: 'Đề trộn', desc: 'Khoảng 17 câu ngẫu nhiên từ mỗi đề, trộn thứ tự. Mỗi lần làm lại là một đề mới.', count: 50, icon: 'shuffle', featured: true },
            { to: '/pmg201c/d1', title: 'Đề 1 — FA25', count: countOf(pmg201cMap['d1']), icon: 'exam' },
            { to: '/pmg201c/d2', title: 'Đề 2 — SP26 FE', count: countOf(pmg201cMap['d2']), icon: 'exam' },
            { to: '/pmg201c/d3', title: 'Đề 3 — SP26 RE', count: countOf(pmg201cMap['d3']), icon: 'exam' },
          ],
        },
        {
          title: 'Ôn theo chủ đề',
          note: 'Gộp cả 3 đề, loại câu trùng, chia theo mảng kiến thức quản lý dự án.',
          decks: TOPICS.map((t) => {
            const data = pmg201cMap[t.id];
            return {
              to: `/pmg201c/${t.id}`,
              title: (data?.title ?? t.id).replace(/^PMG201c — /, ''),
              count: countOf(data),
              icon: t.icon,
            };
          }),
        },
      ]}
    />
  );
}
