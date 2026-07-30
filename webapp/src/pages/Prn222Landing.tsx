import { Link, useNavigate } from 'react-router-dom';
import { prn222Map } from './ReviewPage';

const TOPICS = [
  { id: 'topic-di', icon: '🧩', color: 'from-sky-500 to-cyan-600' },
  { id: 'topic-blazor', icon: '⚡', color: 'from-violet-500 to-purple-600' },
  { id: 'topic-signalr', icon: '📡', color: 'from-amber-500 to-orange-600' },
  { id: 'topic-net', icon: '🌐', color: 'from-pink-500 to-rose-600' },
  { id: 'topic-mvc', icon: '🗂️', color: 'from-blue-500 to-indigo-600' },
  { id: 'topic-worker', icon: '⚙️', color: 'from-lime-500 to-green-600' },
  { id: 'topic-async', icon: '🔄', color: 'from-gray-600 to-gray-700' },
];

export default function Prn222Landing() {
  const navigate = useNavigate();
  const de1 = prn222Map['de1'];
  const de2 = prn222Map['de2'];

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
            <h1 className="text-sm font-bold text-gray-200">🖥️ PRN222 — .NET Web (Blazor, DI, SignalR...)</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-10">
        {/* 2 đề gốc */}
        <section className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/10 to-cyan-950/10 border border-teal-900/20 text-center space-y-2">
            <h2 className="text-lg font-bold text-teal-200">2 Đề Thi Thật</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Giữ nguyên thứ tự và đáp án gốc từ 2 đề bạn thu thập được. Câu có code C# sẽ hiện dạng code block riêng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/prn222/de1"
              className="block rounded-2xl border border-teal-700/40 bg-gradient-to-r from-teal-950/20 to-cyan-950/10 hover:border-teal-600/60 transition-all duration-200 hover:scale-[1.01] group p-5"
            >
              <h3 className="font-extrabold text-md text-teal-300">📄 Đề 1 (FE SP26)</h3>
              <p className="text-xs text-gray-400 mt-1">{de1?.questions?.length ?? 0} câu</p>
            </Link>
            <Link
              to="/prn222/de2"
              className="block rounded-2xl border border-teal-700/40 bg-gradient-to-r from-teal-950/20 to-cyan-950/10 hover:border-teal-600/60 transition-all duration-200 hover:scale-[1.01] group p-5"
            >
              <h3 className="font-extrabold text-md text-teal-300">📄 Đề 2 (FE Bl3w Fall25)</h3>
              <p className="text-xs text-gray-400 mt-1">{de2?.questions?.length ?? 0} câu</p>
            </Link>
          </div>

          <Link
            to="/prn222/mix"
            className="block rounded-3xl border border-amber-700/40 bg-gradient-to-r from-amber-950/20 to-orange-950/10 hover:border-amber-600/60 transition-all duration-200 hover:scale-[1.005] group p-6"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-amber-300">🎯 Đề Trộn — 50 câu</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                  25 câu random từ Đề 1 + 25 câu random từ Đề 2, trộn thứ tự xuất hiện. Mỗi lần vào/làm lại là một đề mới.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                Vào làm đề ➔
              </span>
            </div>
          </Link>
        </section>

        {/* Chia theo chủ đề */}
        <section className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/10 to-blue-950/10 border border-indigo-900/20 text-center space-y-2">
            <h2 className="text-lg font-bold text-indigo-200">Ôn Theo Chủ Đề</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Gộp cả 2 đề (100 câu) rồi chia thành 7 mảng kiến thức để luyện từng phần.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOPICS.map((topic) => {
              const data = prn222Map[topic.id];
              const count = data?.questions?.length ?? 0;
              return (
                <Link
                  key={topic.id}
                  to={`/prn222/${topic.id}`}
                  className="block rounded-2xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-lg shrink-0 shadow-inner`}>
                        {topic.icon}
                      </span>
                      <h3 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">
                        {data?.title?.replace('PRN222 — ', '') ?? topic.id}
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
