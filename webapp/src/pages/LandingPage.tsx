import { Link } from 'react-router-dom';
import Icon, { type IconName } from '../ui/Icon';
import { countOf } from '../ui/SubjectPage';
import '../ui/sheet.css';
import { pru213Map, prn222Map, pmg201cMap, mln111Map, mln122Map } from './ReviewPage';

// Ẩn khu SWD392 (Bài học / Ôn thi PE / Ôn thi FE). Đổi thành true để hiện lại —
// các route /home, /pe-review, /term-bank vẫn hoạt động bình thường.
const SHOW_SWD_CARDS = false;

type Subject = {
  to: string;
  code: string;
  name: string;
  icon: IconName;
  total: number;
  /** Ô được tô trên phiếu (0 = A … 3 = D) — chỉ để trang trí, không mang nghĩa đáp án */
  mark: 0 | 1 | 2 | 3;
};

const SUBJECTS: Subject[] = [
  { to: '/mln122', code: 'MLN122', name: 'Kinh tế chính trị Mác-Lênin', icon: 'coins', mark: 1,
    total: countOf(mln122Map['full']) + countOf(mln122Map['extra']) },
  { to: '/mln111', code: 'MLN111', name: 'Triết học Mác-Lênin', icon: 'compass', mark: 3,
    total: countOf(mln111Map['re']) + countOf(mln111Map['c1']) + countOf(mln111Map['c2']) + countOf(mln111Map['100-full']) },
  { to: '/pmg201c', code: 'PMG201c', name: 'Project Management', icon: 'kanban', mark: 0,
    total: countOf(pmg201cMap['d1']) + countOf(pmg201cMap['d2']) + countOf(pmg201cMap['d3']) },
  { to: '/prn222', code: 'PRN222', name: '.NET Web — Blazor, DI, SignalR', icon: 'braces', mark: 2,
    total: countOf(prn222Map['de1']) + countOf(prn222Map['de2']) },
  { to: '/pru213', code: 'PRU213', name: 'Unity & C#', icon: 'gamepad', mark: 1,
    total: countOf(pru213Map['quiz']) + countOf(pru213Map['b2-comprehensive']) },
];

const LETTERS = ['A', 'B', 'C', 'D'];
const GRAND_TOTAL = SUBJECTS.reduce((n, s) => n + s.total, 0);

function SubjectRow({ s, i }: { s: Subject; i: number }) {
  return (
    <Link to={s.to} className="sheet-row grid-cols-[1fr_auto] sm:grid-cols-[7.5rem_1fr_auto]">
      <span className="sheet-display hidden text-2xl font-semibold sm:block">{s.code}</span>
      <span className="min-w-0">
        <span className="sheet-display block text-xl font-semibold sm:hidden">{s.code}</span>
        <span className="flex items-center gap-2 text-[color:var(--text)]">
          <Icon name={s.icon} size={18} className="shrink-0 text-[color:var(--muted)]" />
          <span className="truncate">{s.name}</span>
        </span>
        <span className="sheet-muted mt-0.5 block text-sm">{s.total} câu hỏi</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
          {LETTERS.map((l, k) => (
            <span
              key={l}
              className={`bubble ${k === s.mark ? 'is-intro' : ''}`}
              style={k === s.mark ? { animationDelay: `${450 + i * 220}ms` } : undefined}
            >
              {l}
            </span>
          ))}
        </span>
        <Icon name="chevron" size={18} className="text-[color:var(--muted)] sm:hidden" />
      </span>
    </Link>
  );
}

export default function LandingPage() {
  return (
    <div className="sheet-root flex flex-col">
      <header className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8">
        <span className="sheet-display text-lg font-semibold">Ôn Trắc Nghiệm FPT</span>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-start gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:pt-24">
        <div className="max-w-md">
          <h1 className="sheet-display text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
            Chọn môn,
            <br />
            tô đáp án.
          </h1>
          <p className="sheet-muted mt-6 text-[17px] leading-relaxed">
            Đề thi thật, đề trộn và câu hỏi theo chương cho {SUBJECTS.length} môn. Chọn xong là biết đúng sai, kèm giải thích
            ngay dưới câu hỏi.
          </p>
          <p className="mt-8 text-sm text-[color:var(--muted)]">
            <span className="sheet-count mr-1.5 text-3xl text-[color:var(--text)]">{GRAND_TOTAL}</span>
            câu hỏi trong ngân hàng
          </p>
        </div>

        <section aria-label="Danh sách môn">
          <div className="mb-3 flex items-end justify-between px-1">
            <h2 className="sheet-display text-xl font-medium">Phiếu chọn môn</h2>
            <span className="sheet-muted text-xs">{SUBJECTS.length} môn</span>
          </div>
          <div className="sheet-panel overflow-hidden">
            {SUBJECTS.map((s, i) => (
              <SubjectRow key={s.code} s={s} i={i} />
            ))}
          </div>

          {SHOW_SWD_CARDS && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 px-1 text-sm">
              <Link to="/home" className="sheet-back">SWD392 — Bài học</Link>
              <Link to="/pe-review" className="sheet-back">SWD392 — Ôn thi PE</Link>
              <Link to="/term-bank" className="sheet-back">SWD392 — Ôn thi FE</Link>
            </div>
          )}
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-5 pb-8 text-xs text-[color:var(--muted)] sm:px-8">
        FPT University
      </footer>
    </div>
  );
}
