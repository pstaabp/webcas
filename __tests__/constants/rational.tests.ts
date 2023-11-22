import { describe, expect, test } from '@jest/globals';
import { Rational } from 'constants/rational.ts';
import { Integer } from 'constants/integer.ts';
import { Real } from 'constants/real.ts';
import { Complex } from 'constants/complex.ts';

describe('constructor with numbers', () => {
	const r1 = new Rational(1, 2);
	const r2 = new Rational(-2, 3);
	const r3 = new Rational(2, -3);
	const r4 = new Rational(-3, -4);
	test('r1 is a rational', () => {
		expect(r1 instanceof Rational);
	});
	test('numerator of r1 has a value of 1', () => {
		expect(r1.numer).toBe(1n);
	});
	test('denominator of r1 has a value of 2', () => {
		expect(r1.denom).toBe(2n);
	});

	test('r2 is a rational', () => {
		expect(r2 instanceof Rational);
	});
	test('numerator of r2 has a value of 2', () => {
		expect(r2.numer).toBe(-2n);
	});
	test('denominator of r2 has a value of 3', () => {
		expect(r2.denom).toBe(3n);
	});

	test('numerator of r3 has a value of 2', () => {
		expect(r3.numer).toBe(-2n);
	});
	test('denominator of r3 has a value of 3', () => {
		expect(r3.denom).toBe(3n);
	});

	test('numerator of r4 has a value of 3', () => {
		expect(r4.numer).toBe(3n);
	});
	test('denominator of r4 has a value of 4', () => {
		expect(r4.denom).toBe(4n);
	});
});

describe('constructor with bigints', () => {
	const r1 = new Rational(1n, 2n);
	const r2 = new Rational(-2n, 3n);
	const r3 = new Rational(2n, -3n);
	const r4 = new Rational(-3n, -4n);
	test('r1 is a rational', () => {
		expect(r1 instanceof Rational);
	});
	test('numerator of r1 has a value of 1', () => {
		expect(r1.numer).toBe(1n);
	});
	test('denominator of r1 has a value of 2', () => {
		expect(r1.denom).toBe(2n);
	});

	test('r2 is a rational', () => {
		expect(r2 instanceof Rational);
	});
	test('numerator of r2 has a value of 2', () => {
		expect(r2.numer).toBe(-2n);
	});
	test('denominator of r2 has a value of 3', () => {
		expect(r2.denom).toBe(3n);
	});

	test('numerator of r3 has a value of 2', () => {
		expect(r3.numer).toBe(-2n);
	});
	test('denominator of r3 has a value of 3', () => {
		expect(r3.denom).toBe(3n);
	});

	test('numerator of r4 has a value of 3', () => {
		expect(r4.numer).toBe(3n);
	});
	test('denominator of r4 has a value of 4', () => {
		expect(r4.denom).toBe(4n);
	});
});

describe('constructor with Integer', () => {
	const r1 = new Rational(new Integer(1), new Integer(2));
	const r2 = new Rational(new Integer(-2), new Integer(3));
	const r3 = new Rational(new Integer(2), new Integer(-3));
	const r4 = new Rational(new Integer(-3), new Integer(-4));
	test('r1 is a rational', () => {
		expect(r1 instanceof Rational);
	});
	test('numerator of r1 has a value of 1', () => {
		expect(r1.numer).toBe(1n);
	});
	test('denominator of r1 has a value of 2', () => {
		expect(r1.denom).toBe(2n);
	});

	test('r2 is a rational', () => {
		expect(r2 instanceof Rational);
	});
	test('numerator of r2 has a value of 2', () => {
		expect(r2.numer).toBe(-2n);
	});
	test('denominator of r2 has a value of 3', () => {
		expect(r2.denom).toBe(3n);
	});

	test('numerator of r3 has a value of 2', () => {
		expect(r3.numer).toBe(-2n);
	});
	test('denominator of r3 has a value of 3', () => {
		expect(r3.denom).toBe(3n);
	});

	test('numerator of r4 has a value of 3', () => {
		expect(r4.numer).toBe(3n);
	});
	test('denominator of r4 has a value of 4', () => {
		expect(r4.denom).toBe(4n);
	});
});

describe('fractions to be reduced', () => {
	const r1 = new Rational(2, 4);
	const r2 = new Rational(-3, 12);
	const r3 = new Rational(33, -55);
	test('2/4 = 1/2', () => {
		expect(r1).toStrictEqual(new Rational(1, 2));
	});
	test('-3/12 = -1/4', () => {
		expect(r2).toStrictEqual(new Rational(-1, 4));
	});
	test('33/(-55) = -3/5', () => {
		expect(r3).toStrictEqual(new Rational(-3, 5));
	});
});

describe('Addition/Subtraction of Rational Numbers', () => {
	const r1 = new Rational(1, 2);
	const r2 = new Rational(2, 3);
	const r3 = new Rational(4, 3);
	const r4 = new Rational(5, 2);
	const sum1 = new Rational(7, 6);
	const diff1 = new Rational(1, 6);
	test('1/2 + 2/3 = 7/6', () => {
		expect(r1.plus(r2)).toStrictEqual(sum1);
	});
	test('2/3 - 1/2 = 1/6', () => {
		expect(r2.minus(r1)).toStrictEqual(diff1);
	});
	test('2/3+4/3=2', () => {
		expect(r2.plus(r3)).toStrictEqual(new Integer(2));
	});
	test('5/2-1/2=2', () => {
		expect(r4.minus(r1)).toStrictEqual(new Integer(2));
	});
});

describe('Addition/Subtraction of Rational Numbers with other numbers', () => {
	const r1 = new Rational(1, 2);
	const i1 = new Integer(3);
	const re1 = new Real(4.25);
	const r2 = new Rational(17, 3);
	const c1 = new Complex(2, 3);
	const sum1 = new Rational(7, 2);
	const sum2 = new Real(4.75);
	const sum3 = new Complex(new Rational(5, 2), 3);
	const diff1 = new Rational(8, 3);
	const diff2 = new Real(17 / 3 - 4.25);
	const diff3 = new Complex(new Rational(11, 3), -3);
	test('1/2 + 3 = 7/2', () => {
		expect(r1.plus(i1)).toStrictEqual(sum1);
	});
	test('1/2 + 4.25 = 4.75', () => {
		expect(r1.plus(re1)).toStrictEqual(sum2);
	});
	test('1/2 + (2+3i) = 5+3i', () => {
		expect(r1.plus(c1)).toStrictEqual(sum3);
	});
	test('17/3 - 3 = 8/3', () => {
		expect(r2.minus(i1)).toStrictEqual(diff1);
	});
	test('17/3-4.25 = 1.4166666666', () => {
		expect(r2.minus(re1)).toStrictEqual(diff2);
	});
	test('17/3-(2+3i) = 11/3-3i', () => {
		expect(r2.minus(c1)).toStrictEqual(diff3);
	});
});

describe('Multiplication/Division of Rational Numbers', () => {
	const r1 = new Rational(1, 2);
	const r2 = new Rational(2, 3);
	const r3 = new Rational(-7, 12);
	const r4 = new Rational(3, 4);
	const r5 = new Rational(-1,4);
	const prod1 = new Rational(1, 3);
	const prod2 = new Rational(-7, 24);
	test('(1/2)*(2/3)=(1/3)', () => {
		expect(r1.times(r2)).toStrictEqual(prod1);
	});
	test('(1/2)*(-7/12)=(-7/24)', () => {
		expect(r1.times(r3)).toStrictEqual(prod2);
	});
	test('(2/3)*(3/4) = (1/2)', () => {
		expect(r4.times(r2)).toStrictEqual(r1);
	});

	test('(1/3)/(1/2) == (2/3)', () => {
		expect(prod1.div(r1)).toStrictEqual(r2);
	});
	test('(-7/24)/(1/2) == (-7/12)', () => {
		expect(prod2.div(r1)).toStrictEqual(r3);
	});
	test('(3/4)/(-1/4) = -3', () => {
		expect(r4.div(r5)).toStrictEqual(new Integer(-3));
	})
});

describe('Multiplication/Division of Rational Numbers with other numbers', () => {
	const r1 = new Rational(1, 2);
	const r2 = new Rational(2, 3);
	const r3 = new Rational(-7, 12);
	const i1 = new Integer(3);
	const i2 = new Integer(-5);
	const re1 = new Real(0.25);
	const c1 = new Complex(1, 2);
	const prod1 = new Rational(3, 2);
	const prod2 = new Rational(-10, 3);
	const prod3 = new Rational(35, 12);
	const prod4 = new Real(0.125);
	const prod5 = new Complex(new Rational(2, 3), new Rational(4, 3));

	const q1 = new Rational(1, 6);
	const q2 = new Rational(-2, 15);
	const q3 = new Real(2.0);
	const q4 = new Complex(new Rational(1, 10), new Rational(-1, 5));
	test('(1/2)*3 = 3/2', () => {
		expect(r1.times(i1)).toStrictEqual(prod1);
	});
	test('(2/3)*(-5) = -10/3', () => {
		expect(r2.times(i2)).toStrictEqual(prod2);
	});
	test('(-7/12)*(-5) = 35/12', () => {
		expect(r3.times(i2)).toStrictEqual(prod3);
	});
	test('(2/3)*3 = 2', () => {
		expect(r2.times(i1)).toStrictEqual(new Integer(2));
	})
	test('(1/2)*(0.25)=0.125', () => {
		expect(r1.times(re1)).toStrictEqual(prod4);
	});
	test('(2/3)*(1+2i)=(2/3+(4/3)i)', () => {
		expect(r2.times(c1)).toStrictEqual(prod5);
	});

	test('(1/2) / 3 = 1/6', () => {
		expect(r1.div(i1)).toStrictEqual(q1);
	});
	test('(2/3)) / (-5) = -2/15', () => {
		expect(r2.div(i2)).toStrictEqual(q2);
	});
	test('(1/2) / (0.25) = 2.0', () => {
		expect(r1.div(re1)).toStrictEqual(q3);
	});

	test('1/2 /(1+2i) = 1/10 - (1/5)i', () => {
		expect(r1.div(c1)).toStrictEqual(q4);
	});
});
