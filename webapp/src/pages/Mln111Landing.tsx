import SubjectPage, { countOf } from '../ui/SubjectPage';
import { mln111Map } from './ReviewPage';

export default function Mln111Landing() {
  return (
    <SubjectPage
      code="MLN111"
      name="Triết học Mác-Lênin"
      icon="compass"
      intro="Ba đề thi thật (RE, C1, C2) giữ nguyên thứ tự và đáp án gốc, kèm bộ 100 câu trọng tâm chương 1 và 2."
      sections={[
        {
          title: 'Đề thi thật',
          decks: [
            { to: '/mln111/mix', title: 'Đề trộn', desc: '20 câu ngẫu nhiên từ mỗi đề RE, C1, C2, trộn thứ tự. Mỗi lần làm lại là một đề mới.', count: 60, icon: 'shuffle', featured: true },
            { to: '/mln111/re', title: 'Đề RE', count: countOf(mln111Map['re']), icon: 'exam' },
            { to: '/mln111/c1', title: 'Đề C1', count: countOf(mln111Map['c1']), icon: 'exam' },
            { to: '/mln111/c2', title: 'Đề C2', count: countOf(mln111Map['c2']), icon: 'exam' },
          ],
        },
        {
          title: '100 câu trọng tâm',
          note: 'Bộ tài liệu riêng bám cấu trúc đề thi chương 1 và 2, có giải thích chi tiết.',
          decks: [
            { to: '/mln111/100-full', title: 'Làm cả 100 câu', desc: 'Phần 1 rồi đến Phần 2, theo thứ tự gốc.', count: countOf(mln111Map['100-full']), icon: 'stack' },
            { to: '/mln111/100-part1', title: 'Phần 1 — Triết học và vai trò', count: countOf(mln111Map['100-part1']), order: 1 },
            { to: '/mln111/100-part2', title: 'Phần 2 — Chủ nghĩa duy vật biện chứng', count: countOf(mln111Map['100-part2']), order: 2 },
          ],
        },
        {
          title: 'Ôn theo chương',
          note: 'Gộp cả 3 đề, loại câu trùng, chia theo 3 chương.',
          decks: [1, 2, 3].map((n) => {
            const data = mln111Map[`chapter-${n}`];
            return {
              to: `/mln111/chapter-${n}`,
              title: (data?.title ?? `Chương ${n}`).replace(/^MLN111 — Chương \d+ — /, ''),
              count: countOf(data),
              order: n,
            };
          }),
        },
      ]}
    />
  );
}
