import {describe, expect, test} from '@jest/globals';
import {Rational} from '/Users/pstaab/code/webcas/src/constants/rational.ts';

describe('constructor', () => {
  const r1 = new Rational(1,2);
  test('r1 is a rational', () => { expect(r1 instanceof Rational); });
  test('numerator of r1 has a value of 1', () => { expect(r1.numer).toBe(1n);});
  test('denominator of r1 has a value of 2', () => { expect(r1.denom).toBe(2n);});
  test('sign of r1 is 1', () => { expect(r1.sign).toBe(1);});
});
