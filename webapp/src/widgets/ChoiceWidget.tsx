

interface ChoiceWidgetProps {
  data: {
    prompt: string;
    options: string[];
    correct: number;
    distractorTags?: Record<string, string | null>;
  };
  selectedAnswer: number | null;
  onAnswer: (value: number) => void;
  isSubmitted: boolean;
  disabledOptions: number[];
}

export default function ChoiceWidget({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: ChoiceWidgetProps) {
  const handleSelect = (idx: number) => {
    if (isSubmitted || disabledOptions.includes(idx)) return;
    onAnswer(idx);
  };

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
            btnClass = "border-primary bg-primary/10 text-primary border-blue-500 bg-blue-500/10 text-blue-400 font-semibold";
          }

          return (
            <button
              key={idx}
              disabled={isDisabled || isSubmitted}
              onClick={() => handleSelect(idx)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-start gap-3 ${btnClass}`}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-xs uppercase">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
