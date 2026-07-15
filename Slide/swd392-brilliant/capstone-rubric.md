# Capstone - Thiết kế Online Food Delivery System

## Bối cảnh

Thiết kế một nền tảng giao đồ ăn có các bên:

- Customer duyệt menu, đặt và theo dõi đơn theo thời gian thực.
- Restaurant nhận đơn, xác nhận và cập nhật trạng thái chuẩn bị.
- Driver nhận nhiệm vụ và cập nhật vị trí/trạng thái giao hàng.
- Payment Provider xử lý thanh toán.
- Notification Provider gửi cập nhật.
- Operations Staff xử lý ngoại lệ và theo dõi hệ thống.

Quality drivers ban đầu:

- Hàng nghìn đơn đồng thời vào giờ cao điểm.
- Cập nhật trạng thái đến người dùng trong tối đa 3 giây ở percentile 95.
- Payment không được ghi nhận hai lần.
- Delivery và notification có thể tạm gián đoạn mà không làm mất order.
- Có thể mở rộng sang nhiều thành phố và thêm payment provider.
- Dữ liệu vị trí và thanh toán cần được bảo vệ.

## Sản phẩm phải nộp

### Gate 1 - Requirements

1. System/software context có scope rõ.
2. Actor map, phân biệt primary/secondary actor.
3. Tối thiểu tám use case theo goal.
4. Hai use case specification đầy đủ main/alternative/exception flow.
5. Năm quality scenario đo được.

### Gate 2 - Analysis

1. Entity class model có multiplicity và ít nhất một association class nếu hợp lý.
2. Boundary/entity/control/application-logic map.
3. Một sequence diagram và một communication diagram cho cùng use case.
4. Một state machine cho Order hoặc Delivery Task.
5. Trace từ từng message về use case step.

### Gate 3 - Architecture

1. Integrated communication hoặc equivalent synthesis view.
2. Subsystem/component map và provided/required interfaces.
3. Deployment view.
4. Quyết định sync/async/callback/event cho các boundary chính.
5. So sánh ít nhất hai architecture alternatives.
6. Một architecture decision chọn phương án cuối cùng theo quality drivers.

### Gate 4 - Detailed Design

1. Hai class/service interface specifications có pre/postcondition/error semantics.
2. Một transaction/failure design cho payment/order.
3. Ít nhất hai design patterns, mỗi pattern có context, problem và consequence.
4. Mapping một entity relationship sang relational schema hoặc data store design.
5. Mapping một interaction path sang pseudo-code/API signatures.

### Gate 5 - Validation và Design Defense

1. Consistency checklist giữa requirements, diagrams, interfaces và code mapping.
2. Traceability matrix.
3. Một change scenario: thêm scheduled order hoặc cash-on-delivery.
4. Impact analysis cho change scenario.
5. Video/phiên trình bày 8 phút hoặc tài liệu defense tương đương.

## Quy tắc trace ID

- Functional requirement: `FR-xx`
- Quality requirement: `QR-xx`
- Use case: `UC-xx`
- Analysis class/object: `A-xx`
- Message: `M-UCxx-nn`
- Component/service: `C-xx`
- Interface/operation: `I-xx`/`OP-xx`
- Architecture decision: `AD-xx`
- Test/validation evidence: `T-xx`

Một trace hợp lệ ví dụ:

`FR-03 → UC-04.PlaceOrder step 6 → M-UC04-08.authorizePayment → OP-07.Payment.authorize → C-05.PaymentService → T-12`

## Rubric 100 điểm

| Hạng mục | Điểm | Mức đạt đầy đủ |
|---|---:|---|
| Scope và requirements | 15 | Actor/use case đúng goal; NFR đo được; không lẫn implementation |
| Static/object structuring | 12 | Quan hệ/multiplicity đúng; responsibility phân bổ hợp lý |
| Dynamic behavior | 14 | Main/alternative/state flow đầy đủ; message trace được |
| Architecture synthesis | 17 | Subsystem/interface/communication/deployment nhất quán |
| Quality và trade-off | 14 | Chọn architecture từ quality drivers; có evidence và consequence |
| Detailed design/pattern | 10 | Interface rõ; pattern theo intent; transaction/failure được xử lý |
| Traceability và consistency | 10 | Trace chain bao phủ tối thiểu 90% FR và 80% QR |
| AI validation và design defense | 8 | Công khai phần AI hỗ trợ, phát hiện/sửa lỗi và bảo vệ quyết định |

### Ngưỡng

- 90-100: Thiết kế nhất quán, có chiều sâu trade-off và chuyển đổi tốt khi requirement đổi.
- 80-89: Đủ artefact và reasoning tốt, còn một số gap nhỏ về trace hoặc failure.
- 70-79: Đạt tối thiểu nhưng một số quyết định thiên về mô tả thay vì lập luận.
- 50-69: Diagram tồn tại nhưng thiếu consistency/trace hoặc architecture không dựa quality driver.
- Dưới 50: Scope/use case sai nền, artefact rời rạc hoặc không thể bảo vệ quyết định.

## Sử dụng AI được phép

Được dùng AI để:

- đề xuất actor/use case candidate;
- tạo draft PlantUML;
- so sánh architecture alternatives;
- tìm consistency gap;
- tạo skeleton interface/test.

Người học phải nộp **AI decision log** gồm:

1. Prompt hoặc mô tả yêu cầu đã gửi, đã loại dữ liệu nhạy cảm.
2. Output nào được dùng, sửa hoặc loại.
3. Ít nhất ba claim/diagram element đã tự kiểm chứng.
4. Một ví dụ AI đề xuất sai hoặc không phù hợp context.
5. Quyết định cuối cùng và người chịu trách nhiệm.

Không được chấm điểm cao cho diagram chỉ “đẹp và đúng syntax” nếu không trace về requirement hoặc không nêu trade-off.

## Bộ kiểm tra tự động đề xuất

- Mọi `UC-*` có ít nhất một primary actor.
- Mọi message trên interaction diagram tham chiếu một use case step.
- Mọi required interface được nối với một provided interface hoặc external dependency.
- Mọi `QR-*` có response measure.
- Mọi `AD-*` nêu context, alternative, decision và consequence.
- Không có component vừa nằm trong vừa nằm ngoài system boundary ở hai view không giải thích.
- State name là tình huống/danh từ; event/action không bị dùng làm state name.

