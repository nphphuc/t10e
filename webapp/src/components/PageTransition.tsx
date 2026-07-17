import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import FoxFallTransition from './FoxFallTransition';

/**
 * Hiệu ứng chuyển màn khi đổi route:
 * - Đối với các bài học (lesson) hoặc bài đánh giá (review), hiển thị hiệu ứng Fox rơi tự do.
 * - Các route khác có hiệu ứng fade nhẹ nhàng, loại bỏ curtain sweep dễ lỗi đen màn trước đây.
 * Tôn trọng prefers-reduced-motion: bỏ hoàn toàn animation, hiện ngay nội dung.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  const isLessonOrReview =
    location.pathname.startsWith('/lesson/') ||
    location.pathname.startsWith('/review/') ||
    (location.pathname.startsWith('/pe-review/') && location.pathname !== '/pe-review');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
    >
      {children}

      {/* Hiệu ứng Fox rơi tự do cho lesson/review */}
      {isLessonOrReview && <FoxFallTransition />}
    </motion.div>
  );
}
