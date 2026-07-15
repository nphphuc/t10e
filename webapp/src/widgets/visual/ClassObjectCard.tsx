import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

interface ClassObjectCardProps {
  data: {
    prompt: string;
    correct?: any;
    visual: {
      variant: string;
      options?: string[];
    };
  };
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions: number[];
}

export default function ClassObjectCard({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: ClassObjectCardProps) {
  const [isObjectMode, setIsObjectMode] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-colors, .transition-transform, .transition-all {
            transition: none !important;
          }
        }
      `}</style>
      {/* Mode Toggle Slider */}
      <div className="flex justify-center items-center gap-3">
        <span className={`text-xs font-bold transition-colors ${!isObjectMode ? 'text-purple-400' : 'text-gray-500'}`}>
          CLASS (Lớp)
        </span>
        <button
          onClick={() => setIsObjectMode(!isObjectMode)}
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isObjectMode ? 'bg-emerald-600' : 'bg-purple-600'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${
              isObjectMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={`text-xs font-bold transition-colors ${isObjectMode ? 'text-emerald-400' : 'text-gray-500'}`}>
          OBJECT (Đối tượng)
        </span>
      </div>

      {/* UML Box Rendering */}
      <div className="w-full flex justify-center py-4 bg-[#090a0c]/40 border border-gray-800/60 rounded-2xl">
        <div
          className={`w-72 border-2 rounded-xl overflow-hidden transition-all duration-300 bg-[#111214] shadow-md ${
            isObjectMode
              ? 'border-emerald-500 shadow-emerald-950/20'
              : 'border-purple-500 shadow-purple-950/20'
          }`}
        >
          {/* Header */}
          <div
            className={`p-3 text-center border-b-2 font-bold text-sm transition-all duration-300 ${
              isObjectMode
                ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300'
                : 'bg-purple-950/30 border-purple-500 text-purple-300'
            }`}
          >
            {isObjectMode ? (
              <span className="underline decoration-1 underline-offset-4">
                johnsAccount : Account
              </span>
            ) : (
              <span>Account</span>
            )}
            <div className="text-[8px] uppercase tracking-widest mt-0.5 opacity-60 font-black">
              {isObjectMode ? 'Object Instance' : 'UML Class'}
            </div>
          </div>

          {/* Attributes Compartment */}
          <div
            className={`p-4 text-left border-b text-xs font-mono space-y-2 transition-colors duration-300 ${
              isObjectMode ? 'border-emerald-900/40' : 'border-purple-900/40'
            }`}
          >
            <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-1">
              Attributes (Thuộc tính)
            </div>
            {isObjectMode ? (
              <>
                <div className="text-gray-200">accountNumber = <span className="text-emerald-400">"A101"</span></div>
                <div className="text-gray-200">balance = <span className="text-emerald-400">500.0</span></div>
              </>
            ) : (
              <>
                <div className="text-gray-300">- accountNumber : String</div>
                <div className="text-gray-300">- balance : Real</div>
              </>
            )}
          </div>

          {/* Operations Compartment */}
          <div className="p-4 text-left text-xs font-mono space-y-2">
            <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-1">
              Operations (Hành động)
            </div>
            {isObjectMode ? (
              <div className="text-gray-500 italic text-[10px] leading-relaxed">
                (Ẩn đi ở Object view. Các operations được kế thừa động từ Class Account ở runtime)
              </div>
            ) : (
              <>
                <div className="text-gray-300">+ deposit(amount : Real)</div>
                <div className="text-gray-300">+ withdraw(amount : Real)</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Choice Question */}
      <div className="border-t border-gray-800 pt-4">
        <ChoiceWidget
          data={{
            prompt: data.prompt,
            options: data.visual.options || [],
            correct: data.correct
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
