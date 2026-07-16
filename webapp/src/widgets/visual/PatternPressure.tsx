import { useState } from 'react';

type PatternConfig = {
  variant?: string;
  patterns?: string[];
  forces?: Array<{ id: string; label: string }>;
  correctMapping?: Record<string, string>;
};

interface PatternPressureProps {
  data: { visual?: PatternConfig };
  selectedAnswer: Record<string, string> | null;
  onAnswer: (value: Record<string, string>) => void;
  isSubmitted: boolean;
}

export default function PatternPressure({ data, selectedAnswer, onAnswer, isSubmitted }: PatternPressureProps) {
  const config = data.visual;
  const forces = config?.forces ?? [];
  const patterns = config?.patterns ?? [];
  const mapping = config?.correctMapping ?? {};
  const [selections, setSelections] = useState<Record<string, string>>(selectedAnswer ?? {});
  const isConfigured = forces.length > 0 && patterns.length > 0 && forces.every((force) => patterns.includes(mapping[force.id]));

  if (!isConfigured) {
    return <p role="status" className="rounded-xl border border-amber-700/50 bg-amber-950/20 p-4 text-sm text-amber-200">Visual này cần force, pattern và mapping được trích từ nguồn đã duyệt.</p>;
  }

  const choose = (forceId: string, pattern: string) => {
    if (isSubmitted) return;
    const next = { ...selections, [forceId]: pattern };
    setSelections(next);
    onAnswer(next);
  };

  return (
    <div className="space-y-4" aria-label="Pattern pressure matching activity">
      {forces.map((force) => (
        <section key={force.id} className="rounded-2xl border border-gray-800 bg-[#111214] p-4">
          <p className="mb-3 text-sm font-medium text-gray-100">{force.label}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={`Chọn pattern cho ${force.label}`}>
            {patterns.map((pattern) => (
              <button key={pattern} type="button" disabled={isSubmitted} onClick={() => choose(force.id, pattern)} className={`rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-boundary ${selections[force.id] === pattern ? 'bg-boundary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                {pattern}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
