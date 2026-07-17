

import { motion, useReducedMotion } from 'framer-motion';

interface ScenarioWidgetProps {
  data: {
    prompt: string;
    options: string[];
    correct: number;
    consequence?: string;
    explanation?: string;
  };
  selectedAnswer: number | null;
  onAnswer: (value: number) => void;
  isSubmitted: boolean;
  disabledOptions: number[];
}

export default function ScenarioWidget({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: ScenarioWidgetProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleSelect = (idx: number) => {
    if (isSubmitted || disabledOptions.includes(idx)) return;
    onAnswer(idx);
  };

  const showConsequence = isSubmitted && selectedAnswer === data.correct;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {data.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isDisabled = disabledOptions.includes(idx);
          const isCorrect = idx === data.correct;

          let btnClass = "border-2 border-gray-700 bg-gray-800/40 text-gray-200 hover:border-gray-500 hover:bg-gray-800/80";

          if (isDisabled) {
            btnClass = "opacity-40 cursor-not-allowed bg-gray-900 border-gray-800 text-gray-500";
          } else if (isSubmitted) {
            if (isCorrect) {
              btnClass = "border-success bg-success/10 text-success font-semibold cursor-default animate-pulse-success";
            } else if (isSelected) {
              btnClass = "border-error bg-error/10 text-error font-semibold cursor-default animate-shake";
            } else {
              btnClass = "border-gray-800 bg-gray-900/40 text-gray-500 cursor-default";
            }
          } else if (isSelected) {
            btnClass = "border-blue-500 bg-blue-500/10 text-blue-400 font-semibold";
          }

          return (
            <motion.button
              key={idx}
              disabled={isDisabled || isSubmitted}
              onClick={() => handleSelect(idx)}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-start gap-3 ${btnClass}`}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-xs uppercase">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{option}</span>
            </motion.button>
          );
        })}
      </div>

      {showConsequence && (data.consequence || data.explanation) && (
        <div className="mt-4 p-5 rounded-xl bg-blue-950/20 border border-blue-900/40 text-blue-200 text-[15px] leading-relaxed md:leading-loose whitespace-pre-line animate-fadeIn">
          <div className="font-bold text-blue-400 mb-2 text-md">Hệ quả thiết kế (Consequence):</div>
          <p>{data.consequence || data.explanation}</p>
        </div>
      )}
    </div>
  );
}
