import { describe, expect, test } from '@jest/globals';
import { Complex } from 'constants/complex.ts';
import { Rational } from 'constants/rational.ts';
import { Integer } from 'constants/integer.ts';
import { Real } from 'constants/real.ts';

describe('constructor with numbers', () => {
	const c1 = new Complex(1, 2);

	test('c1 is complex', () => {
		expect(c1 instanceof Complex).toBe(true);
	});
	test('real part of c1 is 1', () => {
		expect(c1.real.equals(new Integer(1))).toBe(true);
	});
	test('imaginary part of c1 is 2', () => {
		expect(c1.imag.equals(new Integer(2))).toBe(true);
	});
});

describe('constructor with bigints', () => {
	const c1 = new Complex(1n, 2n);

	test('c1 is complex', () => {
		expect(c1 instanceof Complex).toBe(true);
	});
	test('real part of c1 is 1', () => {
		expect(c1.real.equals(new Integer(1))).toBe(true);
	});
	test('imaginary part of c1 is 2', () => {
		expect(c1.imag.equals(new Integer(2))).toBe(true);
	});
});

describe('constructor with Integers', () => {
	const c1 = new Complex(new Integer(1), new Integer(2));

	test('c1 is complex', () => {
		expect(c1 instanceof Complex).toBe(true);
	});
	test('real part of c1 is 1', () => {
		expect(c1.real.equals(new Integer(1))).toBe(true);
	});
	test('imaginary part of c1 is 2', () => {
		expect(c1.imag.equals(new Integer(2))).toBe(true);
	});
});

describe('constructor with rationals', () => {
	const c1 = new Complex(new Rational(1, 3), new Rational(2, 3));

	test('c1 is complex', () => {
		expect(c1 instanceof Complex).toBe(true);
	});
	test('real part of c1 is 1/3', () => {
		expect(c1.real.equals(new Rational(1, 3))).toBe(true);
	});
	test('imaginary part of c1 is 2/2', () => {
		expect(c1.imag.equals(new Rational(2, 3))).toBe(true);
	});
});

describe('constructor with reals', () => {
	const c1 = new Complex(1.1, 2.5);

	test('c1 is complex', () => {
		expect(c1 instanceof Complex).toBe(true);
	});
	test('real part of c1 is 1.0', () => {
		expect(c1.real.equals(new Real(1.1))).toBe(true);
	});
	test('imaginary part of c1 is 2.5', () => {
		expect(c1.imag.equals(new Real(2.5))).toBe(true);
	});
});

describe('Test negation of Complexes', () => {
	const c1 = new Complex(1, 2);
	const c2 = new Complex(3.2, -6.25);
	const c3 = new Complex(new Rational(-5, 2), new Rational(5, 3));
	const neg1 = new Complex(-1, -2);
	const neg2 = new Complex(-3.2, 6.25);
	const neg3 = new Complex(new Rational(5, 2), new Rational(-5, 3));

	test('-(1+2i) = -1-2i', () => {
		expect(c1.neg()).toStrictEqual(neg1);
	});
	test('-(3.2-6.25i) = -3.2+6.25i', () => {
		expect(c2.neg()).toStrictEqual(neg2);
	});
	test('-((-5/2)+(5/3)i) = (5/2)-(5/3)i', () => {
		expect(c3.neg()).toStrictEqual(neg3);
	});
});

describe('Test complex conjugates', () => {
	const c1 = new Complex(1, 2);
	const c2 = new Complex(3.2, -6.25);
	const c3 = new Complex(new Rational(-5, 2), new Rational(5, 3));
	const conj1 = new Complex(1, -2);
	const conj2 = new Complex(3.2, 6.25);
	const conj3 = new Complex(new Rational(-5, 2), new Rational(-5, 3));

	test('conj(1+2i) = 1-2i', () => {
		expect(c1.conj()).toStrictEqual(conj1);
	});
	test('-(3.2-6.25i) = -3.2+6.25i', () => {
		expect(c2.conj()).toStrictEqual(conj2);
	});
	test('-((-5/2)+(5/3)i) = (5/2)-(5/3)i', () => {
		expect(c3.conj()).toStrictEqual(conj3);
	});
});

describe('Addition/Subtraction of Complexes', () => {
	const c1 = new Complex(1, 2);
	const c2 = new Complex(3, 6);
	const c3 = new Complex(new Rational(5, 2), new Rational(5, 3));
	const sum1 = new Complex(4, 8);
	const sum2 = new Complex(new Rational(7, 2), new Rational(11, 3));
	const diff1 = new Complex(-2, -4);
	const diff2 = new Complex(new Rational(-1, 2), new Rational(-13, 3));
	test('(1+2i)+(3+6i) = 4+8i', () => {
		expect(c1.plus(c2)).toStrictEqual(sum1);
	});
	test('(1+2i)-(3+6i) = -2-4i', () => {
		expect(c1.minus(c2)).toStrictEqual(diff1);
	});
	test('(1+2i)+(5/2+(5/3)i = (7/2 + (11/3)i', () => {
		expect(c1.plus(c3)).toStrictEqual(sum2);
	});
	test('(5/2+(5/3)i - (3+6i) = -1/2 -(13/3)i)', () => {
		expect(c3.minus(c2)).toStrictEqual(diff2);
	});
});

describe('Multiplication/Division of Complexes', () => {
	const c1 = new Complex(1, 2);
	const c2 = new Complex(3, 5);
	const prod1 = new Complex(-7, 11);
	const quo1 = new Complex(new Rational(13, 34), new Rational(1, 34));
	test('(1+2i)*(3+5i) = -7+11i', () => {
		expect(c1.times(c2)).toStrictEqual(prod1);
	});
	test('(1+2i)/(3+5i) = (13/34)+(1/34)i', () => {
		expect(c1.div(c2)).toStrictEqual(quo1);
	});
});

describe('Multiplication/Division of Complex and Other numbers', () => {
	const c1 = new Complex(1, 2);
	const i1 = new Integer(3);
	const r1 = new Real(2.5);
	const prod1 = new Complex(3, 6);
	const prod2 = new Complex(2.5, new Real(5));
	const quo1 = new Complex(new Rational(1, 3), new Rational(2, 3));
	const quo2 = new Complex(0.4, 0.8);

	test('(1+2i)*3 = 3 + 6i', () => {
		expect(c1.times(i1)).toStrictEqual(prod1);
	});
	test('(1+2i)*2.5 = 2.5+5i', () => {
		expect(c1.times(r1)).toStrictEqual(prod2);
	});
	test('(1+2i)/3 = (1/3) + (2/3)i', () => {
		expect(c1.div(i1)).toStrictEqual(quo1);
	});
	test('(1+2i)/2.5 = 0.4 + 0.8i', () => {
		expect(c1.div(r1)).toStrictEqual(quo2);
	});
});
