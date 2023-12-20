import { Constant, Integer, Rational } from '../constants/all_constants';
import { Parser } from '../constants/constant_parser';
import {
	ElementaryRowOperation,
	MatrixOperation,
	RowSwap,
	MultiplyRow,
	MultiplyRowAndAdd,
	Pivot,
	PivotPreserveIntegers,
	AddRowToTableau,
} from './row_operation';

/* Matrix class that supports standard matrix operations */

export class Matrix {
	protected _arr: Constant[][];
	private _SMmult: Integer;

	// Create a zero matrix of size num_row by num_col
	constructor(num_row: number, num_col: number);
	// Create a matrix based on an 2D array of numbers, bigints or Constants
	constructor(arg: number[][] | bigint[][] | Constant[][]);
	// Create a matrix that will parse a string.  There are many different types of inputs
	constructor(str: string);

	constructor(arg1: number[][] | bigint[][] | Constant[][] | string | number, arg2?: number) {
		this._arr = new Array<Constant[]>();
		// set the multiplier to -1.  If in simplex mode, this will be overridden.
		this._SMmult = new Integer(-1);
		if (typeof arg1 == 'number' && typeof arg2 === 'number') {
			// Check that arg1 and arg2 are positive integers.
			for (let i = 0; i < arg1; i++) {
				this._arr[i] = new Array<Constant>();
				for (let j = 0; j < arg2; j++) this._arr[i][j] = new Integer(0);
			}
		} else if (typeof arg1 === 'string') {
			// New RegEx location, handles standard and LaTeX
			let str = arg1
				.replace(/\s*&\s*/g, ' ')
				.replace(/\\\\/g, '')
				.replace(/\n/g, ';')
				.replace(/;*$/, '')
				.replace(/\\hline/g, '');

			const m = /(.*);\s*$/.exec(str);
			if (m && m[1] != undefined) str = m[1];
			const s = str.split(';');

			for (let i = 0; i < s.length; i++) {
				const s2 = s[i].split(/\s+/);
				var row = new Array<Constant>();
				for (let j = 0; j < s2.length; j++) if (s2[j] != '') row[row.length] = Parser.parseConstant(s2[j]);
				this._arr[i] = row;
			}
		} else if (Array.isArray(arg1))
			for (let i = 0; i < arg1.length; i++)
				this._arr[i] = arg1[i].map((el) => (el instanceof Constant ? el : Parser.parseConstant(`${el}`)));

		for (let i = 1; i < this._arr.length; i++)
			if (this._arr[0].length != this._arr[i].length)
				throw new Error(`Error in constructing matrix.  Row ${i} is not the same length as previous rows.`);
	}

	set SMmultiplier(value: number | Integer) {
		this._SMmult = typeof value === 'number' ? new Integer(value) : value;
	}

	get SMmultiplier(): Integer {
		return this._SMmult;
	}

	// number of rows in the matrix.
	nrow(): number {
		return this._arr.length;
	}

	// number of columns in the matrix.
	ncol(): number {
		return this._arr[0].length;
	}

	equals(m: Matrix) {
		if (m.ncol() != this.ncol()) return false;
		if (m.nrow() != this.nrow()) return false;
		for (let i = 1; i <= this._arr.length; i++)
			for (let j = 1; j <= this._arr[0].length; j++)
				if (!this.getElement(i, j).equals(m.getElement(i, j))) return false;
		return true;
	}

	setElement(row: number, col: number, value: Constant | number | bigint | string): Matrix {
		if (row < 1) throw new Error('The row input must be positive');
		if (row > this.nrow()) throw new Error('The row input cannot be greater than the number of rows.');
		if (col < 1) throw new Error('The row input must be positive');
		if (col > this.ncol()) throw new Error('The col input cannot be greater than the number of columns.');

		if (typeof value === 'number' || typeof value === 'bigint' || typeof value === 'string')
			this._arr[row - 1][col - 1] = Parser.parseConstant(`${value}`);
		else this._arr[row - 1][col - 1] = value;
		return this;
	}

	getElement(row: number, col: number): Constant {
		if (row < 1) throw new Error('The row input must be positive');
		if (row > this.nrow()) throw new Error('The row input cannot be greater than the number of rows.');
		if (col < 1) throw new Error('The row input must be positive');
		if (col > this.ncol()) throw new Error('The col input cannot be greater than the number of columns.');

		return this._arr[row - 1][col - 1];
	}
	clone(): Matrix {
		const m = new Matrix(this._arr.length, this._arr[0].length);
		for (let i = 1; i <= this._arr.length; i++)
			for (let j = 1; j <= this._arr[0].length; j++) m.setElement(i, j, this.getElement(i, j).clone());
		if (this._SMmult) m.SMmultiplier = this._SMmult.clone();
		return m;
	}

	toString(): string {
		const rows = [];
		for (let i = 0; i < this._arr.length; i++) rows.push(this._arr[i].join(' '));
		return rows.join('\n');
	}

	toLaTeX(): string {
		let str = '\\left[\\begin{array}{' + Array(this.ncol()).fill('r').join('') + '}\n';
		for (let i = 0; i < this.nrow(); i++) str += this._arr[i].map((num) => num.toLaTeX()).join(' & ') + '\\\\\n';
		return str + '\\end{array}\\right]';
	}

	// Returns the column from the vector as a ColumnVector
	column(col: number): ColumnVector {
		if (col < 1) throw new Error('The col input must be positive');
		if (col > this.ncol()) throw new Error('The col input cannot be greater than the number of columns.');

		return new ColumnVector(
			Array(this.nrow())
				.fill(0)
				.map((_, i) => this._arr[i][col - 1])
		);
	}

	setColumn(num: number, col: ColumnVector): Matrix {
		for (let i = 1; i <= this.nrow(); i++) {
			this.setElement(i, num, col.getElement(i, 1));
		}
		return this;
	}

	// Returns the rth row of the Matrix as a Row Vector
	row(r: number): RowVector {
		if (r < 1) throw new Error('The col input must be positive');
		if (r > this.ncol()) throw new Error('The col input cannot be greater than the number of columns.');
		return new RowVector(
			Array(this.ncol())
				.fill(0)
				.map((_, j) => this._arr[r - 1][j])
		);
	}

	setRow(num: number, row: RowVector): Matrix {
		for (let j = 1; j <= this.ncol(); j++) {
			this.setElement(num, j, row.getElement(1, j));
		}
		return this;
	}

	// Add a matrix A to the current matrix.
	plus(A: Matrix): Matrix {
		if (this.nrow() !== A.nrow() || this.ncol() !== A.ncol())
			throw new Error('Matrices are incompatible for addition.');
		const result = new Matrix(this.nrow(), this.ncol());
		for (let i = 1; i <= this.nrow(); i++)
			for (let j = 1; j <= this.ncol(); j++) result.setElement(i, j, this.getElement(i, j).plus(A.getElement(i, j)));
		return result;
	}

	// Add a matrix A to the current matrix.
	minus(A: Matrix): Matrix {
		if (this.nrow() !== A.nrow() || this.ncol() !== A.ncol())
			throw new Error('Matrices are incompatible for subtraction.');
		const result = new Matrix(this.nrow(), this.ncol());
		for (let i = 1; i <= this.nrow(); i++)
			for (let j = 1; j <= this.ncol(); j++) result.setElement(i, j, this.getElement(i, j).minus(A.getElement(i, j)));
		return result;
	}

	// Multiplication by a constant.
	times(c: Constant): Matrix;
	// Multiplication this matrix times the input matrix.
	times(A: Matrix): Matrix;
	times(arg: Constant | Matrix): Matrix {
		const result = new Matrix(this.nrow(), arg instanceof Matrix ? arg.ncol() : this.ncol());
		if (arg instanceof Matrix) {
			if (this.ncol() != arg.nrow()) throw new Error('Matrices are not compatible for multiplication.');
			for (let i = 1; i <= result.nrow(); i++)
				for (let j = 1; j <= result.ncol(); j++) result.setElement(i, j, this.row(i).dot(arg.column(j)));
		} else {
			for (let i = 1; i <= result.nrow(); i++)
				for (let j = 1; j <= result.ncol(); j++) result.setElement(i, j, this.getElement(i, j).times(arg));
		}
		return result;
	}

	transpose(): Matrix {
		const result = new Matrix(this.ncol(), this.nrow());
		for (let i = 1; i <= result.nrow(); i++)
			for (let j = 1; j <= result.ncol(); j++) result.setElement(i, j, this.getElement(j, i));
		return result;
	}

	swapRows(row1: number, row2: number) {
		if (row1 < 1 || row1 > this.nrow() || row2 < 1 || row2 > this.nrow())
			throw new Error('Row numbers must be within the valid rows of this matrix.');
		if (row1 == row2) throw new Error('When swapping rows, the rows must be unique.');
		const r = this.row(row1);
		this.setRow(row1, this.row(row2));
		this.setRow(row2, r);
		return this;
	}

	multiplyRowBy(num: Constant, row: number) {
		this.setRow(row, this.row(row).times(num));
		return this;
	}

	// Takes a linear combination of rows and replaces another row.
	rowCombination(num1: Constant, row1: number, num2: Constant, row2: number, dest_row: number): Matrix {
		if (row1 < 1 || row1 > this.nrow() || row2 < 1 || row2 > this.nrow() || dest_row < 1 || dest_row > this.nrow())
			throw new Error('Row numbers must be within the valid rows of this matrix.');
		if (row1 != dest_row && row2 != dest_row) throw new Error('The destination row must be one of the other two rows.');
		return this.setRow(dest_row, this.row(row1).times(num1).plus(this.row(row2).times(num2)));
	}

	// shortcut for row operations of the form kRi+Rj->Rj
	multiplyRowByAndAdd(num: Constant, row: number, dest_row: number): Matrix {
		return this.rowCombination(num, row, new Integer(1), dest_row, dest_row);
	}

	// Perform a pivot in which the pivot element is a 1.
	pivot(row: number, col: number) {
		if (row < 1 || row > this.nrow())
			throw new Error('The row number for the pivot must be between 1 and the number of rows');
		if (col < 1 || col > this.ncol())
			throw new Error('The column number for the pivot must be between 1 and the number of columns');
		if (this.getElement(row, col).equals(Integer.ZERO)) throw new Error('The pivot element cannot be zero.');
		this.multiplyRowBy(new Integer(1).div(this.getElement(row, col)), row);
		for (let i = 1; i <= this.nrow(); i++) {
			if (i != row) this.multiplyRowByAndAdd(this.getElement(i, col).neg(), row, i);
		}
		return this;
	}

	// Perform a pivot which preserves integers
	pivotPreserveIntegers(row: number, col: number) {
		if (row < 1 || row > this.nrow())
			throw new Error('The row number for the pivot must be between 1 and the number of rows');
		if (col < 1 || col > this.ncol())
			throw new Error('The column number for the pivot must be between 1 and the number of columns');
		if (this.getElement(row, col).equals(Integer.ZERO)) throw new Error('The pivot element cannot be zero.');
		const mult: Integer = this._SMmult ?? new Integer(1);

		if ((this.getElement(row, col) as Integer).compareTo(Integer.ZERO) < 0) this.multiplyRowBy(new Integer(-1), row);
		const m = this.getElement(row, col);

		for (let i = 1; i <= this.nrow(); i++)
			if (i != row)
				this.rowCombination(this.getElement(i, col).neg().div(mult), row, this.getElement(row, col).div(mult), i, i);

		this._SMmult = this.getElement(row, col) as Integer;
		return this;
	}

	addRowToTableau(row: RowVector) {
		const n = this.nrow();
		const m = this.ncol();

		if (row.length() != m + 1)
			throw new Error('The new row in the input box does not contain the same number of elements as the new tableau.');

		// Create a new matrix/tableau that is the previous one with the input
		// put on the second to last row and filled with zeros on the second to last column.
		const mat = new Matrix(n + 1, m + 1);
		for (let i = 1; i < n; i++) {
			for (let j = 1; j < m - 1; j++) mat.setElement(i, j, this.getElement(i, j));
			mat.setElement(i, m, this.getElement(i, m - 1));
			mat.setElement(i, m + 1, this.getElement(i, m));
		}
		mat.setRow(n, row);

		for (let j = 1; j < m - 1; j++) mat.setElement(n + 1, j, this.getElement(n, j));
		mat.setElement(n + 1, m, this.getElement(n, m - 1));
		mat.setElement(n + 1, m + 1, this.getElement(n, m));

		mat.SMmultiplier = this.SMmultiplier;
		return mat;
	}

	// Check that the tableau is all integers and all basic columns are the same multiple
	// of columns of the identity matrix.
	checkTableau(): Matrix {
		let cols = new Array<Integer>(this.nrow() - 1);
		const n = this.ncol();
		const m = this.nrow();
		let max = new Integer(-1);
		for (let j = 1; j <= n; j++) {
			const col = this.column(j);
			let mx = this.getElement(1, j) as Integer;
			let loc = 1;
			for (let i = 1; i <= m; i++) {
				if (!(this.getElement(i, j) instanceof Integer))
					throw new Error('In Simplex Mode, the matrix must be all integers');
				if ((this.getElement(i, j) as Integer).compareTo(mx) > 0) {
					mx = this.getElement(i, j) as Integer;
					loc = i;
				}
			}
			const abs_sum = col.asArray().reduce((m, v) => (v as Integer).abs().plus(m), new Integer(0));

			if (mx.equals(abs_sum))
				if (loc > 0 && cols[loc - 1] == undefined) cols[loc - 1] = mx;
				else
					throw new Error(
						'When use Simplex mode, columns that are multiples of the identity columns cannot be repeated.'
					);
		}
		// remove any undefined elements and sort
		const sorted_cols = cols.filter((v) => v);
		sorted_cols.sort((a, b) => Number(a.value - b.value));
		if (sorted_cols.length === 0) {
			this._SMmult = new Integer(1);
			return this;
		}
		if (sorted_cols[0].value !== sorted_cols.at(-1)?.value)
			throw new Error('When use Simplex mode, columns that are multiples of the identity must have the same multiple.');
		this._SMmult = sorted_cols[0];
		return this;
	}

	// Perform a general operation on the matrix.
	operate(op: MatrixOperation): Matrix {
		const result = this.clone();
		if (op instanceof MultiplyRow) result.multiplyRowBy(op.scalar, op.row);
		else if (op instanceof RowSwap) result.swapRows(op.row1, op.row2);
		else if (op instanceof MultiplyRowAndAdd) result.rowCombination(op.scalar1, op.row1, op.scalar2, op.row2, op.row3);
		else if (op instanceof Pivot) result.pivot(op.row, op.col);
		else if (op instanceof PivotPreserveIntegers) result.pivotPreserveIntegers(op.row, op.col);
		else if (op instanceof AddRowToTableau) return result.addRowToTableau(op.row);
		else throw "This line shouldn't be reached.";
		return result;
	}
}

/* Vectors are Matrices.  ColumnVectors are matrices of size n by 1 and RowVectors are Matrices
of size 1 by n.  */

abstract class Vector extends Matrix {
	abstract length(): number;

	// Return a 1D array of constants.  This strips out column/row form.
	abstract asArray(): Constant[];

	dot(v: RowVector | ColumnVector): Constant {
		let result: Constant = Integer.ZERO;
		if (this.length() != v.length()) throw new Error('The vectors lengths must be equal to take the dot product.');
		const v1 = this.asArray();
		const v2 = v.asArray();
		for (let i = 0; i < v1.length; i++) result = result.plus(v1[i].times(v2[i]));

		return result;
	}
}

export class ColumnVector extends Vector {
	constructor(arg: number[] | bigint[] | Constant[] | (number | bigint | Constant)[]) {
		super(arg.map((el: number | bigint | Constant) => [el]) as number[][] | bigint[][] | Constant[][]);
	}
	length(): number {
		return this.nrow();
	}

	asArray(): Constant[] {
		return Array(this.length())
			.fill(0)
			.map((_, i) => this._arr[i][0]);
	}
}

export class RowVector extends Vector {
	constructor(arg: number[] | bigint[] | Constant[] | (number | bigint | Constant)[]) {
		super([arg] as number[][] | bigint[][] | Constant[][]);
	}

	length(): number {
		return this.ncol();
	}

	asArray(): Constant[] {
		return Array(this.length())
			.fill(0)
			.map((_, j) => this._arr[0][j]);
	}

	// Redefine to return a RowVector
	plus(r: RowVector) {
		return super.plus(r).row(1);
	}

	// Redefine to return a RowVector
	minus(r: RowVector) {
		return super.minus(r).row(1);
	}

	// Redefine to return a RowVector
	times(c: Constant): RowVector;
	times(r: ColumnVector): Matrix;
	times(arg: Constant | ColumnVector): RowVector | Matrix {
		if (arg instanceof Constant) {
			const result = new RowVector(Array(this.length()).fill(0));
			for (let j = 1; j <= result.ncol(); j++) result.setElement(1, j, this.getElement(1, j).times(arg));
			return result;
		} else {
			return super.times(arg);
		}
	}
}
