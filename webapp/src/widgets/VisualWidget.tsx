import BoundarySort from './visual/BoundarySort';
import StateMachineRunner from './visual/StateMachineRunner';
import ChoiceWidget from './ChoiceWidget';
import ViewSwitcher from './visual/ViewSwitcher';
import ClassObjectCard from './visual/ClassObjectCard';


interface VisualWidgetProps {
  data: {
    prompt: string;
    correct?: any;
    visual: {
      variant: string;
      items?: string[];
      correctOutside?: string[];
    };
    feedbackWrongByItem?: Record<string, string>;
  };
  selectedAnswer: any;
  onAnswer: (value: any) => void;
  isSubmitted: boolean;
  disabledOptions: number[];
}

export default function VisualWidget({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
  disabledOptions,
}: VisualWidgetProps) {
  const variant = data.visual?.variant;

  if (variant === 'boundary-sort') {
    return (
      <BoundarySort
        data={data}
        selectedAnswer={selectedAnswer}
        onAnswer={onAnswer}
        isSubmitted={isSubmitted}
        disabledOptions={disabledOptions}
      />
    );
  }

  if (variant === 'state-machine-runner') {
    return (
      <StateMachineRunner
        data={data}
        selectedAnswer={selectedAnswer}
        onAnswer={onAnswer}
        isSubmitted={isSubmitted}
      />
    );
  }

  if (variant === 'view-switcher') {
    return (
      <ViewSwitcher
        data={data}
        selectedAnswer={selectedAnswer}
        onAnswer={onAnswer}
        isSubmitted={isSubmitted}
        disabledOptions={disabledOptions}
      />
    );
  }

  if (variant === 'class-object-card') {
    return (
      <ClassObjectCard
        data={data}
        selectedAnswer={selectedAnswer}
        onAnswer={onAnswer}
        isSubmitted={isSubmitted}
        disabledOptions={disabledOptions}
      />
    );
  }

  if (variant === 'static-diagram') {
    const svgId = (data.visual as any)?.svgId;
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-full max-w-lg p-6 bg-[#111214] border border-gray-800 rounded-2xl flex justify-center shadow-inner">
          {svgId === 'model-vs-code' && (
            <svg viewBox="0 0 400 140" className="w-full h-auto text-gray-200">
              <defs>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
              </defs>
              <rect x="20" y="25" width="130" height="90" rx="12" fill="url(#purpleGrad)" />
              <text x="85" y="60" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">Mô hình (Model)</text>
              <text x="85" y="80" fill="#ddd6fe" fontSize="10" textAnchor="middle">Phân tích & Thiết kế</text>
              <text x="85" y="95" fill="#ddd6fe" fontSize="10" textAnchor="middle">(UML Diagrams)</text>

              <path d="M 165 70 L 225 70" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow)" strokeDasharray="4 2" />
              <text x="195" y="55" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">Dẫn dắt</text>
              <text x="195" y="92" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">Cài đặt</text>

              <rect x="250" y="25" width="130" height="90" rx="12" fill="url(#emeraldGrad)" />
              <text x="315" y="60" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">Mã nguồn (Code)</text>
              <text x="315" y="80" fill="#a7f3d0" fontSize="10" textAnchor="middle">Hiện thực hóa</text>
              <text x="315" y="95" fill="#a7f3d0" fontSize="10" textAnchor="middle">(Implementation)</text>
            </svg>
          )}

          {svgId === 'waterfall-process' && (
            <svg viewBox="0 0 420 180" className="w-full h-auto text-gray-200">
              <defs>
                <linearGradient id="blueGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="purpleGradW" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="orangeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="redGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
                </linearGradient>
                <marker id="wfArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                </marker>
              </defs>

              <rect x="15" y="15" width="85" height="35" rx="6" fill="url(#blueGrad2)" stroke="#0284c7" strokeWidth="1" />
              <text x="57.5" y="36" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">1. Yêu cầu</text>

              <path d="M 100 32 L 125 32 L 125 55" fill="none" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#wfArrow)" />

              <rect x="110" y="55" width="85" height="35" rx="6" fill="url(#purpleGradW)" stroke="#7c3aed" strokeWidth="1" />
              <text x="152.5" y="76" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">2. Thiết kế</text>

              <path d="M 195 72 L 220 72 L 220 95" fill="none" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#wfArrow)" />

              <rect x="205" y="95" width="85" height="35" rx="6" fill="url(#orangeGrad2)" stroke="#ea580c" strokeWidth="1" />
              <text x="247.5" y="116" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">3. Lập trình</text>

              <path d="M 290 112 L 315 112 L 315 135" fill="none" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#wfArrow)" />

              <rect x="300" y="135" width="85" height="35" rx="6" fill="url(#redGrad2)" stroke="#dc2626" strokeWidth="1.5" />
              <text x="342.5" y="156" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">4. Kiểm thử</text>

              <path d="M 230 152.5 L 290 152.5" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
              <rect x="110" y="137" width="115" height="30" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
              <text x="167.5" y="149" fill="#fecaca" fontSize="7.5" fontWeight="bold" textAnchor="middle">Lỗi từ bước 1 phát hiện</text>
              <text x="167.5" y="159" fill="#fecaca" fontSize="7.5" fontWeight="bold" textAnchor="middle">muộn ở bước 4!</text>
            </svg>
          )}

          {svgId === 'comet-phases' && (
            <svg viewBox="0 0 450 200" className="w-full h-auto text-gray-200">
              <defs>
                <linearGradient id="blueGradCOMET" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="purpleGradCOMET" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b0764" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="greenGradCOMET" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#064e3b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              <line x1="20" y1="15" x2="20" y2="120" stroke="#f59e0b" strokeWidth="2" />
              <line x1="20" y1="15" x2="25" y2="15" stroke="#f59e0b" strokeWidth="2" />
              <line x1="20" y1="120" x2="25" y2="120" stroke="#f59e0b" strokeWidth="2" />
              <text x="12" y="72" fill="#f59e0b" fontSize="8.5" fontWeight="bold" writingMode="vertical-rl" textAnchor="middle">PROBLEM DOMAIN</text>

              <line x1="20" y1="130" x2="20" y2="185" stroke="#10b981" strokeWidth="2" />
              <line x1="20" y1="130" x2="25" y2="130" stroke="#10b981" strokeWidth="2" />
              <line x1="20" y1="185" x2="25" y2="185" stroke="#10b981" strokeWidth="2" />
              <text x="12" y="157" fill="#10b981" fontSize="8.5" fontWeight="bold" writingMode="vertical-rl" textAnchor="middle">SOLUTION</text>

              <rect x="40" y="15" width="380" height="40" rx="8" fill="url(#blueGradCOMET)" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="55" y="38" fill="#ffffff" fontSize="12" fontWeight="bold">Requirements Modeling</text>
              <text x="390" y="38" fill="#93c5fd" fontSize="9.5" textAnchor="end">Black box view / Actor & Use Case</text>

              <rect x="40" y="70" width="380" height="50" rx="8" fill="url(#purpleGradCOMET)" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="55" y="93" fill="#ffffff" fontSize="12" fontWeight="bold">Analysis Modeling</text>
              <text x="390" y="91" fill="#ddd6fe" fontSize="9.5" textAnchor="end">Static structural & Dynamic interaction models</text>
              <text x="390" y="105" fill="#a78bfa" fontSize="8" textAnchor="end">(Understand the problem & identify participating objects)</text>

              <rect x="40" y="135" width="380" height="50" rx="8" fill="url(#greenGradCOMET)" stroke="#10b981" strokeWidth="1.5" />
              <text x="55" y="158" fill="#ffffff" fontSize="12" fontWeight="bold">Design Modeling</text>
              <text x="390" y="156" fill="#a7f3d0" fontSize="9.5" textAnchor="end">Synthesize solution / Software Architecture</text>
              <text x="390" y="170" fill="#34d399" fontSize="8" textAnchor="end">(Subsystems, components, concurrent tasks, class interfaces)</text>
            </svg>
          )}

          {svgId === 'seven-views' && (
            <svg viewBox="0 0 500 240" className="w-full h-auto text-gray-200">
              <defs>
                <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="250" cy="120" r="110" fill="url(#hubGrad)" />

              <g stroke="#4b5563" strokeWidth="1.5" strokeDasharray="3 3">
                <line x1="250" y1="120" x2="250" y2="40" />
                <line x1="250" y1="120" x2="350" y2="60" />
                <line x1="250" y1="120" x2="370" y2="150" />
                <line x1="250" y1="120" x2="300" y2="210" />
                <line x1="250" y1="120" x2="200" y2="210" />
                <line x1="250" y1="120" x2="130" y2="150" />
                <line x1="250" y1="120" x2="150" y2="60" />
              </g>

              <circle cx="250" cy="120" r="42" fill="#312e81" stroke="#6366f1" strokeWidth="2.5" />
              <text x="250" y="115" fill="#e0e7ff" fontSize="10" fontWeight="bold" textAnchor="middle">KIẾN TRÚC</text>
              <text x="250" y="130" fill="#a5b4fc" fontSize="8" textAnchor="middle">HỆ THỐNG</text>

              <circle cx="250" cy="40" r="28" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
              <text x="250" y="37" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Use Case</text>
              <text x="250" y="47" fill="#94a3b8" fontSize="7" textAnchor="middle">Yêu cầu</text>

              <circle cx="350" cy="60" r="28" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
              <text x="350" y="57" fill="#c084fc" fontSize="8" fontWeight="bold" textAnchor="middle">Static View</text>
              <text x="350" y="67" fill="#94a3b8" fontSize="7" textAnchor="middle">Cấu trúc lớp</text>

              <circle cx="370" cy="150" r="28" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
              <text x="370" y="145" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">Interaction</text>
              <text x="370" y="155" fill="#94a3b8" fontSize="7" textAnchor="middle">Thông điệp</text>

              <circle cx="300" cy="210" r="28" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="300" y="205" fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="middle">State Machine</text>
              <text x="300" y="215" fill="#94a3b8" fontSize="7" textAnchor="middle">Vòng đời</text>

              <circle cx="200" cy="210" r="28" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
              <text x="200" y="205" fill="#f472b6" fontSize="8" fontWeight="bold" textAnchor="middle">Component</text>
              <text x="200" y="215" fill="#94a3b8" fontSize="7" textAnchor="middle">Thành phần</text>

              <circle cx="130" cy="150" r="28" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
              <text x="130" y="145" fill="#818cf8" fontSize="8" fontWeight="bold" textAnchor="middle">Concurrent</text>
              <text x="130" y="155" fill="#94a3b8" fontSize="7" textAnchor="middle">Đồng thời</text>

              <circle cx="150" cy="60" r="28" fill="#1e293b" stroke="#14b8a6" strokeWidth="2" />
              <text x="150" y="57" fill="#2dd4bf" fontSize="8" fontWeight="bold" textAnchor="middle">Deployment</text>
              <text x="150" y="67" fill="#94a3b8" fontSize="7" textAnchor="middle">Vật lý</text>
            </svg>
          )}

          {svgId === 'class-vs-object' && (
            <svg viewBox="0 0 460 210" className="w-full h-auto text-gray-200">
              <g>
                <rect x="20" y="20" width="180" height="35" rx="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" />
                <text x="110" y="42" fill="#c084fc" fontSize="13" fontWeight="bold" textAnchor="middle">Account</text>
                <rect x="20" y="55" width="180" height="60" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
                <text x="30" y="75" fill="#e2e8f0" fontSize="10" fontFamily="monospace">- accountNumber : String</text>
                <text x="30" y="95" fill="#e2e8f0" fontSize="10" fontFamily="monospace">- balance : Real</text>
                <rect x="20" y="115" width="180" height="65" rx="6" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
                <text x="30" y="135" fill="#e2e8f0" fontSize="10" fontFamily="monospace">+ deposit(amount : Real)</text>
                <text x="30" y="155" fill="#e2e8f0" fontSize="10" fontFamily="monospace">+ withdraw(amount : Real)</text>
                <rect x="30" y="5" width="60" height="15" rx="3" fill="#6d28d9" />
                <text x="60" y="15" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">CLASS</text>
              </g>

              <g>
                <text x="230" y="90" fill="#f59e0b" fontSize="24" fontWeight="bold" textAnchor="middle">≠</text>
                <text x="230" y="120" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">khác nhau</text>
              </g>

              <g>
                <rect x="260" y="20" width="180" height="35" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                <text x="350" y="42" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle" textDecoration="underline">johnsAccount : Account</text>
                <rect x="260" y="55" width="180" height="60" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                <text x="270" y="75" fill="#e2e8f0" fontSize="10" fontFamily="monospace">accountNumber = "A101"</text>
                <text x="270" y="95" fill="#e2e8f0" fontSize="10" fontFamily="monospace">balance = 500.0</text>
                <rect x="260" y="115" width="180" height="65" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                <text x="350" y="145" fill="#64748b" fontSize="10" textAnchor="middle" fontStyle="italic">Các operation kế thừa</text>
                <text x="350" y="160" fill="#64748b" fontSize="10" textAnchor="middle" fontStyle="italic">từ Class Account</text>
                <rect x="270" y="5" width="60" height="15" rx="3" fill="#047857" />
                <text x="300" y="15" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">OBJECT</text>
              </g>
            </svg>
          )}
        </div>
        <ChoiceWidget
          data={{
            prompt: data.prompt,
            options: (data.visual as any).options || [],
            correct: data.correct
          }}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
          disabledOptions={disabledOptions}
        />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 text-gray-400 rounded-xl">
      Không hỗ trợ dạng visual variant: {variant}
    </div>
  );
}
