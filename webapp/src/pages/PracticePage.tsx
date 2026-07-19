import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useMistakesStore, type MistakeEntry } from '../store/mistakes';
import ChoiceWidget from '../widgets/ChoiceWidget';
import MultiWidget from '../widgets/MultiWidget';
import TrueFalseWidget from '../widgets/TrueFalseWidget';
import FillWidget from '../widgets/FillWidget';
import OrderWidget from '../widgets/OrderWidget';
import MatchWidget from '../widgets/MatchWidget';
import { playCorrect, playWrong } from '../engine/sound';
import confetti from 'canvas-confetti';

// Helper: kiểm tra đúng/sai dựa vào type và correct data
function checkAnswer(entry: MistakeEntry, answer: any): boolean {
  if (entry.type === 'choice') return Number(answer) === Number(entry.correct);
  if (entry.type === 'truefalse') return Boolean(answer) === Boolean(entry.correct);
  if (entry.type === 'multi') {
    const selected = (answer as number[]) || [];
    const correct = entry.correctSet || [];
    return selected.length === correct.length && selected.every((s) => correct.includes(s));
  }
  if (entry.type === 'fill') {
    const clean = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');
    return (entry.accepted || []).some((a) => clean(a) === clean(answer as string));
  }
  if (entry.type === 'order') {
    const ordered = (answer as string[]) || [];
    const correct = entry.correctOrder || [];
    return ordered.length === correct.length && ordered.every((item, i) => correct[i] === item);
  }
  if (entry.type === 'match') {
    const matches = (answer as Record<string, string>) || {};
    const pairs = entry.pairs || {};
    const keys = Object.keys(pairs);
    return Object.keys(matches).length === keys.length && keys.every((k) => matches[k] === pairs[k]);
  }
  return false;
}

function renderWidget(
  entry: MistakeEntry,
  selectedAnswer: any,
  onAnswer: (v: any) => void,
  isSubmitted: boolean
) {
  const data = entry as any;
  switch (entry.type) {
    case 'choice':
      return <ChoiceWidget data={data} selectedAnswer={selectedAnswer} onAnswer={onAnswer} isSubmitted={isSubmitted} disabledOptions={[]} />;
    case 'multi':
      return <MultiWidget data={data} selectedAnswer={selectedAnswer} onAnswer={onAnswer} isSubmitted={isSubmitted} disabledOptions={[]} />;
    case 'truefalse':
      return <TrueFalseWidget data={data} selectedAnswer={selectedAnswer} onAnswer={onAnswer} isSubmitted={isSubmitted} />;
    case 'fill':
      return <FillWidget data={data} selectedAnswer={selectedAnswer} onAnswer={onAnswer} isSubmitted={isSubmitted} />;
    case 'order':
      return <OrderWidget data={data} selectedAnswer={selectedAnswer} onAnswer={onAnswer} isSubmitted={isSubmitted} />;
    case 'match':
      return <MatchWidget data={data} selectedAnswer={selectedAnswer} onAnswer={onAnswer} isSubmitted={isSubmitted} />;
    default:
      return (
        <div className="p-4 rounded-xl bg-gray-800 text-gray-400 text-sm">
          Câu hỏi loại <code>{entry.type}</code> chưa hỗ trợ luyện lại.
        </div>
      );
  }
}

export default function PracticePage() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { mistakes, markReviewed, clearMistakes } = useMistakesStore();

  // Chỉ lấy các câu chưa review
  const pending = mistakes.filter((m) => !m.reviewedCorrectly);

  const [cardIdx, setCardIdx] = useState(0);
  const [answer, setAnswer] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [doneCount, setDoneCount] = useState(0);

  const current = pending[cardIdx];

  const handleCheck = () => {
    if (answer === null) return;
    const correct = checkAnswer(current, answer);
    setIsCorrect(correct);
    setSubmitted(true);
    if (correct) {
      playCorrect();
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    if (isCorrect) {
      markReviewed(current.id);
      setDoneCount((n) => n + 1);
      if (!shouldReduceMotion) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 }, scalar: 0.8 });
      }
    }
    // Nếu sai → giữ câu trong queue (sẽ xuất hiện lần tới)
    // Advance to next (if wrong, requeue by moving to end)
    const nextPending = useMistakesStore.getState().mistakes.filter((m) => !m.reviewedCorrectly);
    if (nextPending.length === 0) {
      // All done
      setCardIdx(0);
    } else {
      setCardIdx((prev) => (prev + 1) % nextPending.length);
    }
    setAnswer(null);
    setSubmitted(false);
    setIsCorrect(null);
  };

  // Màn hoàn thành
  if (pending.length === 0) {
    return (
      <div className="min-h-screen bg-[#0c0d0e] flex items-center justify-center px-4">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center space-y-4"
        >
          <div className="text-5xl">🎉</div>
          <h1 className="text-2xl font-extrabold text-white font-display">Đã luyện xong!</h1>
          <p className="text-gray-400 text-sm">
            Bạn đã ôn lại tất cả {doneCount > 0 ? doneCount : 'các'} câu sai. Tiếp tục học để có thêm thử thách!
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
            >
              Về Bản Đồ Khóa Học
            </button>
            <button
              onClick={() => { clearMistakes(); navigate('/home'); }}
              className="w-full py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-gray-200 text-sm transition-colors"
            >
              Xóa toàn bộ lịch sử luyện
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0d0e] flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-800 flex items-center gap-4 bg-gray-900/60 backdrop-blur">
        <button
          onClick={() => navigate('/home')}
          className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1.5"
        >
          ← <span className="hidden sm:inline">Bản đồ</span>
        </button>
        <div className="flex-1">
          <div className="text-xs text-gray-500 font-semibold mb-1 text-center">
            Luyện Điểm Yếu — {cardIdx + 1}/{pending.length} câu còn lại
          </div>
          <div className="flex gap-1 h-1.5">
            {pending.map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-colors ${
                  i < cardIdx ? 'bg-green-500' : i === cardIdx ? 'bg-orange-400' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
          🔥 {pending.length} câu
        </div>
      </header>

      {/* Body */}
      <main className="flex-grow max-w-[680px] w-full mx-auto p-6 pb-40 space-y-6">
        {/* Origin badge */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
            🔁 Câu sai từ {current.lessonId}
          </span>
          {current.misconceptionTags.length > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-800 text-gray-500 border border-gray-700">
              {current.misconceptionTags[0]}
            </span>
          )}
        </div>

        {/* Question */}
        <h1 className="text-xl md:text-2xl font-bold font-display leading-snug text-gray-100">
          {current.questionText}
        </h1>

        {/* Widget */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={shouldReduceMotion ? {} : { opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, x: -15 }}
            transition={{ duration: 0.18 }}
            className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 shadow-xl min-h-[220px] flex flex-col justify-center overflow-hidden"
          >
            {renderWidget(current, answer, setAnswer, submitted)}
          </motion.div>
        </AnimatePresence>

        {/* Feedback after submit */}
        {submitted && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border ${
              isCorrect
                ? 'bg-green-950/30 border-green-700/40 text-green-300'
                : 'bg-red-950/30 border-red-700/40 text-red-300'
            }`}
          >
            <div className="font-bold mb-1 flex items-center gap-1.5">
              {isCorrect ? '✓ Đúng rồi!' : '✗ Chưa đúng — thử lại lần sau'}
            </div>
            {(current.feedbackCorrect || current.explanation) && (
              <p className="text-sm opacity-90 leading-relaxed">
                {current.feedbackCorrect || current.explanation}
              </p>
            )}
          </motion.div>
        )}
      </main>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d0e]/95 border-t border-gray-800/80 shadow-2xl backdrop-blur-md">
        <div className="max-w-[680px] w-full mx-auto px-6 py-4 flex justify-end">
          {!submitted ? (
            <button
              disabled={answer === null}
              onClick={handleCheck}
              className="btn-3d btn-3d-primary px-8 py-3.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-base"
            >
              Kiểm Tra
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`btn-3d px-8 py-3.5 rounded-xl font-bold text-base ${
                isCorrect
                  ? 'btn-3d-success bg-green-600 text-white hover:bg-green-500'
                  : 'bg-orange-600 text-white hover:bg-orange-500'
              }`}
            >
              {isCorrect ? 'Tiếp Tục' : 'Ghi Nhớ & Tiếp'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
