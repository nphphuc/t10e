import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { track } from '../engine/analytics';
import ChoiceWidget from '../widgets/ChoiceWidget';
import MultiWidget from '../widgets/MultiWidget';
import OrderWidget from '../widgets/OrderWidget';
import MatchWidget from '../widgets/MatchWidget';

import manifestData from '../content/manifest.json';

// Eagerly import all lessons to dynamically read level review files (e.g. L03-07.json)
const lessonFiles = import.meta.glob('../content/lessons/*.json', { eager: true });

// Static import of PE review questions
import classData from '../content/pe-review/pe-class-diagram.json';
import sequenceData from '../content/pe-review/pe-sequence.json';
import stateData from '../content/pe-review/pe-state.json';
import activityData from '../content/pe-review/pe-activity.json';
import dbData from '../content/pe-review/pe-conceptual-db.json';

const peReviewMap: Record<string, any> = {
  'class-diagram': classData,
  'sequence': sequenceData,
  'state': stateData,
  'activity': activityData,
  'conceptual-db': dbData,
};

const MISCONCEPTION_INFO: Record<string, { title: string; desc: string; advice: string }> = {
  'actor-is-internal': {
    title: 'Nhầm lẫn thành phần nội bộ là Actor',
    desc: 'Bạn đang xem các đối tượng bên trong phần mềm (như Database, Controller) là Actor.',
    advice: 'Hãy nhớ: Actor phải nằm hoàn toàn bên ngoài biên giới hệ thống (System Boundary) và tương tác với hệ thống qua các thông điệp.'
  },
  'actor-is-person': {
    title: 'Nhầm lẫn người dùng cụ thể là Actor',
    desc: 'Bạn đang dùng tên của một cá nhân cụ thể (ví dụ: Nguyễn An) để đại diện cho Actor thay vì vai trò tổng quát.',
    advice: 'Hãy đặt tên Actor theo vai trò công việc hoặc chức năng tổng quát (ví dụ: Customer, WarehouseStaff) thay vì tên cá nhân.'
  },
  'nfr-is-vague': {
    title: 'Yêu cầu phi chức năng mơ hồ',
    desc: 'Bạn chưa phân biệt được giữa yêu cầu mơ hồ và yêu cầu có thể kiểm thử (verifiable NFR).',
    advice: 'Yêu cầu phi chức năng cần có các chỉ số đo lường định lượng cụ thể, như thời gian phản hồi dưới X giây, độ tin cậy Y%.'
  },
  'usecase-is-click': {
    title: 'Nhầm hành động click giao diện là Use Case',
    desc: 'Bạn đang đặt tên use case theo hành động bấm nút hoặc xem màn hình của người dùng.',
    advice: 'Use case mô tả mục tiêu mang lại giá trị trọn vẹn cho Actor (ví dụ: Add Product), không mô tả các thao tác chi tiết trên giao diện.'
  },
  'include-vs-extend': {
    title: 'Nhầm lẫn quan hệ include và extend',
    desc: 'Bạn đang nhầm lẫn giữa hành vi bắt buộc (include) và hành vi mở rộng tùy chọn (extend).',
    advice: 'Hãy nhớ: include là quan hệ bắt buộc luôn luôn diễn ra, còn extend chỉ xảy ra trong một số điều kiện đặc biệt.'
  },
  'association-is-link': {
    title: 'Nhầm lẫn Association và Link',
    desc: 'Bạn đang nhầm lẫn giữa liên kết cụ thể giữa các đối tượng (Link) và mối quan hệ khái niệm giữa các Class (Association).',
    advice: 'Link là một thể hiện cụ thể (instance) kết nối các object thực tế ở runtime, Association định nghĩa mối quan hệ ở mức Class.'
  },
  'relationship-data': {
    title: 'Nhầm lẫn nơi đặt dữ liệu quan hệ',
    desc: 'Bạn đang cố đặt thuộc tính thuộc về mối quan hệ (như số lượng mua) vào bảng Product hoặc Order đơn thuần.',
    advice: 'Khi một thuộc tính thuộc về giao điểm của hai thực thể (quan hệ nhiều-nhiều), nó phải nằm ở Association Class.'
  },
  'aggregation-equals-composition': {
    title: 'Nhầm lẫn Aggregation và Composition',
    desc: 'Bạn chưa phân biệt được mức độ sở hữu và vòng đời (lifetime dependency) giữa Aggregation và Composition.',
    advice: 'Composition sở hữu độc quyền và vòng đời của part gắn liền với whole. Aggregation là quan hệ gom tụ lỏng lẻo hơn.'
  },
  'inheritance-for-reuse-only': {
    title: 'Lạm dụng kế thừa để tái sử dụng mã nguồn',
    desc: 'Bạn thiết lập quan hệ kế thừa chỉ vì thấy hai Class có một vài thuộc tính giống nhau.',
    advice: 'Chỉ kế thừa khi có quan hệ Is-A thực sự và tuân thủ nguyên lý thế thế Liskov (Substitutability).'
  },
  'sequence-equals-communication': {
    title: 'Nhầm lẫn trọng tâm của Sequence và Communication',
    desc: 'Bạn chưa phân biệt được thế mạnh của hai biểu đồ động này.',
    advice: 'Sequence diagram tối ưu hiển thị trình tự thời gian; Communication diagram tối ưu hiển thị sơ đồ liên kết (topology) giữa các đối tượng.'
  },
  'state-is-action': {
    title: 'Nhầm lẫn State và Action',
    desc: 'Bạn đang gán các hành động diễn ra tức thời (Action) làm trạng thái kéo dài (State).',
    advice: 'State là một tình huống/điều kiện tồn tại kéo dài theo thời gian, Action là tính toán diễn ra tức khắc tại một thời điểm kích hoạt.'
  },
  'ignore-current-state': {
    title: 'Bỏ qua trạng thái hiện tại',
    desc: 'Bạn nghĩ rằng một Event bất kỳ luôn dẫn đến cùng một kết quả mà không cần quan tâm đến trạng thái xuất phát hiện tại.',
    advice: 'Trạng thái tiếp theo luôn phụ thuộc vào cả trạng thái hiện tại, sự kiện kích hoạt và điều kiện bảo vệ: nextState = f(currentState, event, guard).'
  }
};

export default function ReviewPage({ isPeReview = false }: { isPeReview?: boolean }) {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();

  let reviewData = null;
  if (isPeReview) {
    reviewData = levelId ? peReviewMap[levelId] : null;
  } else if (levelId) {
    const level = manifestData.course.levels.find(l => l.id === levelId);
    const reviewLesson = level?.lessons.find(l => l.type === 'review');
    if (reviewLesson) {
      const matchKey = `../content/lessons/${reviewLesson.id}.json`;
      reviewData = (lessonFiles[matchKey] as any)?.default || null;
    }
  }

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isFinished, setIsFinished] = useState(false);

  const exitPath = isPeReview ? '/pe-review' : '/';

  if (!reviewData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0d0e] p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-200">Không Tìm Thấy Đánh Giá</h2>
        <p className="text-gray-400">Đánh giá "{levelId}" chưa có nội dung hoặc đang được sản xuất.</p>
        <button
          onClick={() => navigate(exitPath)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition-all"
        >
          Quay Lại
        </button>
      </div>
    );
  }

  const questions = reviewData.questions || [];
  const currentQuestion = questions[currentIdx];
  const selectedAnswer = answers[currentQuestion?.id] ?? null;

  const handleAnswerSelect = (value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const checkQuestionCorrect = (q: any, ans: any) => {
    if (ans === null || ans === undefined) return false;

    if (q.type === 'choice' || q.type === 'truefalse') {
      // True/false is evaluated identically to single choice
      return ans === q.correct;
    }
    if (q.type === 'multi') {
      const selected = (ans as number[]) || [];
      const correct = q.correctSet || [];
      if (selected.length !== correct.length) return false;
      return selected.every((idx) => correct.includes(idx));
    }
    if (q.type === 'order') {
      const ordered = (ans as string[]) || [];
      const correct = q.correctOrder || [];
      if (ordered.length !== correct.length) return false;
      return ordered.every((val, idx) => correct[idx] === val);
    }
    if (q.type === 'match') {
      const matches = (ans as Record<string, string>) || {};
      const pairs = q.pairs || {};
      const keys = Object.keys(pairs);
      if (Object.keys(matches).length !== keys.length) return false;
      return keys.every((k) => matches[k] === pairs[k]);
    }
    return false;
  };

  const getQuestionMisconception = (q: any, ans: any) => {
    if (ans === null || ans === undefined) return null;

    if (q.type === 'choice' || q.type === 'truefalse') {
      return q.distractorTags?.[String(ans)] || null;
    }
    if (q.type === 'multi') {
      const selected = (ans as number[]) || [];
      const correct = q.correctSet || [];
      for (const idx of selected) {
        if (!correct.includes(idx)) {
          const tag = q.distractorTags?.[String(idx)];
          if (tag) return tag;
        }
      }
    }
    return null;
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate final results
      let correctCount = 0;
      const misconceptionsCount: Record<string, number> = {};

      questions.forEach((q: any) => {
        const ans = answers[q.id];
        const isCorrect = checkQuestionCorrect(q, ans);
        if (isCorrect) {
          correctCount++;
        } else {
          const tag = getQuestionMisconception(q, ans);
          if (tag) {
            misconceptionsCount[tag] = (misconceptionsCount[tag] || 0) + 1;
          }
        }
      });

      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= 75;

      track('review_completed', {
        score,
        levelId,
        correctCount,
        totalQuestions: questions.length,
        passed,
      });

      if (passed) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
      }

      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsFinished(false);
  };

  // Render final result screen
  if (isFinished) {
    let correctCount = 0;
    const misconceptionsCount: Record<string, number> = {};

    questions.forEach((q: any) => {
      const ans = answers[q.id];
      const isCorrect = checkQuestionCorrect(q, ans);
      if (isCorrect) {
        correctCount++;
      } else {
        const tag = getQuestionMisconception(q, ans);
        if (tag) {
          misconceptionsCount[tag] = (misconceptionsCount[tag] || 0) + 1;
        }
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 75;

    // Find the most frequent misconception
    let weakMisconception: string | null = null;
    let maxCount = 0;
    Object.entries(misconceptionsCount).forEach(([tag, count]) => {
      if (count > maxCount) {
        maxCount = count;
        weakMisconception = tag;
      }
    });

    const mInfo = weakMisconception ? MISCONCEPTION_INFO[weakMisconception] : null;

    return (
      <div className="min-h-screen bg-[#0c0d0e] flex flex-col justify-center items-center p-6">
        <div className="max-w-md w-full bg-gray-900/60 border border-gray-800 rounded-3xl p-8 text-center space-y-6 shadow-xl backdrop-blur-md">
          {passed ? (
            <div className="space-y-4">
              <div className="text-6xl animate-bounce">🏆</div>
              <h2 className="text-2xl font-extrabold text-white">Vượt Qua Thử Thách!</h2>
              <p className="text-sm text-emerald-400 font-semibold">Bạn đã đạt {score}% ({correctCount}/{questions.length} câu đúng)</p>
              <p className="text-xs text-gray-400">Bạn đã nắm vững các khái niệm cốt lõi của chủ đề này.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">💡</div>
              <h2 className="text-2xl font-extrabold text-white">Cần Luyện Tập Thêm</h2>
              <p className="text-sm text-red-400 font-semibold">Bạn đạt {score}% ({correctCount}/{questions.length} câu đúng - Yêu cầu ≥ 75%)</p>

              {mInfo && (
                <div className="mt-4 p-4 rounded-2xl bg-red-950/20 border border-red-900/30 text-left space-y-2">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider">Học hiểu lầm chính:</div>
                  <h4 className="font-bold text-sm text-gray-200">{mInfo.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{mInfo.desc}</p>
                  <div className="text-[10px] text-gray-500 italic mt-1">{mInfo.advice}</div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 flex flex-col gap-2">
            {passed ? (
              <button
                onClick={() => navigate(exitPath)}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/20 focus:outline-none"
              >
                Tiếp Tục
              </button>
            ) : (
              <>
                <button
                  onClick={handleRetry}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all focus:outline-none"
                >
                  Thử Lại Đánh Giá
                </button>
                <button
                  onClick={() => navigate(exitPath)}
                  className="w-full py-3.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-all focus:outline-none"
                >
                  Trở Về
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render question UI
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="min-h-screen bg-[#0c0d0e] pb-16 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm("Bạn có muốn hủy bài kiểm tra và quay lại không?")) {
                  navigate(exitPath);
                }
              }}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              ← Quay lại
            </button>
            <h1 className="text-sm font-bold text-gray-200">{reviewData.title}</h1>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Câu {currentIdx + 1} / {questions.length}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-950">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Body */}
      <main className="max-w-xl mx-auto px-6 mt-10 flex-grow w-full flex flex-col justify-between">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-md md:text-lg font-bold text-gray-100 leading-snug">
              {currentQuestion.prompt}
            </h2>
          </div>

          {/* Render corresponding widget with isSubmitted=false to keep it interactive without grading feedback */}
          <div className="p-1">
            {currentQuestion.type === 'choice' && (
              <ChoiceWidget
                data={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswer={handleAnswerSelect}
                isSubmitted={false}
                disabledOptions={[]}
              />
            )}

            {currentQuestion.type === 'multi' && (
              <MultiWidget
                data={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswer={handleAnswerSelect}
                isSubmitted={false}
                disabledOptions={[]}
              />
            )}

            {currentQuestion.type === 'order' && (
              <OrderWidget
                data={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswer={handleAnswerSelect}
                isSubmitted={false}
              />
            )}

            {currentQuestion.type === 'match' && (
              <MatchWidget
                data={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswer={handleAnswerSelect}
                isSubmitted={false}
              />
            )}

            {currentQuestion.type === 'truefalse' && (
              <ChoiceWidget
                data={{
                  prompt: currentQuestion.prompt,
                  options: ['Đúng (True)', 'Sai (False)'],
                  correct: currentQuestion.correct ? 0 : 1
                }}
                selectedAnswer={selectedAnswer === null ? null : selectedAnswer ? 0 : 1}
                onAnswer={(idx) => handleAnswerSelect(idx === 0)}
                isSubmitted={false}
                disabledOptions={[]}
              />
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-10 pb-6">
          <button
            disabled={!isAnswered}
            onClick={handleNext}
            className={`w-full py-4 rounded-2xl font-bold transition-all focus:outline-none flex items-center justify-center gap-2 ${
              isAnswered
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{currentIdx === questions.length - 1 ? 'Nộp Bài & Hoàn Thành' : 'Xác Nhận & Tiếp Tục'}</span>
            <span>➔</span>
          </button>
        </div>
      </main>
    </div>
  );
}
