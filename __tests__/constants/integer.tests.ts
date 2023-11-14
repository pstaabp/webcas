import {describe, expect, test} from '@jest/globals';
import {Integer} from '/Users/pstaab/code/webcas/src/constants/integer.ts';
import {Rational} from '/Users/pstaab/code/webcas/src/constants/rational.ts';
import {Real} from '/Users/pstaab/code/webcas/src/constants/real.ts';
import {Complex} from '/Users/pstaab/code/webcas/src/constants/complex.ts';

describe('constructor', () => {
  const i1 = new Integer(1);
  test('i1 is an integer', () => { expect(i1 instanceof Integer); });
  test('i1 has a value of 1', () => { expect(i1.value).toBe(1n);});
});

describe('addition/subtraction with integers', () => {
  const i1 = new Integer(1);
  const i2 = new Integer(4);
  const i3 = new Integer(-4);
  const i4 = new Integer(7);
  test('1+4=5', () => { expect(i1.plus(i2).equals(new Integer(5))).toBe(true); });
  test('4+(-4)=0', () => {expect(i2.plus(i3).equals(Integer.ZERO)).toBe(true); });
  test('7-4=3', () => {expect(i4.minus(i2)).toStrictEqual(new Integer(3)); });
  test('7-1=6', () => {expect(i4.minus(i1)).toStrictEqual(new Integer(6)); });
  test('7-(-4)=11', () => {expect(i4.minus(i3)).toStrictEqual(new Integer(11)); });
});

describe('addition of integers with other types', () => {
  const i1 = new Integer(3);
  const r1 = new Rational(1,2);
  const r2 = new Rational(7,2);
  const re1 = new Real('1.6');
  const re2 = new Real('4.6');
  const c1 = new Complex(2,3);
  const c2 = new Complex(5,3);
  test('3+1/2=7/2', () => { expect(i1.plus(r1)).toStrictEqual(r2);} );
  test('3+1/2=7/2', () => { expect(i1.plus(r1).equals(r2)).toBe(true);} );
  test('3+1.6=4.6', () => { expect(i1.plus(re1)).toStrictEqual(re2);} );
  test('3+1.6=4.6', () => { expect(i1.plus(re1).equals(re2)).toBe(true);} );
  test('3+(2+3i)=5+3i', () => { expect(i1.plus(c1)).toStrictEqual(c2);} );
  test('3+(2+3i)=5+3i', () => { expect(i1.plus(c1).equals(c2)).toBe(true);} );
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