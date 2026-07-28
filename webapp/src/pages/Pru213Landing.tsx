import { Link, useNavigate } from 'react-router-dom';
import { pru213Map } from './ReviewPage';

const B2_TOPICS = [
  { id: 'b2-editor', icon: '🛠️', color: 'from-sky-500 to-cyan-600' },
  { id: 'b2-gameobject', icon: '🧱', color: 'from-violet-500 to-purple-600' },
  { id: 'b2-physics', icon: '🪐', color: 'from-amber-500 to-orange-600' },
  { id: 'b2-animation', icon: '🎞️', color: 'from-pink-500 to-rose-600' },
  { id: 'b2-ui', icon: '🖼️', color: 'from-blue-500 to-indigo-600' },
  { id: 'b2-input', icon: '🎮', color: 'from-lime-500 to-green-600' },
  { id: 'b2-data', icon: '💾', color: 'from-gray-600 to-gray-700' },
];

export default function Pru213Landing() {
  const navigate = useNavigate();
  const quiz = pru213Map['quiz'];
  const questionCount = quiz?.questions?.length ?? 0;
  const lowConfidenceCount = (quiz?.questions ?? []).filter((q: any) => q.lowConfidence).length;

  const comprehensive = pru213Map['b2-comprehensive'];
  const b2LowCount = (comprehensive?.questions ?? []).filter((q: any) => q.lowConfidence).length;

  return (
    <div className="min-h-screen bg-[#0c0d0e] pb-16">
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              ← Trang chủ
            </button>
            <h1 className="text-sm font-bold text-gray-200">🎮 PRU213 — Unity &amp; C#</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-10">
        {/* Bộ 1 */}
        <section className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/10 to-teal-950/10 border border-emerald-900/20 text-center space-y-2">
            <h2 className="text-lg font-bold text-emerald-200">Bộ 1 — Quiz Ôn Tập PRU213</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              File gốc không kèm đáp án — đáp án do hệ thống tự xác định theo kiến thức Unity/C# chuẩn,{' '}
              {lowConfidenceCount} câu được đánh dấu ⚠️ cần bạn đối chiếu lại với slide/giáo trình.
            </p>
          </div>

          <Link
            to="/pru213/quiz"
            className="block rounded-3xl border border-emerald-700/40 bg-gradient-to-r from-emerald-950/20 to-teal-950/10 hover:border-emerald-600/60 transition-all duration-200 hover:scale-[1.005] group p-6"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-emerald-300">📘 Quiz Unity &amp; C#</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                  {questionCount} câu trắc nghiệm, có 1 câu kèm ảnh minh họa. Trả lời xong hiện đúng/sai + giải thích ngay.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                Bắt đầu làm quiz ➔
              </span>
            </div>
          </Link>
        </section>

        {/* Bộ 2 */}
        <section className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/10 to-blue-950/10 border border-indigo-900/20 text-center space-y-2">
            <h2 className="text-lg font-bold text-indigo-200">Bộ 2 — Quiz Từ Thầy Dạy (150 câu)</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Convert từ bộ câu hỏi ôn thi của thầy (đã gộp câu trùng, câu tự luận được chuyển thành trắc nghiệm),
              chia thành 7 chủ đề. File gốc gần như không có đáp án mẫu — hệ thống tự xác định, {b2LowCount} câu
              đánh dấu ⚠️ cần đối chiếu lại.
            </p>
          </div>

          {/* Quiz tổng hợp — nổi bật */}
          <Link
            to="/pru213/b2-comprehensive"
            className="block rounded-3xl border border-indigo-700/40 bg-gradient-to-r from-indigo-950/20 to-blue-950/10 hover:border-indigo-600/60 transition-all duration-200 hover:scale-[1.005] group p-6"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-indigo-300">🎯 Quiz Tổng Hợp — {comprehensive?.questions?.length ?? 0} câu</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                  Toàn bộ câu hỏi Bộ 2 gộp lại theo thứ tự chủ đề, dùng để ôn tổng thể trước khi thi.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                Vào làm quiz ➔
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {B2_TOPICS.map((topic) => {
              const data = pru213Map[topic.id];
              const count = data?.questions?.length ?? 0;
              return (
                <Link
                  key={topic.id}
                  to={`/pru213/${topic.id}`}
                  className="block rounded-2xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-lg shrink-0 shadow-inner`}>
                        {topic.icon}
                      </span>
                      <h3 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">
                        {data?.title?.replace('PRU213 (Bộ 2) — ', '') ?? topic.id}
                      </h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                      {count} câu
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
