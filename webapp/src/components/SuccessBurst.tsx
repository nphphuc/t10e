import { useReducedMotion } from 'framer-motion';

// Burst 6 hạt CSS bay ra từ tâm — render một lần khi đáp án đúng được xác nhận.
// Thuần trang trí: aria-hidden, tôn trọng reduced motion.
export default function SuccessBurst() {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;

  const particles = Array.from({ length: 6 });

  return (
    <span className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
      {particles.map((_, i) => (
        <span
          key={i}
          className="burst-particle"
          style={{
            // Mỗi hạt một hướng (60° cách nhau) + lệch pha nhẹ
            ['--angle' as any]: `${i * 60 + 15}deg`,
            ['--delay' as any]: `${i * 12}ms`,
          }}
        />
      ))}
    </span>
  );
}
