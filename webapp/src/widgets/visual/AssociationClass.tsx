import ChoiceWidget from '../ChoiceWidget';

interface AssociationClassProps {
  data: any;
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

export default function AssociationClass({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: AssociationClassProps) {
  const classA = data.visual.classA || "Class A";
  const classB = data.visual.classB || "Class B";
  const associationName = data.visual.associationName || "Relation";
  const attributeName = data.visual.attributeName || "attribute";

  const selectedIdx = selectedAnswer !== null ? Number(selectedAnswer) : -1;

  // Visual position parameters
  const isPlacedInA = selectedIdx === 0;
  const isPlacedInB = selectedIdx === 1;
  const isPlacedInClass = selectedIdx === 2;

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-colors, .transition-all {
            transition: none !important;
          }
          .animate-fadeIn {
            animation: none !important;
          }
        }
      `}</style>
      {/* 1. UML Diagram Playground */}
      <div className="w-full p-6 bg-[#111214] border border-gray-800 rounded-3xl flex flex-col items-center gap-4 shadow-inner">
        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
          Placement Diagram
        </div>

        <div className="relative w-full max-w-sm h-48 bg-[#090a0c]/60 border border-gray-900 rounded-2xl flex justify-center items-start pt-6">
          <svg viewBox="0 0 360 180" className="w-90 h-44">
            {/* Draw Association Line between Class A and B */}
            <line x1="80" y1="50" x2="280" y2="50" stroke="#4b5563" strokeWidth="2" />
            <text x="180" y="42" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
              {associationName}
            </text>

            {/* Draw Dashed Line down to Association Class */}
            <line
              x1="180"
              y1="50"
              x2="180"
              y2="105"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Class A Box */}
            <g transform="translate(20, 20)">
              <rect
                x="0"
                y="0"
                width="80"
                height="60"
                rx="6"
                fill="#1e1b4b"
                stroke={isPlacedInA ? '#ef4444' : '#8b5cf6'}
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              <text x="40" y="18" fill="#c084fc" fontSize="9" fontWeight="bold" textAnchor="middle">
                {classA}
              </text>
              <line x1="0" y1="26" x2="80" y2="26" stroke={isPlacedInA ? '#ef4444' : '#8b5cf6'} strokeWidth="1" />
              {isPlacedInA && (
                <text x="8" y="42" fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  - {attributeName}
                </text>
              )}
            </g>

            {/* Class B Box */}
            <g transform="translate(260, 20)">
              <rect
                x="0"
                y="0"
                width="80"
                height="60"
                rx="6"
                fill="#1e1b4b"
                stroke={isPlacedInB ? '#ef4444' : '#8b5cf6'}
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              <text x="40" y="18" fill="#c084fc" fontSize="9" fontWeight="bold" textAnchor="middle">
                {classB}
              </text>
              <line x1="0" y1="26" x2="80" y2="26" stroke={isPlacedInB ? '#ef4444' : '#8b5cf6'} strokeWidth="1" />
              {isPlacedInB && (
                <text x="8" y="42" fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  - {attributeName}
                </text>
              )}
            </g>

            {/* Association Class Box */}
            <g transform="translate(130, 105)">
              <rect
                x="0"
                y="0"
                width="100"
                height="55"
                rx="6"
                fill="#1f1e2e"
                stroke={isPlacedInClass ? '#10b981' : '#64748b'}
                strokeWidth="2"
                strokeDasharray={isPlacedInClass ? 'none' : '3 3'}
                className="transition-all duration-300"
              />
              <text
                x="50"
                y="18"
                fill={isPlacedInClass ? '#34d399' : '#94a3b8'}
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {associationName}
              </text>
              <line
                x1="0"
                y1="26"
                x2="100"
                y2="26"
                stroke={isPlacedInClass ? '#10b981' : '#64748b'}
                strokeWidth="1.5"
                strokeDasharray={isPlacedInClass ? 'none' : '3 3'}
              />
              {isPlacedInClass && (
                <text x="8" y="42" fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  - {attributeName}
                </text>
              )}
            </g>
          </svg>
        </div>

        {/* Diagnostic Feedback Alert */}
        <div className="w-full text-center py-2.5 px-4 rounded-xl text-xs transition-all duration-300">
          {selectedIdx === -1 ? (
            <span className="text-gray-500 font-medium">💡 Chọn vị trí đặt thuộc tính ở câu hỏi để kiểm chứng cấu trúc.</span>
          ) : isPlacedInA ? (
            <div className="text-red-400 bg-red-950/20 border border-red-900/50 p-2 rounded-xl text-left leading-relaxed">
              <span className="font-bold">⚠️ Trùng lặp dữ liệu và Vi phạm tính độc lập:</span>
              <p className="text-[10px] text-red-300/80 mt-1">
                Lỗi: Nếu đặt ở `{classA}`, thực thể `{classA}` chỉ có một giá trị `{attributeName}` duy nhất cho tất cả các liên kết. Ví dụ, một học sinh sẽ có chung 1 điểm cho tất cả các môn học!
              </p>
            </div>
          ) : isPlacedInB ? (
            <div className="text-red-400 bg-red-950/20 border border-red-900/50 p-2 rounded-xl text-left leading-relaxed">
              <span className="font-bold">⚠️ Trùng lặp dữ liệu và Vi phạm tính độc lập:</span>
              <p className="text-[10px] text-red-300/80 mt-1">
                Lỗi: Nếu đặt ở `{classB}`, thực thể `{classB}` chỉ có một giá trị `{attributeName}` chung cho mọi đối tượng liên kết. Ví dụ, môn học sẽ có chung 1 điểm duy nhất cho toàn bộ học sinh!
              </p>
            </div>
          ) : (
            <div className="text-emerald-400 bg-emerald-950/20 border border-emerald-900/50 p-2 rounded-xl text-left leading-relaxed">
              <span className="font-bold">✓ Thiết kế chuẩn xác:</span>
              <p className="text-[10px] text-emerald-300/80 mt-1">
                Bằng cách sử dụng Association Class `{associationName}`, thuộc tính `{attributeName}` được lưu trữ độc lập trên từng cặp liên kết cụ thể (ví dụ: điểm số riêng biệt của mỗi Học sinh cho từng môn học tương ứng).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Choice Widget Options */}
      <div className="border-t border-gray-800 pt-4">
        <ChoiceWidget
          data={{
            prompt: data.prompt,
            options: data.options || [],
            correct: data.correct,
          }}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
          disabledOptions={disabledOptions}
        />
      </div>
    </div>
  );
}
