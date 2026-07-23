import { Link, useNavigate } from 'react-router-dom';
import { termBankMap } from './ReviewPage';

const TOPICS = [
  { id: 'tb-01', icon: '🧩', color: 'from-sky-500 to-cyan-600' },
  { id: 'tb-02', icon: '🔁', color: 'from-emerald-500 to-teal-600' },
  { id: 'tb-03', icon: '🧱', color: 'from-violet-500 to-purple-600' },
  { id: 'tb-04', icon: '🚪', color: 'from-amber-500 to-orange-600' },
  { id: 'tb-05', icon: '🔄', color: 'from-blue-500 to-indigo-600' },
  { id: 'tb-06', icon: '⚙️', color: 'from-pink-500 to-rose-600' },
  { id: 'tb-07', icon: '🏛️', color: 'from-indigo-500 to-blue-700' },
  { id: 'tb-08', icon: '🧬', color: 'from-lime-500 to-green-600' },
  { id: 'tb-09', icon: '🗄️', color: 'from-gray-600 to-gray-700' },
  { id: 'tb-10', icon: '⏱️', color: 'from-red-500 to-orange-700' },
  { id: 'tb-11', icon: '📏', color: 'from-teal-500 to-cyan-700' },
];

export default function TermBankLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0c0d0e] pb-16">
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              ← Trang chủ
            </button>
            <h1 className="text-sm font-bold text-gray-200">📚 Ngân Hàng Thuật Ngữ OOAD</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/10 to-cyan-950/10 border border-sky-900/20 text-center space-y-2">
          <h2 className="text-lg font-bold text-sky-200">198 câu trắc nghiệm định nghĩa OOAD</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Convert từ bộ flashcard textbook <em>Object Oriented Systems Development</em> (Bahrami) — dùng để ôn thuật ngữ nền tảng,
            không thay thế Level Review theo case study FOS. Không cộng XP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOPICS.map((topic) => {
            const data = termBankMap[topic.id];
            const questionCount = data?.questions?.length ?? 0;

            return (
              <Link
                key={topic.id}
                to={`/term-bank/${topic.id}`}
                className="block rounded-3xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group"
              >
                <div className="p-6 flex flex-col justify-between h-full gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-xl shadow-inner`}>
                        {topic.icon}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {questionCount} câu
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-md text-gray-200 group-hover:text-white transition-colors">
                        {data?.title ?? topic.id}
                      </h3>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <span className="text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Bắt đầu luyện tập ➔
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
