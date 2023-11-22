import { RealConstant } from '../constants/abstract_real';
import { Integer } from '../constants/integer';
import { Parser, constRe } from '../constants/parser';
const multAndAddRe = /(\(?(-?[\.\d+\/]*)\)?\*?[Rr](\d+)(\+|-))?\(?(-?[\.\d+\/]*)?\)?\*?[Rr](\d+)(->[rR](\d+)(.*))?/;
const swapRe1 = /^S(\d+)(\d+)$/;
const swapRe2 = /^[Rr](\d+)<->[Rr](\d+)$/;
const genfunctRe = /^(\w+)\(([\d/.]+),([\d/.]+)\)$/;
export class RowOperation {
    constructor() { }
    static parse(str) {
        let num1, row1, num2, row2, row3;
        /* First check if the operation is a row swap */
        const result2 = swapRe1.exec(str);
        if (result2 !== null)
            return new RowSwap(parseInt(result2[1]), parseInt(result2[2]));
        const result3 = swapRe2.exec(str);
        if (result3 !== null)
            return new RowSwap(parseInt(result3[1]), parseInt(result3[2]));
        var result = multAndAddRe.exec(str);
        if (result != null) {
            if (result[1] == undefined) {
                // has form 2R2->R2;
                num2 =
                    result[5] === '-'
                        ? new Integer(-1)
                        : result[4] === '-'
                            ? Parser.parseRealConstant(result[5]).neg()
                            : Parser.parseRealConstant(result[5]);
                row2 = parseInt(result[6]);
                row3 = result[8] == undefined ? (row3 = row2) : parseInt(result[8]);
                if (row2 !== row3)
                    throw new Error('The two rows must be the same.');
                return new MultiplyRow(num2, row2);
            }
            num1 =
                result[2] === '' ? new Integer(1) : result[2] === '-' ? new Integer(-1) : Parser.parseRealConstant(result[2]);
            row1 = parseInt(result[3]);
            if (result[5] == undefined || result[5] == '')
                num2 = result[4] == '-' ? new Integer(-1) : new Integer(1);
            else
                num2 = result[4] == '-' ? Parser.parseRealConstant(result[5]).neg() : Parser.parseRealConstant(result[5]);
            row2 = parseInt(result[6]);
            if (result[8] == undefined)
                row3 = row2;
            else
                row3 = parseInt(result[8]);
            return new MultiplyRowAndAdd(num1, row1, num2, row2, row3);
        }
        const resultGen = genfunctRe.exec(str);
        if (resultGen !== null) {
            if (!constRe.pos_int.test(resultGen[2]))
                throw new Error('Row must be a positive integer');
            if (!constRe.pos_int.test(resultGen[3]))
                throw new Error('Column must be a positive integer');
            if (resultGen[1] === 'pivot')
                return new Pivot(parseInt(resultGen[2]), parseInt(resultGen[3]));
            if (resultGen[1] === 'piv')
                return new PivotPreserveIntegers(parseInt(resultGen[2]), parseInt(resultGen[3]));
        }
        throw new Error('Error in Row operation');
    }
}
export class MultiplyRow extends RowOperation {
    _row;
    _scalar;
    constructor(scalar, row) {
        super();
        if (!constRe.pos_int.test(`${row}`))
            throw new Error('Row is not a positive integer.');
        this._row = row;
        this._scalar = scalar;
    }
    get row() {
        return this._row;
    }
    get scalar() {
        return this._scalar;
    }
    toLaTeX() {
        return `${this._scalar.toLaTeX()} R_{${this._row}} \\to R_{${this._row}}`;
    }
}
export class RowSwap extends RowOperation {
    _row1;
    _row2;
    constructor(row1, row2) {
        super();
        if (!constRe.pos_int.test(`${row1}`))
            throw new Error('First row is not a positive integer.');
        if (!constRe.pos_int.test(`${row2}`))
            throw new Error('Second row is not a positive integer.');
        if (row1 === row2)
            throw new Error('The two rows must be different.');
        this._row1 = row1;
        this._row2 = row2;
    }
    get row1() {
        return this._row1;
    }
    get row2() {
        return this._row2;
    }
    toLaTeX() {
        return `R_{${this._row1}} \\leftrightarrow R_{${this._row2}}`;
    }
}
export class MultiplyRowAndAdd extends RowOperation {
    _row1;
    _row2;
    _row3;
    _scalar1;
    _scalar2;
    constructor(num1, row1, num2, row2, row3) {
        super();
        if (!constRe.pos_int.test(`${row1}`))
            throw new Error('First row is not a positive integer.');
        this._row1 = row1;
        this._scalar1 = num1;
        if (typeof num2 === 'number' && row2 === undefined && row3 == undefined) {
            if (!constRe.pos_int.test(`${num2}`))
                throw new Error('Second row is not a positive integer.');
            this._row2 = num2;
            this._scalar2 = new Integer(1);
            this._row3 = this._row2;
        }
        else if (num2 instanceof RealConstant && row2 !== undefined && row3 !== undefined) {
            if (!constRe.pos_int.test(`${row2}`))
                throw new Error('Second row is not a positive integer.');
            if (!constRe.pos_int.test(`${row3}`))
                throw new Error('Third row is not a positive integer.');
            if (!(row3 == row1 || row3 == row2))
                throw new Error('Third row must be either first or second row.');
            this._row2 = row2;
            this._row3 = row3;
            this._scalar2 = num2;
        }
        else {
            throw new Error("you shouldn't have reached this line");
        }
        if (this._row1 == this._row2)
            throw new Error('The first two rows input must be different.');
    }
    get row1() {
        return this._row1;
    }
    get row2() {
        return this._row2;
    }
    get row3() {
        return this._row3;
    }
    get scalar1() {
        return this._scalar1;
    }
    get scalar2() {
        return this._scalar2;
    }
    toLaTeX() {
        const r1 = (this._scalar1 instanceof Integer && this._scalar1.value == -1n
            ? '-'
            : this._scalar1 instanceof Integer && this._scalar1.value == 1n
                ? ''
                : `${this._scalar1.toLaTeX()}`) + ` R_{${this._row1}}`;
        const op = this._scalar2.compareTo(Integer.ZERO) < 0 ? '-' : '+';
        const scal2 = op === '-' ? this._scalar2.neg() : this._scalar2.clone();
        const scal3 = scal2.equals(new Integer(1)) ? '' : scal2;
        return `${r1} ${op} ${scal3}R_{${this._row2}} \\to R_{${this._row3}}`;
    }
}
export class Pivot extends RowOperation {
    _row;
    _col;
    constructor(row, col) {
        super();
        if (!constRe.pos_int.test(`${row}`))
            throw new Error('Row is not a positive integer.');
        if (!constRe.pos_int.test(`${col}`))
            throw new Error('Column is not a positive integer.');
        this._row = row;
        this._col = col;
    }
    get row() {
        return this._row;
    }
    get col() {
        return this._col;
    }
    toString() {
        return `pivot(${this._row},${this._col})`;
    }
    toLaTeX() {
        return `\\text{pivot}(${this._row},${this._col})`;
    }
}
export class PivotPreserveIntegers extends RowOperation {
    _row;
    _col;
    constructor(row, col) {
        super();
        if (!constRe.pos_int.test(`${row}`) || row == 0)
            throw new Error('Row must be a positive integer.');
        if (!constRe.pos_int.test(`${col}`) || col == 0)
            throw new Error('Column must be a positive integer.');
        this._row = row;
        this._col = col;
    }
    get row() {
        return this._row;
    }
    get col() {
        return this._col;
    }
    toString() {
        return `piv(${this._row},${this._col})`;
    }
    toLaTeX() {
        return `\\text{piv}(${this._row},${this._col})`;
    }
}