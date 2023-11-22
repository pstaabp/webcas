import { describe, expect, test } from '@jest/globals';
import { Matrix } from 'matrix/matrix';
import { Integer } from 'constants/integer';
import { Rational } from 'constants/rational';

describe('Matrix Addition/Subtraction', () => {
	const A = new Matrix(`1 2 3 4; 5 6 7 8;3 4 5 6`);
	const B = new Matrix(`4 3 2 1; 5 6 2 3; 2 -1 2 -1`);
	const C = new Matrix(`5 5 5 5; 10 12 9 11; 5 3 7 5`);

	test('Matrix addition', () => {
		expect(A.plus(B)).toStrictEqual(C);
	});
	test('Matrix addition incompatibility', () => {
		expect(() => {
			A.plus(new Matrix(3, 3));
		}).toThrow('Matrices are incompatible for addition.');
	});

	test('Matrix subtraction', () => {
		expect(C.minus(B)).toStrictEqual(A);
	});
	test('Matrix subtraction incompatibility', () => {
		expect(() => {
			A.minus(new Matrix(3, 3));
		}).toThrow('Matrices are incompatible for subtraction.');
	});
});

describe('Scalar multiplication with a Matrix', () => {
	const A = new Matrix(`4 3 2; 5 6 2; 2 -1 2`);
	const c = new Integer(2);
	const B = new Matrix(`8 6 4; 10 12 4; 4 -2 4`);
	test('2A', () => {
		expect(A.times(c)).toStrictEqual(B);
	});
});

describe('Matrix Multiplication', () => {
	const A = new Matrix(`4 3; 5 6`);
	const B = new Matrix(`1 2; -1 2`);
	const C = new Matrix(`1 14; -1 22`);

	const A1 = new Matrix(`4 3 2; 5 6 2; 2 -1 2`);
	const B1 = new Matrix(`1 2 3 4; 5 6 7 8;3 4 5 6`);
	const C1 = new Matrix(`25 34 43 52; 41 54 67 80; 3 6 9 12`);

	test('2 by 2 Matrix multiplication', () => {
		expect(A.times(B)).toStrictEqual(C);
	});
	test('3 by 3 times 3 by 4 Matrix multiplication', () => {
		expect(A1.times(B1)).toStrictEqual(C1);
	});

	test('incompatible matrix mmultiplication', () => {
		expect(() => {
			A.times(B1);
		}).toThrow('Matrices are not compatible for multiplication.');
	});
});

describe('Matrix Transpose', () => {
	const A = new Matrix(`1 2 3 4; 5 6 7 8;3 4 5 6`);
	const At = new Matrix(`1 5 3; 2 6 4; 3 7 5; 4 8 6`);
	test('matrix tranpose of 3 by 4 matrix.', () => {
		expect(A.transpose()).toStrictEqual(At);
	});
});

describe('Row Swap', () => {
	const A = new Matrix(`1 2 3 4; 5 6 7 8;3 4 5 6`);
	const B = new Matrix(`5 6 7 8; 1 2 3 4; 3 4 5 6`);
	test('swap rows 1 and 2', () => {
		expect(A.swapRows(1, 2)).toStrictEqual(B);
	});
});

describe('Mulitply a row by', () => {
	const A = new Matrix(`1 2 3 4; 5 6 7 8;3 4 5 6`);
	const A0 = A.clone();
	const B = new Matrix(`1 2 3 4; -5 -6 -7 -8;3 4 5 6`);
	const C = new Matrix(`1 2 3 4; 5 6 7 8;-9/2 -6 -15/2 -9`);
	test('multiply row 2 by -1', () => {
		expect(A.multiplyRowBy(new Integer(-1), 2)).toStrictEqual(B);
	});
	test('multiply row 3 by -1/2', () => {
		expect(A0.multiplyRowBy(new Rational(-3, 2), 3)).toStrictEqual(C);
	});
});

describe('Row combinations', () => {
	const A = new Matrix(`1 2 3 4; 5 6 7 8;3 4 5 6`);
	const B = new Matrix(`1 2 3 4; 4 4 4 4; 3 4 5 6`);
	const C = new Matrix(`1 2 3 4; 6 7 8 9; 3 4 5 6`);
	const C0 = new Matrix(`1 2 3 4; 0 -4 -8 -12; 3 4 5 6`);
	const A0 = A.clone();
	const A1 = A.clone();
	const A2 = A.clone();
	test('-R1+R2->R2', () => {
		expect(A.rowCombination(new Integer(-1), 1, new Integer(1), 2, 2)).toStrictEqual(B);
	});
	test('(3/2)R2-(1/2)R3 -> R2', () => {
		expect(A0.rowCombination(new Rational(3, 2), 2, new Rational(-1, 2), 3, 2)).toStrictEqual(C);
	});
	test('-5R1+R2->R2', () => {
		expect(A1.multiplyRowByAndAdd(new Integer(-5), 1, 2)).toStrictEqual(C0);
	});
});

describe('pivots', () => {
	const A = new Matrix(`1 2 3 4; 5 6 7 8;3 4 5 6`);
	const A0 = A.clone();
	const B = new Matrix(`0 4/5 8/5 12/5; 1 6/5 7/5 8/5; 0 2/5 4/5 6/5`);
	const C = new Matrix('0 4 8 12; 5 6 7 8; 0 2 4 6');

	const A1 = new Matrix('1 2 -3 4; 5 6 7 8;3 4 5 6');
	const C1 = new Matrix('-1 -2 3 -4; 22 32 0 52; 14 22 0 38');
	test('pivot(2,1)', () => {
		expect(A.pivot(2, 1)).toStrictEqual(B);
	});

	test('piv(2,1)', () => {
		expect(A0.pivotPreserveIntegers(2,1)).toStrictEqual(C);
	})

	test('piv(1,3) on a negative integer', () => {
		expect(A1.pivotPreserveIntegers(1,3)).toStrictEqual(C1);
	})
});
