import ChoiceWidget from '../ChoiceWidget';

interface Link {
  from: string;
  to: string;
}

interface AssociationMultiplicityProps {
  data: any; // visual config
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

export default function AssociationMultiplicity({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: AssociationMultiplicityProps) {
  const classA = data.visual.classA || "Class A";
  const classB = data.visual.classB || "Class B";
  const objectsA = data.visual.objectsA || ["a1", "a2"];
  const objectsB = data.visual.objectsB || ["b1", "b2", "b3"];
  const links: Link[] = data.visual.links || [];

  // Options multiplicity mapping, e.g. Option 0 maps to ["1", "0..*"], Option 1 maps to ["0..*", "1"]
  // If not defined, read from choice text parser or default to standard
  const getMultValuesForOption = (optIdx: number) => {
    if (data.visual.optionMultiplicities && data.visual.optionMultiplicities[optIdx]) {
      return data.visual.optionMultiplicities[optIdx]; // returns [multA, multB]
    }
    // Default fallback mappings for L04-02
    if (optIdx === 0) return ["1", "0..*"];
    if (optIdx === 1) return ["0..*", "1"];
    return ["*", "*"];
  };

  const selectedIdx = selectedAnswer !== null ? Number(selectedAnswer) : -1;
  const [currentMultA, currentMultB] = selectedIdx !== -1 ? getMultValuesForOption(selectedIdx) : ["?", "?"];

  // Evaluate violations for each object under current multiplicity
  const getViolations = () => {
    if (selectedIdx === -1) return { violationsA: {}, violationsB: {} };

    const violationsA: Record<string, string> = {};
    const violationsB: Record<string, string> = {};

    // 1. Check Class A multiplicity constraints (how many B connected to each A)
    objectsA.forEach((objId: string) => {
      const connCount = links.filter((l) => l.from === objId).length;
      if (currentMultB === "1" && connCount !== 1) {
        violationsA[objId] = `${objId} liên kết với ${connCount} ${classB} (yêu cầu đúng 1)`;
      } else if (currentMultB === "1..*" && connCount < 1) {
        violationsA[objId] = `${objId} không liên kết với ${classB} nào (yêu cầu ít nhất 1)`;
      } else if (currentMultB === "0..1" && connCount > 1) {
        violationsA[objId] = `${objId} liên kết với ${connCount} ${classB} (yêu cầu tối đa 1)`;
      }
    });

    // 2. Check Class B multiplicity constraints (how many A connected to each B)
    objectsB.forEach((objId: string) => {
      const connCount = links.filter((l) => l.to === objId).length;
      if (currentMultA === "1" && connCount !== 1) {
        violationsB[objId] = `${objId} liên kết với ${connCount} ${classA} (yêu cầu đúng 1)`;
      } else if (currentMultA === "1..*" && connCount < 1) {
        violationsB[objId] = `${objId} không liên kết với ${classA} nào (yêu cầu ít nhất 1)`;
      } else if (currentMultA === "0..1" && connCount > 1) {
        violationsB[objId] = `${objId} liên kết với ${connCount} ${classA} (yêu cầu tối đa 1)`;
      }
    });

    return { violationsA, violationsB };
  };

  const { violationsA, violationsB } = getViolations();
  const hasAnyViolation = Object.keys(violationsA).length > 0 || Object.keys(violationsB).length > 0;

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
      {/* 1. UML Class Diagram Header */}
      <div className="w-full flex justify-center py-4 bg-[#111214] border border-gray-800 rounded-2xl relative shadow-inner">
        <div className="flex items-center gap-12 relative w-72 h-20 justify-center">
          {/* Class A Box */}
          <div className="w-20 py-2 border-2 border-purple-500 rounded-lg text-center bg-purple-950/20 text-purple-200 font-bold text-xs">
            {classA}
          </div>

          {/* Association Line */}
          <div className="absolute left-[80px] right-[80px] h-0.5 bg-gray-600 flex items-center justify-between px-2">
            {/* Multiplicity values on line */}
            <span className="text-[10px] font-bold text-amber-400 -mt-5 font-mono">
              {currentMultA}
            </span>
            <span className="text-[10px] font-bold text-amber-400 -mt-5 font-mono">
              {currentMultB}
            </span>
          </div>

          {/* Class B Box */}
          <div className="w-20 py-2 border-2 border-purple-500 rounded-lg text-center bg-purple-950/20 text-purple-200 font-bold text-xs">
            {classB}
          </div>
        </div>
      </div>

      {/* 2. Runtime Objects & Links Diagram */}
      <div className="w-full p-5 bg-[#090a0c]/60 border border-gray-800 rounded-2xl flex flex-col items-center gap-3">
        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
          Runtime Instance Link Set (Tập liên kết đối tượng)
        </div>

        <div className="w-full flex justify-center py-2 relative">
          <svg viewBox="0 0 320 160" className="w-80 h-40">
            {/* Draw Links */}
            {links.map((link, idx) => {
              const fromIdx = objectsA.indexOf(link.from);
              const toIdx = objectsB.indexOf(link.to);
              if (fromIdx === -1 || toIdx === -1) return null;

              // Calculate positions
              const x1 = 50;
              const y1 = 30 + fromIdx * 50;
              const x2 = 270;
              const y2 = 20 + toIdx * 40;

              const isLinkActive = selectedIdx !== -1;

              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isLinkActive ? '#3b82f6' : '#4b5563'}
                  strokeWidth="2"
                  strokeOpacity={isLinkActive ? '0.8' : '0.4'}
                />
              );
            })}

            {/* Draw Class A Objects */}
            {objectsA.map((objId: string, idx: number) => {
              const x = 50;
              const y = 30 + idx * 50;
              const isViolated = violationsA[objId] !== undefined;

              return (
                <g key={objId}>
                  <circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill={isViolated ? '#7f1d1d' : '#1e1b4b'}
                    stroke={isViolated ? '#ef4444' : '#8b5cf6'}
                    strokeWidth="2"
                    className="transition-colors duration-200"
                  />
                  <text x={x} y={y + 4} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {objId}
                  </text>
                  <text x={x} y={y + 24} fill="#94a3b8" fontSize="7" textAnchor="middle">
                    :{classA}
                  </text>
                  {isViolated && (
                    <g transform={`translate(${x + 10}, ${y - 15})`}>
                      <circle cx="0" cy="0" r="5" fill="#ef4444" />
                      <text x="0" y="2" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">!</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Draw Class B Objects */}
            {objectsB.map((objId: string, idx: number) => {
              const x = 270;
              const y = 20 + idx * 40;
              const isViolated = violationsB[objId] !== undefined;

              return (
                <g key={objId}>
                  <circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill={isViolated ? '#7f1d1d' : '#115e59'}
                    stroke={isViolated ? '#ef4444' : '#14b8a6'}
                    strokeWidth="2"
                    className="transition-colors duration-200"
                  />
                  <text x={x} y={y + 4} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {objId}
                  </text>
                  <text x={x} y={y + 24} fill="#94a3b8" fontSize="7" textAnchor="middle">
                    :{classB}
                  </text>
                  {isViolated && (
                    <g transform={`translate(${x - 15}, ${y - 12})`}>
                      <circle cx="0" cy="0" r="5" fill="#ef4444" />
                      <text x="0" y="2" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">!</text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Validation Output Message */}
        <div className="w-full text-center py-2 px-4 rounded-xl text-xs transition-all duration-300">
          {selectedIdx === -1 ? (
            <span className="text-gray-500 font-medium">💡 Chọn một đáp án bên dưới để kiểm tra tính hợp lệ của liên kết.</span>
          ) : hasAnyViolation ? (
            <div className="text-red-400 space-y-1 bg-red-950/20 border border-red-900/50 p-2 rounded-xl">
              <span className="font-bold">⚠️ Vi phạm ràng buộc số lượng:</span>
              <p className="text-[10px] text-red-300/80">
                {Object.values(violationsA)[0] || Object.values(violationsB)[0]}
              </p>
            </div>
          ) : (
            <span className="text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2 px-4 rounded-xl">
              ✓ Hợp lệ: Không có thực thể nào vi phạm ràng buộc số lượng đã chọn.
            </span>
          )}
        </div>
      </div>

      {/* 3. Choice Widget */}
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
