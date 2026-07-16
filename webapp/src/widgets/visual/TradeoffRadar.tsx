import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

type RadarConfig = {
  variant?: string;
  axes?: Array<{ id: string; label: string }>;
  baseline?: Record<string, number>;
  tactics?: Array<{ id: string; label: string; effects: Record<string, number> }>;
};

interface TradeoffRadarProps {
  data: { visual?: RadarConfig; prompt?: string; options?: string[]; correct?: number };
  selectedAnswer: number | null;
  onAnswer: (value: number | null) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

export default function TradeoffRadar({ data, selectedAnswer, onAnswer, isSubmitted, disabledOptions }: TradeoffRadarProps) {
  const config = data.visual;
  const axes = config?.axes ?? [];
  const tactics = config?.tactics ?? [];
  const [active, setActive] = useState<Record<string, boolean>>({});
  const isConfigured = axes.length >= 3 && tactics.length > 0 && axes.every((axis) => typeof config?.baseline?.[axis.id] === 'number');

  if (!isConfigured) {
    return <p role="status" className="rounded-xl border border-amber-700/50 bg-amber-950/20 p-4 text-sm text-amber-200">Visual này cần cấu hình quality axes, baseline và tactic effects từ nguồn đã duyệt.</p>;
  }

  const scoreFor = (axisId: string) => Math.max(1, Math.min(5, (config!.baseline![axisId] ?? 0) + tactics.reduce((sum, tactic) => sum + (active[tactic.id] ? tactic.effects[axisId] ?? 0 : 0), 0)));
  const toggle = (tacticId: string) => setActive((current) => ({ ...current, [tacticId]: !current[tacticId] }));

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-800 bg-[#111214] p-4" aria-label="Quality attribute radar">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {axes.map((axis) => (
            <div key={axis.id} className="rounded-xl border border-gray-700 bg-gray-900 p-3 text-center">
              <div className="text-xs font-bold text-gray-200">{axis.label}</div>
              <div className="mt-1 text-2xl font-bold text-boundary">{scoreFor(axis.id)}/5</div>
            </div>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">{axes.map((axis) => `${axis.label}: ${scoreFor(axis.id)} trên 5`).join(', ')}</p>
      </div>

      <fieldset className="space-y-2 rounded-2xl border border-gray-800 p-4">
        <legend className="px-1 text-xs font-bold uppercase tracking-wide text-gray-400">Kích hoạt tactic</legend>
        {tactics.map((tactic) => (
          <label key={tactic.id} className="flex cursor-pointer items-center gap-3 rounded-xl p-2 text-sm text-gray-200 hover:bg-gray-800">
            <input type="checkbox" checked={Boolean(active[tactic.id])} disabled={isSubmitted} onChange={() => toggle(tactic.id)} />
            {tactic.label}
          </label>
        ))}
      </fieldset>

      <ChoiceWidget data={{ prompt: data.prompt, options: data.options ?? [], correct: data.correct }} selectedAnswer={selectedAnswer} onAnswer={onAnswer} isSubmitted={isSubmitted} disabledOptions={disabledOptions} />
    </div>
  );
}
