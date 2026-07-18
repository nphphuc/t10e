import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * ExplorableTakeaway — Màn takeaway tương tác.
 *
 * Các từ/cụm từ kỹ thuật được highlight (underline dashed), click để mở
 * accordion giải thích chi tiết inline. Phù hợp cho màn role="takeaway".
 *
 * Config (screen.visual):
 *   variant: "explorable-takeaway"
 *   terms: [{ term: string, explanation: string }]
 *
 * screen.text: đoạn văn chính (có thể chứa [[term]] để auto-highlight)
 */

interface Term {
  term: string;
  explanation: string;
}

interface ExplorableTakeawayData {
  visual: {
    variant: 'explorable-takeaway';
    terms: Term[];
  };
  text?: string;
  prompt?: string;
}

interface Props {
  data: ExplorableTakeawayData;
  selectedAnswer: any;
  onAnswer: (v: any) => void;
  isSubmitted: boolean;
}

// Inline term chip
function TermChip({
  term,
  explanation,
  isOpen,
  onToggle,
}: {
  term: string;
  explanation: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <span className="inline-block align-baseline">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`font-semibold underline decoration-dashed underline-offset-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded ${
          isOpen
            ? 'text-cyan-300 decoration-cyan-300'
            : 'text-cyan-400 hover:text-cyan-200 decoration-cyan-500'
        }`}
      >
        {term}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="block overflow-hidden"
          >
            <span className="block mt-2 mb-1 ml-1 px-3 py-2 rounded-xl bg-cyan-950/40 border border-cyan-700/30 text-cyan-100 text-[13px] leading-relaxed">
              <span className="font-bold text-cyan-400 text-xs uppercase tracking-wide mr-1.5">
                {term}:
              </span>
              {explanation}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function ExplorableTakeaway({ data }: Props) {
  const terms: Term[] = data.visual?.terms || [];
  const text: string = data.text || data.prompt || '';
  const [openTerms, setOpenTerms] = useState<Set<string>>(new Set());
  const shouldReduceMotion = useReducedMotion();

  const toggleTerm = (term: string) => {
    setOpenTerms((prev) => {
      const next = new Set(prev);
      if (next.has(term)) next.delete(term);
      else next.add(term);
      return next;
    });
  };

  // Parse text — thay [[term]] bằng chip component
  // Fallback: nếu không có [[]] markup, render text thường + term list riêng
  const hasMarkup = /\[\[.+?\]\]/.test(text);

  const renderMarkedText = () => {
    const parts = text.split(/(\[\[.+?\]\])/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[\[(.+?)\]\]$/);
      if (match) {
        const termKey = match[1];
        const termData = terms.find((t) => t.term === termKey);
        if (termData) {
          return (
            <TermChip
              key={i}
              term={termData.term}
              explanation={termData.explanation}
              isOpen={openTerms.has(termKey)}
              onToggle={() => toggleTerm(termKey)}
            />
          );
        }
        // fallback nếu không tìm thấy term data
        return <span key={i}>{termKey}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-5">
      {/* Main text body */}
      <div className="text-gray-200 text-[15px] leading-relaxed">
        {hasMarkup ? renderMarkedText() : <span>{text}</span>}
      </div>

      {/* If no markup, show term list below */}
      {!hasMarkup && terms.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            🔍 Khám phá thêm — click để mở giải thích:
          </p>
          <div className="flex flex-wrap gap-2">
            {terms.map((t) => (
              <button
                key={t.term}
                onClick={() => toggleTerm(t.term)}
                aria-expanded={openTerms.has(t.term)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  openTerms.has(t.term)
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200'
                    : 'bg-gray-800/60 border-gray-700 text-gray-300 hover:border-cyan-600/50 hover:text-cyan-300'
                }`}
              >
                {t.term}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {terms
              .filter((t) => openTerms.has(t.term))
              .map((t) => (
                <motion.div
                  key={t.term}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="px-4 py-3 rounded-2xl bg-cyan-950/30 border border-cyan-700/30 text-[13px] leading-relaxed text-cyan-100"
                >
                  <span className="font-bold text-cyan-400 text-xs uppercase tracking-wide mr-1.5">
                    {t.term}:
                  </span>
                  {t.explanation}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}

      {/* Keyboard hint */}
      <p className="text-[10px] text-gray-600 mt-2">
        💡 Click vào từ được gạch chân để xem giải thích
      </p>
    </div>
  );
}
