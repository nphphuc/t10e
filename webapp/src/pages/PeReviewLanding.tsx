import { Link, useNavigate } from 'react-router-dom';

// Importing JSON sets to get metadata/length dynamically
import classData from '../content/pe-review/pe-class-diagram.json';
import sequenceData from '../content/pe-review/pe-sequence.json';
import stateData from '../content/pe-review/pe-state.json';
import activityData from '../content/pe-review/pe-activity.json';
import dbData from '../content/pe-review/pe-conceptual-db.json';

const TOPICS = [
  {
    id: 'class-diagram',
    title: 'Class Diagram',
    desc: 'Tự dựng class diagram bằng kéo-thả — Guided từng bước hoặc PE mode tự do, chấm theo cấu trúc.',
    icon: '📊',
    color: 'from-emerald-500 to-teal-600',
    data: classData,
    isBuilder: true,
  },
  {
    id: 'sequence',
    title: 'Sequence Diagram',
    desc: 'Luyện tập về luồng thông điệp (lifeline, messages) và hiện thực hóa use case.',
    icon: '🔄',
    color: 'from-blue-500 to-indigo-600',
    data: sequenceData,
  },
  {
    id: 'state',
    title: 'Statechart Diagram',
    desc: 'Luyện tập về State, Event, Guard, Action và biểu diễn máy trạng thái.',
    icon: '⚙️',
    color: 'from-amber-500 to-orange-600',
    data: stateData,
  },
  {
    id: 'activity',
    title: 'Activity Diagram',
    desc: 'Luyện tập về quy trình nghiệp vụ (control flow, fork/join và partition).',
    icon: '🗺️',
    color: 'from-gray-600 to-gray-700',
    data: activityData,
  },
  {
    id: 'conceptual-db',
    title: 'Conceptual Database',
    desc: 'Luyện tập ánh xạ từ Entity Class Diagram sang cơ sở dữ liệu quan hệ (schema mapping).',
    icon: '🗄️',
    color: 'from-gray-600 to-gray-700',
    data: dbData,
  },
];

export default function PeReviewLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0c0d0e] pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              ← Trang chủ
            </button>
            <h1 className="text-sm font-bold text-gray-200">🚀 Ôn Thi PE (Practical Exam)</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/10 to-indigo-950/10 border border-blue-900/20 text-center space-y-2">
          <h2 className="text-lg font-bold text-blue-200">Luyện thi cấu trúc thiết kế kiến trúc</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Các bộ câu hỏi tổng hợp bám sát cấu trúc bài thi thực hành (PE) của môn học. 
            Trả lời đúng tối thiểu <strong className="text-gray-300">75%</strong> của từng chủ đề để tự tin vượt qua kỳ thi thực tế!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOPICS.map((topic) => {
            const questionCount = topic.data.questions.length;
            const isAvailable = topic.isBuilder ? true : questionCount > 0;

            const cardContent = (
              <div className="p-6 flex flex-col justify-between h-full gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-xl shadow-inner`}>
                      {topic.icon}
                    </span>
                    {topic.isBuilder ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        🎨 Kéo-thả
                      </span>
                    ) : isAvailable ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {questionCount} Câu hỏi
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        Đang cập nhật
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-md text-gray-200 group-hover:text-white transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {topic.desc}
                    </p>
                  </div>
                </div>

                {isAvailable && (
                  <div className="pt-2 flex justify-end">
                    <span className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Bắt đầu luyện tập ➔
                    </span>
                  </div>
                )}
              </div>
            );

            if (isAvailable) {
              return (
                <Link
                  key={topic.id}
                  to={`/pe-review/${topic.id}`}
                  className="block rounded-3xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={topic.id}
                className="rounded-3xl border border-gray-900 bg-gray-950/20 opacity-40 select-none cursor-not-allowed"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
