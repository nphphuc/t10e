import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ClassDiagramBuilderScreen from '../builder/ClassDiagramBuilderScreen';
import { useBuilderProgressStore, type BuilderMode } from '../store/builderProgress';
import guidedLessonData from '../content/builder/cdb-fos-guided.json';
import peLessonData from '../content/builder/cdb-fos-pe.json';
import type { BuilderLesson } from '../builder/engine/types';

const guidedLesson = guidedLessonData as BuilderLesson;
const peLesson = peLessonData as BuilderLesson;

export default function ClassDiagramBuilderPage() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<BuilderMode | null>(null);
  const guidedProgress = useBuilderProgressStore((s) => s.guided);
  const peProgress = useBuilderProgressStore((s) => s.pe);
  const saveProgress = useBuilderProgressStore((s) => s.saveProgress);
  const resetProgress = useBuilderProgressStore((s) => s.resetProgress);

  if (activeMode) {
    const lesson = activeMode === 'guided' ? guidedLesson : peLesson;
    const progress = activeMode === 'guided' ? guidedProgress : peProgress;
    return (
      <div className="min-h-screen bg-[#0c0d0e] pb-16">
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <button onClick={() => setActiveMode(null)} className="text-gray-400 hover:text-gray-200 transition-colors">
              ← Chọn lại
            </button>
            <h1 className="text-sm font-bold text-gray-200">Class Diagram Builder — {activeMode === 'guided' ? 'Guided' : 'PE Mode'}</h1>
          </div>
        </header>
        <ClassDiagramBuilderScreen
          lesson={lesson}
          initialDiagram={progress?.diagram}
          initialStepIndex={progress?.stepIndex ?? 0}
          onProgress={(diagram, stepIndex) => saveProgress(activeMode, diagram, stepIndex)}
          onComplete={() => {
            resetProgress(activeMode);
            setActiveMode(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0d0e] pb-16">
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/pe-review')} className="text-gray-400 hover:text-gray-200 transition-colors">
              ← Ôn Thi PE
            </button>
            <h1 className="text-sm font-bold text-gray-200">📊 Class Diagram Builder</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/10 to-teal-950/10 border border-emerald-900/20 text-center space-y-2">
          <h2 className="text-lg font-bold text-emerald-200">Tự dựng, không chọn đáp án</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Kéo-thả class/attribute, nối quan hệ, chọn multiplicity — máy chấm theo cấu trúc đồ thị,
            không theo tọa độ. Chọn Guided nếu muốn hướng dẫn từng bước, hoặc PE mode để tự làm trọn bài rồi xem điểm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setActiveMode('guided')}
            className="text-left block rounded-3xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group p-6 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl shadow-inner">
                  🧭
                </span>
                {guidedProgress && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Có nháp đang làm
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-md text-gray-200 group-hover:text-white transition-colors">Guided (hướng dẫn từng bước)</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  7 bước có phản hồi tại chỗ: tìm class, đặt attribute, nối quan hệ, chọn multiplicity, chọn loại quan hệ, association class, rồi đối chiếu.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              {guidedProgress ? 'Tiếp tục' : 'Bắt đầu'} ➔
            </span>
          </button>

          <button
            onClick={() => setActiveMode('pe')}
            className="text-left block rounded-3xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group p-6 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl shadow-inner">
                  🎯
                </span>
                {peProgress && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Có nháp đang làm
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-md text-gray-200 group-hover:text-white transition-colors">PE Mode (tự do)</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Tự dựng toàn bộ diagram từ mô tả nghiệp vụ, sau đó xem điểm rubric + đối chiếu bản tham chiếu.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              {peProgress ? 'Tiếp tục' : 'Bắt đầu'} ➔
            </span>
          </button>
        </div>

        <div className="text-center">
          <Link to="/pe-review/class-diagram/quiz" className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2">
            Ôn nhanh trắc nghiệm (5 câu) thay vì dựng diagram
          </Link>
        </div>
      </main>
    </div>
  );
}
