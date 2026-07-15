# Ba lesson mẫu đã viết hoàn chỉnh

Các lesson này là chuẩn giọng văn và độ sâu để đội nội dung sản xuất 69 lesson còn lại. Mỗi màn hình có thể chuyển trực tiếp thành `Question` hoặc content screen trong Learnly.

---

## L03-03 - Actor là vai trò, không phải người

**Thời lượng:** 9 phút  
**Objective:** Phân biệt actor với user instance/internal component và xác định primary/secondary actor.  
**Misconceptions:** `actor-is-person`, `actor-is-internal`, `usecase-is-click`.

### Screen 1 - Ai đang ở ngoài?

**Type:** `visual`

**Prompt:** FOS là phần mềm do nhóm bạn xây dựng. Kéo những thành phần nằm ngoài FOS ra ngoài khung hệ thống.

**Items:**

- Customer
- Warehouse Staff
- Google Authentication Service
- Product Database
- CheckoutController

**Correct outside:** Customer, Warehouse Staff, Google Authentication Service.

**Hint 1:** Đừng hỏi “có liên quan đến hệ thống không”. Hãy hỏi “thành phần này có nằm trong phần mềm nhóm đang thiết kế không”.

**Hint 2:** Database và controller là implementation của FOS trong case này.

**Correct feedback:** Customer và Warehouse Staff gửi input trực tiếp. Google Authentication là hệ thống ngoài cung cấp dịch vụ. Cả ba đều ở ngoài system boundary.

**Wrong feedback by item:**

- Product Database: “Database lưu dữ liệu, nhưng trong scope FOS hiện tại nó là thành phần nội bộ, không phải actor.”
- CheckoutController: “Controller là software object của FOS. Actor không nằm trong phần mềm đang xét.”

### Screen 2 - Một người hay một vai trò?

**Type:** `choice`

**Prompt:** Nguyễn An mua rau trên FOS. Actor nên được đặt tên là gì?

**Options:**

A. Nguyễn An  
B. Customer  
C. Chrome Browser  
D. Buy button

**Correct:** B.

**Explanation:** Actor đại diện một vai trò mà nhiều user instance có thể đóng. Tên người cụ thể là instance; browser/button là phương tiện giao tiếp.

### Screen 3 - Ai khởi tạo để đạt giá trị?

**Type:** `match`

**Prompt:** Ghép actor với vai trò trong use case `Checkout`.

**Pairs:**

- Customer → Primary actor
- Payment System → Secondary actor
- Mailing System → Secondary actor

**Explanation:** Customer khởi tạo Checkout để hoàn tất đơn. Payment và Mailing hỗ trợ hệ thống hoàn thành goal.

### Screen 4 - Actor không nhất thiết là người

**Type:** `multi`

**Prompt:** Thành phần nào có thể là actor?

**Options:**

- Một human role
- Một external system
- Một external I/O device
- Một timer tạo event
- Một private method

**Correct:** Bốn lựa chọn đầu.

**Explanation:** Actor là external role/entity tương tác qua boundary; private method nằm trong implementation.

### Screen 5 - Actor hay object?

**Type:** `scenario`

**Prompt:** ATM card reader là phần cứng bên ngoài software system nhưng nằm trong toàn bộ ATM system. Khi vẽ software context, card reader là gì?

**Options:**

A. External I/O device actor  
B. Entity object  
C. Control object  
D. Không xuất hiện

**Correct:** A.

**Explanation:** Scope quyết định classification. Trong software context, hardware card reader nằm ngoài software và tương tác qua boundary.

### Screen 6 - Retrieval: black box

**Type:** `truefalse`

**Prompt:** Khi đang xác định actor và use case, ta cần biết FOS dùng MVC hay Clean Architecture.

**Correct:** False.

**Explanation:** Requirements model coi hệ thống như black box. Architecture là quyết định của design phase.

### Screen 7 - Takeaway

> Actor là một **vai trò bên ngoài scope** trao đổi input/output với hệ thống. Primary actor khởi tạo use case để đạt giá trị; secondary actor hỗ trợ use case.

**Exit ticket:** Gọi tên một actor không phải con người trong dự án của bạn và giải thích vì sao nó ở ngoài scope.

---

## L06-06 - State, event, guard và action

**Thời lượng:** 11 phút  
**Objective:** Dự đoán transition và phân biệt state, event, guard, action.  
**Misconceptions:** `state-is-action`, `event-is-state`, `ignore-current-state`.

### Screen 1 - Cùng event, khác current state

**Type:** `visual`

Mô hình News có hai state: `Enabled`, `Disabled`.

**Prompt:** Gửi event `DisableNews` khi News đang `Enabled`. State tiếp theo là gì?

**Correct:** Disabled.

**Feedback:** Event kích hoạt transition từ Enabled sang Disabled. `DisableNews` là điều xảy ra, không phải trạng thái kéo dài.

### Screen 2 - Nếu đã Disabled thì sao?

**Type:** `choice`

**Prompt:** News đang `Disabled` và nhận `DisableNews`. Không có transition nào được định nghĩa. Kết quả hợp lý nhất là gì?

**Options:**

A. Tự chuyển sang Enabled  
B. Giữ nguyên Disabled hoặc báo event không hợp lệ  
C. Xóa News  
D. State không quan trọng

**Correct:** B.

**Explanation:** Event không đủ để quyết định next state; current state và transition table đều cần thiết.

### Screen 3 - Phân loại notation

**Type:** `match`

**Pairs:**

- `Enabled` → State
- `DisableNews` → Event
- `[user.isStaff]` → Guard
- `/ writeAuditLog()` → Action

**Explanation:** State tồn tại qua một khoảng thời gian; event xảy ra tại một thời điểm; guard là điều kiện; action là computation gắn với transition.

### Screen 4 - Guard chặn transition

**Type:** `scenario`

**Prompt:** Transition `SubmitOrder [stockAvailable] / reserveStock()` chỉ chạy khi nào?

**Options:**

A. Mỗi khi stockAvailable thay đổi  
B. Khi event SubmitOrder tới và guard stockAvailable đúng  
C. Khi reserveStock hoàn tất  
D. Bất kỳ khi nào đang ở state nào đó

**Correct:** B.

**Wrong feedback:** “Guard không tự kích hoạt transition. Nó chỉ cho phép hoặc chặn transition đã được event kích hoạt.”

### Screen 5 - Entry hay transition action?

**Type:** `choice`

**Prompt:** Có ba transition khác nhau cùng đi vào `Locked`, và mọi lần vào đều phải `notifySecurity()`. Đặt action ở đâu gọn nhất?

**Options:**

A. Lặp trên cả ba transition  
B. `entry / notifySecurity()` của Locked  
C. `exit` của ba state nguồn  
D. Trong tên state

**Correct:** B.

**Explanation:** Entry action phù hợp khi cùng hành động xảy ra trên mọi transition vào state.

### Screen 6 - Xây flow ATM

**Type:** `order`

**Prompt:** Sắp xếp state của một phiên ATM hợp lệ.

**Items:**

- ProcessingTransaction
- WaitingForCard
- ValidatingPIN
- SelectingTransaction
- EjectingCard

**Correct order:** WaitingForCard → ValidatingPIN → SelectingTransaction → ProcessingTransaction → EjectingCard.

**Hint:** Tên state là tình huống kéo dài, không phải message như `insertCard`.

### Screen 7 - State-dependent interaction

**Type:** `multi`

**Prompt:** Những object nào thường tham gia state-dependent realization?

**Options:**

- Boundary object gửi event
- State-dependent control object
- Object thực hiện action
- Bất kỳ entity nào trong database dù không tham gia use case

**Correct:** Ba lựa chọn đầu.

**Explanation:** Control object chạy state machine, nhận event từ boundary và kích hoạt action ở các object tham gia.

### Screen 8 - Retrieval: sequence vs communication

**Type:** `choice`

**Prompt:** Để kiểm tra chính xác thời điểm `invalidPIN` quay lại UI trong một flow dài, diagram nào dễ đọc hơn?

**Correct:** Sequence diagram.

### Screen 9 - Takeaway

> `nextState = f(currentState, event, guard)`. Action là kết quả tức thời của transition; state là tình huống tồn tại theo thời gian.

---

## L08-05 - SOA: service contract và discovery

**Thời lượng:** 12 phút  
**Objective:** Giải thích service principles và chọn broker interaction phù hợp.  
**Misconceptions:** `soa-is-microservices`, `distribution-is-free`, `interface-is-implementation`.

### Screen 1 - Service chuyển node

**Type:** `scenario`

**Prompt:** Inventory Service chuyển từ node A sang node B. Bạn muốn client không phải sửa cấu hình. Nên đặt trách nhiệm location ở đâu?

**Options:**

A. Trong từng client  
B. Service registry/broker  
C. Trong database table của client  
D. Hard-code cả hai địa chỉ

**Correct:** B.

**Explanation:** Broker tạo location transparency: service cập nhật location một nơi, client vẫn tìm qua contract/name.

### Screen 2 - Service registration

**Type:** `order`

**Prompt:** Sắp xếp flow đăng ký và gọi service.

**Items:**

- Client gửi request cho service
- Service đăng ký name, description, location
- Client hỏi broker
- Broker trả location/handle

**Correct:** Service đăng ký → Client hỏi broker → Broker trả location/handle → Client gửi request.

### Screen 3 - White pages hay yellow pages?

**Type:** `match`

**Pairs:**

- Biết chính xác Inventory Service, chưa biết location → White-page lookup
- Biết cần “dịch vụ giao hàng”, chưa chọn provider → Yellow-page discovery

**Explanation:** White pages tìm service đã biết; yellow pages tìm service theo loại/capability.

### Screen 4 - Forwarding hay handle?

**Type:** `choice`

**Prompt:** Client sẽ trao đổi 30 message với cùng một service. Cách nào giảm traffic qua broker sau lần tìm đầu?

**Options:** Broker Forwarding, Broker Handle, Broadcast, Two-Phase Commit.

**Correct:** Broker Handle.

**Consequence feedback:** Handle giảm broker traffic nhưng client giữ reference/location tạm thời và phải xử lý handle hết hạn.

### Screen 5 - Nguyên lý service

**Type:** `multi`

**Prompt:** Những đặc trưng nào làm Inventory Service dễ tái sử dụng?

**Options:**

- Contract rõ
- Autonomy
- Loose coupling
- Ẩn implementation
- Phụ thuộc trực tiếp vào UI của FOS
- Giữ session state của từng màn hình khách hàng

**Correct:** Bốn lựa chọn đầu.

**Explanation:** UI/session-specific dependency làm service khó dùng ở mobile hoặc ứng dụng khác.

### Screen 6 - SOA không đồng nghĩa microservices

**Type:** `truefalse`

**Prompt:** Bất kỳ hệ thống SOA nào cũng phải gồm nhiều microservice nhỏ, deploy độc lập trong container.

**Correct:** False.

**Explanation:** SOA là tập nguyên lý và kiến trúc service. Microservices là một cách tổ chức service cụ thể với granularity và operational model riêng.

### Screen 7 - Contract không phải implementation

**Type:** `choice`

**Prompt:** Thành phần nào nên xuất hiện trong service contract?

**Options:**

A. Tên operation, input/output và error semantics  
B. Toàn bộ SQL query  
C. Private helper methods  
D. Cấu trúc thư mục source code

**Correct:** A.

### Screen 8 - Áp dụng vào FOS

**Type:** `scenario`

**Prompt:** FOS sắp có mobile app. Product catalog phải dùng chung cho web và mobile. Thiết kế nào phù hợp hơn?

**Options:**

A. Copy ProductService vào hai app  
B. Tách Product Catalog thành service có contract chung  
C. Cho mobile truy cập trực tiếp database  
D. Chụp dữ liệu thành file tĩnh mỗi ngày

**Correct:** B.

**Trade-off prompt:** Chọn thêm hai chi phí phải quản lý.

**Correct costs:** Network failure/latency; versioning/observability/authorization (chấp nhận hai trong ba).

### Screen 9 - Retrieval: quality attribute

**Type:** `fill`

**Prompt:** Khả năng dùng cùng service cho web và mobile là quality attribute nào?

**Accepted:** reusability, khả năng tái sử dụng, tái sử dụng.

### Screen 10 - Takeaway

> SOA tách capability thành service autonomous có contract rõ. Registry/broker hỗ trợ discovery và transparency, nhưng distribution tạo thêm latency, failure và governance cost.

