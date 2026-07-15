import React from 'react';

interface FillWidgetProps {
  data: {
    prompt: string;
    accepted: string[];
  };
  selectedAnswer: string | null;
  onAnswer: (value: string) => void;
  isSubmitted: boolean;
}

export default function FillWidget({
  data,
  selectedAnswer = "",
  onAnswer,
  isSubmitted,
}: FillWidgetProps) {
  const currentText = selectedAnswer || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitted) return;
    onAnswer(e.target.value);
  };

  // Check if current text is correct (for display styling)
  const isInputCorrect = () => {
    if (!currentText) return false;
    const cleanUser = currentText.trim().toLowerCase().replace(/\s+/g, "");
    return data.accepted.some(item => {
      const cleanItem = item.trim().toLowerCase().replace(/\s+/g, "");
      return cleanUser === cleanItem;
    });
  };

  let inputBorderClass = "border-gray-700 bg-gray-800/40 text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500";
  if (isSubmitted) {
    if (isInputCorrect()) {
      inputBorderClass = "border-success bg-success/10 text-success cursor-default";
    } else {
      inputBorderClass = "border-error bg-error/10 text-error cursor-default";
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={currentText}
          disabled={isSubmitted}
          onChange={handleChange}
          placeholder="Nhập câu trả lời của bạn..."
          className={`w-full p-4 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none ${inputBorderClass}`}
        />
        {isSubmitted && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isInputCorrect() ? (
              <svg className="w-6 h-6 text-success fill-current" viewBox="0 0 20 20">
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-error fill-current" viewBox="0 0 20 20">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm5 13.59L13.59 15 10 11.41 6.41 15 5 13.59 8.59 10 5 6.41 6.41 5 10 8.59 13.59 5 15 6.41 11.41 10 15 13.59z" />
              </svg>
            )}
          </div>
        )}
      </div>
      {isSubmitted && !isInputCorrect() && (
        <div className="text-sm text-gray-400 mt-2">
          Đáp án đúng: <span className="font-semibold text-gray-200">{data.accepted.join(" hoặc ")}</span>
        </div>
      )}
    </div>
  );
}
