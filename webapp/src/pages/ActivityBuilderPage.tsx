import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityBuilderScreen from '../activity-builder/ActivityBuilderScreen';
import { useActivityProgressStore, type ActivityBuilderMode } from '../store/activityProgress';
import guidedLessonData from '../content/activity-builder/adb-fos-guided.json';
import peLessonData from '../content/activity-builder/adb-fos-pe.json';
import type { ActivityLesson } from '../activity-builder/engine/types';

const guidedLesson = guidedLessonData as unknown as ActivityLesson;
const peLesson = peLessonData as unknown as ActivityLesson;

export default function ActivityBuilderPage() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<ActivityBuilderMode | null>(null);
  const [confirmingReset, setConfirmingReset] = useState<ActivityBuilderMode | null>(null);
  const guidedProgress = useActivityProgressStore((s) => s.guided);
  const peProgress = useActivityProgressStore((s) => s.pe);
  const saveProgress = useActivityProgressStore((s) => s.saveProgress);
  const resetProgress = useActivityProgressStore((s) => s.resetProgress);

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
            <h1 className="text-sm font-bold text-gray-200">Activity Diagram Builder — {activeMode === 'guided' ? 'Guided' : 'PE Mode'}</h1>
          </div>
        </header>
        <ActivityBuilderScreen
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
            <h1 className="text-sm font-bold text-gray-200">🗺️ Activity Diagram Builder</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/10 to-teal-950/10 border border-emerald-900/20 text-center space-y-2">
          <h2 className="text-lg font-bold text-emerald-200">Tự dựng quy trình, không chọn đáp án</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Kéo-thả hành động, node quyết định, fork/join — máy chấm theo cấu trúc đồ thị (thứ tự,
            guard, reachability), không theo tọa độ. Chọn Guided nếu muốn hướng dẫn từng bước, hoặc
            PE mode để tự làm trọn bài rồi xem điểm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveMode('guided')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveMode('guided');
              }
            }}
            className="text-left block rounded-3xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group p-6 flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl shadow-inner">
                  🧭
                </span>
                {guidedProgress && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Có nháp đang làm
                    </span>
                    {confirmingReset === 'guided' ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            resetProgress('guided');
                            setConfirmingReset(null);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-900/40 text-red-300 border border-red-800/60"
                        >
                          Xóa nháp?
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmingReset(null);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-800 text-gray-400 border border-gray-700"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmingReset('guided');
                        }}
                        title="Xóa nháp, học lại từ đầu"
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-800 text-gray-400 border border-gray-700 hover:bg-red-900/30 hover:text-red-300 hover:border-red-800/50 transition-colors"
                      >
                        ✕ Làm lại
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-md text-gray-200 group-hover:text-white transition-colors">Guided (hướng dẫn từng bước)</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  5 bước có phản hồi tại chỗ: đặt hành động, nối luồng chính, decision + guard, fork/join, rồi đối chiếu.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              {guidedProgress ? 'Tiếp tục' : 'Bắt đầu'} ➔
            </span>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveMode('pe')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveMode('pe');
              }
            }}
            className="text-left block rounded-3xl border border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-200 hover:scale-[1.01] group p-6 flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl shadow-inner">
                  🎯
                </span>
                {peProgress && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Có nháp đang làm
                    </span>
                    {confirmingReset === 'pe' ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            resetProgress('pe');
                            setConfirmingReset(null);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-900/40 text-red-300 border border-red-800/60"
                        >
                          Xóa nháp?
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmingReset(null);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-800 text-gray-400 border border-gray-700"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmingReset('pe');
                        }}
                        title="Xóa nháp, làm lại từ đầu"
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-800 text-gray-400 border border-gray-700 hover:bg-red-900/30 hover:text-red-300 hover:border-red-800/50 transition-colors"
                      >
                        ✕ Làm lại
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-md text-gray-200 group-hover:text-white transition-colors">PE Mode (tự do)</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Tự dựng toàn bộ activity diagram từ mô tả nghiệp vụ, sau đó xem điểm rubric + đối chiếu bản tham chiếu.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              {peProgress ? 'Tiếp tục' : 'Bắt đầu'} ➔
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
