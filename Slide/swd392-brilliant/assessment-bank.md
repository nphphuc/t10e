# Ngân hàng Level Review

Ngân hàng gồm 55 câu anchor. Khi sản xuất, mỗi câu cần thêm 1-2 biến thể cùng concept nhưng khác context/diagram. Ký hiệu `→` phân tách đáp án và feedback chuẩn.

## L01 - Modeling và UML views

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R01-01 | choice | Nhóm cần biết “external user nào khởi tạo chức năng nào”. Chọn diagram: Use case / Class / Deployment / State. | **Use case** → Diagram này mô tả actor và goal nhìn từ ngoài hệ thống. | `view-purpose` |
| R01-02 | match | Ghép: notation, method, strategy, criteria với “ký hiệu”, “chuỗi bước”, “định hướng”, “heuristic decomposition”. | notation-ký hiệu; method-chuỗi bước; strategy-định hướng; criteria-heuristic. | `uml-is-method` |
| R01-03 | choice | `order17:Order` có ý nghĩa gì? Class / Object instance / Operation / Actor. | **Object instance** → Tên object đứng trước dấu `:`, class đứng sau; object được underline trong UML. | `class-is-object` |
| R01-04 | multi | Chọn view cần dùng để điều tra message chậm vì component ở node xa: Interaction / Deployment / Use case / Class attributes. | **Interaction + Deployment** → Một view cho message flow, một view cho physical allocation. | `one-view-enough` |
| R01-05 | scenario | UML diagram có cần được vẽ sau khi code chỉ để documentation không? | **Không** → Model còn dùng để khám phá, kiểm tra và giao tiếp quyết định trước implementation. | `model-is-documentation` |

## L02 - Lifecycle và COMET

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R02-01 | order | Sắp xếp vòng spiral: Develop product; Analyze risks; Plan next cycle; Define objectives/alternatives/constraints. | Define → Analyze risks → Develop → Plan next. | `process-order` |
| R02-02 | choice | Review prototype với người dùng để biết hệ thống có giải quyết đúng nhu cầu là Verification hay Validation? | **Validation** → Kiểm tra “build the right system”. | `verify-vs-validate` |
| R02-03 | choice | Artefact UI làm nhanh để lấy feedback rồi bỏ đi là: production increment / throwaway prototype / evolutionary product / unit test. | **Throwaway prototype** → Mục tiêu là học về requirement, không phải phát triển thành production. | `prototype-is-product` |
| R02-04 | match | COMET: requirements, analysis, design với use case/actor; participating objects/interactions; components/interfaces. | Requirements-actor/use case; Analysis-objects/interactions; Design-components/interfaces. | `analysis-is-design` |
| R02-05 | scenario | Requirements rất không chắc chắn và có rủi ro kỹ thuật lớn. Chọn Waterfall thuần hay iterative risk-driven? | **Iterative risk-driven** → Feedback/prototype và risk analysis phải đến sớm. | `one-process-best` |

## L03 - Requirements và Use Case

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R03-01 | multi | Với FOS software scope, actor là: Customer; Google Auth; Product DB nội bộ; CheckoutController; Timer bên ngoài. | **Customer, Google Auth, Timer** → Actor nằm ngoài software boundary. | `actor-is-internal` |
| R03-02 | choice | Yêu cầu nào verifiable hơn? “Trang nhanh” / “95% page load <4s dưới 500 users” / “UI hiện đại” / “không lỗi”. | **95% page load <4s dưới 500 users** → Có environment và response measure. | `nfr-is-vague` |
| R03-03 | choice | Tên use case tốt nhất: Click Add / Product Button / Add Product / Product Screen. | **Add Product** → Động từ + đối tượng, biểu đạt outcome. | `usecase-is-click` |
| R03-04 | order | Sắp xếp: System validates input; Staff submits product; System shows form; System saves product; Staff enters data. | Show form → Enter → Submit → Validate → Save. | `flow-order` |
| R03-05 | choice | Login luôn xảy ra trước Checkout và được nhiều use case dùng. Quan hệ phù hợp: extend / include / generalization / composition. | **include** → Hành vi bắt buộc được tái dùng. | `include-vs-extend` |

## L04 - Static Modeling

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R04-01 | choice | `Jane works in Manufacturing` là association hay link? | **Link** → Đây là kết nối giữa hai instance; `Employee works in Department` mới là association. | `association-is-link` |
| R04-02 | choice | Customer có nhiều Order, mỗi Order thuộc đúng một Customer. FK nằm hợp lý ở đâu? | **Order** → Primary key phía “one” được đặt làm FK phía “many”. | `multiplicity-fk` |
| R04-03 | scenario | `OrderProduct` có Quantity và Price tại thời điểm mua. Nên là attribute của Product hay association class? | **Association class** → Dữ liệu thuộc quan hệ giữa Order và Product. | `relationship-data` |
| R04-04 | choice | Xóa Order thì OrderLine không còn ý nghĩa và không thuộc Order khác. Aggregation hay Composition? | **Composition** → Part phụ thuộc lifetime và ownership của whole. | `aggregation-equals-composition` |
| R04-05 | truefalse | Hai class có vài field giống nhau là đủ lý do tạo inheritance. | **False** → Cần quan hệ is-a/substitutability, không chỉ trùng code. | `inheritance-for-reuse-only` |

## L05 - Object Structuring

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R05-01 | match | ProductForm, Product, CheckoutCoordinator với boundary, entity, control. | ProductForm-boundary; Product-entity; CheckoutCoordinator-control. | `object-role` |
| R05-02 | choice | Use case chỉ đọc danh sách product qua một service. Có bắt buộc tạo control object riêng? | **Không** → Use case đơn giản có thể không cần control; tránh object proliferation. | `control-always` |
| R05-03 | choice | Discount rule thay đổi hàng tuần nhưng Product data ổn định. Đặt rule ở đâu? Product field / business logic object / UI / database actor. | **Business logic object** → Encapsulate phần thay đổi độc lập khỏi entity data. | `entity-does-everything` |
| R05-04 | choice | RouteOptimization encapsulate thuật toán có thể thay đổi: boundary / algorithm object / entity / actor. | **Algorithm object** → Trách nhiệm chính là thuật toán của problem domain. | `object-role` |
| R05-05 | truefalse | Service object thường chủ động gửi yêu cầu nghiệp vụ mới cho client khi không có request. | **False** → Service chủ yếu đáp ứng request; notification là pattern riêng cần contract rõ. | `service-initiates` |

## L06 - Dynamic Modeling

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R06-01 | choice | Muốn thấy topology object và liên kết giữa chúng rõ nhất: sequence hay communication diagram? | **Communication** → Sequence ưu tiên time ordering; communication ưu tiên connection layout. | `sequence-equals-communication` |
| R06-02 | order | Realize use case: determine messages; determine boundary; read use case; determine internal objects; model alternatives. | Read UC → Boundary → Internal objects → Messages → Alternatives. | `realization-order` |
| R06-03 | multi | Alternative “credit denied” có thể làm phát sinh: new message; new participating object; guard/alt branch; không thay đổi model bao giờ. | **Ba lựa chọn đầu** → Alternative flow là phần của behavior model. | `ignore-alternative` |
| R06-04 | match | Enabled; DisableNews; `[isStaff]`; `writeLog()` với state, event, guard, action. | Enabled-state; DisableNews-event; `[isStaff]`-guard; writeLog-action. | `state-is-action` |
| R06-05 | choice | Cùng event có luôn đưa mọi current state đến cùng next state không? | **Không** → Transition phụ thuộc current state, event và guard. | `ignore-current-state` |

## L07 - Architecture và Subsystem

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R07-01 | multi | Thuộc software architecture: subsystem; externally visible interface; relationship; local loop variable. | **Ba lựa chọn đầu** → Local implementation detail không phải architecture nếu không externally significant. | `architecture-is-code` |
| R07-02 | match | Structural, dynamic, deployment với class/component structure; message communication; node allocation. | Structural-structure; Dynamic-message; Deployment-node. | `view-purpose` |
| R07-03 | choice | Interface nên công bố gì? SQL nội bộ / externally visible operations / private data structure / source directory. | **Externally visible operations** → Interface là contract, không phải implementation. | `interface-is-implementation` |
| R07-04 | multi | Tiêu chí tách subsystem hợp lý: geography; client/service; scope of control; màu diagram. | **Ba lựa chọn đầu** → Separation dựa responsibility/deployment/control, không dựa trình bày. | `partition-by-appearance` |
| R07-05 | scenario | Từ bốn use-case communication diagram, bước cầu nối để tìm initial architecture là gì? | **Tích hợp thành integrated communication diagram** → Merge participating objects/messages và sau đó xác định subsystem. | `analysis-is-design` |

## L08 - Architecture Styles

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R08-01 | choice | Client gửi request, tiếp tục làm việc và cần response sau. Pattern: sync reply / async callback / fire-and-forget / broadcast. | **Async callback** → Client không block nhưng vẫn có response sau. | `async-is-faster` |
| R08-02 | choice | Broker trả handle để client gọi service trực tiếp nhiều lần. Lợi ích chính? | **Giảm traffic qua broker** → Đổi lại phải quản lý handle/location validity. | `broker-pattern` |
| R08-03 | multi | ACID gồm: Atomicity, Consistency, Isolation, Durability, Discoverability. | **A,C,I,D** → Discoverability là service principle, không phải transaction property. | `acid` |
| R08-04 | match | Sensor interrupt, sample nhiệt độ mỗi giây, xử lý message nội bộ với event-driven I/O, periodic I/O, demand-driven task. | Interrupt-event-driven I/O; sample-periodic I/O; internal message-demand-driven. | `task-activation` |
| R08-05 | scenario | Hệ thống nhỏ một team, yêu cầu ổn định, không scale độc lập. Có nên tách 20 microservice ngay? | **Không** → Distribution cost phải được biện minh bằng quality/organizational need. | `distribution-is-free` |

## L09 - Quality Attributes

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R09-01 | choice | “Có thể thêm loại thanh toán mới trong 2 ngày, sửa không quá 3 module” đo thuộc tính nào? | **Modifiability** → Scenario đo chi phí/ảnh hưởng của change. | `quality-scenario` |
| R09-02 | truefalse | Tăng encryption luôn cải thiện mọi quality attribute. | **False** → Security có thể tăng CPU/latency và operational complexity. | `nfr-one-tactic` |
| R09-03 | match | Throughput, recovery after failure, reuse across apps, trace requirement-to-code với performance, availability, reusability, traceability. | Ghép theo tên tương ứng. | `quality-confusion` |
| R09-04 | scenario | FOS cần mobile dùng chung business capability. Quality driver trực tiếp nhất cho tách service là gì? | **Reusability** → Cũng có modifiability, nhưng requirement nêu dùng lại capability giữa platform. | `quality-driver` |
| R09-05 | multi | Quality scenario tốt cần: stimulus/context; measurable response; stakeholder/goal; từ “nhanh” duy nhất. | **Ba lựa chọn đầu** → Tính từ đơn lẻ không test được. | `nfr-is-vague` |

## L10 - Design Patterns

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R10-01 | choice | Nhiều payment algorithm chọn runtime: State / Strategy / Singleton / Builder. | **Strategy** → Family algorithm thay đổi độc lập với context. | `state-vs-strategy` |
| R10-02 | choice | Tích hợp legacy TextView có interface không tương thích Shape: Adapter / Bridge / Proxy / Facade. | **Adapter** → Chuyển interface mà client mong đợi. | `pattern-by-shape` |
| R10-03 | choice | Thêm scroll/border động cho từng UI component: Decorator / Composite / Flyweight / Abstract Factory. | **Decorator** → Bọc cùng interface để thêm responsibility runtime. | `wrapper-intent` |
| R10-04 | choice | Hàng nghìn glyph chia sẻ intrinsic font shape, position là extrinsic: Flyweight / Proxy / Memento / Visitor. | **Flyweight** → Chia sẻ state chung để giảm memory. | `wrapper-intent` |
| R10-05 | scenario | Team chọn Singleton cho mọi service “vì cần dùng ở nhiều nơi”. Phản biện quan trọng nhất? | **Global state/tight coupling và test khó** → Chỉ dùng khi exactly-one-instance là invariant thật. | `singleton-global-default` |

## L11 - Case Study và AI

| ID | Type | Prompt và lựa chọn | Đáp án, feedback | Tag |
|---|---|---|---|---|
| R11-01 | order | Trace chain: C# method; use case step; service operation/message; design class; requirement goal. | Requirement goal → Use case step → message/operation → design class → C# method. | `traceability` |
| R11-02 | choice | Banking Withdraw Funds cần debit và dispense/commit nhất quán. Concern nổi bật: color theme / transaction/state / file format / typography. | **Transaction/state** → Failure và partial completion phải được mô hình hóa. | `case-driver` |
| R11-03 | choice | AGV có deadline và sensor event. Architecture emphasis: real-time task/synchronization / CRUD only / report layout / Singleton. | **Real-time task/synchronization** → Activation, priority và blocking ảnh hưởng deadline. | `case-driver` |
| R11-04 | multi | Sau khi AI sinh UML, cần kiểm tra: scope; notation; trace; assumptions/trade-offs; chỉ syntax code. | **Bốn lựa chọn đầu** → Syntax đúng không đảm bảo model/decision đúng. | `ai-output-is-design` |
| R11-05 | scenario | AI đề xuất microservices nhưng không nêu scale, team boundary hay failure handling. Quyết định? | **Yêu cầu evidence, so sánh alternative và bổ sung quality scenarios** → Không chấp nhận architecture chỉ vì tên công nghệ. | `ai-output-is-design` |

## Quy tắc tạo biến thể

- Thay tên domain nhưng giữ reasoning: FreshFood ↔ Library ↔ Banking ↔ Food Delivery.
- Không chỉ đảo thứ tự option; cần đổi data/constraint để kiểm tra transfer.
- Với visual item, tạo một lỗi chính và tối đa hai lỗi phụ để feedback có trọng tâm.
- Câu review phải có ít nhất một đáp án sai “hấp dẫn” vì phản ánh misconception thật.
- Không dùng câu hỏi định nghĩa thuần túy quá 20% tổng ngân hàng.

