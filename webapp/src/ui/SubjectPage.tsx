import { Link } from 'react-router-dom';
import Icon, { type IconName } from './Icon';
import './sheet.css';

export type Deck = {
  to: string;
  title: string;
  desc?: string;
  count: number;
  icon?: IconName;
  /** Số thứ tự hiển thị thay cho icon — chỉ dùng khi bộ đề thật sự có thứ tự (chương 1, 2, 3…) */
  order?: number;
  featured?: boolean;
};

export type Section = {
  title: string;
  note?: string;
  decks: Deck[];
};

type Props = {
  code: string;
  name: string;
  icon: IconName;
  intro?: string;
  sections: Section[];
};

export function countOf(data: any): number {
  return data?.questions?.length ?? 0;
}

function DeckRow({ deck }: { deck: Deck }) {
  return (
    <Link
      to={deck.to}
      className={`sheet-row grid-cols-[2.5rem_1fr_auto] ${deck.featured ? 'sheet-featured' : ''}`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          deck.featured ? 'text-[color:var(--mark)]' : 'text-[color:var(--muted)]'
        }`}
        style={{ border: '1.5px solid var(--rule)' }}
      >
        {deck.order !== undefined ? (
          <span className="sheet-count text-lg leading-none text-[color:var(--text)]">{deck.order}</span>
        ) : (
          <Icon name={deck.icon ?? 'exam'} size={20} />
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-medium leading-snug text-[color:var(--text)]">{deck.title}</span>
        {deck.desc && <span className="sheet-muted mt-0.5 block text-sm leading-relaxed">{deck.desc}</span>}
      </span>
      <span className="flex items-baseline gap-1 pl-2 text-right">
        <span className="sheet-count text-2xl leading-none">{deck.count}</span>
        <span className="sheet-muted text-xs">câu</span>
      </span>
    </Link>
  );
}

export default function SubjectPage({ code, name, icon, intro, sections }: Props) {
  return (
    <div className="sheet-root pb-20">
      <div className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
        <Link to="/" className="sheet-back text-sm">
          <Icon name="back" size={18} />
          Trang chủ
        </Link>

        <header className="mt-10 flex items-start gap-5">
          <span
            className="mt-1 hidden h-14 w-14 shrink-0 items-center justify-center rounded-full text-[color:var(--mark)] sm:flex"
            style={{ border: '1.5px solid var(--mark)' }}
          >
            <Icon name={icon} size={28} strokeWidth={1.4} />
          </span>
          <div className="min-w-0">
            <h1 className="sheet-display text-5xl font-semibold leading-none sm:text-6xl">{code}</h1>
            <p className="mt-3 text-lg text-[color:var(--text)]">{name}</p>
            {intro && <p className="sheet-muted mt-3 max-w-xl text-[15px] leading-relaxed">{intro}</p>}
          </div>
        </header>

        <main className="mt-12 space-y-12">
          {sections.map((s) => (
            <section key={s.title} aria-labelledby={`sec-${s.title}`}>
              <div className="mb-4 max-w-xl">
                <h2 id={`sec-${s.title}`} className="sheet-display text-2xl font-medium">
                  {s.title}
                </h2>
                {s.note && <p className="sheet-muted mt-1.5 text-sm leading-relaxed">{s.note}</p>}
              </div>
              <div className="sheet-panel overflow-hidden">
                {s.decks.map((d) => (
                  <DeckRow key={d.to} deck={d} />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
