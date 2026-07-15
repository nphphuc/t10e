# Build Plan — SWD392 Interactive Course (kiểu Brilliant)

> Tài liệu này là kế hoạch thực thi giao cho agent (Opus/Sonnet). Agent PHẢI đọc phần "Input" trước khi viết bất kỳ dòng code nào. Làm theo từng phase, mỗi phase có acceptance criteria — không nhảy phase.

---

## 0. Bối cảnh và mục tiêu

Xây web app học tương tác cho môn **SWD392 Software Design & Architecture** theo phương pháp Brilliant.org: học bằng làm (predict → manipulate → feedback → apply), không video giảng bài. Nội dung đã được biên soạn sẵn trong bộ bàn giao `swd392-brilliant/` — **agent KHÔNG sáng tác nội dung mới**, chỉ chuyển nội dung có sẵn thành sản phẩm chạy được.

**MVP cần đạt:** course map 11 level + lesson player render được 8 loại tương tác + 3 bài mẫu chơi hoàn chỉnh + 1 Level Review + hệ thống hint/mastery/XP đúng đặc tả.

**Ngoài phạm vi (KHÔNG làm):** backend, auth, database, 69 bài chưa author, AI capstone, mobile app.

## 1. Input — đọc theo đúng thứ tự này

Giải nén `swd392-brilliant.zip`, đọc:

1. `README.md` — tổng quan, quyết định biên soạn, bảng ánh xạ QuestionType.
2. `production-spec.md` — **file quan trọng nhất**. Chứa: cấu trúc lesson 8 màn hình (mục 2), 8 loại tương tác `choice/multi/truefalse/fill/order/match/visual/scenario` (mục 3), visual token màu (mục 4), quy tắc feedback-hint 4 tầng (mục 5), misconception taxonomy 22 mã (mục 6), mastery rules (mục 7), analytics events (mục 9), accessibility (mục 10), thuật ngữ song ngữ (mục 11), QA checklist (mục 12).
3. `authored-lessons.md` — 3 bài viết hoàn chỉnh từng màn hình: **L03-03** (Actor, 7 screens), **L06-06** (State machine, 9 screens), **L08-05** (SOA, 10 screens). Đây là nội dung MVP.
4. `course-manifest.json` + `course.schema.json` — 11 level, 72 bài, metadata máy đọc được. Dùng làm nguồn dữ liệu course map.
5. `assessment-bank.md` — 55 câu review có đáp án + misconception tag. Dùng cho Level Review.
6. `course-blueprint.md`, `capstone-rubric.md`, `source-map.md` — tham khảo, không cần convert ở MVP.

## 2. Tech stack

- **Vite + React 18 + TypeScript** (SPA, không cần SSR).
- **Tailwind CSS** cho styling; token màu lấy từ production-spec mục 4 (Actor `#0EA5E9`, Boundary `#8B5CF6`, Entity `#10B981`, Control `#F59E0B`, Service `#6366F1`, Error `#EF4444`, Success `#16A34A`).
- **dnd-kit** cho kéo-thả (bắt buộc kèm thao tác bàn phím tương đương — spec mục 10).
- **framer-motion** cho animation feedback; tôn trọng `prefers-reduced-motion`.
- **zustand** cho state (progress, XP, streak) + persist vào `localStorage`.
- **canvas-confetti** khi hoàn thành lesson/mastery.
- SVG viết tay cho diagram tương tác (KHÔNG dùng ảnh chụp slide — quyết định đã chốt trong README).

Cấu trúc thư mục:

```
src/
  content/              # JSON nội dung, KHÔNG hard-code trong component
    manifest.json       # copy từ course-manifest.json
    lessons/
      L03-03.json
      L06-06.json
      L08-05.json
    reviews/
      L03-review.json   # từ assessment-bank.md
  engine/
    LessonPlayer.tsx    # điều phối screens, chấm điểm, hint state
    scoring.ts          # mastery rules (spec mục 7)
    hints.ts            # escalation 4 tầng (spec mục 5)
    analytics.ts        # bắn event (console.log stub, đúng schema spec mục 9)
  widgets/              # 1 component / 1 interaction type
    ChoiceWidget.tsx
    MultiWidget.tsx
    TrueFalseWidget.tsx
    FillWidget.tsx
    OrderWidget.tsx
    MatchWidget.tsx
    VisualWidget.tsx    # dispatcher theo visual.variant
    ScenarioWidget.tsx
    visual/             # các variant của VisualWidget
      BoundarySort.tsx  # kéo item vào/ra system boundary (L03-03 S1)
      StateMachineRunner.tsx  # gửi event, xem transition (L06-06 S1)
  pages/
    CourseMap.tsx
    LessonPage.tsx
    ReviewPage.tsx
  store/
    progress.ts
```

## 3. Content schema (Phase 1 phải chốt trước)

Mở rộng từ `course.schema.json`. Mỗi lesson JSON:

```jsonc
{
  "id": "L03-03",
  "title": "Actor là vai trò, không phải người",
  "minutes": 9, "xp": 100,
  "objective": "...",
  "misconceptions": ["actor-is-person", "actor-is-internal"],
  "screens": [
    {
      "id": "s1",
      "role": "hook",              // hook|explore|feedback|contrast|apply|transfer|retrieve|takeaway
      "type": "visual",
      "visual": { "variant": "boundary-sort", "items": [...], "correctOutside": [...] },
      "prompt": "...",
      "hints": ["...", "..."],      // tầng 1, tầng 2
      "solution": "...",            // tầng 3+
      "feedbackCorrect": "...",     // theo spec 5.1: principle + evidence + bridge
      "feedbackWrongByItem": { "Product Database": "..." },  // misconception feedback
      "weight": 2                   // core=2, transfer=3, retrieval=1 (spec 7.1)
    },
    {
      "id": "s2", "role": "contrast", "type": "choice",
      "prompt": "...", "options": ["A...","B...","C...","D..."],
      "correct": 1, "explanation": "...",
      "distractorTags": { "0": "actor-is-person", "2": null, "3": "usecase-is-click" }
    }
    // ... order: {items, correctOrder}, match: {pairs}, multi: {options, correctSet},
    // fill: {accepted: ["reusability","tái sử dụng"]}, truefalse: {correct, explanation},
    // takeaway: {text, exitTicket}
  ]
}
```

Quy tắc convert từ `authored-lessons.md`: giữ nguyên văn prompt/option/feedback tiếng Việt, không viết lại. Screen `scenario` render như `choice` nhưng bắt buộc hiện consequence feedback sau khi đúng.

## 4. Engine behavior — bám chặt production-spec

### 4.1 Hint escalation (spec mục 5) — KHÁC demo đơn giản, làm đúng 4 tầng

- **Đúng:** feedback 3 phần — xác nhận principle, nêu evidence trong scenario, câu bridge sang màn tiếp.
- **Sai lần 1:** KHÔNG lộ đáp án. Hiện hint 1 (gọi tên dấu hiệu cần quan sát). Nếu screen có `feedbackWrongByItem`, hiện feedback riêng của item sai.
- **Sai lần 2:** hint 2 — thu hẹp lựa chọn hoặc highlight vùng liên quan (disable 1 distractor).
- **Sai lần 3:** hiện `solution` dạng worked example, đánh dấu đáp án đúng, cho đi tiếp. Screen tính là "revealed" (0 điểm).

### 4.2 Chấm điểm và mastery (spec mục 7.1)

- Điểm screen = weight nếu đúng trước khi reveal (sai có hint vẫn được tính đúng nếu tự sửa được).
- Mastery lesson = tổng điểm đạt ≥ **80%** VÀ screen transfer đúng với ≤ 2 hint.
- Đạt mastery → cộng full XP + confetti; chưa đạt → cộng 50% XP + nút "Luyện lại" (chơi lại các screen sai).
- Level Review đạt **75%**; dưới ngưỡng hiện danh sách misconception tag sai nhiều nhất.

### 4.3 Gamification (tiết chế như Brilliant)

- XP theo manifest. Streak: ngày có ≥1 lesson hoàn thành (localStorage, so sánh date string). Progress bar trong lesson. Level map: lesson tuần tự — bài sau mở khi bài trước hoàn thành; 69 bài chưa có nội dung hiển thị khóa với nhãn "Đang sản xuất".
- KHÔNG thêm coin/badge/leaderboard.

### 4.4 Analytics stub (spec mục 9)

`analytics.ts` export `track(event, props)` — MVP chỉ `console.log`, nhưng schema đúng spec: `lesson_started`, `interaction_answered` (kèm `misconceptionTags`, `attempt`, `hintUsed`, `durationMs`), `lesson_mastered`, `review_completed`.

## 5. Hai visual widget bắt buộc của MVP

### 5.1 BoundarySort (L03-03 screen 1)

SVG khung "FOS System" ở giữa, vùng ngoài xung quanh. Item chips (Customer, Warehouse Staff, Google Auth, Product Database, CheckoutController) kéo được vào trong/ra ngoài khung. Bàn phím: chọn chip bằng Tab, Enter để toggle trong/ngoài. Check → item sai rung + hiện feedback riêng theo `feedbackWrongByItem`.

### 5.2 StateMachineRunner (L06-06 screen 1)

SVG hai state `Enabled`/`Disabled` (rounded rect, state hiện tại tô màu Control `#F59E0B`), mũi tên transition có label. Nút "Gửi event: DisableNews". Người học **click state mà họ dự đoán** là next state TRƯỚC, rồi bấm gửi event → animation transition chạy → so với dự đoán. Đây là mẫu predict-then-verify chuẩn Brilliant.

Các widget visual khác trong 3 bài (nếu có) được phép fallback về choice/match tương đương — ghi chú TODO trong code.

## 6. Phases và acceptance criteria

### Phase 0 — Setup & validate (nhỏ)
Scaffold Vite+React+TS+Tailwind. Copy manifest, validate bằng `course.schema.json` (script node đơn giản). ✅ App chạy, manifest load, không lỗi console.

### Phase 1 — Content pipeline
Chốt lesson schema (mục 3). Convert tay 3 bài trong `authored-lessons.md` → 3 file JSON. Convert 5 câu L03 trong `assessment-bank.md` → `L03-review.json`. ✅ 4 file JSON đúng schema, nội dung giữ nguyên văn, mỗi distractor có misconception tag nếu nguồn có.

### Phase 2 — Widget library + LessonPlayer
8 widget + hint engine + scoring + progress bar + màn kết quả lesson. Test bằng L03-03 (bài dễ nhất, đủ 6 loại tương tác). ✅ Chơi L03-03 từ đầu đến cuối: sai 3 lần thấy đủ 3 tầng hint, đúng thấy feedback 3 phần, cuối bài thấy điểm/mastery/XP.

### Phase 3 — Course map + gamification
CourseMap render 11 level từ manifest, trạng thái khóa/mở/hoàn thành, XP tổng, streak. LessonPage route theo id. ✅ Hoàn thành L03-03 → map cập nhật, XP cộng, refresh trang không mất tiến độ.

### Phase 4 — 2 bài còn lại + 2 visual widget
L06-06 (có StateMachineRunner), L08-05 (có fill + trade-off multi 2 phần ở screen 8: tách thành 2 screen). BoundarySort cho L03-03 s1 (Phase 2 tạm dùng multi-choice thay thế nếu cần). ✅ Cả 3 bài chơi hoàn chỉnh với đúng visual widget.

### Phase 5 — Level Review + QA
ReviewPage chấm 75%, hiện weak misconceptions. Chạy QA checklist spec mục 12 (10 mục) + accessibility: toàn bộ thao tác được bằng bàn phím, contrast AA, reduced motion. ✅ Checklist pass, ghi kết quả vào `QA.md`.

**Thứ tự ưu tiên nếu thiếu thời gian:** Phase 2 > 1 > 3 > 4 > 5. Một lesson chơi được hoàn chỉnh đúng spec giá trị hơn ba lesson render sơ sài.

## 7. Nguyên tắc bất di bất dịch

1. Nội dung nằm trong JSON, component không chứa chữ nội dung bài học. Thêm bài mới = thêm JSON.
2. Không lộ đáp án trước tầng hint 3. Không hiện "Sai rồi!" đỏ to — sai là một phần của học.
3. Một màn hình một quyết định; tối đa 45 từ tiếng Việt/màn (trừ case study) — spec 1.2.
4. Giữ thuật ngữ theo bảng localization spec mục 11 (use case, actor, boundary/entity/control giữ tiếng Anh).
5. Không dùng ảnh slide; diagram là SVG dựng lại theo visual token.
6. Mọi drag-drop có keyboard alternative.

## 8. Prompt mẫu giao cho agent

> Bạn nhận thư mục `swd392-brilliant/` (bộ bàn giao nội dung) và file `BUILD-PLAN-swd392-course.md`. Hãy thực thi build plan theo đúng thứ tự phase, không bỏ acceptance criteria. Đọc `production-spec.md` trước khi code engine. Không sáng tác nội dung mới — chỉ convert từ `authored-lessons.md` và `assessment-bank.md`. Sau mỗi phase, chạy app và tự kiểm tra acceptance criteria trước khi sang phase kế. Kết thúc: hướng dẫn chạy (`npm i && npm run dev`), screenshot hoặc mô tả các màn hình chính, và danh sách TODO còn lại.
