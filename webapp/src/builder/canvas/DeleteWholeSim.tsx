import { useState } from 'react';
import type { DiagramEdge, DiagramNode } from '../engine/types';

export default function DeleteWholeSim({ edge, whole, part }: { edge: DiagramEdge; whole: DiagramNode; part: DiagramNode }) {
  const [ran, setRan] = useState(false);
  if (edge.type !== 'aggregation' && edge.type !== 'composition') return null;
  const partSurvives = edge.type === 'aggregation';
  return (
    <section className="cdb-concept-lab">
      <strong>Thí nghiệm vòng đời</strong>
      <button type="button" onClick={() => setRan(true)}>Thử xóa {whole.name}</button>
      {ran && <p role="status">{partSurvives ? `${part.name} vẫn tồn tại: đây là aggregation.` : `${part.name} cũng biến mất: đây là composition.`}</p>}
    </section>
  );
}
