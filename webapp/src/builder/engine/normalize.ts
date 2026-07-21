import type { NameMatcher } from './types';

export function normalizeName(raw: string): string {
  return raw
    .trim()
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '');
}

export function match(userName: string, matcher: NameMatcher): boolean {
  const normalized = normalizeName(userName);
  return normalized.length > 0
    && [matcher.canonical, ...matcher.accepted].some((candidate) => normalizeName(candidate) === normalized);
}
