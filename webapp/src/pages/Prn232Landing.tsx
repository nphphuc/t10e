import SubjectPage, { countOf } from '../ui/SubjectPage';
import { prn232Map } from './ReviewPage';

export default function Prn232Landing() {
  return (
    <SubjectPage
      code="PRN232"
      name=".NET Web API — REST, gRPC, OData, WCF"
      icon="globe"
      intro="Ba đề FE giữ nguyên thứ tự câu như đề gốc. Đề SU26 theo bảng đáp án của bạn; đề SP26 không có bảng đáp án nên đáp án được giải theo kiến thức môn. Câu có code hiện dạng code block riêng, mỗi câu đều có giải thích."
      sections={[
        {
          title: 'Đề thi thật',
          decks: [
            { to: '/prn232/mix', title: 'Đề trộn', desc: '50 câu ngẫu nhiên lấy từ cả 3 đề, trộn thứ tự. Mỗi lần làm lại là một đề mới.', count: 50, icon: 'shuffle', featured: true },
            { to: '/prn232/de-a', title: 'Đề A — SU26 FE', count: countOf(prn232Map['de-a']), icon: 'exam' },
            { to: '/prn232/de-b', title: 'Đề B — SU26 B5 FE', desc: 'Có 1 câu chọn nhiều đáp án (câu 33).', count: countOf(prn232Map['de-b']), icon: 'exam' },
            { to: '/prn232/sp26', title: 'Đề SP26 FE', count: countOf(prn232Map['sp26']), icon: 'exam' },
          ],
        },
      ]}
    />
  );
}
