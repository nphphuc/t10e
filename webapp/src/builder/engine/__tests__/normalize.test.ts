import { describe, it, expect } from 'vitest';
import { match, normalizeName } from '../normalize';

describe('normalizeName', () => {
  it('lowercases, trims, collapses whitespace and strips Vietnamese diacritics', () => {
    expect(normalizeName('  Đơn Hàng  ')).toBe('donhang');
    expect(normalizeName('Customer')).toBe('customer');
    expect(normalizeName('  Khách   hàng ')).toBe('khachhang');
  });
});

describe('match', () => {
  const matcher = { canonical: 'Order', accepted: ['đơn hàng', 'donhang', 'orders'] };

  it('matches canonical regardless of case/whitespace/diacritics', () => {
    expect(match('order', matcher)).toBe(true);
    expect(match('  Order  ', matcher)).toBe(true);
  });

  it('matches any accepted variant', () => {
    expect(match('Đơn Hàng', matcher)).toBe(true);
    expect(match('DonHang', matcher)).toBe(true);
    expect(match('Orders', matcher)).toBe(true);
  });

  it('does not match unrelated names', () => {
    expect(match('Product', matcher)).toBe(false);
    expect(match('Ordr', matcher)).toBe(false);
  });

  it('does not match empty input', () => {
    expect(match('', matcher)).toBe(false);
    expect(match('   ', matcher)).toBe(false);
  });
});
