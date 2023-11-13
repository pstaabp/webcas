import {describe, expect, test} from '@jest/globals';
import {Integer} from '/Users/pstaab/code/webcas/src/constants/integer.ts';

describe('constructor', () => {
  const i1 = new Integer(1);
  test('i1 is an integer', () => { expect(i1 instanceof Integer); });
  test('i1 has a value of 1', () => { expect(i1.value).toBe(1n);});
});

describe('addition with integers', () => {
  const i1 = new Integer(1);
  const i2 = new Integer(4);
  const i3 = new Integer(-4);
  test('1+4=5', () => { expect(i1.plus(i2).equals(new Integer(5))).toBe(true); });
  test('4+(-4)=0', () => {expect(i2.plus(i3).equals(Integer.ZERO)).toBe(true); });
});


describe('gcd of 2 integers', () => {
  test('gcd(24,9) to equal 3', () => {expect(Integer.gcd(24,9)).toBe(3n);});
  test('gcd(32,16) to equal 16', () => {expect(Integer.gcd(32,16)).toBe(16n);});
  test('gcd(17,9) to equal 1', () => {expect(Integer.gcd(17,9)).toBe(1n);});
});

describe('gcd of 3 integers', () => {
  test('gcd(24,9,12) to equal 3', () => {expect(Integer.gcd(24,9,12)).toBe(3n); });
});

describe('gcd of 4 integers', () => {
  test('gcd(24,12,16,40) to equal 4', () => {expect(Integer.gcd(24,12,16,40)).toBe(4n); });
});