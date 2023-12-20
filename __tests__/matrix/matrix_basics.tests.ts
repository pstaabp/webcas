import { describe, expect, test } from '@jest/globals';
import { Matrix, ColumnVector, RowVector } from '../../src/matrix/matrix';
import { Integer } from '../../src/constants/all_constants';

describe('get and set elements of a matrix', () => {
	const mat1 = new Matrix(`1 2 3 4
	4 5 6 8
	7 8 9 10`);
	const mat2 = mat1.clone();
	test('check clone', () => {
		expect(mat2.equals(mat1)).toBe(true);
	});

	const mat3 = mat1.clone();
	test('check getElement', () => {
		expect(mat1.getElement(2, 3)).toStrictEqual(new Integer(6));
	});
	mat3.setElement(2, 3, 7);
	test('check setElement', () => {
		expect(mat3.getElement(2, 3)).toStrictEqual(new Integer(7));
	});
});

describe('columns of a matrix', () => {
	const mat1 = new Matrix(`1 2 3 4; 4 5 6 8; 7 8 9 10`);
	const mat2 = mat1.clone();
	const c2 = new ColumnVector([2, 5, 8]);
	test('column', () => {
		expect(mat1.column(2)).toStrictEqual(c2);
	});
	test('column', () => {
		expect(mat1.column(2).equals(c2)).toBe(true);
	});
	test('set column of matrix', () => {
		expect(mat2.setColumn(1, new ColumnVector([1, 2, 3]))).toStrictEqual(new Matrix(`1 2 3 4;	2 5 6 8;	3 8 9 10`));
	});
});

describe('rows of a matrix', () => {
	const mat1 = new Matrix(`1 2 3 4; 4 5 6 8;7 8 9 10`);
	const mat2 = mat1.clone();

	const r2 = new RowVector([4, 5, 6, 8]);
	test('row', () => {
		expect(mat1.row(2)).toStrictEqual(r2);
	});
	test('row', () => {
		expect(mat1.row(2).equals(r2)).toBe(true);
	});

	test('set row', () => {
		expect(mat2.setRow(2, new RowVector([5, 4, 0, 1]))).toStrictEqual(new Matrix(`1 2 3 4; 5 4 0 1;7 8 9 10`));
	});
});
