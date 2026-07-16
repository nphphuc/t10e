import { useState } from 'react';

interface PatternPressureProps {
  data: any;
  selectedAnswer: Record<string, string> | null;
  onAnswer: (value: Record<string, string>) => void;
  isSubmitted: boolean;
}

export default function PatternPressure({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: PatternPressureProps) {
  const correctMapping: Record<string, string> = data.visual?.correctMapping || {
    "Chỉ một PrinterSpooler": "Singleton",
    "Third-party PDF library": "Adapter",
    "Order thay đổi notify EmailService": "Observer",
    "Chọn thuật toán ship": "Strategy"
  };

  const scenarios = Object.keys(correctMapping);
  const patterns = ["Singleton", "Adapter", "Observer", "Strategy"];

  const [selections, setSelections] = useState<Record<string, string>>(() => {
    return selectedAnswer || {};
  });

  const [hoveredPattern, setHoveredPattern] = useState<string | null>(null);

  const handleSelect = (scenario: string, pattern: string) => {
    if (isSubmitted) return;
    const next = { ...selections, [scenario]: pattern };
    setSelections(next);
    onAnswer(next);
  };

  // Determine which diagram pattern to show (highest precedence: hovered, then selected, else default Strategy)
  const getActiveDiagramPattern = () => {
    if (hoveredPattern) return hoveredPattern;
    // check first scenario's selection or fallback
    const firstSelected = selections[scenarios[0]];
    if (firstSelected && patterns.includes(firstSelected)) return firstSelected;
    return "Strategy";
  };

  const activeDiag = getActiveDiagramPattern();

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn select-none">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-all, .transition-transform {
            transition: none !important;
          }
          .animate-fadeIn {
            animation: none !important;
          }
        }
      `}</style>

      {/* Screen Reader Alternative */}
      <div className="sr-only" aria-live="polite">
        Bảng ghép nối Design Pattern với lực đẩy thiết kế. Sơ đồ hiện tại đang mô tả pattern: {activeDiag}.
      </div>

      {/* 1. Dynamic SVG Pattern Structure */}
      <div className="w-full p-4 bg-[#111214] border border-gray-800 rounded-3xl flex flex-col items-center gap-2 shadow-inner">
        <div className="text-[9px] uppercase font-bold text-purple-400 tracking-widest font-mono">
          Interactive Pattern Structure: {activeDiag}
        </div>
        
        <div className="w-full max-w-sm h-48 bg-[#090a0c]/60 rounded-2xl flex items-center justify-center p-2 border border-gray-900">
          {activeDiag === "Singleton" && (
            <svg viewBox="0 0 300 160" className="w-full h-full text-gray-200">
              {/* Class Box */}
              <rect x="75" y="40" width="150" height="70" rx="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="150" y="58" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">Singleton</text>
              <line x1="75" y1="66" x2="225" y2="66" stroke="#8b5cf6" strokeWidth="1" />
              <text x="85" y="78" fill="#a78bfa" fontSize="8">- static instance: Singleton</text>
              <line x1="75" y1="84" x2="225" y2="84" stroke="#8b5cf6" strokeWidth="1" />
              <text x="85" y="96" fill="#a78bfa" fontSize="8">+ static getInstance()</text>

              {/* Loop arrow self-reference */}
              <path d="M 225 90 C 265 90, 265 50, 227 50" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />
              <polygon points="227,50 234,46 232,54" fill="#8b5cf6" />
              <text x="260" y="74" fill="#a78bfa" fontSize="7" textAnchor="middle">Returns unique instance</text>
            </svg>
          )}

          {activeDiag === "Adapter" && (
            <svg viewBox="0 0 300 160" className="w-full h-full text-gray-200">
              {/* Client Node */}
              <rect x="15" y="60" width="60" height="40" rx="4" fill="#0f172a" stroke="#4b5563" strokeWidth="1.5" />
              <text x="45" y="84" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">Client</text>

              {/* Target Interface */}
              <rect x="110" y="20" width="80" height="40" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="150" y="38" fill="#c084fc" fontSize="8" fontWeight="bold" textAnchor="middle">&lt;&lt;interface&gt;&gt;</text>
              <text x="150" y="48" fill="#c084fc" fontSize="8.5" fontWeight="bold" textAnchor="middle">Target</text>

              {/* Adapter Class */}
              <rect x="110" y="100" width="80" height="40" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="150" y="124" fill="#c084fc" fontSize="9" fontWeight="bold" textAnchor="middle">Adapter</text>

              {/* Adaptee Class */}
              <rect x="225" y="100" width="65" height="40" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
              <text x="257.5" y="120" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">Adaptee</text>
              <text x="257.5" y="130" fill="#34d399" fontSize="7.5" textAnchor="middle">(Third-party)</text>

              {/* Arrows */}
              {/* Client -> Target */}
              <path d="M 75 70 L 110 50" stroke="#8b5cf6" strokeWidth="1.2" />
              <polygon points="110,50 101,48 105,55" fill="#8b5cf6" />

              {/* Adapter implements Target */}
              <path d="M 150 100 L 150 60" stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="3 3" />
              <polygon points="150,60 145,67 155,67" fill="none" stroke="#8b5cf6" />

              {/* Adapter delegates to Adaptee */}
              <path d="M 190 120 L 225 120" stroke="#10b981" strokeWidth="1.2" />
              <polygon points="225,120 217,116 217,124" fill="#10b981" />
            </svg>
          )}

          {activeDiag === "Observer" && (
            <svg viewBox="0 0 300 160" className="w-full h-full text-gray-200">
              {/* Subject */}
              <rect x="30" y="55" width="80" height="50" rx="4" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
              <text x="70" y="78" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">Subject</text>
              <text x="70" y="90" fill="#ca8a04" fontSize="7.5" textAnchor="middle">(Trạng thái)</text>

              {/* Observer */}
              <rect x="190" y="55" width="80" height="50" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="230" y="78" fill="#c084fc" fontSize="9" fontWeight="bold" textAnchor="middle">Observer</text>
              <text x="230" y="90" fill="#a78bfa" fontSize="7.5" textAnchor="middle">(Nhận thông báo)</text>

              {/* Notify Arrow */}
              <path d="M 110 70 L 190 70" stroke="#eab308" strokeWidth="1.5" />
              <polygon points="190,70 182,66 182,74" fill="#eab308" />
              <text x="150" y="63" fill="#fef08a" fontSize="7" textAnchor="middle">notify()</text>

              {/* Subscribe reverse arrow */}
              <path d="M 190 90 L 110 90" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3 3" />
              <polygon points="110,90 118,94 118,86" fill="#8b5cf6" />
              <text x="150" y="101" fill="#a78bfa" fontSize="7" textAnchor="middle">attach(obs)</text>
            </svg>
          )}

          {activeDiag === "Strategy" && (
            <svg viewBox="0 0 300 160" className="w-full h-full text-gray-200">
              {/* Context */}
              <rect x="20" y="60" width="70" height="40" rx="4" fill="#0f172a" stroke="#4b5563" strokeWidth="1.5" />
              <text x="55" y="84" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Context</text>

              {/* Strategy Interface */}
              <rect x="135" y="20" width="90" height="40" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="180" y="38" fill="#c084fc" fontSize="8" fontWeight="bold" textAnchor="middle">&lt;&lt;interface&gt;&gt;</text>
              <text x="180" y="48" fill="#c084fc" fontSize="9" fontWeight="bold" textAnchor="middle">Strategy</text>

              {/* Concrete Strategy A */}
              <rect x="105" y="105" width="70" height="35" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
              <text x="140" y="126" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">Strategy A</text>

              {/* Concrete Strategy B */}
              <rect x="195" y="105" width="70" height="35" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
              <text x="230" y="126" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">Strategy B</text>

              {/* Arrows */}
              <path d="M 90 80 L 135 48" stroke="#8b5cf6" strokeWidth="1.2" />
              <polygon points="135,48 126,48 131,54" fill="#8b5cf6" />

              <path d="M 140 105 L 170 60" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" />
              <polygon points="170,60 163,65 171,69" fill="none" stroke="#10b981" />

              <path d="M 230 105 L 195 60" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" />
              <polygon points="195,60 193,69 201,64" fill="none" stroke="#10b981" />
            </svg>
          )}
        </div>
      </div>

      {/* 2. Scenarios Matching Matrix */}
      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        {scenarios.map((scenario) => {
          const matchedPattern = selections[scenario] || '';
          const isCorrect = isSubmitted && correctMapping[scenario] === matchedPattern;
          return (
            <div
              key={scenario}
              className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-600/40 bg-emerald-950/10'
                    : 'border-rose-600/40 bg-rose-950/10'
                  : 'border-gray-800 bg-[#0d0e12]/60 hover:border-gray-700'
              }`}
            >
              <div className="text-[11px] font-semibold text-gray-200 leading-relaxed">
                {scenario}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-1">
                {patterns.map((pat) => {
                  const active = matchedPattern === pat;
                  return (
                    <button
                      key={pat}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(scenario, pat)}
                      onMouseEnter={() => setHoveredPattern(pat)}
                      onMouseLeave={() => setHoveredPattern(null)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        active
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                      }`}
                    >
                      {pat}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
