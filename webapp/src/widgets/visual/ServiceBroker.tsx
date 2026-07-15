import { useState, useEffect } from 'react';


interface ServiceBrokerProps {
  data: any;
  selectedAnswer: string[] | null;
  onAnswer: (value: string[]) => void;
  isSubmitted: boolean;
}

export default function ServiceBroker({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: ServiceBrokerProps) {
  const correctOrder: string[] = data.correctOrder || [
    "Service đăng ký name, description, location",
    "Client hỏi broker",
    "Broker trả location/handle",
    "Client gửi request cho service"
  ];

  // Initialize order
  const [order, setOrder] = useState<string[]>(() => {
    if (selectedAnswer && selectedAnswer.length === correctOrder.length) {
      return selectedAnswer;
    }
    // Initially shuffled order (stable, not matching correct)
    const shuffled = [...correctOrder];
    shuffled.reverse(); // simple reverse is guaranteed not to match correct
    return shuffled;
  });

  useEffect(() => {
    if (!selectedAnswer) {
      onAnswer(order);
    }
  }, [order, selectedAnswer, onAnswer]);

  const moveStep = (fromIdx: number, toIdx: number) => {
    if (isSubmitted) return;
    const newOrder = [...order];
    const [moved] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, moved);
    setOrder(newOrder);
    onAnswer(newOrder);
  };

  // Find step numbers for diagram markers
  const getStepNumber = (labelPrefix: string) => {
    // find index in current order
    const idx = order.findIndex(item => item.toLowerCase().includes(labelPrefix.toLowerCase()));
    return idx !== -1 ? idx + 1 : '?';
  };

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
        Sơ đồ tương tác Service Broker Registry. Thứ tự hiện tại: {order.join(' ➔ ')}.
      </div>

      {/* 1. Dynamic SOA Discovery Graph */}
      <div className="w-full p-4 bg-[#111214] border border-gray-800 rounded-3xl flex justify-center shadow-inner">
        <svg viewBox="0 0 400 180" className="w-full max-w-sm h-44 text-gray-200">
          {/* Client Node */}
          <rect x="25" y="110" width="80" height="40" rx="8" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
          <text x="65" y="133" fill="#c084fc" fontSize="9" fontWeight="bold" textAnchor="middle">Client</text>

          {/* Broker Registry Node */}
          <rect x="160" y="20" width="80" height="40" rx="8" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
          <text x="200" y="43" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">Broker/Registry</text>

          {/* Provider Node */}
          <rect x="295" y="110" width="80" height="40" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
          <text x="335" y="133" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">Provider</text>

          {/* Step 1: Provider -> Broker Register */}
          <path d="M 335 110 L 240 50" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points="240,50 249,50 244,57" fill="#10b981" />
          <circle cx="288" cy="80" r="10" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
          <text x="288" y="83" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">{getStepNumber('đăng ký')}</text>

          {/* Step 2: Client -> Broker Query */}
          <path d="M 65 110 L 160 50" stroke="#eab308" strokeWidth="1.5" />
          <polygon points="160,50 155,57 151,51" fill="#eab308" />
          <circle cx="112" cy="80" r="10" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
          <text x="112" y="83" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">{getStepNumber('hỏi')}</text>

          {/* Step 3: Broker -> Client Respond */}
          <path d="M 175 60 L 95 110" stroke="#eab308" strokeWidth="1.5" strokeDasharray="2 2" />
          <polygon points="95,110 104,109 99,102" fill="#eab308" />
          <circle cx="135" cy="85" r="7" fill="#78350f" stroke="#eab308" strokeWidth="1" />
          <text x="135" y="87.5" fill="#fef08a" fontSize="6" fontWeight="bold" textAnchor="middle">{getStepNumber('trả')}</text>

          {/* Step 4: Client -> Provider Call */}
          <path d="M 105 130 L 295 130" stroke="#8b5cf6" strokeWidth="1.5" />
          <polygon points="295,130 287,126 287,134" fill="#8b5cf6" />
          <circle cx="200" cy="130" r="10" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
          <text x="200" y="133" fill="#c084fc" fontSize="8" fontWeight="bold" textAnchor="middle">{getStepNumber('gửi request')}</text>
        </svg>
      </div>

      {/* 2. Interactive Ordering List */}
      <div className="flex flex-col gap-2 max-w-md mx-auto w-full">
        {order.map((stepLabel, idx) => {
          const isCorrect = isSubmitted && correctOrder[idx] === stepLabel;
          return (
            <div
              key={stepLabel}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-600/40 bg-emerald-950/10 text-emerald-200'
                    : 'border-rose-600/40 bg-rose-950/10 text-rose-200'
                  : 'border-gray-800 bg-[#0d0e12]/60 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 font-bold text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold">{stepLabel}</span>
              </div>
              
              {!isSubmitted && (
                <div className="flex gap-1">
                  <button
                    onClick={() => moveStep(idx, idx - 1)}
                    disabled={idx === 0}
                    aria-label="Di chuyển lên"
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveStep(idx, idx + 1)}
                    disabled={idx === order.length - 1}
                    aria-label="Di chuyển xuống"
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    ▼
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
