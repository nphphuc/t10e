

import { motion, useReducedMotion } from 'framer-motion';

interface MultiWidgetProps {
  data: {
    prompt: string;
    options: string[];
    correctSet: number[];
    distractorTags?: Record<string, string | null>;
  };
  selectedAnswer: number[] | null;
  onAnswer: (value: number[]) => void;
  isSubmitted: boolean;
  disabledOptions: number[];
}

export default function MultiWidget({
  data,
  selectedAnswer = [],
  onAnswer,
  isSubmitted,
  disabledOptions = [],
}: MultiWidgetProps) {
  const shouldReduceMotion = useReducedMotion();
  const currentSelections = Array.isArray(selectedAnswer) ? selectedAnswer : [];

  const handleToggle = (idx: number) => {
    if (isSubmitted || disabledOptions.includes(idx)) return;
    if (currentSelections.includes(idx)) {
      onAnswer(currentSelections.filter((s) => s !== idx));
    } else {
      onAnswer([...currentSelections, idx]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-2">
        Chọn tất cả đáp án đúng
      </div>
      <div className="grid grid-cols-1 gap-3">
        {data.options.map((option, idx) => {
          const isSelected = currentSelections.includes(idx);
          const isDisabled = disabledOptions.includes(idx);
          const isCorrect = data.correctSet.includes(idx);

          let btnClass = "border-2 border-gray-700 bg-gray-800/40 text-gray-200 hover:border-gray-500 hover:bg-gray-800/80";
          let checkboxClass = "border-gray-500";

          if (isDisabled) {
            btnClass = "opacity-40 cursor-not-allowed bg-gray-900 border-gray-800 text-gray-500";
            checkboxClass = "border-gray-800";
          } else if (isSubmitted) {
            if (isCorrect) {
              btnClass = "border-success bg-success/10 text-success font-semibold cursor-default animate-pulse-success";
              checkboxClass = "border-success bg-success text-black";
            } else if (isSelected) {
              btnClass = "border-error bg-error/10 text-error font-semibold cursor-default animate-shake";
              checkboxClass = "border-error bg-error text-white";
            } else {
              btnClass = "border-gray-800 bg-gray-900/40 text-gray-500 cursor-default";
              checkboxClass = "border-gray-800";
            }
          } else if (isSelected) {
            btnClass = "border-blue-500 bg-blue-500/10 text-blue-400 font-semibold";
            checkboxClass = "border-blue-500 bg-blue-500";
          }

          return (
            <motion.button
              key={idx}
              disabled={isDisabled || isSubmitted}
              onClick={() => handleToggle(idx)}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-3 ${btnClass}`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${checkboxClass}`}>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </div>
              <span>{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
