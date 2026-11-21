import SubjectPage, { countOf } from '../ui/SubjectPage';
import { prm393Map } from './ReviewPage';

export default function Prm393Landing() {
  return (
    <SubjectPage
      code="PRM393"
      name="Mobile — Flutter & Dart"
      icon="phone"
      intro="Ba đề FE giữ nguyên thứ tự câu như đề gốc. Đề B5 theo đáp án tham khảo đi kèm; đề SU26 và RE không có đáp án nên được giải theo kiến thức môn. Mỗi câu đều có giải thích."
      sections={[
        {
          title: 'Đề thi thật',
          decks: [
            { to: '/prm393/mix', title: 'Đề trộn', desc: '50 câu ngẫu nhiên từ cả 3 đề, đã bỏ câu trùng. Mỗi lần làm lại là một bộ mới.', count: 50, icon: 'shuffle', featured: true },
            { to: '/prm393/fe', title: 'Đề SU26', count: countOf(prm393Map['fe']), icon: 'exam' },
            { to: '/prm393/re', title: 'Đề SU26 RE', count: countOf(prm393Map['re']), icon: 'exam' },
            { to: '/prm393/b5', title: 'Đề SU26 B5', count: countOf(prm393Map['b5']), icon: 'exam' },
          ],
        },
      ]}
    />
  );
}
