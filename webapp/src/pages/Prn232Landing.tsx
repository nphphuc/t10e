import SubjectPage, { countOf } from '../ui/SubjectPage';
import { prn232Map } from './ReviewPage';

export default function Prn232Landing() {
  return (
    <SubjectPage
      code="PRN232"
      name=".NET Web API — REST, gRPC, OData, WCF"
      icon="globe"
      intro="Hai đề FE SU26 giữ nguyên thứ tự câu, đáp án theo bảng đáp án của bạn. Câu có code hiện dạng code block riêng, mỗi câu đều có giải thích."
      sections={[
        {
          title: 'Đề thi thật',
          decks: [
            { to: '/prn232/mix', title: 'Đề trộn', desc: '25 câu ngẫu nhiên từ mỗi đề, trộn thứ tự. Mỗi lần làm lại là một đề mới.', count: 50, icon: 'shuffle', featured: true },
            { to: '/prn232/de-a', title: 'Đề A — SU26 FE', count: countOf(prn232Map['de-a']), icon: 'exam' },
            { to: '/prn232/de-b', title: 'Đề B — SU26 B5 FE', desc: 'Có 1 câu chọn nhiều đáp án (câu 33).', count: countOf(prn232Map['de-b']), icon: 'exam' },
          ],
        },
      ]}
    />
  );
}
