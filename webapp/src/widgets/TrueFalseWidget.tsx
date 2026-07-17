

import { motion, useReducedMotion } from 'framer-motion';
import SuccessBurst from '../components/SuccessBurst';

interface TrueFalseWidgetProps {
  data: {
    prompt: string;
    correct: boolean;
    explanation?: string;
  };
  selectedAnswer: boolean | null;
  onAnswer: (value: boolean) => void;
  isSubmitted: boolean;
}

export default function TrueFalseWidget({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: TrueFalseWidgetProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleSelect = (val: boolean) => {
    if (isSubmitted) return;
    onAnswer(val);
  };

  const options = [
    { label: "Đúng (True)", value: true },
    { label: "Sai (False)", value: false },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((opt) => {
        const isSelected = selectedAnswer === opt.value;
        const isCorrect = opt.value === data.correct;

        let btnClass = "btn-3d border-2 border-gray-700 bg-gray-800/40 text-gray-200 hover:border-gray-500 hover:bg-gray-800/80";

        if (isSubmitted) {
          if (isCorrect) {
            btnClass = "border-success bg-success/10 text-success font-semibold cursor-default animate-pulse-success";
          } else if (isSelected) {
            btnClass = "border-error bg-error/10 text-error font-semibold cursor-default animate-shake";
          } else {
            btnClass = "border-gray-800 bg-gray-900/40 text-gray-500 cursor-default";
          }
        } else if (isSelected) {
          btnClass = "btn-3d btn-3d-selected border-blue-500 bg-blue-500/10 text-blue-400 font-semibold";
        }

        return (
          <motion.button
            key={opt.label}
            disabled={isSubmitted}
            onClick={() => handleSelect(opt.value)}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`relative p-6 rounded-2xl text-center font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${btnClass}`}
          >
            {opt.label}
            {isSubmitted && isCorrect && isSelected && <SuccessBurst />}
          </motion.button>
        );
      })}
    </div>
  );
}
