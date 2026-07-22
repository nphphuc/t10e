import type { NameMatcher } from './types';

const VIETNAMESE_DIACRITICS: [RegExp, string][] = [
  [/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a'],
  [/[èéẹẻẽêềếệểễ]/g, 'e'],
  [/[ìíịỉĩ]/g, 'i'],
  [/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o'],
  [/[ùúụủũưừứựửữ]/g, 'u'],
  [/[ỳýỵỷỹ]/g, 'y'],
  [/đ/g, 'd'],
];

export function normalizeName(raw: string): string {
  let s = raw.toLowerCase().trim().replace(/\s+/g, ' ');
  for (const [pattern, replacement] of VIETNAMESE_DIACRITICS) {
    s = s.replace(pattern, replacement);
  }
  // Guard text is the one place users type comparison operators and numbers by hand —
  // "<=" is far easier to type than "≤" on a normal keyboard, and "1.000.000" vs
  // "1000000" is just a thousands-separator choice, not a meaningful difference. Accept
  // both without requiring the lesson content to spell out every formatting variant.
  s = s.replace(/<=/g, '≤').replace(/>=/g, '≥');
  s = s.replace(/[.,]/g, '');
  return s.replace(/\s+/g, '');
}

export function match(userName: string, matcher: NameMatcher): boolean {
  const normalizedUser = normalizeName(userName);
  if (normalizedUser.length === 0) return false;
  const candidates = [matcher.canonical, ...matcher.accepted];
  return candidates.some((c) => normalizeName(c) === normalizedUser);
}
