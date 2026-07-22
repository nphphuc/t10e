import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { DiagramEdge, DiagramNode } from '../engine/types';

type Prediction = 'survives' | 'disappears';
type Phase = 'predict' | 'running' | 'observed';

export default function DeleteWholeSim({ edge, whole, part }: { edge: DiagramEdge; whole: DiagramNode; part: DiagramNode }) {
  const systemReducedMotion = useReducedMotion();
  const reduceMotion = systemReducedMotion || (import.meta.env.DEV
    && new URLSearchParams(window.location.search).get('testReducedMotion') === '1');
  const [prediction, setPrediction] = useState<Prediction>();
  const [phase, setPhase] = useState<Phase>('predict');
  const partSurvives = edge.type === 'aggregation';

  useEffect(() => {
    setPrediction(undefined);
    setPhase('predict');
  }, [edge.type, edge.from, edge.to]);

  useEffect(() => {
    if (phase !== 'running') return undefined;
    const timer = window.setTimeout(() => setPhase('observed'), reduceMotion ? 0 : 800);
    return () => window.clearTimeout(timer);
  }, [phase, reduceMotion]);

  if (edge.type !== 'aggregation' && edge.type !== 'composition') return null;
  const correct = prediction === (partSurvives ? 'survives' : 'disappears');
  const reset = () => { setPrediction(undefined); setPhase('predict'); };

  return (
    <section className="cdb-concept-lab" aria-labelledby={`lifetime-title-${edge.id}`}>
      <strong id={`lifetime-title-${edge.id}`}>Predict · Observe · Explain</strong>
      <p><b>Predict:</b> nếu xóa whole <strong>{whole.name}</strong>, part <strong>{part.name}</strong> sẽ thế nào?</p>
      <div className="cdb-sim-predictions" role="group" aria-label="Chọn dự đoán">
        <button type="button" className={prediction === 'survives' ? 'is-active' : ''} onClick={() => { setPrediction('survives'); setPhase('predict'); }}>Vẫn còn</button>
        <button type="button" className={prediction === 'disappears' ? 'is-active' : ''} onClick={() => { setPrediction('disappears'); setPhase('predict'); }}>Biến mất theo</button>
      </div>
      <div className={`cdb-lifetime-visual is-${phase} ${partSurvives ? 'part-survives' : 'part-disappears'}`} aria-label={`Mô phỏng vòng đời của ${whole.name} và ${part.name}`}>
        <svg viewBox="0 0 420 124" role="img">
          <title>Xóa whole và quan sát part</title>
          <line x1="145" y1="62" x2="275" y2="62" />
          <g className="cdb-sim-whole"><rect x="24" y="28" width="122" height="68" rx="12" /><text x="85" y="66">{whole.name}</text></g>
          <g className="cdb-sim-part"><rect x="274" y="28" width="122" height="68" rx="12" /><text x="335" y="66">{part.name}</text></g>
          <path className="cdb-sim-delete-mark" d="M45 39 L125 85 M125 39 L45 85" />
        </svg>
      </div>
      <div className="cdb-sim-actions">
        <button type="button" disabled={!prediction || phase === 'running'} onClick={() => setPhase('running')}>▶ Chạy thử</button>
        {(prediction || phase !== 'predict') && <button type="button" onClick={reset}>↺ Làm lại thí nghiệm</button>}
      </div>
      {phase === 'running' && <p role="status"><b>Observe:</b> đang xóa whole…</p>}
      {phase === 'observed' && <div className="cdb-sim-explanation" role="status">
        <p><b>Observe:</b> Bạn đoán “{prediction === 'survives' ? 'vẫn còn' : 'biến mất theo'}”. Kết quả: {part.name} {partSurvives ? 'vẫn tồn tại sau khi whole bị xóa.' : 'biến mất cùng whole.'}</p>
        <p><b>Explain:</b> {correct ? 'Dự đoán của bạn khớp quan sát.' : 'Quan sát khác dự đoán.'} Nếu part {partSurvives ? 'có thể' : 'không thể'} tồn tại độc lập với whole, bạn nên chọn loại quan hệ nào ở phía trên?</p>
      </div>}
    </section>
  );
}
