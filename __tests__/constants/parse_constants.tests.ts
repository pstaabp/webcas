import {describe, expect, test} from '@jest/globals';
import {Parser} from '/Users/pstaab/code/webcas/src/constants/parser.ts';
import {Integer} from '/Users/pstaab/code/webcas/src/constants/integer.ts';
import {Rational} from '/Users/pstaab/code/webcas/src/constants/rational.ts';
import {Real} from '/Users/pstaab/code/webcas/src/constants/real.ts';
import {Complex} from '/Users/pstaab/code/webcas/src/constants/complex.ts';

describe('Parse Integers', () => {
  test('1 is an integer', () => { expect(Parser.parseConstant("1").equals(new Integer(1))).toBe(true); });
  test('1 is an integer', () => { expect(Parser.parseConstant("1") instanceof Integer).toBe(true);});
  test('-11 is an integer', () => { expect(Parser.parseConstant("-11").equals(new Integer(-11))).toBe(true); });
  test('-11 is an integer', () => { expect(Parser.parseConstant("-11") instanceof Integer).toBe(true); });
  test('1.2 is not an integer', () => {
    expect(() => {new Integer('1.2');}).toThrow('1.2 is not an integer');
  });
  test('1/2 is not an integer', () => {
    expect(() => {new Integer('1/2');}).toThrow('1/2 is not an integer');
  });
});

describe('Parse Rationals', () => {
  test('1/2 is a rational', () => { expect(Parser.parseConstant('1/2').equals(new Rational(1,2))).toBe(true); });
  test('1/2 is a rational', () => { expect(Parser.parseConstant('1/2') instanceof Rational).toBe(true); });
  test('-2/3 is a rational', () => { expect(Parser.parseConstant('-2/3').equals(new Rational(-2,3))).toBe(true); });
  test('-2/3 is a rational', () => { expect(Parser.parseConstant('-2/3') instanceof Rational).toBe(true); });
  test('2 is not a rational', () => { expect(() => { new Rational('2'); }).toThrow('2 is not a rational'); });
  test('2.4 is not a rational', () => { expect(() => { new Rational('2.4'); }).toThrow('2.4 is not a rational'); });
});

describe('Parse reals', () => {
  test('3.0 is a real', () => { expect(Parser.parseConstant('3.0').equals(new Real(3.0))).toBe(true); });
  test('3.0 is a real', () => { expect(Parser.parseConstant('3.0') instanceof Real).toBe(true); });
  test('-3.0 is a real', () => { expect(Parser.parseConstant('-3.0').equals(new Real(-3.0))).toBe(true); });
  test('-3.0 is a real', () => { expect(Parser.parseConstant('-3.0') instanceof Real).toBe(true); });
  test('2/3 is not a real', () => { expect(() => { new Real('2/3'); }).toThrow('2/3 is not a real'); });
});

describe('Parse complex numbers', () => {
  test('2+3i is a complex', () => { expect(Parser.parseConstant('2+3i').equals(new Complex(2,3))).toBe(true); });
});