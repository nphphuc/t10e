import type { DiagramEdge, DiagramNode } from '../engine/types';

export default function InstancePreview({ edge, from, to }: { edge: DiagramEdge; from: DiagramNode; to: DiagramNode }) {
  if (edge.type === 'generalization') return null;
  const describe = (name: string, value = '1') => {
    if (value === '0..1') return `Không hoặc một ${name}`;
    if (value === '0..*') return `Không hoặc nhiều ${name}`;
    if (value === '1..*') return `Một hoặc nhiều ${name}`;
    return `Một ${name}`;
  };
  return (
    <section className="cdb-concept-lab" aria-label="Minh họa instance theo multiplicity">
      <strong>POE · Nhìn ở mức instance</strong>
      <p>
        {describe(from.name, edge.multiplicity?.from)}
        {' ↔ '}
        {describe(to.name, edge.multiplicity?.to).toLocaleLowerCase('vi')}. Hãy đối chiếu câu này với brief trước khi tiếp tục.
      </p>
    </section>
  );
}
