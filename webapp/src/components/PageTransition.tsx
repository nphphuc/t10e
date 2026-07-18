import { useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import FoxFallTransition from './FoxFallTransition';
import { FOX_TRANSITION_S } from './transitionConfig';

// Cờ ở module scope (sống suốt vòng đời tab): TRUE nghĩa là đã có ít nhất 1
// trang từng hiện ra trong tab này. Lần đầu tiên (load thẳng URL, mở app lần
// đầu) KHÔNG có "trang cũ" để chuyển từ đó sang — hiện ngay, không hiệu ứng.
let hasTransitionedOnce = false;

/**
 * Hiệu ứng chuyển màn đồng bộ toàn app — THUẦN CSS ANIMATION.
 *
 * LỊCH SỬ BUG (đừng quay lại các cách cũ):
 * 1. setTimeout + React state để "mở khoá" nội dung → timer bị lỡ khi
 *    mount/unmount liên tục (SPA + StrictMode) → nội dung kẹt opacity 0.
 * 2. framer-motion `animate` + `transition.delay` bên trong AnimatePresence
 *    mode="wait" → bug đã biết của framer-motion: enter mount ngay sau exit
 *    có thể không bao giờ start animation → nội dung kẹt ở initial opacity 0,
 *    overlay kẹt nền đen → "màn hình đen phải reload", console sạch.
 *
 * Cách hiện tại: CSS @keyframes + animation-fill-mode. Browser tự chạy CSS
 * animation ngay khi element vào DOM, không phụ thuộc bất kỳ cơ chế JS nào.
 * Worst case nếu có gì bất thường: nội dung vẫn hiện (from-state chỉ tồn tại
 * trong lúc animation chạy), không bao giờ đen màn.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const [isFirstEver] = useState(() => !hasTransitionedOnce);

  useEffect(() => {
    hasTransitionedOnce = true;
  }, []);

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  // Lần hiện trang đầu tiên của cả app: hiện ngay, không hiệu ứng, không overlay.
  if (isFirstEver) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <style>{`
        @keyframes page-content-enter {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Nội dung: CSS animation với delay = đúng lúc overlay Fox kết thúc.
          `backwards` giữ from-state (ẩn) trong lúc chờ delay — nhưng chỉ trong
          phạm vi animation; sau đó element LUÔN về trạng thái bình thường. */}
      <div
        style={{
          animation: `page-content-enter 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${FOX_TRANSITION_S}s backwards`,
        }}
      >
        {children}
      </div>

      <FoxFallTransition />
    </div>
  );
}
