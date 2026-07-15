import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

interface SyncAsyncTimelineProps {
  data: any;
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

export default function SyncAsyncTimeline({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: SyncAsyncTimelineProps) {
  const [activeTimeline, setActiveTimeline] = useState<'sync' | 'async'>('sync');

  // Description text alternative for screen readers
  const getAlternativeText = () => {
    if (activeTimeline === 'sync') {
      return 'Sơ đồ timeline Synchronous: Client gửi request tại 20ms, sau đó bị chặn (block/idle) chờ 80ms cho đến khi dịch vụ phản hồi lúc 100ms mới chạy tiếp.';
    } else {
      return 'Sơ đồ timeline Asynchronous: Client gửi request tại 20ms và lập tức tiếp tục xử lý việc khác, không bị chặn chờ. Dịch vụ xử lý dưới nền và gửi callback về sau.';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn select-none">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-all, .transition-colors {
            transition: none !important;
          }
          .animate-fadeIn {
            animation: none !important;
          }
        }
      `}</style>

      {/* Screen Reader Alternative */}
      <div className="sr-only" aria-live="polite">
        Đang xem sơ đồ timeline giao tiếp. {getAlternativeText()}
      </div>

      {/* Timeline Toggle Buttons */}
      <div className="flex justify-center gap-2 p-1 bg-[#111214] border border-gray-800 rounded-xl max-w-sm mx-auto">
        <button
          onClick={() => setActiveTimeline('sync')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            activeTimeline === 'sync'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Synchronous Timeline
        </button>
        <button
          onClick={() => setActiveTimeline('async')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            activeTimeline === 'async'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Asynchronous Timeline
        </button>
      </div>

      {/* Diagram Playground */}
      <div className="w-full p-4 bg-[#090a0c]/60 border border-gray-800 rounded-3xl flex justify-center shadow-inner">
        {activeTimeline === 'sync' ? (
          /* SYNCHRONOUS TIMELINE DRAWING */
          <svg viewBox="0 0 380 180" className="w-full max-w-sm h-48 text-gray-200">
            {/* Time Axis */}
            <line x1="20" y1="140" x2="360" y2="140" stroke="#4b5563" strokeWidth="1.5" />
            <polygon points="360,140 352,136 352,144" fill="#4b5563" />
            <text x="350" y="155" fill="#94a3b8" fontSize="7" textAnchor="middle">Thời gian (Time) ➔</text>

            {/* Client Timeline */}
            <text x="20" y="30" fill="#a78bfa" fontSize="8" fontWeight="bold">Client Thread</text>
            
            {/* Client Active (0 - 50px) */}
            <rect x="20" y="40" width="50" height="15" rx="3" fill="#6d28d9" stroke="#8b5cf6" strokeWidth="1" />
            <text x="45" y="50" fill="#c084fc" fontSize="6.5" fontWeight="bold" textAnchor="middle">Active</text>

            {/* Client Waiting/Blocked (50 - 250px) */}
            <rect x="70" y="40" width="200" height="15" rx="3" fill="#78350f" stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" />
            <text x="170" y="50" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">Blocked (Chờ phản hồi)</text>

            {/* Client Active again (270px - 330px) */}
            <rect x="270" y="40" width="60" height="15" rx="3" fill="#6d28d9" stroke="#8b5cf6" strokeWidth="1" />
            <text x="300" y="50" fill="#c084fc" fontSize="6.5" fontWeight="bold" textAnchor="middle">Active</text>

            {/* Service Timeline */}
            <text x="20" y="90" fill="#34d399" fontSize="8" fontWeight="bold">Service Thread</text>
            {/* Idle (0-70px) */}
            <line x1="20" y1="100" x2="70" y2="100" stroke="#374151" strokeWidth="2" />
            {/* Active processing (70 - 270px) */}
            <rect x="70" y="92" width="200" height="15" rx="3" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
            <text x="170" y="102" fill="#a7f3d0" fontSize="7" fontWeight="bold" textAnchor="middle">Xử lý Request</text>

            {/* Call Flow Arrows */}
            <path d="M 70 55 L 70 92" stroke="#eab308" strokeWidth="1.5" />
            <polygon points="70,92 66,85 74,85" fill="#eab308" />

            <path d="M 270 92 L 270 55" stroke="#10b981" strokeWidth="1.5" />
            <polygon points="270,55 266,62 274,62" fill="#10b981" />
          </svg>
        ) : (
          /* ASYNCHRONOUS TIMELINE DRAWING */
          <svg viewBox="0 0 380 180" className="w-full max-w-sm h-48 text-gray-200">
            {/* Time Axis */}
            <line x1="20" y1="140" x2="360" y2="140" stroke="#4b5563" strokeWidth="1.5" />
            <polygon points="360,140 352,136 352,144" fill="#4b5563" />
            <text x="350" y="155" fill="#94a3b8" fontSize="7" textAnchor="middle">Thời gian (Time) ➔</text>

            {/* Client Timeline */}
            <text x="20" y="30" fill="#a78bfa" fontSize="8" fontWeight="bold">Client Thread</text>
            {/* Client Active throughout (0 - 250px) */}
            <rect x="20" y="40" width="250" height="15" rx="3" fill="#6d28d9" stroke="#8b5cf6" strokeWidth="1" />
            <text x="145" y="50" fill="#c084fc" fontSize="7.5" fontWeight="bold" textAnchor="middle">Active (Làm việc khác)</text>

            {/* Client Callback processing (270px - 330px) */}
            <rect x="270" y="40" width="60" height="15" rx="3" fill="#0369a1" stroke="#0ea5e9" strokeWidth="1" />
            <text x="300" y="50" fill="#7dd3fc" fontSize="6.5" fontWeight="bold" textAnchor="middle">Callback</text>

            {/* Service Timeline */}
            <text x="20" y="90" fill="#34d399" fontSize="8" fontWeight="bold">Service Thread</text>
            {/* Idle (0-70px) */}
            <line x1="20" y1="100" x2="70" y2="100" stroke="#374151" strokeWidth="2" />
            {/* Active processing (70 - 270px) */}
            <rect x="70" y="92" width="200" height="15" rx="3" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
            <text x="170" y="102" fill="#a7f3d0" fontSize="7" fontWeight="bold" textAnchor="middle">Xử lý Request</text>

            {/* Call Flow Arrows */}
            <path d="M 70 55 L 70 92" stroke="#eab308" strokeWidth="1.5" />
            <polygon points="70,92 66,85 74,85" fill="#eab308" />

            <path d="M 270 92 L 270 55" stroke="#0ea5e9" strokeWidth="1.5" />
            <polygon points="270,55 266,62 274,62" fill="#0ea5e9" />
          </svg>
        )}
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
