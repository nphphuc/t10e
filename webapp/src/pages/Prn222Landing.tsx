import SubjectPage, { countOf } from '../ui/SubjectPage';
import type { IconName } from '../ui/Icon';
import { prn222Map } from './ReviewPage';

const TOPICS: { id: string; icon: IconName }[] = [
  { id: 'topic-di', icon: 'plug' },
  { id: 'topic-blazor', icon: 'bolt' },
  { id: 'topic-signalr', icon: 'signal' },
  { id: 'topic-net', icon: 'globe' },
  { id: 'topic-mvc', icon: 'folders' },
  { id: 'topic-worker', icon: 'gear' },
  { id: 'topic-async', icon: 'refresh' },
];

export default function Prn222Landing() {
  return (
    <SubjectPage
      code="PRN222"
      name=".NET Web — Blazor, DI, SignalR"
      icon="braces"
      intro="Hai đề thi thật giữ nguyên thứ tự và đáp án gốc. Câu có code C# hiện dạng code block riêng."
      sections={[
        {
          title: 'Đề thi thật',
          decks: [
            { to: '/prn222/mix', title: 'Đề trộn', desc: '25 câu ngẫu nhiên từ mỗi đề, trộn thứ tự. Mỗi lần làm lại là một đề mới.', count: 50, icon: 'shuffle', featured: true },
            { to: '/prn222/de1', title: 'Đề 1 — FE SP26', count: countOf(prn222Map['de1']), icon: 'exam' },
            { to: '/prn222/de2', title: 'Đề 2 — FE Bl3w Fall25', count: countOf(prn222Map['de2']), icon: 'exam' },
          ],
        },
        {
          title: 'Ôn theo chủ đề',
          note: 'Gộp cả 2 đề rồi chia theo mảng kiến thức.',
          decks: TOPICS.map((t) => {
            const data = prn222Map[t.id];
            return {
              to: `/prn222/${t.id}`,
              title: (data?.title ?? t.id).replace(/^PRN222 — /, ''),
              count: countOf(data),
              icon: t.icon,
            };
          }),
        },
      ]}
    />
  );
}
