import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { track } from '../engine/analytics';
import { useProgressStore } from '../store/progress';
import { playCorrect, playWrong } from '../engine/sound';
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

// Ngân Hàng Thuật Ngữ — 198 câu convert từ flashcard OOAD (Bahrami) do chủ dự án cung cấp
import tb01 from '../content/term-bank/tb-01.json';
import tb02 from '../content/term-bank/tb-02.json';
import tb03 from '../content/term-bank/tb-03.json';
import tb04 from '../content/term-bank/tb-04.json';
import tb05 from '../content/term-bank/tb-05.json';
import tb06 from '../content/term-bank/tb-06.json';
import tb07 from '../content/term-bank/tb-07.json';
import tb08 from '../content/term-bank/tb-08.json';
import tb09 from '../content/term-bank/tb-09.json';
import tb10 from '../content/term-bank/tb-10.json';
import tb11 from '../content/term-bank/tb-11.json';

const peReviewMap: Record<string, any> = {
  'class-diagram': classData,
  'sequence': sequenceData,
  'state': stateData,
  'activity': activityData,
  'conceptual-db': dbData,
};

export const termBankMap: Record<string, any> = {
  'tb-01': tb01,
  'tb-02': tb02,
  'tb-03': tb03,
  'tb-04': tb04,
  'tb-05': tb05,
  'tb-06': tb06,
  'tb-07': tb07,
  'tb-08': tb08,
  'tb-09': tb09,
  'tb-10': tb10,
  'tb-11': tb11,
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
  },
  'uml-notation-confusion': {
    title: 'Nhầm ký hiệu và thuật ngữ mô hình hóa cơ bản',
    desc: 'Bạn đang nhầm giữa các thuật ngữ nền tảng của mô hình hóa (modeling, architecture, notation, design concept/strategy/method) hoặc ký hiệu UML (actor, use case, class, association...).',
    advice: 'Ôn lại định nghĩa gốc của từng thuật ngữ: notation là cách biểu diễn, concept là ý tưởng nền tảng, strategy là định hướng, method là quy trình có hệ thống.'
  },
  'lifecycle-model-confusion': {
    title: 'Nhầm mô hình vòng đời hoặc kỹ thuật kiểm thử',
    desc: 'Bạn chưa phân biệt rõ waterfall, prototyping, spiral, hoặc verification/validation, white-box/black-box testing.',
    advice: 'Verification = "xây đúng cách" (building the system right); Validation = "xây đúng thứ" (building the right system). White-box cần biết nội bộ, black-box thì không.'
  },
  'oo-term-confusion': {
    title: 'Nhầm thuật ngữ hướng đối tượng cơ bản',
    desc: 'Bạn đang nhầm giữa object, class, attribute, operation, signature, encapsulation, data abstraction.',
    advice: 'Class là khuôn mẫu định nghĩa các object cùng đặc điểm; attribute là dữ liệu; operation/method là hành vi; signature gồm tên + tham số + kiểu trả về.'
  },
  'bce-role-confusion': {
    title: 'Nhầm vai trò Boundary/Entity/Control',
    desc: 'Bạn đang nhầm trách nhiệm của Boundary object (giao tiếp ngoài), Entity object (lưu dữ liệu), Control/Coordinator object (điều phối) hoặc Timer object.',
    advice: 'Boundary giao tiếp với actor bên ngoài, Entity lưu trữ dữ liệu bền vững, Control điều phối logic nghiệp vụ, Coordinator ra quyết định nên tương tác entity nào.'
  },
  'usecase-concept-confusion': {
    title: 'Nhầm khái niệm use case',
    desc: 'Bạn đang nhầm giữa actor, primary/secondary actor, alternative sequence, use case package.',
    advice: 'Primary actor là actor khởi tạo use case; secondary actor chỉ tham gia. Alternative sequence là luồng khác luồng chính, không nhất thiết là lỗi.'
  },
  'architecture-view-confusion': {
    title: 'Nhầm các view và pattern kiến trúc',
    desc: 'Bạn đang nhầm structural view (component/connector), dynamic view (object/message), deployment view (node vật lý), hoặc tiêu chí gom subsystem.',
    advice: 'Structural = tĩnh, mô tả thành phần; Dynamic = chạy thời gian thực, mô tả tương tác; Deployment = vật lý, mô tả nơi cài đặt.'
  },
  'client-service-role-confusion': {
    title: 'Nhầm vai trò client/server/service',
    desc: 'Bạn đang nhầm ai gửi yêu cầu (client), ai xử lý và trả kết quả (service/server), đặc biệt ở kiến trúc nhiều tầng.',
    advice: 'Một tier trung gian (intermediate tier) vừa là client (gọi tầng dưới) vừa là service (phục vụ tầng trên).'
  },
  'component-interface-confusion': {
    title: 'Nhầm provided/required interface của component',
    desc: 'Bạn đang nhầm interface mà component cung cấp (provided) với interface mà nó cần dùng từ bên ngoài (required), hoặc vai trò connector/port.',
    advice: 'Provided interface = component hứa thực hiện; Required interface = component cần component khác cung cấp. Connector nối required port của một component với provided port của component khác.'
  },
  'task-activation-confusion': {
    title: 'Nhầm cơ chế kích hoạt task',
    desc: 'Bạn đang nhầm giữa task kích hoạt bởi sự kiện ngoài (event-driven), theo chu kỳ thời gian (periodic), hay theo yêu cầu từ task khác (demand-driven).',
    advice: 'Event-driven task chờ interrupt từ thiết bị ngoài; periodic task chờ timer; demand-driven task chờ message/event nội bộ từ task khác.'
  },
  'spl-feature-confusion': {
    title: 'Nhầm khái niệm Software Product Line',
    desc: 'Bạn đang nhầm feature, kernel class/system, variation point trong một họ sản phẩm phần mềm (SPL).',
    advice: 'Kernel class là thành phần bắt buộc ở mọi thành viên SPL; feature là đặc điểm có thể chọn/không chọn; variation point là nơi trong use case cho phép thay đổi.'
  }
};

const SUPPORTED_REVIEW_TYPES = new Set(['choice', 'multi', 'truefalse', 'order', 'match']);

export default function ReviewPage({ isPeReview = false, isTermBank = false, levelIdOverride }: { isPeReview?: boolean; isTermBank?: boolean; levelIdOverride?: string }) {
  const { levelId } = useParams<{ levelId: string }>();
  const resolvedLevelId = levelIdOverride ?? levelId;
  const navigate = useNavigate();

  let reviewData = null;
  let reviewLessonId: string | null = null;
  let reviewLessonXp = 0;
  if (isPeReview) {
    reviewData = resolvedLevelId ? peReviewMap[resolvedLevelId] : null;
  } else if (isTermBank) {
    reviewData = resolvedLevelId ? termBankMap[resolvedLevelId] : null;
  } else if (levelId) {
    const level = manifestData.course.levels.find(l => l.id === levelId);
    const reviewLesson = level?.lessons.find(l => l.type === 'review');
    if (reviewLesson) {
      const matchKey = `../content/lessons/${reviewLesson.id}.json`;
      reviewData = (lessonFiles[matchKey] as any)?.default || null;
      reviewLessonId = reviewLesson.id;
      reviewLessonXp = (reviewLesson as any).xp ?? 0;
    }
  }

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const exitPath = isPeReview ? '/pe-review' : isTermBank ? '/term-bank' : '/home';

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
  const isUnsupportedQuestion = Boolean(currentQuestion && !SUPPORTED_REVIEW_TYPES.has(currentQuestion.type));

  const handleAnswerSelect = (value: any) => {
    if (submitted) return;
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

  // Bước 1: người dùng bấm "Kiểm Tra" — chấm điểm câu hiện tại và hiện feedback + giải thích ngay
  const handleCheck = () => {
    if (selectedAnswer === null || selectedAnswer === undefined) return;
    setSubmitted(true);
    const isCorrect = checkQuestionCorrect(currentQuestion, selectedAnswer);
    if (isCorrect) {
      playCorrect();
    } else {
      playWrong();
    }
  };

  // Bước 2: người dùng đã xem feedback, bấm "Tiếp Tục" — sang câu kế hoặc nộp bài
  const handleContinue = () => {
    setSubmitted(false);
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
        levelId: resolvedLevelId,
        correctCount,
        totalQuestions: questions.length,
        passed,
      });

      if (passed) {
        // Đánh dấu bài review hoàn thành để mở khóa level kế tiếp
        // (PE review không thuộc lộ trình nên không tính)
        if (!isPeReview && reviewLessonId) {
          useProgressStore.getState().completeLesson(reviewLessonId, reviewLessonXp);
        }
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
    setSubmitted(false);
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
  const isAnswered = isUnsupportedQuestion || selectedAnswer !== null;

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

          {/* Widget hiện isSubmitted=true sau khi bấm Kiểm Tra để tô màu đúng/sai ngay */}
          <div className="p-1">
            {isUnsupportedQuestion && (
              <div role="status" className="rounded-2xl border border-amber-700/50 bg-amber-950/20 p-4 text-sm text-amber-100">
                Loại câu hỏi <code className="font-bold">{currentQuestion.type}</code> chưa được hỗ trợ trong Level Review. Bạn có thể bỏ qua câu này; bài review vẫn tiếp tục.
              </div>
            )}

            {currentQuestion.type === 'choice' && (
              <ChoiceWidget
                data={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswer={handleAnswerSelect}
                isSubmitted={submitted}
                disabledOptions={[]}
              />
            )}

            {currentQuestion.type === 'multi' && (
              <MultiWidget
                data={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswer={handleAnswerSelect}
                isSubmitted={submitted}
                disabledOptions={[]}
              />
            )}

            {currentQuestion.type === 'order' && (
              <OrderWidget
                data={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswer={handleAnswerSelect}
                isSubmitted={submitted}
              />
            )}

            {currentQuestion.type === 'match' && (
              <MatchWidget
                data={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswer={handleAnswerSelect}
                isSubmitted={submitted}
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
                isSubmitted={submitted}
                disabledOptions={[]}
              />
            )}
          </div>

          {/* Feedback + giải thích — hiện ngay sau khi bấm Kiểm Tra */}
          {submitted && !isUnsupportedQuestion && (() => {
            const isCorrectNow = checkQuestionCorrect(currentQuestion, selectedAnswer);
            const tagNow = !isCorrectNow ? getQuestionMisconception(currentQuestion, selectedAnswer) : null;
            const mInfoNow = tagNow ? MISCONCEPTION_INFO[tagNow] : null;
            return (
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isCorrectNow
                    ? 'bg-green-950/30 border-green-700/40 text-green-300'
                    : 'bg-red-950/30 border-red-700/40 text-red-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {isCorrectNow ? '✓ Chính xác!' : '✗ Chưa đúng'}
                </div>
                {currentQuestion.explanation && (
                  <p className="text-sm opacity-90 leading-relaxed">{currentQuestion.explanation}</p>
                )}
                {mInfoNow && (
                  <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{mInfoNow.title}</div>
                    <p className="text-xs opacity-80 leading-relaxed">{mInfoNow.advice}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Bottom Actions */}
        <div className="pt-10 pb-6">
          {!submitted ? (
            <button
              disabled={!isAnswered}
              onClick={isUnsupportedQuestion ? handleContinue : handleCheck}
              className={`w-full py-4 rounded-2xl font-bold transition-all focus:outline-none flex items-center justify-center gap-2 ${
                isAnswered
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{isUnsupportedQuestion ? 'Bỏ Qua & Tiếp Tục' : 'Kiểm Tra'}</span>
              <span>➔</span>
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="w-full py-4 rounded-2xl font-bold transition-all focus:outline-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
            >
              <span>{currentIdx === questions.length - 1 ? 'Nộp Bài & Hoàn Thành' : 'Tiếp Tục'}</span>
              <span>➔</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
