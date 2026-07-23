# Đặc tả sản xuất khóa học

## 1. Nguyên tắc sư phạm

### 1.1 Productive struggle

Mỗi concept mới bắt đầu bằng một quyết định có thể suy luận từ trực giác. Không giải thích định nghĩa trước rồi mới hỏi. Ví dụ, trước khi định nghĩa composition, cho người học xóa whole object và dự đoán part có còn tồn tại không.

### 1.2 Một màn hình, một quyết định

- Tối đa 45 từ tiếng Việt hoặc 70 từ tiếng Anh/màn hình, trừ case study.
- Một diagram chỉ làm nổi bật các element liên quan đến câu hỏi hiện tại.
- Không yêu cầu người học vừa nhớ notation mới, vừa phân tích business rule mới trong cùng một màn.

### 1.3 Visual-first, terminology-second

Thứ tự mặc định:

1. Quan sát hoặc thao tác.
2. Dự đoán kết quả.
3. Nhận phản hồi.
4. Gắn tên chính thức cho khái niệm.
5. Vận dụng sang case khác.

### 1.4 Misconception-driven distractors

Mỗi đáp án sai phải đại diện một lỗi tư duy có thể chẩn đoán. Không dùng “tất cả đều sai”, “không liên quan” hoặc distractor vô nghĩa.

Ví dụ cho actor:

- `Database`: nhầm internal implementation với external actor.
- `Customer Nguyen Van A`: nhầm actor role với user instance.
- `Checkout button`: nhầm UI element với actor.

### 1.5 Interleaving và retrieval

- Mỗi lesson có một câu retrieval từ 2-4 bài trước.
- Mỗi Level Review có ít nhất hai câu kết hợp kiến thức level trước.
- Practice set không nhóm toàn bộ câu cùng loại; phải buộc người học nhận diện cách giải.

## 2. Cấu trúc lesson

Một lesson 8-12 phút gồm 6-9 screen:

| Screen | Mục đích | Loại tương tác ưu tiên |
|---|---|---|
| 1. Hook | Tạo conflict hoặc dự đoán | `scenario`, `visual`, `choice` |
| 2. Explore | Thao tác model | `visual`, `order`, `match` |
| 3. Feedback | Giải thích dựa trên thao tác | micro-explanation |
| 4. Contrast | Phân biệt khái niệm dễ nhầm | `choice`, `truefalse` |
| 5. Guided Apply | Áp dụng có hint vào FOS | `scenario`, `order`, `visual` |
| 6. Transfer | Case mới, giảm scaffolding | `scenario`, `multi` |
| 7. Retrieve | Ôn lại concept cũ | bất kỳ |
| 8. Takeaway | Một câu kết luận + next link | summary |

### Mẫu metadata lesson

```json
{
  "id": "L06-06",
  "type": "concept",
  "title": "State, event, guard và action",
  "minutes": 11,
  "xp": 110,
  "objective": "Dự đoán transition và phân biệt state với action.",
  "hook": "News đang Enabled. DisableNews tới thì điều gì đổi?",
  "interactionTypes": ["visual", "order", "scenario", "choice"],
  "misconceptions": ["state-is-action", "event-is-state", "ignore-current-state"],
  "sourceRefs": ["Ch09-11_Dynamic Modeling.pptx#17-26", "RDS.pdf#37"]
}
```

## 3. Loại tương tác

### 3.1 `choice`

Dùng khi cần chọn một quyết định. Các phương án phải cùng mức trừu tượng. Không trộn một architecture style với một implementation detail.

### 3.2 `multi`

Dùng cho property set, participating objects hoặc quality tactics. UI phải cho biết “chọn tất cả đáp án đúng”. Chấm theo tập hợp, nhưng feedback chỉ ra từng lựa chọn sai/thiếu.

### 3.3 `truefalse`

Chỉ dùng cho misconception có giá trị, không dùng để kiểm tra câu chữ thuộc lòng. Sau câu sai phải yêu cầu sửa statement hoặc chọn counterexample.

### 3.4 `fill`

Chỉ dùng cho thuật ngữ cốt lõi hoặc message/operation ngắn. Chấp nhận biến thể tiếng Việt/Anh, khác hoa-thường và khoảng trắng.

### 3.5 `order`

Phù hợp use case flow, lifecycle, message sequence, transaction protocol và COMET trace. Khi sai, feedback hiển thị cặp bước đầu tiên vi phạm dependency, không công bố toàn bộ thứ tự ngay.

### 3.6 `match`

Phù hợp diagram-purpose, object-role, quality-tactic và pattern-intent. Tối đa sáu cặp/màn hình.

### 3.7 `visual`

Tương tác chính của khóa. Các biến thể:

- Chọn element sai trong UML.
- Kéo actor/class/component vào đúng vùng.
- Nối association/message/connector.
- Đổi multiplicity và quan sát instance set hợp lệ.
- Chạy timeline sync/async.
- Kích hoạt event và xem state transition.
- Di chuyển component giữa node và xem latency/failure boundary.

### 3.8 `scenario`

Người học đưa ra quyết định trong context có constraint. Đáp án phải yêu cầu lý do hoặc consequence, đặc biệt ở L08-L10.

## 4. Visual assets cần sản xuất

Không dùng nguyên ảnh slide vì chữ nhỏ, style không đồng nhất và không tương tác được. Cần dựng lại SVG theo token hệ thống.

| Asset family | Số biến thể tối thiểu | Level |
|---|---:|---|
| System boundary + actor cards | 8 | L03 |
| UML class/object cards | 12 | L01, L04 |
| Association/multiplicity simulator | 8 | L04 |
| Composition/aggregation lifetime simulator | 4 | L04 |
| Boundary/entity/control sorter | 6 | L05 |
| Sequence/communication dual view | 10 | L06 |
| State machine runner | 8 | L06 |
| Architecture view switcher | 6 | L07 |
| Sync/async/callback timeline | 6 | L07-L08 |
| Subsystem partition board | 6 | L07 |
| Relational mapping builder | 8 | L08 |
| Service registry/broker simulator | 5 | L08 |
| Transaction failure simulator | 6 | L08 |
| Task/deadline timeline | 6 | L08 |
| Quality trade-off radar | 6 | L09 |
| Pattern pressure cards | 15 | L10 |
| RDS trace graph | 8 | L11 |

### Visual token

- Actor/external: `#0EA5E9`
- Boundary: `#8B5CF6`
- Entity/data: `#10B981`
- Control/coordinator: `#F59E0B`
- Service/component: `#6366F1`
- Error/risk: `#EF4444`
- Success: `#16A34A`
- Background phải đạt contrast WCAG AA.

Không truyền đạt meaning chỉ bằng màu. Mỗi category phải có icon, label hoặc shape khác nhau.

## 5. Feedback và hint

### 5.1 Khi đúng

Feedback gồm:

1. Xác nhận principle, không chỉ nói “Đúng”.
2. Nêu evidence trong scenario.
3. Một câu bridge sang màn tiếp theo.

Mẫu: “Đúng. `Google Authentication Service` nằm ngoài FOS và cung cấp response cho hệ thống, vì vậy nó là secondary actor. Tiếp theo, hãy xem internal database có phải actor không.”

### 5.2 Khi sai lần đầu

- Không lộ đáp án.
- Gọi tên dấu hiệu cần quan sát.
- Nếu có thể, chạy counterexample nhỏ.

Mẫu: “Bạn đang chọn theo tên công nghệ. Hãy tạm bỏ tên và hỏi: thành phần này nằm trong scope do nhóm phát triển hay là một hệ thống bên ngoài?”

### 5.3 Khi sai lần hai

- Thu hẹp lựa chọn hoặc highlight vùng diagram liên quan.
- Nêu rule nhưng vẫn yêu cầu người học thực hiện bước cuối.

### 5.4 Khi sai lần ba

- Hiển thị worked example tương tự, không phải cùng câu.
- Cho retry câu gốc sau một màn hình xen kẽ.

## 6. Misconception taxonomy

| Mã | Hiểu lầm |
|---|---|
| `model-is-documentation` | Model chỉ để viết tài liệu sau khi code |
| `uml-is-method` | UML tự nó là quy trình phát triển |
| `actor-is-person` | Actor luôn là cá nhân con người |
| `actor-is-internal` | Database/module nội bộ là actor |
| `usecase-is-click` | Mỗi thao tác UI là một use case |
| `nfr-is-vague` | “Nhanh”, “dễ dùng” đã là NFR đủ tốt |
| `association-is-link` | Association và object link là một |
| `aggregation-equals-composition` | Hai quan hệ whole/part có cùng lifetime |
| `inheritance-for-reuse-only` | Dùng inheritance chỉ vì trùng code |
| `entity-does-everything` | Entity nên chứa mọi business flow |
| `sequence-equals-communication` | Hai diagram có cùng trọng tâm và luôn thay thế nhau |
| `state-is-action` | State là một động từ tức thời |
| `event-determines-next-state` | Bỏ qua current state khi tính transition |
| `analysis-is-design` | Object analysis map thẳng sang component/task |
| `interface-is-implementation` | Interface mô tả thuật toán nội bộ |
| `async-is-faster` | Async luôn nhanh và đơn giản hơn sync |
| `soa-is-microservices` | SOA và microservices đồng nghĩa |
| `distribution-is-free` | Tách service không tạo failure/latency/consistency cost |
| `nfr-one-tactic` | Một tactic chỉ ảnh hưởng một quality attribute |
| `pattern-by-shape` | Chọn pattern vì class diagram giống mẫu |
| `singleton-global-default` | Cần dùng chung là dùng Singleton |
| `ai-output-is-design` | AI sinh diagram nghĩa là thiết kế đã hợp lệ |
| `uml-notation-confusion` | Nhầm ký hiệu/thuật ngữ mô hình hóa cơ bản (modeling, architecture, notation, design concept/strategy/method, PIM/PSM) |
| `lifecycle-model-confusion` | Nhầm giữa các mô hình vòng đời (waterfall/prototyping/spiral) hoặc giữa verification và validation, white-box và black-box testing |
| `oo-term-confusion` | Nhầm thuật ngữ OO cơ bản: object, class, attribute, operation, signature, encapsulation, data abstraction |
| `bce-role-confusion` | Nhầm vai trò Boundary/Entity/Control/Coordinator/Timer object trong class structuring |
| `usecase-concept-confusion` | Nhầm khái niệm use case (actor, alternative sequence, use case package) không liên quan include/extend |
| `architecture-view-confusion` | Nhầm giữa structural/dynamic/deployment view, architectural pattern, hoặc tiêu chí gom subsystem |
| `client-service-role-confusion` | Nhầm vai trò client/server/service trong architectural pattern client-service |
| `component-interface-confusion` | Nhầm provided/required interface, connector, port, transaction trong component-based design |
| `task-activation-confusion` | Nhầm cơ chế kích hoạt task (event-driven, periodic, demand-driven) hoặc active/passive object |
| `spl-feature-confusion` | Nhầm khái niệm SPL: feature, kernel class/system, variation point |

Misconception tag phải được lưu theo attempt để tạo personalized practice.

10 tag phía trên (từ `uml-notation-confusion` đến `spl-feature-confusion`) được thêm khi convert 198 câu glossary OOAD (nguồn: bộ flashcard do chủ dự án cung cấp, textbook Bahrami *Object Oriented Systems Development*) thành "Ngân Hàng Thuật Ngữ" (`webapp/src/content/term-bank/tb-01..11.json`). Đây là câu hỏi định nghĩa/recall thuật ngữ (không phải case FOS), nên tag ở mức "nhầm cụm khái niệm" thay vì misconception hành vi chi tiết như các tag case-study gốc.

## 7. Mastery và adaptive practice

### 7.1 Điểm lesson

- Core concept items: trọng số 2.
- Transfer item: trọng số 3.
- Retrieval item: trọng số 1.
- Mastery khi đạt ít nhất 80% và transfer item đúng sau tối đa hai hint.

### 7.2 Level Review

- 40% câu mới trong case chưa thấy.
- 40% câu kết hợp nhiều concept trong level.
- 20% spaced retrieval từ level trước.
- Đạt 75%; dưới ngưỡng tạo practice set 6-10 câu dựa trên misconception tags.

### 7.3 Forgetting check

Sau 2, 7 và 21 ngày, đưa một câu transfer ngắn cho concept quan trọng:

- actor/scope;
- multiplicity và composition;
- boundary/entity/control;
- sequence vs communication;
- state/event/guard;
- sync vs async;
- quality scenario;
- pattern intent.

## 8. Capstone

Capstone không chấm số lượng diagram. Mỗi artefact chỉ được điểm khi:

- giải quyết một câu hỏi thiết kế rõ;
- nhất quán với artefact trước;
- có trace identifier;
- nêu assumption;
- có ít nhất một alternative/trade-off.

Chi tiết tại `capstone-rubric.md`.

## 9. Analytics sự kiện

| Event | Thuộc tính bắt buộc |
|---|---|
| `lesson_started` | courseId, levelId, lessonId, priorMastery |
| `interaction_answered` | itemId, type, correct, attempt, hintUsed, misconceptionTags, durationMs |
| `diagram_changed` | itemId, action, elementType, validAfterAction |
| `lesson_mastered` | score, durationMs, retryCount |
| `review_completed` | score, weakConcepts, generatedPracticeCount |
| `capstone_submitted` | rubricVersion, artifactCount, traceCoverage |

Không ghi nội dung prompt AI hoặc tài liệu người học vào analytics nếu chưa có consent rõ ràng.

## 10. Accessibility

- Mọi drag-and-drop phải có thao tác bàn phím tương đương: chọn nguồn, chọn đích, xác nhận.
- Diagram có text alternative mô tả node và edge theo thứ tự logic.
- Animation timeline có pause, step forward và reduce motion.
- Không giới hạn thời gian cho câu hỏi học tập; timed challenge chỉ là tùy chọn.
- Thuật ngữ tiếng Anh có tooltip tiếng Việt và phát âm không bắt buộc.
- Công thức message notation và multiplicity phải đọc được bởi screen reader.

## 11. Localization và thuật ngữ

Dùng nhất quán:

| English | Cách trình bày trong khóa |
|---|---|
| software architecture | kiến trúc phần mềm (software architecture) ở lần đầu; sau đó dùng “kiến trúc” |
| use case | use case, không dịch thành “ca sử dụng” trong UI chính |
| actor | actor (vai trò bên ngoài) |
| boundary/entity/control | giữ tiếng Anh, kèm mô tả tiếng Việt |
| sequence diagram | biểu đồ tuần tự (sequence diagram) ở lần đầu |
| communication diagram | biểu đồ giao tiếp (communication diagram) ở lần đầu |
| quality attribute | thuộc tính chất lượng (quality attribute) |
| trade-off | trade-off/đánh đổi |

Không dịch identifier trong diagram hoặc code. Tên operation dùng lowerCamelCase và use case dùng động từ + danh từ.

## 12. QA trước phát hành

Mỗi lesson phải vượt các kiểm tra:

1. Source ref tồn tại và hỗ trợ claim.
2. Objective có thể quan sát/đánh giá được.
3. Hook có thể trả lời trước khi đọc explanation.
4. Mỗi distractor gắn misconception.
5. Đáp án không phụ thuộc wording mẹo.
6. Diagram đúng UML ở mức notation khóa học sử dụng.
7. Case fact nhất quán với FOS RDS.
8. Không vô tình đồng nhất SOAP/UDDI với toàn bộ SOA hiện đại.
9. AI lesson yêu cầu validation và không khuyến khích gửi dữ liệu nhạy cảm.
10. Keyboard, contrast, screen-reader alternative và reduced motion đã kiểm tra.

