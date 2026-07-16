import { useState } from 'react';
import ChoiceWidget from '../ChoiceWidget';

type TraceNode = { id: string; label: string; layer: 'requirement' | 'analysis' | 'design' };
type TraceConfig = { variant?: string; nodes?: TraceNode[]; edges?: Array<{ from: string; to: string }>; correctPath?: string[] };

interface RdsTraceProps {
  data: { visual?: TraceConfig; prompt?: string; options?: string[]; correct?: number };
  selectedAnswer: number | null;
  onAnswer: (value: number | null) => void;
  isSubmitted: boolean;
  disabledOptions?: number[];
}

export default function RdsTrace({ data, selectedAnswer, onAnswer, isSubmitted, disabledOptions }: RdsTraceProps) {
  const config = data.visual;
  const nodes = config?.nodes ?? [];
  const edges = config?.edges ?? [];
  const correctPath = config?.correctPath ?? [];
  const [selected, setSelected] = useState<string[]>([]);
  const ids = new Set(nodes.map((node) => node.id));
  const isConfigured = correctPath.length >= 3 && correctPath.every((id) => ids.has(id)) && edges.length > 0;

  if (!isConfigured) {
    return <p role="status" className="rounded-xl border border-amber-700/50 bg-amber-950/20 p-4 text-sm text-amber-200">Visual này cần trace nodes, edges và correct path được trích từ RDS/source đã duyệt.</p>;
  }

  const toggle = (id: string) => {
    if (isSubmitted) return;
    const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    setSelected(next);
    onAnswer(next.length === correctPath.length && correctPath.every((pathId) => next.includes(pathId)) ? data.correct ?? null : null);
  };

  const layers: TraceNode['layer'][] = ['requirement', 'analysis', 'design'];
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3" aria-label="RDS trace graph">
        {layers.map((layer) => (
          <section key={layer} className="rounded-2xl border border-gray-800 bg-[#111214] p-3">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">{layer}</h3>
            <div className="space-y-2">
              {nodes.filter((node) => node.layer === layer).map((node) => (
                <button key={node.id} type="button" aria-pressed={selected.includes(node.id)} disabled={isSubmitted} onClick={() => toggle(node.id)} className={`w-full rounded-xl border p-3 text-left text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-boundary ${selected.includes(node.id) ? 'border-boundary bg-boundary/20 text-white' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`}>
                  {node.label}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">Đã chọn: {selected.join(', ') || 'chưa có node'}; có {edges.length} liên kết trong trace graph.</p>
      <ChoiceWidget data={{ prompt: data.prompt, options: data.options ?? [], correct: data.correct }} selectedAnswer={selectedAnswer} onAnswer={onAnswer} isSubmitted={isSubmitted} disabledOptions={disabledOptions} />
    </div>
  );
}
