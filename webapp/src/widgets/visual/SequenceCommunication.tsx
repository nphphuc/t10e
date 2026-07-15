import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

interface Message {
  from: string;
  to: string;
  name: string;
  num: string;
}

interface SequenceCommunicationProps {
  data: any;
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

export default function SequenceCommunication({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: SequenceCommunicationProps) {
  const lifelines: string[] = data.visual.lifelines || [];
  const messages: Message[] = data.visual.messages || [];

  const [activeTab, setActiveTab] = useState<'sequence' | 'communication'>('sequence');

  // Coordinates helper for Communication View
  const getObjectCoords = (idx: number, total: number) => {
    if (total === 3) {
      if (idx === 0) return { x: 70, y: 140 };
      if (idx === 1) return { x: 200, y: 40 };
      if (idx === 2) return { x: 330, y: 140 };
    }
    const angle = (idx * 2 * Math.PI) / total - Math.PI / 2;
    return {
      x: 200 + Math.cos(angle) * 110,
      y: 100 + Math.sin(angle) * 60,
    };
  };

  // Generate text alternative for screen readers
  const getTextAlternative = () => {
    const list = messages.map((m) => `${m.num}: ${m.from} gửi ${m.name} đến ${m.to}`);
    return `Mô tả tương tác giữa các đối tượng: ${list.join(', ')}.`;
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
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
        Sơ đồ tương tác đối tượng (Scenario).
        {getTextAlternative()}
      </div>

      {/* Dual View Toggle Buttons */}
      <div className="flex justify-center gap-2 p-1 bg-[#111214] border border-gray-800 rounded-xl max-w-sm mx-auto">
        <button
          onClick={() => setActiveTab('sequence')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            activeTab === 'sequence'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Sequence View
        </button>
        <button
          onClick={() => setActiveTab('communication')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            activeTab === 'communication'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Communication View
        </button>
      </div>

      {/* UML Interactive Board */}
      <div className="w-full p-5 bg-[#090a0c]/60 border border-gray-800 rounded-3xl flex justify-center shadow-inner relative overflow-hidden">
        {activeTab === 'sequence' ? (
          /* SEQUENCE VIEW */
          <svg viewBox="0 0 400 200" className="w-full max-w-md h-52 text-gray-200 select-none">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
              </marker>
            </defs>

            {/* Draw Lifelines */}
            {lifelines.map((name, idx) => {
              const x = 60 + idx * 140;
              return (
                <g key={name}>
                  {/* Vertical dashed line */}
                  <line x1={x} y1={40} x2={x} y2={180} stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
                  {/* Object Header Box */}
                  <rect x={x - 50} y={10} width="100" height="30" rx="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
                  <text x={x} y={28} fill="#c084fc" fontSize="8" fontWeight="bold" textAnchor="middle" textDecoration="underline">
                    {name}
                  </text>
                </g>
              );
            })}

            {/* Draw Messages */}
            {messages.map((msg, idx) => {
              const fromIdx = lifelines.indexOf(msg.from);
              const toIdx = lifelines.indexOf(msg.to);
              if (fromIdx === -1 || toIdx === -1) return null;

              const x1 = 60 + fromIdx * 140;
              const x2 = 60 + toIdx * 140;
              const y = 70 + idx * 45;

              // Arrow offset to prevent overlapping text
              const labelX = (x1 + x2) / 2;

              return (
                <g key={idx}>
                  <line x1={x1} y1={y} x2={x2} y2={y} stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <text x={labelX} y={y - 5} fill="#14b8a6" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    {msg.num}: {msg.name}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          /* COMMUNICATION VIEW */
          <svg viewBox="0 0 400 200" className="w-full max-w-md h-52 text-gray-200 select-none">
            <defs>
              <marker id="commArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#eab308" />
              </marker>
            </defs>

            {/* Draw links first (underneath boxes) */}
            {lifelines.map((name, i) => {
              const c1 = getObjectCoords(i, lifelines.length);
              return lifelines.slice(i + 1).map((otherName, j) => {
                const otherIdx = i + 1 + j;
                const c2 = getObjectCoords(otherIdx, lifelines.length);

                // Check if there is any message between them
                const hasLink = messages.some(
                  (m) =>
                    (m.from === name && m.to === otherName) ||
                    (m.from === otherName && m.to === name)
                );

                if (!hasLink) return null;

                return (
                  <line
                    key={`${i}-${otherIdx}`}
                    x1={c1.x}
                    y1={c1.y}
                    x2={c2.x}
                    y2={c2.y}
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                );
              });
            })}

            {/* Draw message direction arrows & labels */}
            {messages.map((msg, idx) => {
              const fromIdx = lifelines.indexOf(msg.from);
              const toIdx = lifelines.indexOf(msg.to);
              if (fromIdx === -1 || toIdx === -1) return null;

              const c1 = getObjectCoords(fromIdx, lifelines.length);
              const c2 = getObjectCoords(toIdx, lifelines.length);

              // Direction angle
              const dx = c2.x - c1.x;
              const dy = c2.y - c1.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const ux = dx / len;
              const uy = dy / len;

              // Placement position (slightly offset from link line to handle multiple messages)
              const offsetMultiplier = idx % 2 === 0 ? 1 : -1;
              const mx = (c1.x + c2.x) / 2 + uy * 15 * offsetMultiplier;
              const my = (c1.y + c2.y) / 2 - ux * 15 * offsetMultiplier;

              return (
                <g key={idx}>
                  {/* Direction Arrow */}
                  <line
                    x1={mx - ux * 6}
                    y1={my - uy * 6}
                    x2={mx + ux * 6}
                    y2={my + uy * 6}
                    stroke="#eab308"
                    strokeWidth="1.5"
                    markerEnd="url(#commArrow)"
                  />
                  {/* Label */}
                  <text
                    x={mx}
                    y={my - 8}
                    fill="#fbbf24"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {msg.num}: {msg.name}
                  </text>
                </g>
              );
            })}

            {/* Draw Object Vertex Boxes */}
            {lifelines.map((name, idx) => {
              const { x, y } = getObjectCoords(idx, lifelines.length);
              return (
                <g key={name}>
                  <rect x={x - 45} y={y - 15} width="90" height="30" rx="6" fill="#111827" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x={x} y={y + 3} fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle" textDecoration="underline">
                    {name}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Choice Selection Section */}
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
