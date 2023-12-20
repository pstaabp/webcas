import { describe, expect, test } from '@jest/globals';
import { ColumnVector, RowVector, Matrix } from '../../src/matrix/matrix';
import { Integer, Rational } from '../../src/constants/all_constants';

describe('ColumnVector constructor', () => {
	test('create column vectors of ints', () => {
		expect(new ColumnVector([1, 2, 3]) instanceof ColumnVector).toBe(true);
	});
	test('create column vectors of rational', () => {
		expect(new ColumnVector([new Rational(1, 2), new Rational(2, 3), 3]) instanceof ColumnVector).toBe(true);
	});
	test('Test length', () => {
		const v = new ColumnVector([1, 2, 3]);
		expect(v.nrow()).toBe(3);
	});
	test('Test length', () => {
		const v = new ColumnVector([1, 2, 3]);
		expect(v.length()).toBe(3);
	});
});

describe('RowVector constructor', () => {
	test('create a row vector of ints', () => {
		expect(new RowVector([1, 2, 3]) instanceof RowVector).toBe(true);
	});
	test('a row vector is a matrix', () => {
		expect(new RowVector([1, 2, 3]) instanceof Matrix).toBe(true);
	});
	test('Test length', () => {
		const v = new RowVector([1, 2, 3]);
		expect(v.ncol()).toBe(3);
		expect(v.nrow()).toBe(1);
	});
	test('Test length', () => {
		const v = new RowVector([1, 2, 3]);
		expect(v.length()).toBe(3);
	});
});

describe('dot product tests', () => {
	const r1 = new RowVector([1, 2, 3]);
	const r2 = new RowVector([1, -2, 4]);
	const c1 = new ColumnVector([0, 4, 7]);
	const c2 = new ColumnVector([9, new Rational(3, 2), new Rational(-5, 2)]);
	test('dot product between row vectors', () => {
		expect(r1.dot(r2)).toStrictEqual(new Integer(9));
	});
	test('dot product between column vectors', () => {
		expect(c1.dot(c2)).toStrictEqual(new Rational(-23, 2));
	});
	test('dot product between row and column vector', () => {
		expect(c2.dot(r2)).toStrictEqual(new Integer(-4));
	});
});

describe('operations between row vectors', () => {
	const r1 = new RowVector([1, 2, 3]);
	const r2 = new RowVector([1, -2, 4]);
	const result1 = new RowVector([2, 0, 7]);
	test('add two row vectors', () => {
		expect(r1.plus(r2)).toStrictEqual(result1);
	});
	test('subtract two row vectors', () => {
		expect(r1.minus(r2)).toStrictEqual(new RowVector([0, 4, -1]));
	});

	test('multiply a row vector by 2', () => {
		expect(r1.times(new Integer(2))).toStrictEqual(new RowVector([2, 4, 6]));
	});

	test('Multiply a row vector by 2 and add to another', () => {
		expect(r1.times(new Integer(2)).plus(r2)).toStrictEqual(new RowVector([3, 2, 10]));
	});
});
