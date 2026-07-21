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
