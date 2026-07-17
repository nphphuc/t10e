import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import FoxFallTransition from './FoxFallTransition';

/**
 * Hiệu ứng chuyển màn đồng bộ trên toàn ứng dụng:
 * - Khi đổi route, chạy hiệu ứng Fox rơi tự do toàn màn hình.
 * - Trang đích sẽ tự động pop-up mượt mà (scale + opacity) đồng bộ đúng lúc Fox rơi qua.
 * Tôn trọng prefers-reduced-motion: bỏ hoàn toàn animation, hiển thị ngay nội dung.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeIn' }}
      className="relative"
    >
      {/* Target page content with delay and spring pop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 18,
          delay: 1.25, // Bắt đầu pop lên ngay khi fox rơi qua ở giữa và chuẩn bị thoát
        }}
      >
        {children}
      </motion.div>

      {/* Transition overlay mounts immediately without delay */}
      <FoxFallTransition />
    </motion.div>
  );
}
