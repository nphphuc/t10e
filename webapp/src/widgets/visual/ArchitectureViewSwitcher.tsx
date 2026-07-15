import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

interface ArchitectureViewSwitcherProps {
  data: any;
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

type ViewType = 'logical' | 'process' | 'development' | 'physical';

export default function ArchitectureViewSwitcher({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: ArchitectureViewSwitcherProps) {
  const [activeTab, setActiveTab] = useState<ViewType>('logical');

  // Description text alternative for screen readers
  const getAlternativeText = () => {
    switch (activeTab) {
      case 'logical':
        return 'Sơ đồ logical view: Thể hiện cấu trúc lớp của hệ thống với ba lớp ClientInterface, OrderController, và OrderRepository kết nối với nhau.';
      case 'process':
        return 'Sơ đồ process view: Thể hiện các tiến trình động gồm Client Thread, Controller Thread, và DB Daemon truyền nhận message không đồng bộ.';
      case 'development':
        return 'Sơ đồ development view: Thể hiện cấu trúc các module thư mục mã nguồn bao gồm presentation, application, và infrastructure.';
      case 'physical':
        return 'Sơ đồ physical view: Thể hiện hạ tầng triển khai thực tế gồm User PC kết nối HTTPS đến App Server VM, và App Server VM kết nối TCP đến Database Server.';
    }
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
        Đang xem sơ đồ kiến trúc hệ thống FOS. {getAlternativeText()}
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap gap-1.5 justify-center p-1 bg-[#111214] border border-gray-800 rounded-xl max-w-md mx-auto">
        {(['logical', 'process', 'development', 'physical'] as ViewType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[90px] px-2 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              activeTab === tab
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab === 'logical' ? 'Logical' : tab === 'process' ? 'Process' : tab === 'development' ? 'Development' : 'Physical'} View
          </button>
        ))}
      </div>

      {/* Drawing Board */}
      <div className="w-full p-5 bg-[#090a0c]/60 border border-gray-800 rounded-3xl flex justify-center shadow-inner relative overflow-hidden">
        {activeTab === 'logical' && (
          /* LOGICAL VIEW: Class diagram layout */
          <svg viewBox="0 0 380 180" className="w-full max-w-sm h-48 text-gray-200 select-none">
            {/* Box 1 */}
            <rect x="20" y="65" width="80" height="40" rx="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
            <text x="60" y="88" fill="#c084fc" fontSize="7.5" fontWeight="bold" textAnchor="middle">UI::ClientInterface</text>
            
            {/* Connection 1 */}
            <line x1="100" y1="85" x2="150" y2="85" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3" />
            <polygon points="150,85 142,81 142,89" fill="#a78bfa" />

            {/* Box 2 */}
            <rect x="150" y="65" width="80" height="40" rx="6" fill="#172554" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="190" y="88" fill="#60a5fa" fontSize="7.5" fontWeight="bold" textAnchor="middle">OrderController</text>

            {/* Connection 2 */}
            <line x1="230" y1="85" x2="280" y2="85" stroke="#3b82f6" strokeWidth="1.5" />
            <polygon points="280,85 272,81 272,89" fill="#3b82f6" />

            {/* Box 3 */}
            <rect x="280" y="65" width="80" height="40" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="320" y="88" fill="#34d399" fontSize="7.5" fontWeight="bold" textAnchor="middle">OrderRepository</text>

            <text x="190" y="150" fill="#94a3b8" fontSize="8.5" fontWeight="semibold" textAnchor="middle">
              Logical View: Nhấn mạnh cấu trúc lớp tĩnh & quan hệ dependency
            </text>
          </svg>
        )}

        {activeTab === 'process' && (
          /* PROCESS VIEW: Active process thread timeline */
          <svg viewBox="0 0 380 180" className="w-full max-w-sm h-48 text-gray-200 select-none">
            {/* Client Process */}
            <rect x="20" y="15" width="80" height="25" rx="12" fill="#7c2d12" stroke="#f97316" strokeWidth="1.5" />
            <text x="60" y="31" fill="#fdba74" fontSize="8" fontWeight="bold" textAnchor="middle">Client Thread</text>
            <line x1="60" y1="40" x2="60" y2="130" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Controller Process */}
            <rect x="150" y="15" width="80" height="25" rx="12" fill="#78350f" stroke="#eab308" strokeWidth="1.5" />
            <text x="190" y="31" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">Controller Thread</text>
            <line x1="190" y1="40" x2="190" y2="130" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* DB Daemon */}
            <rect x="280" y="15" width="80" height="25" rx="12" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="320" y="31" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">DB Daemon</text>
            <line x1="320" y1="40" x2="320" y2="130" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Message 1 */}
            <line x1="60" y1="65" x2="190" y2="65" stroke="#f97316" strokeWidth="1.5" />
            <polygon points="190,65 182,61 182,69" fill="#f97316" />
            <text x="125" y="58" fill="#fdba74" fontSize="7" fontWeight="semibold" textAnchor="middle">async: submitOrder()</text>

            {/* Message 2 */}
            <line x1="190" y1="95" x2="320" y2="95" stroke="#eab308" strokeWidth="1.5" />
            <polygon points="320,95 312,91 312,99" fill="#eab308" />
            <text x="255" y="88" fill="#fef08a" fontSize="7" fontWeight="semibold" textAnchor="middle">sync: saveOrder()</text>

            <text x="190" y="155" fill="#94a3b8" fontSize="8.5" fontWeight="semibold" textAnchor="middle">
              Process View: Nhấn mạnh tiến trình chạy song song và truyền nhận tin nhắn
            </text>
          </svg>
        )}

        {activeTab === 'development' && (
          /* DEVELOPMENT VIEW: Module file packaging */
          <svg viewBox="0 0 380 180" className="w-full max-w-sm h-48 text-gray-200 select-none">
            {/* Folder 1 */}
            <rect x="25" y="25" width="90" height="45" rx="4" fill="#042f2e" stroke="#14b8a6" strokeWidth="1.5" />
            <rect x="25" y="18" width="30" height="7" fill="#14b8a6" />
            <text x="70" y="52" fill="#99f6e4" fontSize="8.5" fontWeight="bold" textAnchor="middle">presentation/</text>

            {/* Dependency Arrow */}
            <line x1="115" y1="48" x2="155" y2="48" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
            <polygon points="155,48 147,44 147,52" fill="#14b8a6" />

            {/* Folder 2 */}
            <rect x="155" y="25" width="90" height="45" rx="4" fill="#111827" stroke="#9ca3af" strokeWidth="1.5" />
            <rect x="155" y="18" width="30" height="7" fill="#9ca3af" />
            <text x="200" y="52" fill="#e5e7eb" fontSize="8.5" fontWeight="bold" textAnchor="middle">application/</text>

            {/* Dependency Arrow */}
            <line x1="245" y1="48" x2="285" y2="48" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
            <polygon points="285,48 277,44 277,52" fill="#9ca3af" />

            {/* Folder 3 */}
            <rect x="285" y="25" width="90" height="45" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
            <rect x="285" y="18" width="30" height="7" fill="#8b5cf6" />
            <text x="330" y="52" fill="#c084fc" fontSize="8.5" fontWeight="bold" textAnchor="middle">infrastructure/</text>

            {/* Text details inside package */}
            <text x="70" y="90" fill="#4fe8d6" fontSize="6.5" textAnchor="middle">UI, Forms, Router</text>
            <text x="200" y="90" fill="#9ca3af" fontSize="6.5" textAnchor="middle">UseCases, Services</text>
            <text x="330" y="90" fill="#c084fc" fontSize="6.5" textAnchor="middle">DB, EmailGateway</text>

            <text x="190" y="150" fill="#94a3b8" fontSize="8.5" fontWeight="semibold" textAnchor="middle">
              Development View: Nhấn mạnh phân chia thư mục, đóng gói module (packages)
            </text>
          </svg>
        )}

        {activeTab === 'physical' && (
          /* PHYSICAL VIEW: Hardware deployment network nodes */
          <svg viewBox="0 0 380 180" className="w-full max-w-sm h-48 text-gray-200 select-none">
            {/* User Terminal Node */}
            <rect x="20" y="45" width="80" height="50" rx="4" fill="#111827" stroke="#6b7280" strokeWidth="2" />
            <text x="60" y="70" fill="#e5e7eb" fontSize="7.5" fontWeight="bold" textAnchor="middle">«node»</text>
            <text x="60" y="82" fill="#e5e7eb" fontSize="8.5" fontWeight="bold" textAnchor="middle">User PC</text>

            {/* Network Link 1 */}
            <line x1="100" y1="70" x2="160" y2="70" stroke="#3b82f6" strokeWidth="2" />
            <text x="130" y="62" fill="#60a5fa" fontSize="7.5" fontWeight="bold" textAnchor="middle">HTTPS</text>

            {/* Application VM Node */}
            <rect x="160" y="45" width="80" height="50" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" />
            <text x="200" y="70" fill="#c084fc" fontSize="7.5" fontWeight="bold" textAnchor="middle">«node»</text>
            <text x="200" y="82" fill="#c084fc" fontSize="8" fontWeight="bold" textAnchor="middle">App Server VM</text>

            {/* Network Link 2 */}
            <line x1="240" y1="70" x2="300" y2="70" stroke="#10b981" strokeWidth="2" />
            <text x="270" y="62" fill="#34d399" fontSize="7.5" fontWeight="bold" textAnchor="middle">TCP/IP</text>

            {/* Database Node */}
            <rect x="300" y="45" width="60" height="50" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
            <text x="330" y="70" fill="#34d399" fontSize="7.5" fontWeight="bold" textAnchor="middle">«node»</text>
            <text x="330" y="82" fill="#34d399" fontSize="8.5" fontWeight="bold" textAnchor="middle">DB Server</text>

            <text x="190" y="150" fill="#94a3b8" fontSize="8.5" fontWeight="semibold" textAnchor="middle">
              Physical View: Nhấn mạnh thiết bị phần cứng, máy chủ và kết nối mạng
            </text>
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
