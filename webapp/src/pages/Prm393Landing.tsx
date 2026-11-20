import SubjectPage, { countOf } from '../ui/SubjectPage';
import { prm393Map } from './ReviewPage';

export default function Prm393Landing() {
  return (
    <SubjectPage
      code="PRM393"
      name="Mobile — Flutter & Dart"
      icon="phone"
      intro="Đề FE giữ nguyên thứ tự câu như đề gốc. Đề không có bảng đáp án nên đáp án được giải theo kiến thức môn; mỗi câu đều có giải thích."
      sections={[
        {
          title: 'Đề thi thật',
          decks: [
            { to: '/prm393/mix', title: 'Đề trộn', desc: 'Toàn bộ câu của đề FE, đảo thứ tự câu. Mỗi lần làm lại là một thứ tự mới.', count: countOf(prm393Map['fe']), icon: 'shuffle', featured: true },
            { to: '/prm393/fe', title: 'Đề FE', count: countOf(prm393Map['fe']), icon: 'exam' },
          ],
        },
      ]}
    />
  );
}
