import { describe, expect, test } from '@jest/globals';
import { Integer, Rational, Real, Complex } from '../../src/constants/all_constants';

describe('constructor', () => {
	const i1 = new Integer(1);
	test('i1 is an integer', () => {
		expect(i1 instanceof Integer);
	});
	test('i1 has a value of 1', () => {
		expect(i1.value).toBe(1n);
	});
});

describe('addition/subtraction with integers', () => {
	const i1 = new Integer(1);
	const i2 = new Integer(4);
	const i3 = new Integer(-4);
	const i4 = new Integer(7);
	test('1+4=5', () => {
		expect(i1.plus(i2).equals(new Integer(5))).toBe(true);
	});
	test('4+(-4)=0', () => {
		expect(i2.plus(i3).equals(Integer.ZERO)).toBe(true);
	});
	test('7-4=3', () => {
		expect(i4.minus(i2)).toStrictEqual(new Integer(3));
	});
	test('7-1=6', () => {
		expect(i4.minus(i1)).toStrictEqual(new Integer(6));
	});
	test('7-(-4)=11', () => {
		expect(i4.minus(i3)).toStrictEqual(new Integer(11));
	});
});

describe('addition of integers with other types', () => {
	const i1 = new Integer(3);
	const r1 = new Rational(1, 2);
	const r2 = new Rational(7, 2);
	const re1 = new Real('1.6');
	const re2 = new Real('4.6');
	const c1 = new Complex(2, 3);
	const c2 = new Complex(5, 3);
	test('3+1/2=7/2', () => {
		expect(i1.plus(r1)).toStrictEqual(r2);
	});
	test('3+1/2=7/2', () => {
		expect(i1.plus(r1).equals(r2)).toBe(true);
	});
	test('3+1.6=4.6', () => {
		expect(i1.plus(re1)).toStrictEqual(re2);
	});
	test('3+1.6=4.6', () => {
		expect(i1.plus(re1).equals(re2)).toBe(true);
	});
	test('3+(2+3i)=5+3i', () => {
		expect(i1.plus(c1)).toStrictEqual(c2);
	});
	test('3+(2+3i)=5+3i', () => {
		expect(i1.plus(c1).equals(c2)).toBe(true);
	});
});

describe('subtraction of integers with other types', () => {
	const i1 = new Integer(3);
	const r1 = new Rational(1, 2);
	const r2 = new Rational(5, 2);
	const re1 = new Real('1.6');
	const re2 = new Real('1.4');
	const c1 = new Complex(2, 3);
	const c2 = new Complex(1, -3);
	test('3-1/2=5/2', () => {
		expect(i1.minus(r1)).toStrictEqual(r2);
	});
	test('3-1.6=1.4', () => {
		expect(i1.minus(re1)).toStrictEqual(re2);
	});
	test('3-(2+3i)=1-3i', () => {
		expect(i1.minus(c1)).toStrictEqual(c2);
	});
});

describe('multiplication of integers with other types', () => {
	const i1 = new Integer(3);
	const r1 = new Rational(1, 2);
	const re1 = new Real('1.25');
	const c1 = new Complex(2, 3);
	const prod1 = new Rational(3, 2);
	const prod2 = new Real('3.75');
	const prod3 = new Complex(6, 9);
	test('3*1/2=3/2', () => {
		expect(i1.times(r1)).toStrictEqual(prod1);
	});
	test('3*1.25=3.75', () => {
		expect(i1.times(re1)).toStrictEqual(prod2);
	});
	test('3*(2+3i)=6+9i', () => {
		expect(i1.times(c1)).toStrictEqual(prod3);
	});
});

describe('division of integers with other types', () => {
	const i1 = new Integer(3);
	const i2 = new Integer(4);
	const r1 = new Rational(7, 2);
	const r2 = new Rational(-2, 3);
	const re1 = new Real('1.25');
	const c1 = new Complex(2, 3);
	const quo1 = new Rational(6, 7);
	const quo2 = new Real('2.4');
	const quo3 = new Complex(new Rational(6, 13), new Rational(-9, 13));
	test('3/(7/2)=6/7', () => {
		expect(i1.div(r1)).toStrictEqual(quo1);
	});
	test('4/(-2/3) = -6', () => {
		expect(i2.div(r2)).toStrictEqual(new Integer(-6));
	});
	test('3/1.25=2.4', () => {
		expect(i1.div(re1)).toStrictEqual(quo2);
	});
	test('3/(2+3i)=(6/13)-(9/13)i', () => {
		expect(i1.div(c1)).toStrictEqual(quo3);
	});
});

describe('gcd of 2 integers', () => {
	test('gcd(24,9) to equal 3', () => {
		expect(Integer.gcd(24, 9)).toBe(3n);
	});
	test('gcd(32,16) to equal 16', () => {
		expect(Integer.gcd(32, 16)).toBe(16n);
	});
	test('gcd(17,9) to equal 1', () => {
		expect(Integer.gcd(17, 9)).toBe(1n);
	});
});

describe('gcd of 3 integers', () => {
	test('gcd(24,9,12) to equal 3', () => {
		expect(Integer.gcd(24, 9, 12)).toBe(3n);
	});
});

describe('gcd of 4 integers', () => {
	test('gcd(24,12,16,40) to equal 4', () => {
		expect(Integer.gcd(24, 12, 16, 40)).toBe(4n);
	});
});

describe('check absolute value', () => {
	test('abs(-2) = 2', () => {
		expect(new Integer(-2).abs()).toStrictEqual(new Integer(2));
	});
	test('abs(2) = 2', () => {
		expect(new Integer(2).abs()).toStrictEqual(new Integer(2));
	});
});

describe('check unary minus', () => {
	test('(2).neg = -2', () => {
		expect(new Integer(-2).neg()).toStrictEqual(new Integer(2));
	});
	test('(-2).neg = 2', () => {
		expect(new Integer(2).neg()).toStrictEqual(new Integer(-2));
	});
});

describe('abs sum of integers', () => {
	const arr = [new Integer(1), new Integer(-2), new Integer(3)];
	const abs_sum = arr.reduce((m: Integer, v: Integer, i, array) => v.abs().plus(m) as Integer);
	test('abs sum', () => {
		expect(abs_sum).toStrictEqual(new Integer(6));
	});
});
