# SWD392 - Thiết kế phần mềm và kiến trúc theo phương pháp Brilliant

Thư mục này là bộ bàn giao nội dung và đặc tả sản xuất cho khóa học tương tác **SWD392: Software Design & Architecture**. Nội dung được tái cấu trúc từ nhánh `phuc` của kho `nphphuc/t10e`, tại commit:

`2764885f09992613d50dc2e76b96743f2d30e157`

Nguồn đã kiểm tra gồm 23 bộ slide với tổng cộng 579 trang và tài liệu case study `SWD392_RDS Document Case Study.pdf` gồm 55 trang. Khóa học không sao chép cách chia chương của slide. Mỗi bài được tổ chức theo vòng học kiểu Brilliant: dự đoán trước, thao tác với mô hình, nhận phản hồi, khái quát hóa và vận dụng sang tình huống mới.

## Bộ bàn giao

- `course-blueprint.md`: kiến trúc khóa học đầy đủ gồm 11 level và 72 bài.
- `production-spec.md`: đặc tả sư phạm, tương tác, feedback, mastery, accessibility và analytics.
- `assessment-bank.md`: ngân hàng 55 câu Level Review đã có đáp án, giải thích và mã hiểu lầm.
- `authored-lessons.md`: ba bài mẫu được viết hoàn chỉnh theo từng màn hình để làm chuẩn sản xuất.
- `capstone-rubric.md`: đề bài và rubric cho dự án cuối khóa.
- `source-map.md`: truy vết từ từng nguồn trong GitHub sang các level.
- `course-manifest.json`: manifest máy đọc được của toàn bộ 72 bài.
- `course.schema.json`: JSON Schema dùng để kiểm tra manifest.

## Thông số khóa học

| Thuộc tính | Giá trị |
|---|---|
| Đối tượng | Sinh viên SWD392, junior developer, business analyst mới học thiết kế phần mềm |
| Trình độ | Cơ bản đến trung cấp |
| Ngôn ngữ giảng dạy | Tiếng Việt; giữ thuật ngữ UML/architecture tiếng Anh |
| Điều kiện nên có | OOP cơ bản; biết đọc mã Java hoặc C# là lợi thế |
| Quy mô | 11 level, 72 bài, khoảng 14 giờ học tương tác |
| Nhịp học đề xuất | 15-25 phút/ngày trong 6-8 tuần |
| Luyện tập mục tiêu | 5-8 tương tác/bài, khoảng 420 tương tác khi sản xuất đầy đủ |
| Case study xuyên suốt | FreshFood Online System (FOS) |
| Case study bổ trợ | Banking, Online Shopping, Emergency Monitoring, Automated Guided Vehicle |
| Chuẩn đạt | 80% ở bài học, 75% ở Level Review, từ 70/100 ở capstone |

## Kết quả đầu ra

Sau khi hoàn thành, người học có thể:

1. Giải thích vai trò của mô hình, UML, vòng đời phần mềm và phương pháp COMET.
2. Chuyển mô tả nghiệp vụ thành system context, actor, use case, use case specification và activity diagram.
3. Xây dựng static model với class, association, multiplicity, association class, aggregation, composition và inheritance.
4. Phân loại boundary, entity, control và application-logic objects.
5. Hiện thực hóa use case bằng sequence/communication diagram và mô hình hóa hành vi trạng thái bằng state machine.
6. Tổng hợp các interaction model thành subsystem, interface và software architecture.
7. So sánh và lựa chọn object-oriented, client/server, SOA, component-based và concurrent/real-time architecture.
8. Biến quality attribute mơ hồ thành yêu cầu đo được và giải thích trade-off kiến trúc.
9. Chọn design pattern theo vấn đề và hệ quả thay vì nhớ tên pattern.
10. Hoàn thành một RDS có truy vết từ yêu cầu đến thiết kế, triển khai và quyết định kiến trúc.
11. Sử dụng AI để hỗ trợ thiết kế nhưng vẫn kiểm tra giả định, tính đúng UML và trade-off.

## Quyết định biên soạn quan trọng

- Chương 9-11 trong nguồn được hợp nhất thành một level Dynamic Modeling vì kiến thức interaction và state machine phụ thuộc trực tiếp vào nhau.
- Chương 19 không xuất hiện trong nhánh nguồn. Product-line architecture không được tự bổ sung để tránh tạo kiến thức không có căn cứ.
- Các giao thức SOA cũ như SOAP/UDDI vẫn được giữ ở vai trò lịch sử và minh họa broker/discovery; bài học nhấn mạnh nguyên lý kiến trúc có thể chuyển sang API/service registry hiện đại.
- Design Patterns được dạy theo nhóm quyết định thiết kế, không tạo 23 bài học ghi nhớ độc lập.
- GenAI được đặt cuối khóa. Người học phải có khả năng tự đánh giá mô hình trước khi dùng AI tạo UML hoặc đề xuất kiến trúc.
- Các câu quiz tự sinh trong `SeedData_Generated.cs` không được tái sử dụng vì nhiều câu hỏi chỉ lặp lại câu trên slide và distractor không chẩn đoán hiểu lầm.

## Cách triển khai vào Learnly hiện tại

Các loại tương tác trong đặc tả ánh xạ trực tiếp với frontend hiện có:

| Đặc tả | `QuestionType` hiện có |
|---|---|
| Chọn một phương án | `choice` |
| Chọn nhiều phương án | `multi` |
| Đúng/sai có giải thích | `truefalse` |
| Điền thuật ngữ/ngắn | `fill` |
| Sắp xếp dòng sự kiện | `order` |
| Ghép khái niệm | `match` |
| Chọn hoặc sửa UML | `visual` |
| Quyết định kiến trúc | `scenario` |

Manifest là nguồn nội dung độc lập với UI. Khi tích hợp, nên tạo bộ chuyển đổi từ manifest sang type `Course`, `Module`, `Lesson`, `Question` thay vì chèn thêm hàng nghìn dòng vào `platform-client.tsx`.

## Giới hạn của bản bàn giao

Bộ này đã hoàn thành curriculum, nội dung cốt lõi, mẫu bài, review bank và đặc tả sản xuất. Để phát hành như một khóa Brilliant hoàn chỉnh vẫn cần:

- Vẽ lại diagram thành SVG có thể thao tác, không dùng ảnh chụp slide.
- Viết thêm 4-7 biến thể luyện tập cho mỗi lesson từ các recipe đã chỉ định.
- Biên tập học thuật vòng cuối bởi giảng viên SWD392.
- Chạy pilot với người học để hiệu chỉnh độ khó, thời gian và distractor.
