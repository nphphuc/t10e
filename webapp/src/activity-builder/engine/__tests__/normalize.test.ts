import { describe, it, expect } from 'vitest';
import { normalizeName, match } from '../normalize';

describe('normalizeName', () => {
  it('lowercases, trims, and collapses whitespace', () => {
    expect(normalizeName('  Trả   Sách  ')).toBe(normalizeName('trả sách'));
  });

  it('strips Vietnamese diacritics', () => {
    expect(normalizeName('Hư hỏng')).toBe(normalizeName('Hu hong'));
  });

  it('treats different casing/spacing of the same word as equal', () => {
    expect(normalizeName('CẬP NHẬT KHO')).toBe(normalizeName('cập nhật kho'));
  });

  it('treats "<=" as equivalent to "≤" (easier to type on a normal keyboard)', () => {
    expect(normalizeName('Tổng đơn <= 1000000')).toBe(normalizeName('Tổng đơn ≤ 1000000'));
  });

  it('treats ">=" as equivalent to "≥"', () => {
    expect(normalizeName('Tổng đơn >= 1000000')).toBe(normalizeName('Tổng đơn ≥ 1000000'));
  });

  it('ignores thousands-separator punctuation ("1.000.000" vs "1000000")', () => {
    expect(normalizeName('Tổng đơn > 1.000.000')).toBe(normalizeName('Tổng đơn > 1000000'));
  });
});

describe('match', () => {
  it('matches the canonical name', () => {
    expect(match('Trả sách', { canonical: 'Trả sách', accepted: [] })).toBe(true);
  });

  it('matches any accepted alias', () => {
    expect(match('hong', { canonical: 'Hư hỏng', accepted: ['hong', 'damaged'] })).toBe(true);
  });

  it('rejects an unrelated name', () => {
    expect(match('Xếp lại kệ sách', { canonical: 'Trả sách', accepted: [] })).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(match('', { canonical: 'Trả sách', accepted: [] })).toBe(false);
  });
});
