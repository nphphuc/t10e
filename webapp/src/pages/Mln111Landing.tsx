import { Link, useNavigate } from 'react-router-dom';
import { mln111Map } from './ReviewPage';

const CHAPTERS = [
  { id: 'chapter-1', icon: '🧭', color: 'from-sky-500 to-cyan-600' },
  { id: 'chapter-2', icon: '⚛️', color: 'from-violet-500 to-purple-600' },
  { id: 'chapter-3', icon: '🏛️', color: 'from-amber-500 to-orange-600' },
];

export default function Mln111Landing() {
  const navigate = useNavigate();
  const re = mln111Map['re'];
  const c1 = mln111Map['c1'];
  const c2 = mln111Map['c2'];

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
            <h1 className="text-sm font-bold text-gray-200">☯️ MLN111 — Triết Học Mác-Lênin</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-10">
        {/* 3 đề gốc */}
        <section className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/10 to-red-950/10 border border-rose-900/20 text-center space-y-2">
            <h2 className="text-lg font-bold text-rose-200">3 Đề Thi Thật</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Giữ nguyên thứ tự và đáp án gốc từ 3 đề bạn thu thập được (RE, C1, C2).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/mln111/re"
              className="block rounded-2xl border border-rose-700/40 bg-gradient-to-r from-rose-950/20 to-red-950/10 hover:border-rose-600/60 transition-all duration-200 hover:scale-[1.01] group p-5"
            >
              <h3 className="font-extrabold text-md text-rose-300">📄 Đề RE</h3>
              <p className="text-xs text-gray-400 mt-1">{re?.questions?.length ?? 0} câu</p>
            </Link>
            <Link
              to="/mln111/c1"
              className="block rounded-2xl border border-rose-700/40 bg-gradient-to-r from-rose-950/20 to-red-950/10 hover:border-rose-600/60 transition-all duration-200 hover:scale-[1.01] group p-5"
            >
              <h3 className="font-extrabold text-md text-rose-300">📄 Đề C1</h3>
              <p className="text-xs text-gray-400 mt-1">{c1?.questions?.length ?? 0} câu</p>
            </Link>
            <Link
              to="/mln111/c2"
              className="block rounded-2xl border border-rose-700/40 bg-gradient-to-r from-rose-950/20 to-red-950/10 hover:border-rose-600/60 transition-all duration-200 hover:scale-[1.01] group p-5"
            >
              <h3 className="font-extrabold text-md text-rose-300">📄 Đề C2</h3>
              <p className="text-xs text-gray-400 mt-1">{c2?.questions?.length ?? 0} câu</p>
            </Link>
          </div>

          <Link
            to="/mln111/mix"
            className="block rounded-3xl border border-amber-700/40 bg-gradient-to-r from-amber-950/20 to-orange-950/10 hover:border-amber-600/60 transition-all duration-200 hover:scale-[1.005] group p-6"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-amber-300">🎯 Đề Trộn — 60 câu</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                  20 câu random từ mỗi đề RE + C1 + C2, trộn thứ tự xuất hiện. Mỗi lần vào/làm lại là một đề mới.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                Vào làm đề ➔
              </span>
            </div>
          </Link>
        </section>

        {/* Chia theo 3 chương */}
        <section className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/10 to-emerald-950/10 border border-teal-900/20 text-center space-y-2">
            <h2 className="text-lg font-bold text-teal-200">Ôn Theo Chương</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Gộp cả 3 đề, loại trùng, chia thành 3 chương: Triết học & vai trò, CN Duy vật biện chứng, CN Duy vật lịch sử.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {CHAPTERS.map((ch) => {
              const data = mln111Map[ch.id];
              const count = data?.questions?.length ?? 0;
              return (
                <Link
                  key={ch.id}
                  to={`/mln111/${ch.id}`}
                  className="block rounded-2xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-lg shrink-0 shadow-inner`}>
                        {ch.icon}
                      </span>
                      <h3 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">
                        {data?.title?.replace('MLN111 — ', '') ?? ch.id}
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
