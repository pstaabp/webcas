import { describe, expect, test } from '@jest/globals';
import {
	MultiplyRowAndAdd,
	RowSwap,
	MultiplyRow,
	RowOperation,
	Pivot,
	PivotPreserveIntegers,
} from 'matrix/row_operation.ts';
import { Integer } from 'constants/integer.ts';
import { Rational } from 'constants/rational.ts';

describe('construct Row Swap', () => {
	const rs1 = new RowSwap(1, 2);
	test('construct row swap', () => {
		expect(rs1 instanceof RowSwap).toBe(true);
	});
	test('construct row swap', () => {
		expect(rs1 instanceof RowOperation).toBe(true);
	});

	test('detect first row of row swap', () => {
		expect(rs1.row1).toBe(1);
	});
	test('detect second row of row swap', () => {
		expect(rs1.row2).toBe(2);
	});

	test('toLaTeX', () => {
		expect(rs1.toLaTeX()).toBe('R_{1} \\leftrightarrow R_{2}');
	});
});

describe('test for bad input to RowSwap', () => {
	test('non integer row1', () => {
		expect(() => {
			new RowSwap(1.1, 2);
		}).toThrow('First row is not a positive integer.');
	});
	test('negative row1', () => {
		expect(() => {
			new RowSwap(-2, 2);
		}).toThrow('First row is not a positive integer.');
	});

	test('non integer row2', () => {
		expect(() => {
			new RowSwap(1, 2.5);
		}).toThrow('Second row is not a positive integer.');
	});
	test('negative row2', () => {
		expect(() => {
			new RowSwap(1, -2);
		}).toThrow('Second row is not a positive integer.');
	});

	test('rows must be different', () => {
		expect(() => {
			new RowSwap(1, 1);
		}).toThrow('The two rows must be different.');
	});
});

describe('construct Multiply Row', () => {
	const mrow = new MultiplyRow(new Integer(2), 2);
	test('construct multiply row', () => {
		expect(mrow instanceof MultiplyRow).toBe(true);
	});
	test('construct multiply row', () => {
		expect(mrow instanceof RowOperation).toBe(true);
	});

	test('detect scalar of multiply row', () => {
		expect(mrow.scalar).toStrictEqual(new Integer(2));
	});
	test('detect row of multiply row', () => {
		expect(mrow.row).toBe(2);
	});

	test('toLaTeX', () => {
		expect(mrow.toLaTeX()).toBe('2 R_{2} \\to R_{2}');
	});
});

describe('test for bad input to MultiplyRow', () => {
	test('non integer row', () => {
		expect(() => {
			new MultiplyRow(new Integer(2), 2.2);
		}).toThrow('Row is not a positive integer.');
	});
	test('negative row', () => {
		expect(() => {
			new MultiplyRow(new Integer(2), -2);
		}).toThrow('Row is not a positive integer.');
	});
});

describe('construct Multiply Row and Add', () => {
	const mrow = new MultiplyRowAndAdd(new Integer(-2), 1, 2);
	test('construct multiply row and add', () => {
		expect(mrow instanceof MultiplyRowAndAdd).toBe(true);
	});
	test('construct multiply row', () => {
		expect(mrow instanceof RowOperation).toBe(true);
	});

	test('detect first scalar of multiply row and add', () => {
		expect(mrow.scalar1).toStrictEqual(new Integer(-2));
	});
	test('detect first row of multiply row and add', () => {
		expect(mrow.row1).toBe(1);
	});
	test('detect second scalar of multiply row and add', () => {
		expect(mrow.scalar2).toStrictEqual(new Integer(1));
	});
	test('detect second row of multiply row and add', () => {
		expect(mrow.row2).toBe(2);
	});
	test('detect third row of multiply row and add', () => {
		expect(mrow.row3).toBe(2);
	});

	test('toLaTeX', () => {
		expect(mrow.toLaTeX()).toBe('-2 R_{1} + R_{2} \\to R_{2}');
	});
});

describe('construct 5-arg Multiply Row and Add', () => {
	const mrow = new MultiplyRowAndAdd(new Integer(-2), 1, new Integer(1), 2, 2);
	const mrow2 = new MultiplyRowAndAdd(new Integer(2), 1, new Rational(2, 3), 3, 3);
	test('construct multiply row and add', () => {
		expect(mrow instanceof MultiplyRowAndAdd).toBe(true);
	});
	test('construct multiply row', () => {
		expect(mrow instanceof RowOperation).toBe(true);
	});

	test('detect first scalar of multiply row and add', () => {
		expect(mrow.scalar1).toStrictEqual(new Integer(-2));
	});
	test('detect first row of multiply row and add', () => {
		expect(mrow.row1).toBe(1);
	});
	test('detect second scalar of multiply row and add', () => {
		expect(mrow.scalar2).toStrictEqual(new Integer(1));
	});
	test('detect second row of multiply row and add', () => {
		expect(mrow.row2).toBe(2);
	});
	test('detect third row of multiply row and add', () => {
		expect(mrow.row3).toBe(2);
	});
	test('multiply row and add with Rational', () => {
		expect(mrow2 instanceof MultiplyRowAndAdd).toBe(true);
	});

	test('toLaTeX', () => {
		expect(mrow.toLaTeX()).toBe('-2 R_{1} + R_{2} \\to R_{2}');
	});
});

describe('test for bad input to MultiplyRowAndAdd', () => {
	test('non integer first row', () => {
		expect(() => {
			new MultiplyRowAndAdd(new Integer(2), 1.2, 2);
		}).toThrow('First row is not a positive integer.');
	});
	test('negative first row', () => {
		expect(() => {
			new MultiplyRowAndAdd(new Integer(2), -2, 1);
		}).toThrow('First row is not a positive integer.');
	});
	test('non integer second row', () => {
		expect(() => {
			new MultiplyRowAndAdd(new Integer(2), 1, 2.5);
		}).toThrow('Second row is not a positive integer.');
	});
	test('negative second row', () => {
		expect(() => {
			new MultiplyRowAndAdd(new Integer(2), 1, 1.5);
		}).toThrow('Second row is not a positive integer.');
	});

	test('non integer second row', () => {
		expect(() => {
			new MultiplyRowAndAdd(new Integer(2), 1, new Integer(1), 2.5, 3);
		}).toThrow('Second row is not a positive integer.');
	});
	test('negative second row', () => {
		expect(() => {
			new MultiplyRowAndAdd(new Integer(2), 1, new Integer(1), -2, 3);
		}).toThrow('Second row is not a positive integer.');
	});

	test('non integer third row', () => {
		expect(() => {
			new MultiplyRowAndAdd(new Integer(2), 1, new Integer(1), 2, 3.3);
		}).toThrow('Third row is not a positive integer.');
	});
	test('negative third row', () => {
		expect(() => {
			new MultiplyRowAndAdd(new Integer(2), 1, new Integer(1), 2, -1);
		}).toThrow('Third row is not a positive integer.');
	});

	test('ensure that the third row is either first or second row', () => {
		expect(() => {
			new MultiplyRowAndAdd(new Integer(2), 1, new Integer(1), 2, 3);
		}).toThrow('Third row must be either first or second row.');
	});

	test('ensure that the first two rows are different.', () => {
		expect(() => {
			new MultiplyRowAndAdd(new Integer(2), 1, new Integer(1), 1, 1);
		}).toThrow('The first two rows input must be different.');
	});
});

describe('construct Pivot ops', () => {
	test('Pivot(1,2) is a Pivot', () => {
		expect(new Pivot(1, 2) instanceof Pivot).toBe(true);
	});
	test('Pivot(1,2) is a RowOperation', () => {
		expect(new Pivot(1, 2) instanceof RowOperation).toBe(true);
	});
	test('Pivot(1,2) stores correct info.', () => {
		const p = new Pivot(1, 2);
		expect(p.row).toBe(1);
		expect(p.col).toBe(2);
	});

	test('piv(1,2) is a PivotPreserveIntegers', () => {
		expect(new PivotPreserveIntegers(1, 2) instanceof PivotPreserveIntegers).toBe(true);
	});
	test('piv(1,2) is a RowOperation', () => {
		expect(new PivotPreserveIntegers(1, 2) instanceof RowOperation).toBe(true);
	});
	test('piv(1,2) stores correct info.', () => {
		const p = new PivotPreserveIntegers(1, 2);
		expect(p.row).toBe(1);
		expect(p.col).toBe(2);
	});
});

describe('parsing correct row swaps', () => {
	test('S12', () => {
		expect(RowOperation.parse('S12')).toStrictEqual(new RowSwap(1, 2));
	});
	test('R1<->R2', () => {
		expect(RowOperation.parse('R1<->R2')).toStrictEqual(new RowSwap(1, 2));
	});
	test('r1<->r2', () => {
		expect(RowOperation.parse('r1<->r2')).toStrictEqual(new RowSwap(1, 2));
	});
});

describe('parsing correct row multiplications', () => {
	test('2R1->R1', () => {
		expect(RowOperation.parse('2R1->R1')).toStrictEqual(new MultiplyRow(new Integer(2), 1));
	});
	test('2r1->r1', () => {
		expect(RowOperation.parse('2r1->r1')).toStrictEqual(new MultiplyRow(new Integer(2), 1));
	});
	test('2R1', () => {
		expect(RowOperation.parse('2R1')).toStrictEqual(new MultiplyRow(new Integer(2), 1));
	});
	test('2r1', () => {
		expect(RowOperation.parse('2r1')).toStrictEqual(new MultiplyRow(new Integer(2), 1));
	});

	test('-2R1', () => {
		expect(RowOperation.parse('-2R1')).toStrictEqual(new MultiplyRow(new Integer(-2), 1));
	});
	test('-2r1', () => {
		expect(RowOperation.parse('-2r1')).toStrictEqual(new MultiplyRow(new Integer(-2), 1));
	});

	test('(2/3)R1', () => {
		expect(RowOperation.parse('(2/3)R1')).toStrictEqual(new MultiplyRow(new Rational(2, 3), 1));
	});
});

describe('parsing correct row combinations', () => {
	test('2R1+R3->R3', () => {
		expect(RowOperation.parse('2R1+R3->R3')).toStrictEqual(
			new MultiplyRowAndAdd(new Integer(2), 1, new Integer(1), 3, 3)
		);
	});

	test('(2/3)R1+R3->R3', () => {
		expect(RowOperation.parse('(2/3)R1+R3->R3')).toStrictEqual(
			new MultiplyRowAndAdd(new Rational(2, 3), 1, new Integer(1), 3, 3)
		);
	});

	test('2R1-R3->R3', () => {
		expect(RowOperation.parse('2R1-R3->R3')).toStrictEqual(
			new MultiplyRowAndAdd(new Integer(2), 1, new Integer(-1), 3, 3)
		);
	});
});

describe('parsing incorrect row operations', () => {
	test('S11', () => {
		expect(() => {
			RowOperation.parse('S11');
		}).toThrow('The two rows must be different.');
	});
	test('R2<->R2', () => {
		expect(() => {
			RowOperation.parse('R2<->R2');
		}).toThrow('The two rows must be different.');
	});
	test('r1<->r1', () => {
		expect(() => {
			RowOperation.parse('r1<->r1');
		}).toThrow('The two rows must be different.');
	});
	test('2R1->R2', () => {
		expect(() => {
			RowOperation.parse('2R1->R2');
		}).toThrow('The two rows must be the same.');
	});
	test('2r1->r2', () => {
		expect(() => {
			RowOperation.parse('2r1->r2');
		}).toThrow('The two rows must be the same.');
	});
});

describe('parse pivots correctly', () => {
	test('pivot(1,2)', () => {
		expect(RowOperation.parse('pivot(1,2)')).toStrictEqual(new Pivot(1, 2));
	});
	test('piv(1,2)', () => {
		expect(RowOperation.parse('piv(1,2)')).toStrictEqual(new PivotPreserveIntegers(1, 2));
	});
});

describe('parse pivot throws errors', () => {
	test('pivot(1.2,2)', () => {
		expect(() => {
			RowOperation.parse('pivot(1.1,2)');
		}).toThrow('Row must be a positive integer');
	});
	test('pivot(1,2.5)', () => {
		expect(() => {
			RowOperation.parse('pivot(1,2.5)');
		}).toThrow('Column must be a positive integer');
	});

	test('piv(0,2)', () => {
		expect(() => {
			RowOperation.parse('piv(0,2)');
		}).toThrow('Row must be a positive integer');
	});
	test('piv(1,-3)', () => {
		expect(() => {
			RowOperation.parse('pivot(1,2.5)');
		}).toThrow('Column must be a positive integer');
	});
})
