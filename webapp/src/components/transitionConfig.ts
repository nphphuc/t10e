/**
 * Cấu hình thời lượng transition dùng chung giữa PageTransition và FoxFallTransition.
 * Tách riêng khỏi các file component để KHÔNG phá vỡ ranh giới Fast Refresh của Vite
 * (một file .tsx chỉ export component mới được HMR giữ nguyên state mượt mà; xuất thêm
 * một named export không-phải-component sẽ khiến Vite phải full-reload module đó, có
 * thể gây trạng thái "kẹt" tạm thời cho tới khi người dùng tự reload trình duyệt).
 */
export const FOX_TRANSITION_MS = 700;

/** Cùng giá trị, tính bằng giây — dùng trực tiếp trong `transition.delay` của Framer Motion. */
export const FOX_TRANSITION_S = FOX_TRANSITION_MS / 1000;
