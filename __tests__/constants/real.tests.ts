import { describe, expect, test } from '@jest/globals';
import { Rational } from 'constants/rational.ts';
import { Integer } from 'constants/integer.ts';
import { Real } from 'constants/real.ts';
import { Complex } from 'constants/complex.ts';

describe('constructor', () => {
	const r1 = new Real(0.5);
	const r2 = new Real(-1.5);
	test('r1 is a Real', () => {
		expect(r1 instanceof Real);
	});
	test('r1 has value 0.5', () => {
		expect(r1.value).toBe(0.5);
	});
	test('r2 is a Real', () => {
		expect(r2 instanceof Real);
	});
	test('r2 has value -1.5', () => {
		expect(r2.value).toBe(-1.5);
	});
});

describe('Addition/Subtraction of reals', () => {
	const r1 = new Real(3.5);
	const r2 = new Real(2.75);
	const sum = new Real(6.25);
	const diff = new Real(0.75);
	test('3.5+2.75=6.25', () => {
		expect(r1.plus(r2)).toStrictEqual(sum);
	});
	test('3.5+2.75=6.25', () => {
		expect(r1.plus('2.75')).toStrictEqual(sum);
	});
	test('3.5-2.75=0.75', () => {
		expect(r1.minus(r2)).toStrictEqual(diff);
	});
	test('3.5-2.75=0.75', () => {
		expect(r1.minus('2.75')).toStrictEqual(diff);
	});
});

describe('Addition/Subtraction of other number types', () => {
	const r1 = new Real(3.5);
	const i1 = new Integer(2);
	const rat1 = new Rational(5, 4);
	const c1 = new Complex(1.25, -2.5);
	const sum1 = new Real(5.5);
	const sum2 = new Real(4.75);
	const sum3 = new Complex(4.75, -2.5);
	const diff1 = new Real(1.5);
	const diff2 = new Real(2.25);
	const diff3 = new Complex(2.25, 2.5);
	test('3.5+2=5.5', () => {
		expect(r1.plus(i1)).toStrictEqual(sum1);
	});
	test('3.5+2=5.5', () => {
		expect(r1.plus('2')).toStrictEqual(sum1);
	});
	test('3.5-2=1.5', () => {
		expect(r1.minus(i1)).toStrictEqual(diff1);
	});
	test('3.5-2=1.5', () => {
		expect(r1.minus('2')).toStrictEqual(diff1);
	});

	test('3.5+5/4=4.75', () => {
		expect(r1.plus(rat1)).toStrictEqual(sum2);
	});
	test('3.5+5/4=4.75', () => {
		expect(r1.plus('5/4')).toStrictEqual(sum2);
	});
	test('3.5-5/4=2.25', () => {
		expect(r1.minus(rat1)).toStrictEqual(diff2);
	});
	test('3.5-5/4=2.25', () => {
		expect(r1.minus('5/4')).toStrictEqual(diff2);
	});

	test('3.5+(1.25-2.5i)=4.75-2.5i', () => {
		expect(r1.plus(c1)).toStrictEqual(sum3);
	});
	test('3.5+(1.25-2.5i)=4.75-2.5i', () => {
		expect(r1.plus('1.25-2.5i')).toStrictEqual(sum3);
	});
	test('3.5-(1.25-2.5i)=2.25+2.5i', () => {
		expect(r1.minus(c1)).toStrictEqual(diff3);
	});
	test('3.5-(1.25-2.5i)=2.25+2.5i', () => {
		expect(r1.minus('1.25-2.5i')).toStrictEqual(diff3);
	});
});

describe('Multiplication/Division of reals', () => {
	const r1 = new Real(3.5);
	const r2 = new Real(1.25);
	const prod = new Real(4.375);
	const quo = new Real(3.5 / 1.25);
	test('3.5*1.25=4.375', () => {
		expect(r1.times(r2)).toStrictEqual(prod);
	});
	test('3.5*1.25=4.375', () => {
		expect(r1.times('1.25')).toStrictEqual(prod);
	});
	test('3.5/1.25=2.8', () => {
		expect(r1.div(r2)).toStrictEqual(quo);
	});
	test('3.5/1.25=2.8', () => {
		expect(r1.div('1.25')).toStrictEqual(quo);
	});
});

describe('Multiplication/Division of other number types', () => {
	const r1 = new Real(3.25);
	const i1 = new Integer(2);
	const rat1 = new Rational(5, 4);
	const c1 = new Complex(1.25, -2.5);
	const prod1 = new Real(6.5);
	const prod2 = new Real(4.0625);
	const prod3 = new Complex(4.0625, -8.125);
	const quo1 = new Real(1.625);
	const quo2 = new Real(2.6);
	const quo3 = new Complex(0.52, 1.04);
	test('3.25*2=6.5', () => {
		expect(r1.times(i1)).toStrictEqual(prod1);
	});
	test('3.25/2=1.75', () => {
		expect(r1.div(i1)).toStrictEqual(quo1);
	});

	test('3.25*5/4=4.0625', () => {
		expect(r1.times(rat1)).toStrictEqual(prod2);
	});
	test('3.25/(5/4)=', () => {
		expect(r1.div(rat1)).toStrictEqual(quo2);
	});
	test('3.25*(1.25-2.5i)=4.0625 - 8.125i', () => {
		expect(r1.times(c1)).toStrictEqual(prod3);
	});
	test('3.25/(1.25-2.5i)=0.52 + 1.04i', () => {
		expect(r1.div(c1)).toStrictEqual(quo3);
	});
});
