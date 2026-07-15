# Bản đồ nguồn và phạm vi

## Nguồn GitHub

- Repository: `https://github.com/nphphuc/t10e/tree/phuc`
- Branch: `phuc`
- Commit đã khảo sát: `2764885f09992613d50dc2e76b96743f2d30e157`
- Ngày khảo sát: 2026-07-14

## Kiểm kê và ánh xạ

| Nguồn | Trang | Nội dung chính | Level đích |
|---|---:|---|---|
| `Ch01_Introduction.pptx` | 7 | Modeling, UML, architecture, COMET, multiple views | L01 |
| `Ch02_Overview of UML Notation.pptx` | 14 | Use case, class, interaction, state, deployment, UML extension | L01 |
| `Ch03_Software Life Cycle Models and Processes.pptx` | 13 | Waterfall, prototyping, incremental, spiral, RUP, V&V | L02 |
| `Ch04_Software Design and Architecture Concepts.pptx` | 15 | OO, information hiding, concurrency, patterns, quality | L01, L02, L07, L09 |
| `Ch05_Overview of Software Modeling & Design Methods.pptx` | 19 | COMET requirements-analysis-design lifecycle | L02 |
| `Ch06_Use Case Modeling.pptx` | 20 | Requirements, actors, use cases, activity diagrams | L03 |
| `Ch07_Static Modeling.pptx` | 25 | Class relationships, context, stereotypes, entities | L04 |
| `Ch08_Object and Class Structuring.pptx` | 17 | Boundary, entity, control, business/algorithm/service objects | L05 |
| `Ch09-11_Dynamic Modeling.pptx` | 26 | Sequence, communication, stateless/state-dependent modeling, FSM | L06 |
| `Ch12_Overview of Software Architecture.pptx` | 18 | Architecture views, components, patterns, interfaces | L07 |
| `Ch13_Software Subsystem Architectural Design.pptx` | 25 | Integrated diagrams, separation of concerns, subsystem criteria | L07 |
| `Ch14_Designing Object-Oriented Software Architectures.pptx` | 23 | Information-hiding classes, interfaces, polymorphism | L08 |
| `Ch15_Designing Client Server Software Architectures.pptx` | 42 | Client/server, middleware, wrappers, relational mapping | L08 |
| `Ch16_Designing Service-Oriented Architectures.pptx` | 29 | SOA, broker/discovery, transaction, orchestration/choreography | L08 |
| `Ch17_Designing Component-Based Software Architectures.pptx` | 23 | Components, provided/required interfaces, group messaging, deployment | L08 |
| `Ch18_Designing Concurrent and Real-Time Software Architectures.pptx` | 34 | Task structuring, synchronization, TIS/TBS, Java threads | L08 |
| `Ch20_Software Quality Attributes.pptx` | 17 | Maintainability, modifiability, testability, scalability, security | L09 |
| `SWD392_Design Partern.pptx` | 89 | GoF pattern catalog và cách chọn pattern | L10 |
| `Ch21_Client Server Software Architecture Case Study-Banking System.pptx` | 45 | Banking end-to-end, client/server, ATM statechart, DB | L11 |
| `Ch22_SOA Case Study-Online Shopping System.pptx` | 19 | Online Shopping theo SOA | L11 |
| `Ch23_Component-Based Software Arch_Case Study Emergency Monitoring System.pptx` | 21 | Emergency Monitoring theo component-based architecture | L11 |
| `Ch24_Real-Time Software Arch_Case Study Automated Guided Vehicle System.pptx` | 20 | AGV theo real-time architecture | L11 |
| `SWD392_GenAI.pptx` | 18 | AI hỗ trợ use case, UML, pattern và architecture selection | L11 |
| `SWD392_RDS Document Case Study.pdf` | 55 | FreshFood RDS: requirements → analysis → design → code → SOA/microservice | L03-L11 |

Tổng slide: **579**. Tổng PDF case study: **55 trang**.

## Case study FreshFood được dùng như thế nào

| Giai đoạn học | Phần RDS sử dụng | Sản phẩm người học |
|---|---|---|
| Requirements | PDF trang 4-24 | Context, feature map, NFR, use case và activity flow |
| Data/static analysis | PDF trang 24-30 | Entity model và data dictionary |
| Dynamic analysis | PDF trang 30-37 | Sequence, communication và state diagram |
| Architecture | PDF trang 37-41 | Integrated communication, deployment, class/component/package views |
| Detailed design | PDF trang 41-43 | Design classes và relational schema |
| Trace to code | PDF trang 44-50 | Mapping component/class/message sang project và C# |
| Architecture evolution | PDF trang 51-55 | Client/server → SOA → microservices theo quality attributes mới |

## Vấn đề chất lượng nguồn đã xử lý

1. `slide_content.json` có một số ký tự mojibake như `ï»¿` và `â€“`; nội dung bàn giao đã chuẩn hóa Unicode.
2. `generate_seed.py` chia slide theo số lượng thay vì dependency kiến thức; cấu trúc mới dùng prerequisite graph.
3. Quiz tự sinh có distractor kiểu “unrelated concept” và không chẩn đoán misconception; ngân hàng mới gắn mỗi đáp án sai với một lỗi tư duy cụ thể.
4. Một số thuật ngữ dùng không nhất quán giữa “statechart”, “state machine” và “state diagram”; khóa học dùng “state machine” cho khái niệm và “state diagram” cho biểu diễn UML.
5. Nguồn nhảy từ Chapter 18 sang Chapter 20; khóa học không tuyên bố bao phủ Chapter 19.
6. SOAP/UDDI được trình bày trong nguồn như công nghệ SOA. Khóa học phân biệt rõ nguyên lý bền vững (contract, autonomy, discovery) với công nghệ minh họa theo thời kỳ.

