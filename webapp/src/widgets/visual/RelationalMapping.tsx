import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

interface RelationalMappingProps {
  data: any;
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

export default function RelationalMapping({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: RelationalMappingProps) {
  const classA = data.visual.classA || "Customer";
  const classB = data.visual.classB || "Account";

  const [activeFkPlacement, setActiveFkPlacement] = useState<string | null>(null);

  const handleSelectFk = (placement: string) => {
    if (isSubmitted) return;
    setActiveFkPlacement(placement);
    
    // map the placement string to choice index for compatibility with ChoiceWidget
    let answerIndex = 0;
    if (placement === classB) answerIndex = 0; // Account (many side)
    if (placement === classA) answerIndex = 1; // Customer (one side)
    if (placement === 'join-table') answerIndex = 2; // Join Table
    
    onAnswer(answerIndex);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn select-none">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-all {
            transition: none !important;
          }
          .animate-fadeIn {
            animation: none !important;
          }
        }
      `}</style>

      {/* Screen Reader Alternative */}
      <div className="sr-only" aria-live="polite">
        Sơ đồ chuyển đổi UML sang quan hệ DB. Lớp {classA} quan hệ 1-nhiều với lớp {classB}.
      </div>

      {/* UML Class Diagram Representation */}
      <div className="w-full flex flex-col items-center gap-2 py-4 bg-[#111214] border border-gray-800 rounded-2xl shadow-inner">
        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
          UML Static Class Diagram
        </div>
        <div className="flex items-center gap-12 relative w-72 h-16 justify-center">
          {/* Class A */}
          <div className="w-20 py-2 border-2 border-purple-500 rounded-lg text-center bg-purple-950/20 text-purple-200 font-bold text-xs">
            {classA}
            <div className="border-t border-purple-500/40 mt-1 pt-0.5 text-[8px] text-gray-400 font-mono">
              - {classA.toLowerCase()}Id
            </div>
          </div>

          {/* Association Line */}
          <div className="absolute left-[80px] right-[80px] h-0.5 bg-gray-600 flex items-center justify-between px-2">
            <span className="text-[10px] font-bold text-amber-400 -mt-5 font-mono">1</span>
            <span className="text-[10px] font-bold text-amber-400 -mt-5 font-mono">*</span>
          </div>

          {/* Class B */}
          <div className="w-20 py-2 border-2 border-purple-500 rounded-lg text-center bg-purple-950/20 text-purple-200 font-bold text-xs">
            {classB}
            <div className="border-t border-purple-500/40 mt-1 pt-0.5 text-[8px] text-gray-400 font-mono">
              - {classB.toLowerCase()}Id
            </div>
          </div>
        </div>
      </div>

      {/* Relational Database Target Tables */}
      <div className="grid grid-cols-2 gap-4">
        {/* Table A */}
        <div
          onClick={() => handleSelectFk(classA)}
          className={`p-3 bg-[#0d0e12] border-2 rounded-2xl flex flex-col gap-1.5 cursor-pointer transition-all ${
            activeFkPlacement === classA || (isSubmitted && selectedAnswer === 1)
              ? 'border-purple-600 shadow-md'
              : 'border-gray-800 hover:border-gray-700'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-purple-400 border-b border-gray-800 pb-1 font-mono">
            Table: {classA.toLowerCase()}s
          </div>
          <div className="text-xs text-gray-300 font-mono flex items-center justify-between">
            <span>🔑 {classA.toLowerCase()}Id</span>
            <span className="text-[9px] text-gray-500">PK</span>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            name: varchar
          </div>
          {(activeFkPlacement === classA || (isSubmitted && selectedAnswer === 1)) && (
            <div className="text-[9px] bg-purple-900/30 text-purple-300 px-2 py-1 rounded font-semibold text-center border border-purple-800/40">
              🔗 FK: {classB.toLowerCase()}Id
            </div>
          )}
        </div>

        {/* Table B */}
        <div
          onClick={() => handleSelectFk(classB)}
          className={`p-3 bg-[#0d0e12] border-2 rounded-2xl flex flex-col gap-1.5 cursor-pointer transition-all ${
            activeFkPlacement === classB || (isSubmitted && selectedAnswer === 0)
              ? 'border-purple-600 shadow-md'
              : 'border-gray-800 hover:border-gray-700'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-purple-400 border-b border-gray-800 pb-1 font-mono">
            Table: {classB.toLowerCase()}s
          </div>
          <div className="text-xs text-gray-300 font-mono flex items-center justify-between">
            <span>🔑 {classB.toLowerCase()}Id</span>
            <span className="text-[9px] text-gray-500">PK</span>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            date: timestamp
          </div>
          {(activeFkPlacement === classB || (isSubmitted && selectedAnswer === 0)) && (
            <div className="text-[9px] bg-purple-900/30 text-purple-300 px-2 py-1 rounded font-semibold text-center border border-purple-800/40">
              🔗 FK: {classA.toLowerCase()}Id
            </div>
          )}
        </div>
      </div>

      {/* Choice grading widget */}
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
