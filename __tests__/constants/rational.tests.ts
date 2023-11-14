import {describe, expect, test} from '@jest/globals';
import {Rational} from '/Users/pstaab/code/webcas/src/constants/rational.ts';
import {Integer} from '/Users/pstaab/code/webcas/src/constants/integer.ts';

describe('constructor with numbers', () => {
  const r1 = new Rational(1,2);
  const r2 = new Rational(-2,3);
  const r3 = new Rational(2,-3);
  const r4 = new Rational(-3,-4);
  test('r1 is a rational', () => { expect(r1 instanceof Rational); });
  test('numerator of r1 has a value of 1', () => { expect(r1.numer).toBe(1n);});
  test('denominator of r1 has a value of 2', () => { expect(r1.denom).toBe(2n);});
  test('sign of r1 is 1', () => { expect(r1.sign).toBe(1);});

  test('r2 is a rational', () => { expect(r2 instanceof Rational); });
  test('numerator of r2 has a value of 2', () => { expect(r2.numer).toBe(2n);});
  test('denominator of r2 has a value of 3', () => { expect(r2.denom).toBe(3n);});
  test('sign of r2 is 1', () => { expect(r2.sign).toBe(-1);});

  test('numerator of r3 has a value of 2', () => { expect(r3.numer).toBe(2n);});
  test('denominator of r3 has a value of 3', () => { expect(r3.denom).toBe(3n);});
  test('sign of r3 is -1', () => { expect(r3.sign).toBe(-1);});

  test('numerator of r4 has a value of 3', () => { expect(r4.numer).toBe(3n);});
  test('denominator of r4 has a value of 4', () => { expect(r4.denom).toBe(4n);});
  test('sign of r4 is 1', () => { expect(r4.sign).toBe(1);});

});

describe('constructor with bigints', () => {
  const r1 = new Rational(1n,2n);
  const r2 = new Rational(-2n,3n);
  const r3 = new Rational(2n,-3n);
  const r4 = new Rational(-3n,-4n);
  test('r1 is a rational', () => { expect(r1 instanceof Rational); });
  test('numerator of r1 has a value of 1', () => { expect(r1.numer).toBe(1n);});
  test('denominator of r1 has a value of 2', () => { expect(r1.denom).toBe(2n);});
  test('sign of r1 is 1', () => { expect(r1.sign).toBe(1);});

  test('r2 is a rational', () => { expect(r2 instanceof Rational); });
  test('numerator of r2 has a value of 2', () => { expect(r2.numer).toBe(2n);});
  test('denominator of r2 has a value of 3', () => { expect(r2.denom).toBe(3n);});
  test('sign of r2 is 1', () => { expect(r2.sign).toBe(-1);});

  test('numerator of r3 has a value of 2', () => { expect(r3.numer).toBe(2n);});
  test('denominator of r3 has a value of 3', () => { expect(r3.denom).toBe(3n);});
  test('sign of r3 is -1', () => { expect(r3.sign).toBe(-1);});

  test('numerator of r4 has a value of 3', () => { expect(r4.numer).toBe(3n);});
  test('denominator of r4 has a value of 4', () => { expect(r4.denom).toBe(4n);});
  test('sign of r4 is 1', () => { expect(r4.sign).toBe(1);});
});

describe('constructor with Integer', () => {
  const r1 = new Rational(new Integer(1),new Integer(2));
  const r2 = new Rational(new Integer(-2),new Integer(3));
  const r3 = new Rational(new Integer(2), new Integer(-3));
  const r4 = new Rational(new Integer(-3), new Integer(-4));;
  test('r1 is a rational', () => { expect(r1 instanceof Rational); });
  test('numerator of r1 has a value of 1', () => { expect(r1.numer).toBe(1n);});
  test('denominator of r1 has a value of 2', () => { expect(r1.denom).toBe(2n);});
  test('sign of r1 is 1', () => { expect(r1.sign).toBe(1);});

  test('r2 is a rational', () => { expect(r2 instanceof Rational); });
  test('numerator of r2 has a value of 2', () => { expect(r2.numer).toBe(2n);});
  test('denominator of r2 has a value of 3', () => { expect(r2.denom).toBe(3n);});
  test('sign of r2 is 1', () => { expect(r2.sign).toBe(-1);});

  test('numerator of r3 has a value of 2', () => { expect(r3.numer).toBe(2n);});
  test('denominator of r3 has a value of 3', () => { expect(r3.denom).toBe(3n);});
  test('sign of r3 is -1', () => { expect(r3.sign).toBe(-1);});

  test('numerator of r4 has a value of 3', () => { expect(r4.numer).toBe(3n);});
  test('denominator of r4 has a value of 4', () => { expect(r4.denom).toBe(4n);});
  test('sign of r4 is 1', () => { expect(r4.sign).toBe(1);});
});

describe('fractions to be reduced', () => {
  const r1 = new Rational(2,4);
  const r2 = new Rational(-3,12);
  const r3 = new Rational(33,-55);
  test('2/4 = 1/2', () => {expect(r1).toStrictEqual(new Rational(1,2));});
  test('-3/12 = -1/4', () => {expect(r2).toStrictEqual(new Rational(-1,4));});
  test('33/(-55) = -3/5', () => {expect(r3).toStrictEqual(new Rational(-3,5));});
});

describe('Addition/Subraction of Rational Numbers', () => {
  const r1 = new Rational(1,2);
  const r2 = new Rational(2,3);
  const sum1 = new Rational(7,6);
  const diff1 = new Rational(1,6);
  test('1/2 + 2/3 = 7/6', () => { expect(r1.plus(r2)).toStrictEqual(sum1);})
  test('2/3 - 1/2 = 1/6', () => { expect(r2.minus(r1)).toStrictEqual(diff1);})
});