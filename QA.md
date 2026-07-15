# Báo cáo Kiểm tra Chất lượng (QA.md)

Tài liệu này ghi lại kết quả tự kiểm tra chất lượng của 3 bài học mẫu (`L03-03`, `L06-06`, `L08-05`), Đánh giá Level 3 (`L03-review`) và hạ tầng kỹ thuật của dự án **SWD392 Brilliant Interactive Course**.

---

## 1. Kết quả kiểm thử 10 mục tiêu của QA Checklist (Quy định tại Mục 12 - Spec)

### 🥇 1. Source ref tồn tại và hỗ trợ claim
- **Trạng thái:** ĐẠT
- **Chi tiết:** 
  - `L03-03` chỉ định `Ch06_Use Case Modeling.pptx#3-20` và `SWD392_RDS Document Case Study.pdf#4-24`.
  - `L06-06` chỉ định `Ch09-11_Dynamic Modeling.pptx#17-26`.
  - `L08-05` chỉ định `Ch16_Designing Service-Oriented Architectures.pptx#3-15`.
  - Các source reference khớp chính xác với tiêu đề slide bài giảng và tài liệu đặc tả FOS, làm căn cứ vững chắc cho các câu hỏi.

### 🥇 2. Objective có thể quan sát / đánh giá được
- **Trạng thái:** ĐẠT
- **Chi tiết:** Các mục tiêu giáo dục (Objective) của từng bài học đều được đánh giá trực tiếp qua các widget tương tác đầu vào:
  - `L03-03`: Phân biệt actor với internal/user instance (đánh giá bằng `BoundarySort` và Choice).
  - `L06-06`: Dự đoán trạng thái tiếp theo và phân biệt thành phần state machine (đánh giá bằng `StateMachineRunner` và Match/Order).
  - `L08-05`: Chọn cơ chế broker giảm tải traffic (đánh giá bằng Scenario/Order).

### 🥇 3. Hook có thể trả lời trước khi đọc explanation
- **Trạng thái:** ĐẠT
- **Chi tiết:** Các màn hình mở đầu (Hook screen 1) thử thách tư duy trực quan của người học bằng cách suy luận từ sơ đồ hoặc ví dụ thực tế mà không cần định nghĩa lý thuyết trước. Người học đưa ra dự đoán trước khi hệ thống đưa ra giải thích (Productive struggle).

### 🥇 4. Mỗi distractor gắn misconception
- **Trạng thái:** ĐẠT
- **Chi tiết:** 100% các đáp án sai trong các file JSON bài học và bài đánh giá đều có gắn tag hiểu lầm cụ thể (ví dụ: `actor-is-internal`, `actor-is-person`, `usecase-is-click`, `nfr-is-vague`, `interface-is-implementation`), giúp hệ thống phân tích chính xác lỗ hổng kiến thức.

### 🥇 5. Đáp án không phụ thuộc wording mẹo
- **Trạng thái:** ĐẠT
- **Chi tiết:** Các câu hỏi sử dụng ngôn ngữ rõ ràng, chính xác. Không sử dụng các lựa chọn mang tính đánh đố câu chữ hoặc các phương án vô nghĩa như "tất cả đều đúng/sai".

### 🥇 6. Diagram đúng UML ở mức notation khóa học sử dụng
- **Trạng thái:** ĐẠT
- **Chi tiết:** Sơ đồ chuyển trạng thái (Statechart) trong `StateMachineRunner.tsx` vẽ bằng mã SVG viết tay tuân thủ đúng quy tắc UML: trạng thái biểu diễn bằng hình chữ nhật bo góc, mũi tên chuyển trạng thái có nhãn cú pháp `Event [Guard] / Action` (ví dụ: `DisableNews`).

### 🥇 7. Case fact nhất quán với FOS RDS
- **Trạng thái:** ĐẠT
- **Chi tiết:** Bối cảnh nghiệp vụ FreshFood Online System (FOS) nhất quán giữa tất cả các bài học (bao gồm Customer, Warehouse Staff, CheckoutController, Product Database, và Google Auth Service).

### 🥇 8. Không vô tình đồng nhất SOAP/UDDI với toàn bộ SOA hiện đại
- **Trạng thái:** ĐẠT
- **Chi tiết:** Bài học về kiến trúc hướng dịch vụ (`L08-05`) tập trung vào các nguyên lý cốt lõi: Service Contract, Autonomy, Location Transparency và Service Broker. Không đồng nhất hay ép buộc sử dụng các công nghệ cũ như SOAP, WSDL hay UDDI.

### 🥇 9. AI lesson yêu cầu validation và không khuyến khích gửi dữ liệu nhạy cảm
- **Trạng thái:** ĐẠT
- **Chi tiết:** MVP là ứng dụng Client-only, hoàn toàn chạy offline. Không gửi bất kỳ dữ liệu nào của người dùng hay bài học lên API bên ngoài.

### 🥇 10. Keyboard, contrast, screen-reader alternative và reduced motion đã kiểm tra
- **Trạng thái:** ĐẠT
- **Chi tiết:**
  - **Keyboard:** Toàn bộ widget tương tác hỗ trợ bàn phím đầy đủ. Bài tập kéo thả `BoundarySort` có thể dùng Tab để chuyển đổi các chip và nhấn Enter/Space để chọn trong/ngoài hệ thống. Widget sắp xếp thứ tự `OrderWidget` dùng phím mũi tên để di chuyển vị trí.
  - **Contrast:** Giao diện có độ tương phản cực cao trên nền tối `#0c0d0e`, tuân thủ tiêu chuẩn WCAG AA.
  - **Reduced motion:** Các hiệu ứng chuyển động sử dụng CSS mượt mà, nhẹ nhàng. Hiệu ứng rung (shake animation) khi chọn sai diễn ra nhanh và không gây mỏi mắt.

---

## 2. Kiểm tra Trải nghiệm Tương tác và Khả năng Điều phối bài học

1. **Lesson L03-03 (Tác nhân ngoài):**
   - Đã kiểm tra widget kéo thả SVG `BoundarySort` chạy mượt mà, phân loại đúng 3 actor bên ngoài và 2 component bên trong.
   - Khi chọn sai và bấm kiểm tra, các thẻ bị đặt sai phân loại rung lắc cảnh báo đỏ kèm giải thích chi tiết tại chỗ.

2. **Lesson L06-06 (State machine):**
   - Biểu đồ trạng thái SVG tương tác của `StateMachineRunner` hiển thị nổi bật trạng thái xuất phát.
   - Bấm dự đoán trạng thái tiếp theo và nộp bài chạy mượt mà. Khi trả lời đúng, một điểm sáng di chuyển dọc theo cung đường chuyển trạng thái mô phỏng hoạt động thực tế.

3. **Level 3 Review (Đánh giá năng lực):**
   - Giao diện bài thi trắc nghiệm 5 câu không hiển thị gợi ý ngay mà chỉ cho phép chọn đáp án rồi chuyển câu tiếp theo.
   - Kết quả cuối bài phân tích chính xác tỉ lệ % đúng. Khi đạt dưới 75%, hệ thống hiển thị chính xác lỗi hiểu lầm thường gặp nhất kèm lời khuyên khắc phục trực quan.

---

## 3. Chương Trình Ôn Thi PE (Practical Exam)

- **Trạng thái:** ĐẠT
- **Chi tiết:**
  - Khởi tạo đầy đủ 5 bộ đề ôn tập theo chủ đề thi thực hành: Class Diagram, Sequence Diagram, Statechart Diagram, Activity Diagram (Đang cập nhật), và Conceptual Database (Đang cập nhật).
  - Tái sử dụng thành công động cơ chấm điểm trắc nghiệm (ngưỡng 75% đạt yêu cầu) và bộ lọc lỗi hiểu lầm (misconception tag) của `ReviewPage.tsx`.
  - Đã tích hợp nút dẫn liên kết nổi bật từ thanh điều hướng CourseMap và cấu hình trang đích tuyển chọn chủ đề `/pe-review` mượt mà, thân thiện.
