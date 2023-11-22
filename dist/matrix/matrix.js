import { Constant } from '../constants/abstract_constant';
import { Integer } from '../constants/integer';
import { Parser } from '../constants/parser';
/* Matrix class that supports standard matrix operations */
export class Matrix {
    _arr;
    _SMmult;
    constructor(arg1, arg2) {
        this._arr = new Array();
        if (typeof arg1 == 'number' && typeof arg2 === 'number') {
            // Check that arg1 and arg2 are positive integers.
            for (let i = 0; i < arg1; i++) {
                this._arr[i] = new Array();
                for (let j = 0; j < arg2; j++)
                    this._arr[i][j] = new Integer(0);
            }
        }
        else if (typeof arg1 === 'string') {
            // New RegEx location, handles standard and LaTeX
            let str = arg1
                .replace(/\s*&\s*/g, ' ')
                .replace(/\\\\/g, '')
                .replace(/\n/g, ';')
                .replace(/;*$/, '')
                .replace(/\\hline/g, '');
            const m = /(.*);\s*$/.exec(str);
            if (m && m[1] != undefined)
                str = m[1];
            const s = str.split(';');
            for (let i = 0; i < s.length; i++) {
                const s2 = s[i].split(/\s+/);
                var row = new Array();
                for (let j = 0; j < s2.length; j++) {
                    if (s2[j] != '')
                        row[row.length] = Parser.parseConstant(s2[j]);
                }
                this._arr[i] = row;
            }
        }
        else if (Array.isArray(arg1)) {
            for (let i = 0; i < arg1.length; i++) {
                this._arr[i] = arg1[i].map((el) => (el instanceof Constant ? el : Parser.parseConstant(`${el}`)));
            }
        }
        for (let i = 1; i < this._arr.length; i++) {
            if (this._arr[0].length != this._arr[i].length) {
                throw 'Error in constructing matrix.  Each row must be the same length.';
            }
        }
    }
    // number of rows in the matrix.
    nrow() {
        return this._arr.length;
    }
    // number of columns in the matrix.
    ncol() {
        return this._arr[0].length;
    }
    equals(m) {
        if (m.ncol() != this.ncol())
            return false;
        if (m.nrow() != this.nrow())
            return false;
        for (let i = 1; i <= this._arr.length; i++)
            for (let j = 1; j <= this._arr[0].length; j++)
                if (!this.getElement(i, j).equals(m.getElement(i, j)))
                    return false;
        return true;
    }
    setElement(row, col, value) {
        if (row < 1)
            throw new Error('The row input must be positive');
        if (row > this.nrow())
            throw new Error('The row input cannot be greater than the number of rows.');
        if (col < 1)
            throw new Error('The row input must be positive');
        if (col > this.ncol())
            throw new Error('The col input cannot be greater than the number of columns.');
        if (typeof value === 'number' || typeof value === 'bigint' || typeof value === 'string')
            this._arr[row - 1][col - 1] = Parser.parseConstant(`${value}`);
        else
            this._arr[row - 1][col - 1] = value;
        return this;
    }
    getElement(row, col) {
        if (row < 1)
            throw new Error('The row input must be positive');
        if (row > this.nrow())
            throw new Error('The row input cannot be greater than the number of rows.');
        if (col < 1)
            throw new Error('The row input must be positive');
        if (col > this.ncol())
            throw new Error('The col input cannot be greater than the number of columns.');
        return this._arr[row - 1][col - 1];
    }
    clone() {
        const m = new Matrix(this._arr.length, this._arr[0].length);
        for (let i = 1; i <= this._arr.length; i++)
            for (let j = 1; j <= this._arr[0].length; j++)
                m.setElement(i, j, this.getElement(i, j).clone());
        return m;
    }
    toString() {
        const rows = [];
        for (let i = 0; i < this._arr.length; i++)
            rows.push(this._arr[i].join(' '));
        return rows.join('\n');
    }
    // Returns the column from the vector as a ColumnVector
    column(col) {
        if (col < 1)
            throw new Error('The col input must be positive');
        if (col > this.ncol())
            throw new Error('The col input cannot be greater than the number of columns.');
        return new ColumnVector(Array(this.nrow())
            .fill(0)
            .map((_, i) => this._arr[i][col - 1]));
    }
    setColumn(num, col) {
        for (let i = 1; i <= this.nrow(); i++) {
            this.setElement(i, num, col.getElement(i, 1));
        }
        return this;
    }
    // Returns the rth row of the Matrix as a Row Vector
    row(r) {
        if (r < 1)
            throw new Error('The col input must be positive');
        if (r > this.ncol())
            throw new Error('The col input cannot be greater than the number of columns.');
        return new RowVector(Array(this.ncol())
            .fill(0)
            .map((_, j) => this._arr[r - 1][j]));
    }
    setRow(num, row) {
        for (let j = 1; j <= this.ncol(); j++) {
            this.setElement(num, j, row.getElement(1, j));
        }
        return this;
    }
    // Add a matrix A to the current matrix.
    plus(A) {
        if (this.nrow() !== A.nrow() || this.ncol() !== A.ncol())
            throw new Error('Matrices are incompatible for addition.');
        const result = new Matrix(this.nrow(), this.ncol());
        for (let i = 1; i <= this.nrow(); i++)
            for (let j = 1; j <= this.ncol(); j++)
                result.setElement(i, j, this.getElement(i, j).plus(A.getElement(i, j)));
        return result;
    }
    // Add a matrix A to the current matrix.
    minus(A) {
        if (this.nrow() !== A.nrow() || this.ncol() !== A.ncol())
            throw new Error('Matrices are incompatible for subtraction.');
        const result = new Matrix(this.nrow(), this.ncol());
        for (let i = 1; i <= this.nrow(); i++)
            for (let j = 1; j <= this.ncol(); j++)
                result.setElement(i, j, this.getElement(i, j).minus(A.getElement(i, j)));
        return result;
    }
    times(arg) {
        const result = new Matrix(this.nrow(), arg instanceof Matrix ? arg.ncol() : this.ncol());
        if (arg instanceof Matrix) {
            if (this.ncol() != arg.nrow())
                throw new Error('Matrices are not compatible for multiplication.');
            for (let i = 1; i <= result.nrow(); i++)
                for (let j = 1; j <= result.ncol(); j++)
                    result.setElement(i, j, this.row(i).dot(arg.column(j)));
        }
        else {
            for (let i = 1; i <= result.nrow(); i++)
                for (let j = 1; j <= result.ncol(); j++)
                    result.setElement(i, j, this.getElement(i, j).times(arg));
        }
        return result;
    }
    transpose() {
        const result = new Matrix(this.ncol(), this.nrow());
        for (let i = 1; i <= result.nrow(); i++)
            for (let j = 1; j <= result.ncol(); j++)
                result.setElement(i, j, this.getElement(j, i));
        return result;
    }
    swapRows(row1, row2) {
        const result = this.clone();
        if (row1 < 1 || row1 > this.nrow() || row2 < 1 || row2 > this.nrow())
            throw new Error('Row numbers must be within the valid rows of this matrix.');
        if (row1 == row2)
            throw new Error('When swapping rows, the rows must be unique.');
        const r = result.row(row1);
        result.setRow(row1, result.row(row2));
        result.setRow(row2, r);
        return result;
    }
    multiplyRowBy(num, row) {
        this.setRow(row, this.row(row).times(num));
        return this;
    }
    // Takes a linear combination of rows and replaces another row.
    rowCombination(num1, row1, num2, row2, dest_row) {
        if (row1 < 1 || row1 > this.nrow() || row2 < 1 || row2 > this.nrow() || dest_row < 1 || dest_row > this.nrow())
            throw new Error('Row numbers must be within the valid rows of this matrix.');
        if (row1 != dest_row && row2 != dest_row)
            throw new Error('The destination row must be one of the other two rows.');
        return this.setRow(dest_row, this.row(row1).times(num1).plus(this.row(row2).times(num2)));
    }
    // shortcut for row operations of the form kRi+Rj->Rj
    multiplyRowByAndAdd(num, row, dest_row) {
        return this.rowCombination(num, row, new Integer(1), dest_row, dest_row);
    }
    // Perform a pivot in which the pivot element is a 1.
    pivot(row, col) {
        if (row < 1 || row > this.nrow())
            throw new Error('The row number for the pivot must be between 1 and the number of rows');
        if (col < 1 || col > this.ncol())
            throw new Error('The column number for the pivot must be between 1 and the number of columns');
        if (this.getElement(row, col).equals(Integer.ZERO))
            throw new Error('The pivot element cannot be zero.');
        this.multiplyRowBy(new Integer(1).div(this.getElement(row, col)), row);
        for (let i = 1; i <= this.nrow(); i++) {
            if (i != row)
                this.multiplyRowByAndAdd(this.getElement(i, col).neg(), row, i);
        }
        return this;
    }
    // Perform a pivot which preserves integers
    pivotPreserveIntegers(row, col) {
        if (this.getElement(row, col).compareTo(Integer.ZERO) < 0)
            this.multiplyRowBy(new Integer(-1), row);
        const m = this.getElement(row, col);
        for (let j = 1; j <= this.nrow(); j++)
            if (j != row)
                this.rowCombination(this.getElement(j, col).neg(), row, this.getElement(row, col), j, j);
        return this;
    }
}
/* Vectors are Matrices.  ColumnVectors are matrices of size n by 1 and RowVectors are Matrices
of size 1 by n.  */
class Vector extends Matrix {
    dot(v) {
        let result = Integer.ZERO;
        if (this.length() != v.length())
            throw new Error('The vectors lengths must be equal to take the dot product.');
        const v1 = this.asArray();
        const v2 = v.asArray();
        for (let i = 0; i < v1.length; i++)
            result = result.plus(v1[i].times(v2[i]));
        return result;
    }
}
export class ColumnVector extends Vector {
    constructor(arg) {
        super(arg.map((el) => [el]));
    }
    length() {
        return this.nrow();
    }
    asArray() {
        return Array(this.length())
            .fill(0)
            .map((_, i) => this._arr[i][0]);
    }
}
export class RowVector extends Vector {
    constructor(arg) {
        super([arg]);
    }
    length() {
        return this.ncol();
    }
    asArray() {
        return Array(this.length())
            .fill(0)
            .map((_, j) => this._arr[0][j]);
    }
    // Redefine to return a RowVector
    plus(r) {
        return super.plus(r).row(1);
    }
    // Redefine to return a RowVector
    minus(r) {
        return super.minus(r).row(1);
    }
    times(arg) {
        if (arg instanceof Constant) {
            const result = new RowVector(Array(this.length()).fill(0));
            for (let j = 1; j <= result.ncol(); j++)
                result.setElement(1, j, this.getElement(1, j).times(arg));
            return result;
        }
        else {
            return super.times(arg);
        }
    }
}
