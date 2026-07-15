import { useEffect, useState } from 'react';

interface StateMachineRunnerProps {
  data: {
    prompt: string;
    visual: {
      variant: string;
    };
  };
  selectedAnswer: string | null;
  onAnswer: (value: string) => void;
  isSubmitted: boolean;
}

export default function StateMachineRunner({
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: StateMachineRunnerProps) {
  const [animate, setAnimate] = useState(false);

  // Trigger animation when submitted and correct
  useEffect(() => {
    if (isSubmitted && selectedAnswer === 'Disabled') {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isSubmitted, selectedAnswer]);

  const handleSelectState = (stateName: string) => {
    if (isSubmitted) return;
    onAnswer(stateName);
  };

  const isEnabledSelected = selectedAnswer === 'Enabled';
  const isDisabledSelected = selectedAnswer === 'Disabled';

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* SVG State Machine Diagram */}
      <div className="relative w-full max-w-[600px] aspect-[600/300] bg-gray-950/40 border border-gray-800 rounded-3xl p-4 shadow-inner">
        <svg
          viewBox="0 0 600 300"
          className="w-full h-full text-gray-400 select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for Markers (Arrowheads) */}
          <defs>
            <marker
              id="arrow-right"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4b5563" />
            </marker>
            <marker
              id="arrow-right-active"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3b82f6" />
            </marker>
            <marker
              id="arrow-left"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4b5563" />
            </marker>
          </defs>

          {/* Grid lines/background decor (subtle dots) */}
          <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#1f2937" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotGrid)" className="rounded-2xl" />

          {/* Transition: Enabled -> Disabled (Top Curved Path) */}
          <path
            id="transition-disable"
            d="M 180 130 Q 300 70 420 130"
            fill="none"
            stroke={animate ? '#3b82f6' : '#374151'}
            strokeWidth={animate ? '3' : '2'}
            strokeDasharray={animate ? '0' : '4 4'}
            markerEnd={animate ? 'url(#arrow-right-active)' : 'url(#arrow-right)'}
            className="transition-all duration-500"
          />
          <text x="300" y="80" textAnchor="middle" className="text-[11px] font-mono fill-blue-400 font-bold bg-gray-900">
            DisableNews
          </text>

          {/* Transition: Disabled -> Enabled (Bottom Curved Path) */}
          <path
            id="transition-enable"
            d="M 420 170 Q 300 230 180 170"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
            strokeDasharray="4 4"
            markerEnd="url(#arrow-left)"
          />
          <text x="300" y="225" textAnchor="middle" className="text-[11px] font-mono fill-gray-500">
            EnableNews
          </text>

          {/* Animated Token moving on DisableNews */}
          {animate && (
            <circle r="6" fill="#60a5fa" className="shadow-lg shadow-blue-500">
              <animateMotion
                dur="1.2s"
                repeatCount="indefinite"
                path="M 180 130 Q 300 70 420 130"
              />
            </circle>
          )}

          {/* Initial State Entry Arrow */}
          <path
            d="M 50 150 L 110 150"
            fill="none"
            stroke="#4b5563"
            strokeWidth="2"
            markerEnd="url(#arrow-right)"
          />
          <circle cx="50" cy="150" r="4" fill="#4b5563" />

          {/* State Node 1: Enabled */}
          <g
            onClick={() => handleSelectState('Enabled')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectState('Enabled');
              }
            }}
            tabIndex={isSubmitted ? -1 : 0}
            className={`cursor-pointer focus:outline-none group`}
          >
            {/* Outer Glow Selection */}
            <rect
              x="110"
              y="110"
              width="80"
              height="80"
              rx="20"
              fill="none"
              stroke={isEnabledSelected ? '#3b82f6' : 'transparent'}
              strokeWidth="4"
              className="transition-all duration-200"
            />
            {/* Main Node */}
            <rect
              x="115"
              y="115"
              width="70"
              height="70"
              rx="16"
              fill={isEnabledSelected ? '#1e293b' : '#0f172a'}
              stroke={
                isSubmitted
                  ? selectedAnswer === 'Enabled'
                    ? '#ef4444' // selected incorrect
                    : '#374151'
                  : isEnabledSelected
                  ? '#3b82f6'
                  : '#1f2937'
              }
              strokeWidth="2"
              className="transition-all duration-200 group-hover:stroke-gray-600"
            />
            {/* Active start pointer */}
            <circle cx="150" cy="125" r="4" fill="#f97316" className="animate-ping" />
            <circle cx="150" cy="125" r="3" fill="#f97316" />
            
            <text
              x="150"
              y="155"
              textAnchor="middle"
              className={`text-xs font-bold font-mono transition-all ${
                isEnabledSelected ? 'fill-blue-400' : 'fill-gray-300'
              }`}
            >
              Enabled
            </text>
          </g>

          {/* State Node 2: Disabled */}
          <g
            onClick={() => handleSelectState('Disabled')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectState('Disabled');
              }
            }}
            tabIndex={isSubmitted ? -1 : 0}
            className={`cursor-pointer focus:outline-none group`}
          >
            {/* Outer Glow Selection */}
            <rect
              x="410"
              y="110"
              width="80"
              height="80"
              rx="20"
              fill="none"
              stroke={
                isSubmitted && isDisabledSelected
                  ? '#10b981' // green success glow
                  : isDisabledSelected
                  ? '#3b82f6'
                  : 'transparent'
              }
              strokeWidth="4"
              className="transition-all duration-200"
            />
            {/* Main Node */}
            <rect
              x="415"
              y="115"
              width="70"
              height="70"
              rx="16"
              fill={isDisabledSelected ? '#1e293b' : '#0f172a'}
              stroke={
                isSubmitted
                  ? isDisabledSelected
                    ? '#10b981' // green success border
                    : '#374151'
                  : isDisabledSelected
                  ? '#3b82f6'
                  : '#1f2937'
              }
              strokeWidth="2"
              className="transition-all duration-200 group-hover:stroke-gray-600"
            />
            <text
              x="450"
              y="155"
              textAnchor="middle"
              className={`text-xs font-bold font-mono transition-all ${
                isSubmitted && isDisabledSelected
                  ? 'fill-emerald-400'
                  : isDisabledSelected
                  ? 'fill-blue-400'
                  : 'fill-gray-300'
              }`}
            >
              Disabled
            </text>
          </g>
        </svg>
      </div>

      {/* Helper text instructions */}
      <div className="text-sm text-gray-300 text-center max-w-md leading-relaxed">
        {isSubmitted ? (
          selectedAnswer === 'Disabled' ? (
            <span className="text-emerald-400 font-semibold">
              🎉 Chính xác! Event <code>DisableNews</code> kích hoạt transition từ trạng thái <code>Enabled</code> sang <code>Disabled</code>.
            </span>
          ) : (
            <span className="text-red-400 font-semibold">
              ❌ Chưa đúng. Hãy quan sát hướng đi của mũi tên khi nhận event <code>DisableNews</code>.
            </span>
          )
        ) : (
          <span>
            Click trực tiếp vào trạng thái trên sơ đồ biểu đồ để chọn câu trả lời của bạn.
          </span>
        )}
      </div>
    </div>
  );
}
