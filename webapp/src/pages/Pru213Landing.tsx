import { Link, useNavigate } from 'react-router-dom';
import { pru213Map } from './ReviewPage';

export default function Pru213Landing() {
  const navigate = useNavigate();
  const quiz = pru213Map['quiz'];
  const questionCount = quiz?.questions?.length ?? 0;
  const lowConfidenceCount = (quiz?.questions ?? []).filter((q: any) => q.lowConfidence).length;

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

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/10 to-teal-950/10 border border-emerald-900/20 text-center space-y-2">
          <h2 className="text-lg font-bold text-emerald-200">Quiz Ôn Tập PRU213 (Unity &amp; C#)</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Convert từ bộ câu hỏi ôn thi bạn cung cấp. File gốc không kèm đáp án — đáp án do hệ thống tự xác định
            theo kiến thức Unity/C# chuẩn, {lowConfidenceCount} câu được đánh dấu ⚠️ cần bạn đối chiếu lại với slide/giáo trình.
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
      </main>
    </div>
  );
}
