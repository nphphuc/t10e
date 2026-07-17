import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import FoxFallTransition from './FoxFallTransition';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 18,
      delay: 1.25, // Bắt đầu pop lên ngay khi fox rơi qua ở giữa và chuẩn bị thoát
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

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
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}

      {/* Hiệu ứng Fox rơi tự do */}
      <FoxFallTransition />
    </motion.div>
  );
}
