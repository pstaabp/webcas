import { describe, expect, test } from '@jest/globals';
import { Matrix } from 'matrix/matrix.ts';

describe('constructing matrices from strings', () => {
	const m1 = `1 2 3 4
	4 5 6 8
	7 8 9 10`;
	const m2 = `1.1 1.2 1.3 1.4 1.5
	2.1 2.2 2.3 2.4 2.5
	3.1 3.2 3.3 3.4 3.5`;
	const m3 = `1 1/2 1/3
	1/2 1/3 1/4
	1/3 1/4 1/5
	1/4 1/5 1/6`;
	test('construct a 3 by 3 matrix of integers', () => {
		expect(new Matrix(m1) instanceof Matrix).toBe(true);
	});
	const mat1 = new Matrix(m1);
	test('number of rows of a 3 by 4 matrix', () => {
		expect(mat1.nrow()).toBe(3);
	});
	test('number of cols of a 3 by 4 matrix', () => {
		expect(mat1.ncol()).toBe(4);
	});

	test('construct a 3 by 5 matrix of real', () => {
		expect(new Matrix(m2) instanceof Matrix).toBe(true);
	});
	const mat2 = new Matrix(m2);
	test('number of rows of a 3 by 5 matrix', () => {
		expect(mat2.nrow()).toBe(3);
	});
	test('number of cols of a 3 by 5 matrix', () => {
		expect(mat2.ncol()).toBe(5);
	});

	test('construct a 4 by 3 matrix of rationals', () => {
		expect(new Matrix(m3) instanceof Matrix).toBe(true);
	});
	const mat3 = new Matrix(m3);
	test('number of rows of a 3 by 4 matrix', () => {
		expect(mat3.nrow()).toBe(4);
	});
	test('number of cols of a 3 by 4 matrix', () => {
		expect(mat3.ncol()).toBe(3);
	});
});
