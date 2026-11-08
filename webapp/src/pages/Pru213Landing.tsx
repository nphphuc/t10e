import SubjectPage, { countOf } from '../ui/SubjectPage';
import type { IconName } from '../ui/Icon';
import { pru213Map } from './ReviewPage';

const B2_TOPICS: { id: string; icon: IconName }[] = [
  { id: 'b2-editor', icon: 'window' },
  { id: 'b2-gameobject', icon: 'cube' },
  { id: 'b2-physics', icon: 'orbit' },
  { id: 'b2-animation', icon: 'film' },
  { id: 'b2-ui', icon: 'layout' },
  { id: 'b2-input', icon: 'pointer' },
  { id: 'b2-data', icon: 'database' },
];

const lowCount = (data: any) => (data?.questions ?? []).filter((q: any) => q.lowConfidence).length;

export default function Pru213Landing() {
  const quiz = pru213Map['quiz'];
  const comprehensive = pru213Map['b2-comprehensive'];

  return (
    <SubjectPage
      code="PRU213"
      name="Unity & C#"
      icon="gamepad"
      intro="Hai bộ câu hỏi ôn thi. File gốc gần như không có đáp án mẫu nên đáp án được xác định theo kiến thức Unity/C# chuẩn; câu nào chưa chắc sẽ được ghi chú để bạn đối chiếu slide."
      sections={[
        {
          title: 'Bộ 1 — quiz ôn tập',
          note: `${lowCount(quiz)} câu được ghi chú cần đối chiếu lại.`,
          decks: [
            {
              to: '/pru213/quiz',
              title: 'Quiz Unity & C#',
              desc: 'Trả lời xong hiện đúng/sai và giải thích ngay.',
              count: countOf(quiz),
              icon: 'exam',
            },
          ],
        },
        {
          title: 'Bộ 2 — câu hỏi từ thầy',
          note: `Đã gộp câu trùng, câu tự luận chuyển thành trắc nghiệm. ${lowCount(comprehensive)} câu được ghi chú cần đối chiếu lại.`,
          decks: [
            {
              to: '/pru213/b2-comprehensive',
              title: 'Làm cả bộ',
              desc: 'Toàn bộ câu hỏi Bộ 2, theo thứ tự chủ đề.',
              count: countOf(comprehensive),
              icon: 'stack',
              featured: true,
            },
            ...B2_TOPICS.map((t) => {
              const data = pru213Map[t.id];
              return {
                to: `/pru213/${t.id}`,
                title: (data?.title ?? t.id).replace(/^PRU213 \(Bộ 2\) — /, ''),
                count: countOf(data),
                icon: t.icon,
              };
            }),
          ],
        },
      ]}
    />
  );
}
