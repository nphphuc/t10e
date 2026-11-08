import SubjectPage, { countOf } from '../ui/SubjectPage';
import { mln122Map } from './ReviewPage';

const PART_IDS = ['part-01', 'part-02', 'part-03', 'part-04', 'part-05', 'part-06', 'part-07', 'part-08', 'part-09', 'part-10'];

export default function Mln122Landing() {
  const total = countOf(mln122Map['full']) + countOf(mln122Map['extra']);
  return (
    <SubjectPage
      code="MLN122"
      name="Kinh tế chính trị Mác-Lênin"
      icon="coins"
      intro={`Ngân hàng ${total} câu lọc từ file "MLN _ FINAL", giữ đáp án gốc. Câu có đáp án không thống nhất giữa các bản sao hoặc phải tra giáo trình đều được ghi chú trong phần giải thích.`}
      sections={[
        {
          title: 'Luyện tổng hợp',
          decks: [
            { to: '/mln122/mix', title: 'Đề trộn', desc: '60 câu ngẫu nhiên từ toàn bộ ngân hàng. Mỗi lần làm lại là một đề mới.', count: 60, icon: 'shuffle', featured: true },
            { to: '/mln122/full', title: 'Làm toàn bộ', desc: 'Theo thứ tự gốc trong file.', count: countOf(mln122Map['full']), icon: 'stack' },
            { to: '/mln122/extra', title: 'Câu kinh tế chính trị lẫn trong bộ MLN111', desc: 'Những câu không có trong bộ chính.', count: countOf(mln122Map['extra']), icon: 'plusSquare' },
          ],
        },
        {
          title: 'Ôn theo chương',
          note: 'Xếp theo 6 chương của giáo trình Kinh tế chính trị Mác-Lênin.',
          decks: [1, 2, 3, 4, 5, 6].map((n) => {
            const data = mln122Map[`chapter-${n}`];
            return {
              to: `/mln122/chapter-${n}`,
              title: (data?.title ?? `Chương ${n}`).replace(/^MLN122 — Chương \d+ — /, ''),
              count: countOf(data),
              order: n,
            };
          }),
        },
        {
          title: 'Ôn theo phần',
          note: 'Cắt ngân hàng thành từng phần khoảng 50 câu theo thứ tự gốc.',
          decks: PART_IDS.filter((id) => mln122Map[id]).map((id, i) => ({
            to: `/mln122/${id}`,
            title: (mln122Map[id]?.title ?? id).replace(/^MLN122 — /, ''),
            count: countOf(mln122Map[id]),
            order: i + 1,
          })),
        },
      ]}
    />
  );
}
