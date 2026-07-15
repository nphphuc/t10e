

interface MatchWidgetProps {
  data: {
    prompt: string;
    pairs: Record<string, string>;
  };
  selectedAnswer: Record<string, string> | null; // e.g., { key: value }
  onAnswer: (value: Record<string, string>) => void;
  isSubmitted: boolean;
}

export default function MatchWidget({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: MatchWidgetProps) {
  const currentMatches = (selectedAnswer && typeof selectedAnswer === 'object' && !Array.isArray(selectedAnswer)) ? selectedAnswer : {};

  // Extract unique values to display as target options
  const uniqueValues = Array.from(new Set(Object.values(data.pairs)));
  const keys = Object.keys(data.pairs);

  const handleMatch = (key: string, value: string) => {
    if (isSubmitted) return;
    onAnswer({
      ...currentMatches,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {keys.map((key) => {
          const selectedVal = currentMatches[key];
          const correctVal = data.pairs[key];
          const isCorrect = selectedVal === correctVal;

          return (
            <div
              key={key}
              className={`p-4 rounded-xl border-2 bg-gray-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? "border-success/40 bg-success/5"
                    : "border-error/40 bg-error/5"
                  : "border-gray-700"
              }`}
            >
              <div className="font-semibold text-gray-200 text-sm md:w-1/2">
                {key}
              </div>
              <div className="flex flex-wrap gap-2 md:w-1/2 md:justify-end">
                {uniqueValues.map((val) => {
                  const isActive = selectedVal === val;
                  let chipClass = "border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200";

                  if (isActive) {
                    if (isSubmitted) {
                      chipClass = isCorrect
                        ? "bg-success text-black border-success font-semibold"
                        : "bg-error text-white border-error font-semibold";
                    } else {
                      chipClass = "bg-blue-500 text-white border-blue-500 font-semibold";
                    }
                  } else if (isSubmitted) {
                    chipClass = "opacity-30 border-gray-800 text-gray-600 cursor-default";
                  }

                  return (
                    <button
                      key={val}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleMatch(key, val)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${chipClass}`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {isSubmitted && (
        <div className="mt-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800 text-sm">
          <div className="font-semibold text-gray-300 mb-2">Đáp án đúng:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-400">
            {Object.entries(data.pairs).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="font-medium text-gray-200">{k}</span>
                <span>&rarr;</span>
                <span className="text-success">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
