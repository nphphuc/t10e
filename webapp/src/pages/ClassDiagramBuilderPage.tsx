import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import ClassDiagramBuilderScreen from '../builder/ClassDiagramBuilderScreen';
import type { BuilderLesson } from '../builder/engine/types';
import { useBuilderProgress } from '../store/builderProgress';
import guidedData from '../content/builder/cdb-fos-guided.json';
import peData from '../content/builder/cdb-fos-pe.json';
import '../builder/builder.css';

const lessons: Record<string, BuilderLesson> = {
  guided: guidedData as unknown as BuilderLesson,
  pe: peData as unknown as BuilderLesson,
};

export default function ClassDiagramBuilderPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = params.get('mode');
  const lesson = mode ? lessons[mode] : undefined;
  const progress = useBuilderProgress((state) => state.lessons);
  if (lesson) return <ClassDiagramBuilderScreen lesson={lesson} onExit={() => setParams({})} />;

  return (
    <main className="cdb-hub">
      <header><button type="button" onClick={() => navigate('/pe-review')}>← PE Review</button><Link to="/pe-review/class-diagram/quiz">Ôn nhanh trắc nghiệm →</Link></header>
      <section className="cdb-hub-hero">
        <div><span>CLASS DIAGRAM BUILDER</span><h1>Dựng cấu trúc.<br /><em>Không đoán đáp án.</em></h1><p>Biến brief FOS thành class diagram bằng thao tác trực tiếp. Phản hồi dựa trên cấu trúc graph, không dựa vào vị trí pixel.</p></div>
        <div className="cdb-hero-diagram" aria-hidden="true"><i>Customer</i><b>places</b><i>Order</i><span>1</span><span>0..*</span><strong>OrderLine<small>quantity · priceAtPurchase</small></strong></div>
      </section>
      <section className="cdb-mode-grid">
        <button type="button" onClick={() => setParams({ mode: 'guided' })}><span>01 · Guided</span><strong>Học qua 7 quyết định thiết kế</strong><p>Palette có bẫy, feedback tại chỗ, thí nghiệm multiplicity và vòng đời.</p><em>{progress['cdb-fos-guided'] ? `Tiếp tục bước ${progress['cdb-fos-guided'].stepIndex + 1}` : 'Bắt đầu guided'} →</em></button>
        <button type="button" onClick={() => setParams({ mode: 'pe' })}><span>02 · PE Mode</span><strong>Tự dựng từ brief trống</strong><p>Không palette gợi ý. Nhận rubric 100 điểm, diff và bản tham chiếu.</p><em>{progress['cdb-fos-pe'] ? `Tiếp tục bài PE` : 'Vào PE free build'} →</em></button>
      </section>
      <p className="cdb-content-note">Nội dung FOS hiện là draft theo Ch07 + L04 và đang chờ owner duyệt vì source `CLASS-DIAGRAM-BUILDER-brief.md` không có trên nhánh main.</p>
    </main>
  );
}
