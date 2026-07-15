import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

interface ViewSwitcherProps {
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

interface ViewItem {
  id: string;
  name: string;
  color: string;
  description: string;
  svg: React.ReactNode;
}

export default function ViewSwitcher({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: ViewSwitcherProps) {
  const [activeView, setActiveView] = useState('usecase');

  const views: ViewItem[] = [
    {
      id: 'usecase',
      name: 'Use Case',
      color: '#0ea5e9',
      description: 'Mô tả yêu cầu chức năng từ bên ngoài hệ thống. Cho thấy Actor tương tác với các Use Case vượt qua biên giới (System Boundary).',
      svg: (
        <svg viewBox="0 0 300 120" className="w-full h-28 text-gray-200">
          {/* System Boundary */}
          <rect x="90" y="10" width="180" height="100" rx="8" fill="#1e293b" fillOpacity="0.4" stroke="#475569" strokeWidth="2" />
          <text x="180" y="24" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">FOS Boundary</text>
          {/* Actor */}
          <circle cx="45" cy="50" r="10" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="45" y1="60" x2="45" y2="85" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="30" y1="70" x2="60" y2="70" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="45" y1="85" x2="35" y2="105" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="45" y1="85" x2="55" y2="105" stroke="#0ea5e9" strokeWidth="2" />
          <text x="45" y="116" fill="#0ea5e9" fontSize="8" fontWeight="bold" textAnchor="middle">Customer</text>
          {/* Use Case Bubble */}
          <ellipse cx="180" cy="65" rx="45" ry="20" fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="2" />
          <text x="180" y="68" fill="#e0f2fe" fontSize="9" fontWeight="bold" textAnchor="middle">Checkout</text>
          {/* Connection */}
          <line x1="55" y1="65" x2="135" y2="65" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      id: 'static',
      name: 'Static Class',
      color: '#8b5cf6',
      description: 'Mô tả cấu trúc tĩnh của hệ thống. Biểu diễn các Class, thuộc tính (attributes), phương thức (operations) và các mối quan hệ tĩnh (association, generalization, composition).',
      svg: (
        <svg viewBox="0 0 300 120" className="w-full h-28 text-gray-200">
          {/* Class 1 */}
          <rect x="20" y="20" width="80" height="80" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" />
          <text x="60" y="36" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">Customer</text>
          <line x1="20" y1="44" x2="100" y2="44" stroke="#8b5cf6" strokeWidth="1" />
          <text x="26" y="56" fill="#e2e8f0" fontSize="7" fontFamily="monospace">- name : String</text>
          <line x1="20" y1="66" x2="100" y2="66" stroke="#8b5cf6" strokeWidth="1" />
          <text x="26" y="78" fill="#e2e8f0" fontSize="7" fontFamily="monospace">+ getProfile()</text>
          {/* Association Line */}
          <path d="M 100 60 L 200 60" fill="none" stroke="#8b5cf6" strokeWidth="2" />
          <text x="110" y="54" fill="#a78bfa" fontSize="8" fontFamily="monospace">1</text>
          <text x="188" y="54" fill="#a78bfa" fontSize="8" fontFamily="monospace">0..*</text>
          {/* Class 2 */}
          <rect x="200" y="20" width="80" height="80" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" />
          <text x="240" y="36" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">Order</text>
          <line x1="200" y1="44" x2="280" y2="44" stroke="#8b5cf6" strokeWidth="1" />
          <text x="206" y="56" fill="#e2e8f0" fontSize="7" fontFamily="monospace">- total : Real</text>
          <line x1="200" y1="66" x2="280" y2="66" stroke="#8b5cf6" strokeWidth="1" />
          <text x="206" y="78" fill="#e2e8f0" fontSize="7" fontFamily="monospace">+ calculateTax()</text>
        </svg>
      )
    },
    {
      id: 'interaction',
      name: 'Interaction',
      color: '#10b981',
      description: 'Mô tả luồng giao tiếp động. Biểu diễn trình tự truyền thông điệp (messages) giữa các đối tượng (objects) theo thời gian để thực thi một Use Case.',
      svg: (
        <svg viewBox="0 0 300 120" className="w-full h-28 text-gray-200">
          <defs>
            <marker id="seqArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>
          {/* Lifeline 1 */}
          <text x="70" y="20" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle" textDecoration="underline">c : Customer</text>
          <line x1="70" y1="26" x2="70" y2="105" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Lifeline 2 */}
          <text x="230" y="20" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle" textDecoration="underline">o : Order</text>
          <line x1="230" y1="26" x2="230" y2="105" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Message Arrow */}
          <path d="M 70 55 L 230 55" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#seqArrow)" />
          <text x="150" y="48" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">1: calculateTotal()</text>
          {/* Response Message */}
          <path d="M 230 85 L 70 85" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#seqArrow)" />
          <text x="150" y="78" fill="#10b981" fontSize="8" textAnchor="middle">totalValue</text>
        </svg>
      )
    },
    {
      id: 'state',
      name: 'State Machine',
      color: '#f59e0b',
      description: 'Mô tả vòng đời động của một đối tượng đơn lẻ. Biểu diễn các trạng thái (states), sự kiện kích hoạt (events) và hành động chuyển trạng thái (transitions).',
      svg: (
        <svg viewBox="0 0 300 120" className="w-full h-28 text-gray-200">
          <defs>
            <marker id="stateArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
          </defs>
          {/* State 1 */}
          <rect x="30" y="40" width="70" height="35" rx="8" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="65" y="61" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">ChờThanhToán</text>
          {/* Transition */}
          <path d="M 100 57 L 200 57" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#stateArrow)" />
          <text x="150" y="48" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">ThanhToánThànhCông</text>
          {/* State 2 */}
          <rect x="200" y="40" width="70" height="35" rx="8" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="235" y="61" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">ĐãThanhToán</text>
        </svg>
      )
    },
    {
      id: 'component',
      name: 'Component',
      color: '#ec4899',
      description: 'Mô tả cấu trúc lắp ráp phần mềm ở mức cao. Biểu diễn các khối chức năng độc lập (components) và các cổng giao tiếp (provided/required interfaces) của chúng.',
      svg: (
        <svg viewBox="0 0 300 120" className="w-full h-28 text-gray-200">
          {/* Component 1 */}
          <rect x="20" y="35" width="90" height="50" rx="4" fill="#500733" stroke="#ec4899" strokeWidth="2" />
          <text x="65" y="64" fill="#f472b6" fontSize="10" fontWeight="bold" textAnchor="middle">OrderManager</text>
          {/* Provided Interface Socket */}
          <path d="M 110 60 L 140 60" fill="none" stroke="#ec4899" strokeWidth="2" />
          <circle cx="150" cy="60" r="10" fill="none" stroke="#ec4899" strokeWidth="2" />
          {/* Required Interface Plug */}
          <circle cx="150" cy="60" r="4" fill="#ec4899" />
          <path d="M 154 60 L 190 60" fill="none" stroke="#ec4899" strokeWidth="2" />
          {/* Component 2 */}
          <rect x="190" y="35" width="90" height="50" rx="4" fill="#500733" stroke="#ec4899" strokeWidth="2" />
          <text x="235" y="64" fill="#f472b6" fontSize="10" fontWeight="bold" textAnchor="middle">BillingService</text>
        </svg>
      )
    },
    {
      id: 'concurrent',
      name: 'Concurrent',
      color: '#6366f1',
      description: 'Mô tả khía cạnh xử lý đồng thời, đa luồng. Biểu diễn các tiến trình active tasks (luồng thực thi riêng) và các kênh giao tiếp liên tiến trình (message queues).',
      svg: (
        <svg viewBox="0 0 300 120" className="w-full h-28 text-gray-200">
          <defs>
            <marker id="conArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
            </marker>
          </defs>
          {/* Task 1 (Active object with double vertical borders) */}
          <rect x="20" y="35" width="80" height="50" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5" />
          <text x="60" y="64" fill="#a5b4fc" fontSize="9" fontWeight="bold" textAnchor="middle">InputReader</text>
          {/* Message Queue (grid box) */}
          <rect x="125" y="45" width="40" height="30" fill="#312e81" stroke="#6366f1" strokeWidth="1.5" />
          <line x1="135" y1="45" x2="135" y2="75" stroke="#6366f1" strokeWidth="1.5" />
          <line x1="145" y1="45" x2="145" y2="75" stroke="#6366f1" strokeWidth="1.5" />
          <line x1="155" y1="45" x2="155" y2="75" stroke="#6366f1" strokeWidth="1.5" />
          <text x="145" y="90" fill="#6366f1" fontSize="7" textAnchor="middle">Queue</text>
          {/* Connection Arrows */}
          <path d="M 100 60 L 125 60" fill="none" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#conArrow)" />
          <path d="M 165 60 L 195 60" fill="none" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#conArrow)" />
          {/* Task 2 */}
          <rect x="195" y="35" width="80" height="50" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5" />
          <text x="235" y="64" fill="#a5b4fc" fontSize="9" fontWeight="bold" textAnchor="middle">LogWriter</text>
        </svg>
      )
    },
    {
      id: 'deployment',
      name: 'Deployment',
      color: '#14b8a6',
      description: 'Mô tả cấu trúc vật lý của hệ thống. Biểu diễn các thiết bị phần cứng, máy chủ ảo (nodes) và sự phân bổ các file component thực tế lên các máy chủ đó.',
      svg: (
        <svg viewBox="0 0 300 120" className="w-full h-28 text-gray-200">
          {/* Node 1 (3D box shape) */}
          <polygon points="20,40 60,20 110,20 110,70 70,90 20,90" fill="#115e59" stroke="#14b8a6" strokeWidth="1.5" />
          <polygon points="20,40 70,40 110,20" fill="none" stroke="#14b8a6" strokeWidth="1.5" />
          <line x1="70" y1="40" x2="70" y2="90" stroke="#14b8a6" strokeWidth="1.5" />
          <text x="65" y="60" fill="#2dd4bf" fontSize="8" fontWeight="bold" textAnchor="middle">Web Server</text>
          {/* Physical Link */}
          <path d="M 110 50 L 190 50" fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 2" />
          <text x="150" y="44" fill="#14b8a6" fontSize="7" textAnchor="middle">TCP/IP</text>
          {/* Node 2 */}
          <polygon points="190,40 230,20 280,20 280,70 240,90 190,90" fill="#115e59" stroke="#14b8a6" strokeWidth="1.5" />
          <polygon points="190,40 240,40 280,20" fill="none" stroke="#14b8a6" strokeWidth="1.5" />
          <line x1="240" y1="40" x2="240" y2="90" stroke="#14b8a6" strokeWidth="1.5" />
          <text x="235" y="60" fill="#2dd4bf" fontSize="8" fontWeight="bold" textAnchor="middle">DB Server</text>
        </svg>
      )
    }
  ];

  const currentViewItem = views.find(v => v.id === activeView) || views[0];

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-all {
            transition: none !important;
          }
        }
      `}</style>
      {/* View Switcher Tabs */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {views.map((v) => {
          const isActive = v.id === activeView;
          return (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              style={{
                borderColor: isActive ? v.color : 'transparent',
                backgroundColor: isActive ? `${v.color}15` : 'transparent',
                color: isActive ? '#f8fafc' : '#94a3b8',
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 hover:text-white bg-gray-800/20`}
            >
              {v.name}
            </button>
          );
        })}
      </div>

      {/* Main View Area */}
      <div
        style={{ borderColor: `${currentViewItem.color}30` }}
        className="w-full p-5 bg-[#111214] border rounded-2xl flex flex-col items-center gap-4 transition-all duration-300 shadow-inner"
      >
        <div className="w-full flex justify-center py-2 bg-[#090a0c]/60 rounded-xl">
          {currentViewItem.svg}
        </div>
        <div className="text-left w-full space-y-1">
          <span
            style={{ color: currentViewItem.color }}
            className="text-[10px] uppercase font-black tracking-wider"
          >
            {currentViewItem.name} View
          </span>
          <p className="text-xs text-gray-300 leading-relaxed">
            {currentViewItem.description}
          </p>
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
