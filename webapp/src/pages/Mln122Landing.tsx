import { Link, useNavigate } from 'react-router-dom';
import { mln122Map } from './ReviewPage';

const CHAPTERS = [
  { id: 'chapter-1', icon: '🧭', color: 'from-sky-500 to-cyan-600' },
  { id: 'chapter-2', icon: '🛒', color: 'from-violet-500 to-purple-600' },
  { id: 'chapter-3', icon: '💵', color: 'from-amber-500 to-orange-600' },
  { id: 'chapter-4', icon: '🏭', color: 'from-rose-500 to-red-600' },
  { id: 'chapter-5', icon: '🇻🇳', color: 'from-emerald-500 to-green-600' },
  { id: 'chapter-6', icon: '🚀', color: 'from-indigo-500 to-blue-600' },
];

const PART_IDS = ['part-01', 'part-02', 'part-03', 'part-04', 'part-05', 'part-06', 'part-07', 'part-08', 'part-09', 'part-10'];

export default function Mln122Landing() {
  const navigate = useNavigate();
  const full = mln122Map['full'];
  const extra = mln122Map['extra'];
  const total = (full?.questions?.length ?? 0) + (extra?.questions?.length ?? 0);

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
            <h1 className="text-sm font-bold text-gray-200">💰 MLN122 — Kinh Tế Chính Trị Mác-Lênin</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-10">
        {/* Toàn bộ + đề trộn */}
        <section className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/10 to-teal-950/10 border border-emerald-900/20 text-center space-y-2">
            <h2 className="text-lg font-bold text-emerald-200">Ngân Hàng {total} Câu</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Lọc và gộp trùng từ file "MLN _ FINAL", giữ nguyên thứ tự và đáp án gốc. Câu có đáp án không thống nhất giữa các bản sao được đánh dấu ⚠️ trong phần giải thích.
            </p>
          </div>

          <Link
            to="/mln122/mix"
            className="block rounded-3xl border border-amber-700/40 bg-gradient-to-r from-amber-950/20 to-orange-950/10 hover:border-amber-600/60 transition-all duration-200 hover:scale-[1.005] group p-6"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-amber-300">🎯 Đề Trộn — 60 câu</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                  60 câu random từ toàn bộ ngân hàng, trộn thứ tự xuất hiện. Mỗi lần vào/làm lại là một đề mới.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                Vào làm đề ➔
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/mln122/full"
              className="block rounded-2xl border border-emerald-700/40 bg-gradient-to-r from-emerald-950/20 to-teal-950/10 hover:border-emerald-600/60 transition-all duration-200 hover:scale-[1.01] group p-5"
            >
              <h3 className="font-extrabold text-md text-emerald-300">📚 Làm Toàn Bộ</h3>
              <p className="text-xs text-gray-400 mt-1">{full?.questions?.length ?? 0} câu theo thứ tự gốc</p>
            </Link>
            <Link
              to="/mln122/extra"
              className="block rounded-2xl border border-emerald-700/40 bg-gradient-to-r from-emerald-950/20 to-teal-950/10 hover:border-emerald-600/60 transition-all duration-200 hover:scale-[1.01] group p-5"
            >
              <h3 className="font-extrabold text-md text-emerald-300">🧩 Câu KTCT Lẫn Trong Bộ MLN111</h3>
              <p className="text-xs text-gray-400 mt-1">{extra?.questions?.length ?? 0} câu không có trong bộ chính</p>
            </Link>
          </div>
        </section>

        {/* Chia theo 6 chương giáo trình */}
        <section className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/10 to-indigo-950/10 border border-sky-900/20 text-center space-y-2">
            <h2 className="text-lg font-bold text-sky-200">Ôn Theo Chương</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Toàn bộ câu hỏi xếp theo 6 chương của giáo trình Kinh tế chính trị Mác-Lênin.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {CHAPTERS.map((ch) => {
              const data = mln122Map[ch.id];
              const count = data?.questions?.length ?? 0;
              return (
                <Link
                  key={ch.id}
                  to={`/mln122/${ch.id}`}
                  className="block rounded-2xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-lg shrink-0 shadow-inner`}>
                        {ch.icon}
                      </span>
                      <h3 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">
                        {data?.title?.replace('MLN122 — ', '') ?? ch.id}
                      </h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                      {count} câu
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Chia 10 phần */}
        <section className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/10 to-cyan-950/10 border border-teal-900/20 text-center space-y-2">
            <h2 className="text-lg font-bold text-teal-200">Ôn Theo Phần</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Chia ngân hàng thành các phần ~50 câu theo thứ tự gốc để ôn dần.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PART_IDS.map((id, i) => {
              const data = mln122Map[id];
              if (!data) return null;
              const count = data.questions?.length ?? 0;
              return (
                <Link
                  key={id}
                  to={`/mln122/${id}`}
                  className="block rounded-2xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-extrabold text-white shrink-0 shadow-inner">
                        {i + 1}
                      </span>
                      <h3 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">
                        {data.title?.replace('MLN122 — ', '') ?? id}
                      </h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
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
