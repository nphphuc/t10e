# Course Blueprint - SWD392: Software Design & Architecture

## Câu chuyện học tập

Người học đóng vai kiến trúc sư tập sự cho **FreshFood Online System (FOS)**. Ở đầu khóa, họ chỉ có một mô tả nghiệp vụ dài và nhiều mâu thuẫn. Qua từng level, họ biến mô tả đó thành yêu cầu có thể kiểm thử, mô hình UML, kiến trúc, quyết định pattern và cuối cùng là một RDS có thể truy vết đến mã nguồn.

Mỗi bài có cấu trúc mặc định:

1. **Predict:** chọn hoặc dự đoán trước khi được giải thích.
2. **Manipulate:** kéo-thả actor, class, message, state hoặc component.
3. **Explain:** giải thích ngắn sau khi người học đã thử.
4. **Contrast:** phân biệt với một khái niệm dễ nhầm.
5. **Apply:** áp dụng vào FOS hoặc một case study khác.
6. **Retrieve:** một câu gợi nhớ kiến thức level trước.

## Tổng quan 11 level

| Level | Chủ đề | Số bài | Sản phẩm tích lũy |
|---|---|---:|---|
| L01 | Nhìn hệ thống trước khi viết code | 6 | View map và UML diagram selector |
| L02 | Vòng đời và COMET | 6 | Lựa chọn process và trace chain |
| L03 | Requirements và Use Case | 7 | Requirements model cho FOS |
| L04 | Static Modeling | 7 | Context/entity class model |
| L05 | Object & Class Structuring | 5 | Boundary-entity-control map |
| L06 | Dynamic Modeling | 7 | Interaction và state model |
| L07 | Từ Analysis đến Architecture | 7 | Subsystem/interface architecture |
| L08 | Architecture Style Lab | 9 | Architecture decision cho một scenario |
| L09 | Quality Attributes và Trade-off | 5 | Quality scenarios và trade-off matrix |
| L10 | Design Pattern Toolbox | 7 | Pattern decision record |
| L11 | Case Study Studio và AI Capstone | 6 | RDS hoàn chỉnh và design defense |

---

## L01 - Nhìn hệ thống trước khi viết code

**Mục tiêu level:** Phân biệt model, method, notation, architecture và chọn đúng UML view cho một câu hỏi thiết kế.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L01-01 | Tại sao phải model trước khi code? | Cho hai nhóm bắt đầu cùng một yêu cầu: một nhóm code ngay, một nhóm dựng model; người học dự đoán nhóm nào phát hiện scope error trước. | Model là công cụ suy nghĩ, giao tiếp và kiểm tra giả định trước chi phí implementation. | 8 | Ch01 s2,s4 |
| L01-02 | Concept, strategy, criteria, method hay notation? | Kéo năm thẻ mô tả vào năm khái niệm; feedback chỉ ra vì sao “UML” không phải một development method. | Notation biểu diễn; method chỉ thứ tự làm; strategy định hướng; criteria hỗ trợ decomposition; concept là ý tưởng nền. | 9 | Ch01 s5-s6 |
| L01-03 | Bảy góc nhìn của một hệ thống | Xoay một “lăng kính kiến trúc” để lần lượt hiện use case, static, interaction, state, component, concurrent, deployment. | Không diagram nào mô tả đủ hệ thống; mỗi view trả lời một nhóm câu hỏi. | 10 | Ch01 s3,s7 |
| L01-04 | Class không phải object | Chọn ký hiệu đúng cho `Account` và `maryAccount:Account`, sau đó sửa lỗi underline. | Class là type; object là instance; attribute và operation thuộc contract của class. | 8 | Ch02 s3-s6; Ch04 s3-s4 |
| L01-05 | Diagram nào trả lời câu hỏi nào? | Ghép câu hỏi “ai dùng?”, “cấu trúc ra sao?”, “message theo thứ tự nào?”, “chạy trên node nào?” với diagram. | Use case, class, interaction, state và deployment diagram có mục đích khác nhau. | 10 | Ch02 s2-s12 |
| L01-06 | Level Review: UML View Detective | Điều tra một hệ thống đặt món bị lỗi; chọn tối thiểu ba view cần xem và sắp xếp thứ tự khảo sát. | Người thiết kế giỏi chọn view theo quyết định cần đưa ra, không theo diagram quen tay. | 12 | Ch01-Ch02 |

**Spaced retrieval:** L01-06 hỏi lại class/object sau ba bài và buộc dùng đồng thời requirements, dynamic và deployment view.

---

## L02 - Vòng đời và COMET

**Mục tiêu level:** So sánh process model theo rủi ro và phản hồi; giải thích trace từ use case qua analysis/design đến test.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L02-01 | Waterfall dưới áp lực thay đổi | Thanh timeline cho phép kéo một requirements error từ đầu dự án đến lúc system test; chi phí sửa tăng theo độ trễ. | Waterfall rõ phase nhưng phản hồi muộn và không thể hiện tốt overlap/iteration. | 9 | Ch03 s2-s3 |
| L02-02 | Prototype để học, increment để giao | Phân loại ba artefact thành throwaway prototype, evolutionary prototype hoặc production increment. | Prototype giảm uncertainty; increment tạo phần hệ thống vận hành được; không được biến throwaway code thành production vô thức. | 10 | Ch03 s4-s8 |
| L02-03 | Spiral và RUP: tổ chức iteration | Người học xoay spiral qua objective-risk-develop-plan, rồi ghép RUP phase với mục tiêu. | Spiral dùng risk điều khiển iteration; RUP tổ chức lifecycle thành phase và workflow lặp. | 10 | Ch03 s9-s10 |
| L02-04 | Build the right system, build the system right | Chọn validation hay verification cho prototype review, requirements review, design review và performance analysis. | Validation kiểm tra nhu cầu; verification kiểm tra artefact có tuân theo artefact trước đó. | 9 | Ch03 s11-s12 |
| L02-05 | COMET nối yêu cầu với kiến trúc | Xây dây chuyền actor/use case → participating objects → interactions → subsystem/interface → test. | COMET là use-case-driven, iterative và object-oriented; use case tạo trace xuyên requirements, analysis, design và test. | 11 | Ch05 s3-s12,s15-s18 |
| L02-06 | Level Review: Chọn process theo rủi ro | Bốn dự án có độ ổn định yêu cầu, safety và time-to-market khác nhau; người học chọn process và giải thích trade-off. | Không có process tốt nhất cho mọi dự án; quyết định phụ thuộc uncertainty, risk và feedback cost. | 13 | Ch03; Ch05 |

---

## L03 - Requirements và Use Case

**Mục tiêu level:** Biến mô tả nghiệp vụ thành requirements model có scope, actor, use case và flow kiểm thử được.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L03-01 | Nhìn hệ thống như một black box | Che toàn bộ implementation của FOS; người học chỉ được kéo input/output và external entity vào biên hệ thống. | Requirements nói hệ thống phải cung cấp gì, không quyết định sớm cách cài đặt. | 9 | Ch06 s3-s5; FOS p4-p9 |
| L03-02 | Functional hay quality requirement? | Phân loại yêu cầu; sau đó sửa “hệ thống phải nhanh” thành response-time scenario có workload và ngưỡng. | Functional requirement mô tả capability; nonfunctional requirement đặt ràng buộc/chất lượng và cần đo được. | 10 | Ch06 s5-s6; FOS p8 |
| L03-03 | Actor là vai trò, không phải người | Kéo Customer, Warehouse Staff, Google Auth, Timer và Database vào/ngoài system boundary. | Actor luôn ở ngoài scope và đại diện vai trò; primary actor khởi tạo để đạt giá trị, secondary actor hỗ trợ. | 9 | Ch06 s7-s13; FOS p6-p8 |
| L03-04 | Tìm use case có giá trị | Từ 18 động từ nhỏ của FOS, nhóm thành các goal như `Manage Products` và loại các thao tác UI không tạo outcome độc lập. | Use case là chuỗi tương tác mang lại outcome có giá trị; tên dùng động từ + đối tượng. | 11 | Ch06 s14-s16; FOS p4-p6 |
| L03-05 | Viết main flow có thể kiểm thử | Sắp xếp trigger, precondition, main steps, alternative, exception và postcondition của `Add Product`. | Use case specification phải đủ rõ để tạo test và không trộn chi tiết giao diện không cần thiết. | 12 | Ch06 s17; FOS p15-p22 |
| L03-06 | Include, extend và activity flow | Sửa diagram quản lý cart/login; sau đó nối decision, loop và alternate flow trong activity diagram. | `include` là hành vi bắt buộc dùng lại; `extend` là hành vi tùy điều kiện; activity diagram làm rõ control flow. | 11 | Ch06 s18-s20; FOS p9-p24 |
| L03-07 | Level Review: Requirements Sprint cho FOS | Từ một đoạn problem description mới, tạo context, actor map, ba use case và một quality scenario. | Requirements tốt phải correct, complete, unambiguous, consistent, verifiable, modifiable và traceable. | 16 | Ch06; FOS I.1-I.5 |

---

## L04 - Static Modeling

**Mục tiêu level:** Xây class model mô tả cấu trúc dữ liệu và quan hệ mà không lẫn flow xử lý.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L04-01 | Từ noun đến class, từ value đến attribute | Chọn noun candidate trong mô tả FOS; loại UI label và giá trị cụ thể; tạo `Product`, `Category`, `Supplier`. | Class đại diện tập đối tượng cùng đặc trưng; attribute phân biệt các instance. | 9 | Ch07 s3-s6; FOS p24-p30 |
| L04-02 | Association, link và multiplicity | Kéo multiplicity cho Customer-Order, Category-Product; mô phỏng một link instance. | Association là quan hệ giữa class; link là instance; multiplicity thể hiện số instance hợp lệ. | 10 | Ch07 s7-s9 |
| L04-03 | Quan hệ có dữ liệu riêng | Chọn khi nào cần unary, ternary hoặc association class; thêm `HoursWorked` và `OrderProduct`. | Nếu thuộc tính mô tả chính quan hệ, association class thường là mô hình đúng. | 10 | Ch07 s10-s11; FOS p42-p43 |
| L04-04 | Composition hay aggregation? | Xóa “whole” và quan sát lifetime của part trong ba scenario; kéo diamond phù hợp. | Composition ràng buộc lifetime và ownership mạnh; aggregation là whole/part yếu hơn. | 9 | Ch07 s12-s14 |
| L04-05 | Generalization không chỉ để tái dùng code | Trích common properties của Checking/Savings Account; kiểm tra quan hệ “is-a” bằng substitution. | Superclass gom thuộc tính/operation chung; subclass kế thừa và chuyên biệt hóa. | 10 | Ch07 s15-s16 |
| L04-06 | Vẽ đúng biên và đúng stereotype | Phân biệt system context, software context; gắn `external user`, `external system`, `device`, `entity`. | Context model xác định inside/outside; stereotype diễn đạt vai trò của class trong mô hình. | 11 | Ch07 s17-s25; FOS p6-p8 |
| L04-07 | Level Review: Data Model Clinic | Sửa một class diagram FOS có 10 lỗi: multiplicity, association class, composition, inheritance và scope. | Static model phải nhất quán với data requirements và không chứa thứ tự message. | 15 | Ch07; FOS I.6 |

---

## L05 - Object & Class Structuring

**Mục tiêu level:** Gán trách nhiệm đúng cho boundary, entity, control và application-logic objects.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L05-01 | Boundary, entity hay control? | Thả `ProductForm`, `Product`, `ManageProductController` vào ba vùng; simulation hiện coupling khi đặt sai. | Boundary giao tiếp với bên ngoài; entity giữ thông tin; control điều phối use case. | 9 | Ch08 s3-s9 |
| L05-02 | Khi nào cần control object? | So sánh `View Product` đơn giản với `Checkout` nhiều service; chọn stateless coordinator, state-dependent control hoặc timer. | Use case phức tạp cần control; state-dependent control phản ứng phụ thuộc current state. | 10 | Ch08 s9-s11 |
| L05-03 | Tách business rule khỏi dữ liệu | Di chuyển discount rule ra khỏi Product entity và quan sát testability/modifiability. | Business logic nên được encapsulate khi thay đổi độc lập với entity data. | 9 | Ch08 s12-s13 |
| L05-04 | Algorithm object và service object | Phân loại route optimization, pricing algorithm, inventory service; kiểm tra ai được phép khởi tạo request. | Algorithm object đóng gói thuật toán; service object phản hồi request và hướng đến reuse. | 9 | Ch08 s14-s17 |
| L05-05 | Level Review: Responsibility Sorting | Phân loại 18 object candidate của FOS, loại “god object” và giải thích từng responsibility. | Structuring tốt gom trách nhiệm liên quan, che giấu phần dễ đổi và giảm coupling. | 14 | Ch08; FOS p30-p36 |

---

## L06 - Dynamic Modeling

**Mục tiêu level:** Hiện thực hóa use case bằng object interaction và state machine nhất quán.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L06-01 | Communication diagram: ai nói với ai? | Nối participating objects của `View Alarms`, sau đó đánh số message theo sequence. | Communication diagram nhấn mạnh topology và liên kết giữa object. | 9 | Ch09-11 s3-s5 |
| L06-02 | Sequence diagram: khi nào message xảy ra? | Kéo lifeline, activation và message; thêm loop/alt fragment cho checkout. | Sequence diagram nhấn mạnh thời gian và thứ tự, phù hợp flow dài/phức tạp. | 10 | Ch09-11 s6-s8 |
| L06-03 | Hai diagram, một interaction | Chuyển cùng model qua lại sequence/communication và phát hiện message bị thiếu. | Hai biểu diễn có thông tin gần tương đương nhưng tối ưu cho câu hỏi khác nhau. | 9 | Ch09-11 s4-s8 |
| L06-04 | Stateless realization từng bước | Từ use case `View Alarms`, chọn boundary/internal object, message và alternative. | Realization phải bắt đầu từ actor-system flow và giữ trace về use case step. | 11 | Ch09-11 s9-s11 |
| L06-05 | Alternative flow không phải ghi chú phụ | Xây `Make Order Request`; credit card denied tạo nhánh nhưng không phá postcondition logic. | Alternative scenario cần object/message bổ sung và phải được mô hình hóa, không chỉ viết cuối tài liệu. | 12 | Ch09-11 s12-s16 |
| L06-06 | State, event, guard và action | Điều khiển News qua Enabled/Disabled và ATM qua PIN states; sửa nhầm state với action. | Next state phụ thuộc current state và event; guard giới hạn transition; action xảy ra khi transition. | 11 | Ch09-11 s17-s26; FOS p37 |
| L06-07 | Level Review: Realize Add Product | Tạo interaction model và state assumptions cho FOS; kiểm tra message có khớp use case flow. | Dynamic model đúng phải đầy đủ participating objects, thứ tự message, branch và trace. | 16 | Ch09-11; FOS p30-p37 |

---

## L07 - Từ Analysis đến Architecture

**Mục tiêu level:** Tổng hợp các use-case realization thành subsystem, interface và communication architecture.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L07-01 | Architecture gồm những gì? | Chọn element, externally visible property và relationship trong một sơ đồ; loại internal local variable. | Architecture mô tả structure, visible properties và quan hệ ở mức ảnh hưởng hệ thống. | 9 | Ch12 s3-s4 |
| L07-02 | Structural, dynamic và deployment view | Cùng một FOS architecture được xoay qua class, communication và deployment view. | Static nói cấu trúc; dynamic nói message; deployment nói phân bổ lên physical node. | 9 | Ch12 s5-s7 |
| L07-03 | Component, interface và connector | Kéo provided/required operation vào interface; chọn sync/async connector và quan sát coupling. | Interface là contract tách khỏi implementation; connector chứa protocol giao tiếp. | 10 | Ch04 s14; Ch12 s4,s16-s17 |
| L07-04 | Architectural pattern cơ bản | So sánh layers, call/return, asynchronous queue và synchronous request/reply bằng timeline tương tác. | Structure pattern và communication pattern giải quyết loại vấn đề khác nhau. | 11 | Ch12 s8-s15 |
| L07-05 | Tích hợp interaction thành kiến trúc | Chồng bốn communication diagram FOS, merge object trùng và aggregate message. | Integrated communication diagram là cầu nối từ per-use-case analysis sang initial architecture. | 12 | Ch13 s3-s9; FOS p37-p38 |
| L07-06 | Cắt subsystem theo separation of concerns | Thử chia theo composite lifetime, geography, client/service, user interface, external device và scope of control. | Subsystem tốt có responsibility rõ, cohesion cao, interface nhỏ và có thể thiết kế độc lập. | 12 | Ch13 s10-s22 |
| L07-07 | Level Review: Message & Subsystem Studio | Thiết kế subsystem map FOS và quyết định sync/async, direction, message name/parameter. | Phân chia subsystem và communication semantics là quyết định thiết kế, không thể sao chép máy móc từ analysis. | 16 | Ch13 s23-s25; FOS p38-p41 |

---

## L08 - Architecture Style Lab

**Mục tiêu level:** Chọn và phác thảo architecture phù hợp với distribution, autonomy, concurrency, data và transaction needs.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L08-01 | Object-oriented architecture và class contract | Thiết kế interface cho Account với pre/postcondition/invariant; bật polymorphic binding. | OO architecture dùng information hiding và stable interface để cô lập thay đổi. | 11 | Ch14 s3-s23 |
| L08-02 | Client/server và multi-tier | Phân phối client, service và intermediate tier; dự đoán dependency direction. | Client yêu cầu service; multi-tier thêm tầng vừa là client vừa là service. | 10 | Ch15 s3-s9 |
| L08-03 | Request/reply, callback và middleware | Chạy ba timeline khi service chậm; chọn sync, async callback và vai trò middleware. | Communication pattern quyết định blocking, throughput, complexity và coupling. | 11 | Ch15 s10-s18 |
| L08-04 | Từ entity model đến relational design | Map Product, Customer-Order, association class và inheritance sang table, PK/FK. | Database wrapper che SQL; mapping quan hệ phải bảo toàn identity và multiplicity. | 13 | Ch15 s19-s42; FOS p42-p43 |
| L08-05 | SOA: service contract và discovery | Đăng ký, tìm và gọi service qua broker; so sánh forwarding với handle. | SOA ưu tiên loose coupling, autonomy, contract, reuse, composability, statelessness và discoverability. | 12 | Ch16 s3-s13 |
| L08-06 | Transaction và coordination | Khóa debit/credit vào two-phase commit; sau đó thử compound/long-living transaction và orchestration/choreography. | Atomicity không tự xuất hiện trong distributed system; coordination có trade-off về coupling và failure. | 13 | Ch16 s14-s28 |
| L08-07 | Component-based architecture | Ghép provided/required interfaces, connector, composite component và node deployment cho EMS. | Distributed component là concurrent unit có interface rõ; deployment phải xét autonomy, performance và hardware. | 11 | Ch17 s3-s23 |
| L08-08 | Concurrent và real-time task architecture | Phân loại event-driven I/O, periodic, demand-driven, control và user-interaction task; chọn synchronization. | Task boundary xuất phát từ activation/timing/control; sync/async semantics ảnh hưởng deadline và blocking. | 14 | Ch18 s2-s34 |
| L08-09 | Level Review: Architecture Decision Arena | Chọn architecture cho banking, shopping, emergency monitoring và AGV; bảo vệ quyết định trước một thay đổi requirement. | Architecture là tập trade-off theo context, không phải bảng xếp hạng style. | 18 | Ch14-Ch18; Ch21-Ch24 |

---

## L09 - Quality Attributes và Trade-off

**Mục tiêu level:** Viết quality scenario đo được và giải thích cách một quyết định kiến trúc cải thiện thuộc tính này nhưng có thể làm xấu thuộc tính khác.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L09-01 | Từ “nhanh và dễ dùng” đến scenario đo được | Điền stimulus, environment, response và measure cho FOS performance/usability. | Quality requirement phải quan sát/đo được; tính từ mơ hồ không đủ để thiết kế hoặc test. | 10 | Ch20 s3,s15; FOS p8 |
| L09-02 | Khả năng thay đổi và kiểm thử | Xem một “god module” rồi tách encapsulation/interface; đo blast radius và test seam. | Maintainability, modifiability, testability và traceability liên quan nhưng không đồng nghĩa. | 11 | Ch20 s4-s9 |
| L09-03 | Scale, reuse, performance, security, availability | Chọn tactic cho từng quality attribute và phát hiện tactic gây hại thuộc tính khác. | Quality attributes cạnh tranh tài nguyên và complexity; cần ưu tiên theo scenario. | 12 | Ch20 s10-s14 |
| L09-04 | FOS tiến hóa: client/server → SOA → microservices | Thêm mobile, nhiều cửa hàng và concurrent users; chọn điểm tách service, registry và load balancing. | Architecture chỉ nên tiến hóa khi quality requirements mới biện minh cho chi phí distribution. | 14 | FOS p51-p55; Ch16 |
| L09-05 | Level Review: Trade-off Board | Phân bổ 100 điểm ưu tiên và chọn architecture/tactic; mỗi lựa chọn làm thay đổi radar chất lượng. | “Tốt hơn” phải gắn với stakeholder priority và evidence, không phải xu hướng công nghệ. | 16 | Ch20; FOS NF-01..NF-06 |

---

## L10 - Design Pattern Toolbox

**Mục tiêu level:** Nhận diện design pressure, chọn pattern phù hợp và mô tả consequence/anti-pattern.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L10-01 | Pattern là quyết định, không phải hình UML | Hoàn thiện template name-context-problem-solution-consequence; phát hiện pattern overuse. | Pattern là lời giải lặp lại trong context, luôn có lợi ích và chi phí. | 10 | Patterns s3-s16 |
| L10-02 | Tạo object mà không khóa concrete type | Chọn Abstract Factory, Builder, Factory Method, Prototype hoặc Singleton cho năm pressure khác nhau. | Creational patterns kiểm soát variation trong creation; Singleton không phải mặc định cho global access. | 12 | Patterns s17-s33 |
| L10-03 | Kết nối interface và hierarchy | Sửa incompatibility bằng Adapter; tách abstraction/implementation bằng Bridge; dựng tree bằng Composite. | Adapter đổi interface; Bridge tách hai chiều biến đổi; Composite đồng nhất leaf và group. | 12 | Patterns s34-s46 |
| L10-04 | Thêm trách nhiệm và kiểm soát truy cập | Thử Decorator, Facade, Flyweight, Proxy trên UI, subsystem, glyph và remote image. | Các pattern có cấu trúc giống wrapping nhưng intent khác nhau. | 12 | Patterns s47-s58 |
| L10-05 | Phân phối request và notification | Mô phỏng Chain of Responsibility, Observer, Mediator và Command cho order/notification UI. | Behavioral pattern quản lý coupling giữa sender, receiver và interaction policy. | 13 | Patterns s59-s67,s73-s75,s87-s88 |
| L10-06 | Thay đổi algorithm, state và operation | So sánh Iterator, Memento, State, Strategy, Template Method và Visitor bằng change scenario. | Chọn pattern theo “điều gì cần thay đổi độc lập”, không theo class diagram trông giống nhau. | 14 | Patterns s68-s86 |
| L10-07 | Level Review: Pattern Selection Clinic | Chọn pattern cho payment, notification, undo, import adapter, document export; phải nêu một consequence. | Câu trả lời chỉ được tính đúng khi pattern giải quyết đúng pressure và trade-off được thừa nhận. | 18 | Patterns s1-s89; GenAI s11-s14 |

---

## L11 - Case Study Studio và AI Capstone

**Mục tiêu level:** Tổng hợp toàn bộ quy trình, so sánh architecture qua case study và bảo vệ một thiết kế có AI hỗ trợ.

| ID | Bài học | Hook và tương tác chính | Kết luận cốt lõi | Phút | Nguồn |
|---|---|---|---|---:|---|
| L11-01 | Banking: từ ATM use case đến client/server | Lần theo `Withdraw Funds` qua use case, objects, messages, ATM statechart, subsystem, database và deployment. | Một architecture tốt giữ trace xuyên nhiều view và xử lý cả state lẫn transaction. | 16 | Ch21 s2-s45 |
| L11-02 | Online Shopping: phối hợp nhiều service | Ghép Customer Account, Credit Card, Delivery Order, Email và coordinator; chọn orchestration/choreography. | SOA hiệu quả khi service autonomous/reusable và workflow được tách khỏi service core. | 14 | Ch22 s2-s19 |
| L11-03 | Emergency Monitoring: component và group message | Nối sensor, alarm service, operator presentation; chọn broadcast hoặc subscribe/notify. | Component-based architecture phù hợp cấu hình phân tán và publisher/subscriber interaction. | 13 | Ch23 s2-s21 |
| L11-04 | AGV: deadline thay đổi thiết kế | Phân loại task, message và node cho Automated Guided Vehicle; tìm blocking call nguy hiểm. | Real-time design được điều khiển bởi timing, event source, priority và synchronization. | 14 | Ch24 s2-s20 |
| L11-05 | FreshFood RDS: trace từ requirement đến code | Điều tra một trace bị đứt giữa use case, sequence message, service operation, class và C# method; sửa architecture evolution. | RDS là chuỗi lập luận có truy vết, không phải tập diagram rời rạc. | 18 | FOS p4-p55 |
| L11-06 | AI-assisted Capstone và Design Defense | Dùng AI đề xuất actor, UML, pattern và architecture cho Online Food Delivery; người học đánh dấu assumption, sửa lỗi và bảo vệ trade-off. | AI là trợ lý tạo phương án; con người chịu trách nhiệm validation, consistency và quyết định cuối cùng. | 25 + dự án | GenAI s2-s18; toàn khóa |

## Nhịp ôn tập liên level

- L03 truy hồi black-box view từ L01 và V&V từ L02.
- L04 dùng actors/context từ L03 nhưng yêu cầu chuyển từ behavioral sang structural reasoning.
- L06 bắt buộc dùng object roles từ L05 và use case steps từ L03.
- L07 tích hợp diagram của L06 và class responsibilities của L04-L05.
- L08 interleave quality hints để chuẩn bị L09.
- L10 bắt buộc nêu consequence để chuẩn bị design defense ở L11.
- L11 không giới thiệu khái niệm kiến trúc mới; toàn bộ là transfer, integration và critique.

## Quy tắc mở khóa

- Lesson concept: đạt 80% hoặc hoàn thành một vòng retry có giải thích.
- Level Review: tối thiểu 75%; nếu thấp hơn, hệ thống tạo practice set từ misconception tags.
- L08 chỉ mở khi L06 và L07 đã đạt mastery vì architecture style không nên học như catalog rời.
- L11-06 chỉ mở khi tất cả Level Review đạt ít nhất 75%.

