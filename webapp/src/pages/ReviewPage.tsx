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

// Quiz môn PRU213 (Unity & C#) — mục riêng, độc lập với SWD392
import pru213Quiz from '../content/pru213/pru213-quiz.json';

// Bộ 2: quiz từ thầy dạy (Unity Editor, GameObject, Physics, Animation, UI, Input, Data)
import pru213B2Editor from '../content/pru213/pru213-b2-01-editor.json';
import pru213B2GameObject from '../content/pru213/pru213-b2-02-gameobject.json';
import pru213B2Physics from '../content/pru213/pru213-b2-03-physics.json';
import pru213B2Animation from '../content/pru213/pru213-b2-04-animation.json';
import pru213B2Ui from '../content/pru213/pru213-b2-05-ui.json';
import pru213B2Input from '../content/pru213/pru213-b2-06-input.json';
import pru213B2Data from '../content/pru213/pru213-b2-07-data.json';
import pru213B2Comprehensive from '../content/pru213/pru213-b2-comprehensive.json';

// Quiz môn PRN222 — 2 đề thi thật + trộn 2 đề + chia theo chủ đề
import prn222De1 from '../content/prn222/prn222-de1.json';
import prn222De2 from '../content/prn222/prn222-de2.json';
import prn222TopicDi from '../content/prn222/prn222-topic-01-di.json';
import prn222TopicBlazor from '../content/prn222/prn222-topic-02-blazor.json';
import prn222TopicSignalr from '../content/prn222/prn222-topic-03-signalr.json';
import prn222TopicNet from '../content/prn222/prn222-topic-04-networking.json';
import prn222TopicMvc from '../content/prn222/prn222-topic-05-mvc-razor.json';
import prn222TopicWorker from '../content/prn222/prn222-topic-06-worker.json';
import prn222TopicAsync from '../content/prn222/prn222-topic-07-async.json';

// Quiz môn PMG201c (Project Management) — 3 đề thi thật + trộn 3 đề + chia theo chủ đề
import pmg201cD1 from '../content/pmg201c/pmg201c-d1.json';
import pmg201cD2 from '../content/pmg201c/pmg201c-d2.json';
import pmg201cD3 from '../content/pmg201c/pmg201c-d3.json';
import pmg201cTopicOverview from '../content/pmg201c/pmg201c-topic-01-overview.json';
import pmg201cTopicScopeSchedule from '../content/pmg201c/pmg201c-topic-02-scope-schedule.json';
import pmg201cTopicCost from '../content/pmg201c/pmg201c-topic-03-cost.json';
import pmg201cTopicEvm from '../content/pmg201c/pmg201c-topic-04-evm.json';
import pmg201cTopicQuality from '../content/pmg201c/pmg201c-topic-05-quality.json';
import pmg201cTopicHr from '../content/pmg201c/pmg201c-topic-06-hr.json';
import pmg201cTopicCommunication from '../content/pmg201c/pmg201c-topic-07-communication.json';
import pmg201cTopicRisk from '../content/pmg201c/pmg201c-topic-08-risk.json';
import pmg201cTopicStakeholder from '../content/pmg201c/pmg201c-topic-09-stakeholder.json';

// Quiz môn MLN111 (Triết học Mác-Lênin) — 3 đề thi thật + trộn 3 đề + chia theo 3 chương
import mln111Re from '../content/mln111/mln111-re.json';
import mln111C1 from '../content/mln111/mln111-c1.json';
import mln111C2 from '../content/mln111/mln111-c2.json';
import mln111Chapter1 from '../content/mln111/mln111-chapter-01-triet-hoc-vai-tro.json';
import mln111Chapter2 from '../content/mln111/mln111-chapter-02-duy-vat-bien-chung.json';
import mln111Chapter3 from '../content/mln111/mln111-chapter-03-duy-vat-lich-su.json';

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

export const pru213Map: Record<string, any> = {
  'quiz': pru213Quiz,
  'b2-editor': pru213B2Editor,
  'b2-gameobject': pru213B2GameObject,
  'b2-physics': pru213B2Physics,
  'b2-animation': pru213B2Animation,
  'b2-ui': pru213B2Ui,
  'b2-input': pru213B2Input,
  'b2-data': pru213B2Data,
  'b2-comprehensive': pru213B2Comprehensive,
};

export const prn222Map: Record<string, any> = {
  'de1': prn222De1,
  'de2': prn222De2,
  'topic-di': prn222TopicDi,
  'topic-blazor': prn222TopicBlazor,
  'topic-signalr': prn222TopicSignalr,
  'topic-net': prn222TopicNet,
  'topic-mvc': prn222TopicMvc,
  'topic-worker': prn222TopicWorker,
  'topic-async': prn222TopicAsync,
};

// Đề trộn PRN222: 25 câu random từ Đề 1 + 25 câu random từ Đề 2 = 50 câu,
// trộn thứ tự xuất hiện — KHÔNG đảo vị trí đáp án bên trong mỗi câu.
function buildPrn222Mix() {
  const pool1 = shuffleArray(prn222De1.questions).slice(0, 25);
  const pool2 = shuffleArray(prn222De2.questions).slice(0, 25);
  return {
    id: 'PRN222-MIX',
    title: 'PRN222 — Đề Trộn (50 câu, mix Đề 1 + Đề 2)',
    questions: shuffleArray([...pool1, ...pool2]),
  };
}

export const pmg201cMap: Record<string, any> = {
  'd1': pmg201cD1,
  'd2': pmg201cD2,
  'd3': pmg201cD3,
  'topic-overview': pmg201cTopicOverview,
  'topic-scope-schedule': pmg201cTopicScopeSchedule,
  'topic-cost': pmg201cTopicCost,
  'topic-evm': pmg201cTopicEvm,
  'topic-quality': pmg201cTopicQuality,
  'topic-hr': pmg201cTopicHr,
  'topic-communication': pmg201cTopicCommunication,
  'topic-risk': pmg201cTopicRisk,
  'topic-stakeholder': pmg201cTopicStakeholder,
};

// Đề trộn PMG201c: 17 câu random từ Đề 1 + 17 câu random từ Đề 2 + 16 câu random
// từ Đề 3 = 50 câu, trộn thứ tự xuất hiện — KHÔNG đảo vị trí đáp án bên trong mỗi câu.
function buildPmg201cMix() {
  const pool1 = shuffleArray(pmg201cD1.questions).slice(0, 17);
  const pool2 = shuffleArray(pmg201cD2.questions).slice(0, 17);
  const pool3 = shuffleArray(pmg201cD3.questions).slice(0, 16);
  return {
    id: 'PMG201C-MIX',
    title: 'PMG201c — Đề Trộn (50 câu, mix Đề 1 + Đề 2 + Đề 3)',
    questions: shuffleArray([...pool1, ...pool2, ...pool3]),
  };
}

export const mln111Map: Record<string, any> = {
  're': mln111Re,
  'c1': mln111C1,
  'c2': mln111C2,
  'chapter-1': mln111Chapter1,
  'chapter-2': mln111Chapter2,
  'chapter-3': mln111Chapter3,
};

// Đề trộn MLN111: 20 câu random từ mỗi đề RE/C1/C2 = 60 câu, trộn thứ tự xuất hiện —
// KHÔNG đảo vị trí đáp án bên trong mỗi câu.
function buildMln111Mix() {
  const pool1 = shuffleArray(mln111Re.questions).slice(0, 20);
  const pool2 = shuffleArray(mln111C1.questions).slice(0, 20);
  const pool3 = shuffleArray(mln111C2.questions).slice(0, 20);
  return {
    id: 'MLN111-MIX',
    title: 'MLN111 — Đề Trộn (60 câu, mix RE + C1 + C2)',
    questions: shuffleArray([...pool1, ...pool2, ...pool3]),
  };
}

// Phân bố 60 câu đề thi thử theo 11 chương — gần đều, dư 5 câu rải vào chương
// có nhiều câu gốc nhất (TB-09) và 4 chương kế tiếp theo thứ tự chương.
// Tổng: 6+5+5+6+6+6+5+5+6+5+5 = 60.
const MOCK_EXAM_PLAN: Record<string, number> = {
  'tb-01': 6,
  'tb-02': 5,
  'tb-03': 5,
  'tb-04': 6,
  'tb-05': 6,
  'tb-06': 6,
  'tb-07': 5,
  'tb-08': 5,
  'tb-09': 6,
  'tb-10': 5,
  'tb-11': 5,
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Random N câu/chương (không lặp), rồi trộn thứ tự xuất hiện giữa các chương.
// KHÔNG đảo vị trí đáp án bên trong mỗi câu — options giữ nguyên như JSON gốc.
function buildMockExam() {
  const selected: any[] = [];
  Object.entries(MOCK_EXAM_PLAN).forEach(([key, count]) => {
    const bank = termBankMap[key];
    if (!bank) return;
    const pool = shuffleArray(bank.questions);
    selected.push(...pool.slice(0, count));
  });
  return {
    id: 'MOCK-EXAM',
    title: 'Đề Thi Thử — 60 câu ngẫu nhiên',
    questions: shuffleArray(selected),
  };
}

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

export default function ReviewPage({ isPeReview = false, isTermBank = false, isMockExam = false, isPru213 = false, isPrn222 = false, isPrn222Mix = false, isPmg201c = false, isPmg201cMix = false, isMln111 = false, isMln111Mix = false, levelIdOverride }: { isPeReview?: boolean; isTermBank?: boolean; isMockExam?: boolean; isPru213?: boolean; isPrn222?: boolean; isPrn222Mix?: boolean; isPmg201c?: boolean; isPmg201cMix?: boolean; isMln111?: boolean; isMln111Mix?: boolean; levelIdOverride?: string }) {
  const { levelId } = useParams<{ levelId: string }>();
  const resolvedLevelId = levelIdOverride ?? levelId;
  const navigate = useNavigate();

  // Đề thi thử: random 1 lần khi vào trang, và random lại mỗi lần bấm "Làm Lại"
  // (xem handleRetry) — không random lại khi component re-render bình thường.
  const [mockExamData, setMockExamData] = useState<any>(() => (isMockExam ? buildMockExam() : null));
  const [prn222MixData, setPrn222MixData] = useState<any>(() => (isPrn222Mix ? buildPrn222Mix() : null));
  const [pmg201cMixData, setPmg201cMixData] = useState<any>(() => (isPmg201cMix ? buildPmg201cMix() : null));
  const [mln111MixData, setMln111MixData] = useState<any>(() => (isMln111Mix ? buildMln111Mix() : null));

  let reviewData = null;
  let reviewLessonId: string | null = null;
  let reviewLessonXp = 0;
  if (isMockExam) {
    reviewData = mockExamData;
  } else if (isPrn222Mix) {
    reviewData = prn222MixData;
  } else if (isPmg201cMix) {
    reviewData = pmg201cMixData;
  } else if (isMln111Mix) {
    reviewData = mln111MixData;
  } else if (isPeReview) {
    reviewData = resolvedLevelId ? peReviewMap[resolvedLevelId] : null;
  } else if (isTermBank) {
    reviewData = resolvedLevelId ? termBankMap[resolvedLevelId] : null;
  } else if (isPru213) {
    reviewData = resolvedLevelId ? pru213Map[resolvedLevelId] : null;
  } else if (isPrn222) {
    reviewData = resolvedLevelId ? prn222Map[resolvedLevelId] : null;
  } else if (isPmg201c) {
    reviewData = resolvedLevelId ? pmg201cMap[resolvedLevelId] : null;
  } else if (isMln111) {
    reviewData = resolvedLevelId ? mln111Map[resolvedLevelId] : null;
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

  const exitPath = isPeReview ? '/pe-review' : (isPru213 ? '/pru213' : (isPrn222 || isPrn222Mix) ? '/prn222' : (isPmg201c || isPmg201cMix) ? '/pmg201c' : (isMln111 || isMln111Mix) ? '/mln111' : (isTermBank || isMockExam) ? '/term-bank' : '/home');

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
    // Đề thi thử: mỗi lần "Làm Lại" ra một bộ 60 câu random mới (giống bấm đề mới)
    if (isMockExam) {
      setMockExamData(buildMockExam());
    }
    // Đề trộn PRN222: mỗi lần "Làm Lại" ra một bộ 50 câu random mới
    if (isPrn222Mix) {
      setPrn222MixData(buildPrn222Mix());
    }
    // Đề trộn PMG201c: mỗi lần "Làm Lại" ra một bộ 50 câu random mới
    if (isPmg201cMix) {
      setPmg201cMixData(buildPmg201cMix());
    }
    // Đề trộn MLN111: mỗi lần "Làm Lại" ra một bộ 60 câu random mới
    if (isMln111Mix) {
      setMln111MixData(buildMln111Mix());
    }
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
            {currentQuestion.image && (
              <img
                src={`${import.meta.env.BASE_URL}${String(currentQuestion.image).replace(/^\//, '')}`}
                alt=""
                className="w-full max-w-sm mx-auto rounded-2xl border border-gray-800 mt-3"
              />
            )}
            {currentQuestion.code && (
              <pre className="mt-3 p-4 rounded-2xl bg-[#1e1e1e] border border-gray-800 overflow-x-auto text-left">
                <code className="font-mono text-[13px] leading-relaxed text-gray-200 whitespace-pre">
                  {currentQuestion.code}
                </code>
              </pre>
            )}
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
