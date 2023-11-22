import { Constant } from './abstract_constant';
import { Integer } from './integer';
import { Real } from './real';
import { Rational } from './rational';
import { Parser, constRe } from './parser';
export class Complex extends Constant {
    _real;
    _imag;
    constructor(arg1, arg2) {
        super();
        this._real = new Integer(0);
        this._imag = new Integer(0);
        if (typeof arg1 === 'string' && arg2 == undefined) {
            if (!constRe.complex.test(arg1))
                throw arg1 + ' is not a complex number';
            const match = arg1.match(constRe.complex);
            if (match) {
                this._real = Parser.parseRealConstant(match[2]);
                this._imag = Parser.parseRealConstant(match[4]);
            }
            if (match != undefined && match[3] == '-')
                this._imag.times('-1');
        }
        else {
            if (arg1 instanceof Integer || arg1 instanceof Real || arg1 instanceof Rational) {
                this._real = arg1;
            }
            else {
                this._real = Parser.parseRealConstant(`${arg1}`);
            }
            if (arg2 instanceof Integer || arg2 instanceof Real || arg2 instanceof Rational) {
                this._imag = arg2;
            }
            else {
                this._imag = Parser.parseRealConstant(`${arg2}`);
            }
        }
    }
    get real() {
        return this._real;
    }
    get imag() {
        return this._imag;
    }
    toString() {
        return `${this._real}+${this._imag}i`;
    }
    toLaTeX() {
        return this.toString();
    }
    equals(num) {
        if (num instanceof Complex) {
            return num.real.equals(this._real) && num.imag.equals(this._imag);
        }
        return false;
    }
    simplify() {
        return new Complex(this._real.simplify(), this._imag.simplify());
    }
    clone() {
        return new Complex(this._real, this._imag);
    }
    neg() {
        return new Complex(this._real.neg(), this._imag.neg());
    }
    plus(num) {
        if (typeof num === 'string')
            return this.plus(Parser.parseConstant(num));
        let result;
        if (num instanceof Integer || num instanceof Real || num instanceof Rational)
            result = new Complex(this.real.plus(num), this.imag.plus(num));
        else if (num instanceof Complex)
            result = new Complex(this.real.plus(num.real), this.imag.plus(num.imag));
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    minus(num) {
        let result;
        if (num instanceof Integer)
            result = new Complex(this._real.minus(num), this._imag);
        else if (num instanceof Real)
            result = new Complex(this._real.minus(num), this._imag);
        else if (num instanceof Rational)
            result = new Complex(this._real.minus(num), this._imag);
        else if (num instanceof Complex)
            result = new Complex(this._real.minus(num.real), this._imag.minus(num.imag));
        else if (typeof num === 'string')
            result = this.minus(Parser.parseConstant(num));
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    times(num) {
        let result;
        if (num instanceof Integer)
            result = new Complex(this._real.times(num), this._imag.times(num));
        else if (num instanceof Real)
            result = new Complex(this._real.times(num), this._imag.times(num));
        else if (num instanceof Rational)
            result = new Complex(this._real.times(num), this._imag.times(num));
        else if (num instanceof Complex)
            result = new Complex(num.real.times(this._real).minus(num.imag.times(this.imag)), num.imag.times(this._real).plus(num.real.times(this._imag)));
        else if (typeof num === 'string')
            result = this.times(Parser.parseConstant(num));
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    div(num) {
        let result;
        if (num instanceof Integer)
            result = new Complex(this._real.div(num), this._imag.div(num));
        else if (num instanceof Real)
            result = new Complex(this._real.div(num), this._imag.div(num));
        else if (num instanceof Rational)
            result = new Complex(this._real.div(num), this._imag.div(num));
        else if (num instanceof Complex) {
            const denom = num.real.times(num.real).plus(num.imag.times(num.imag));
            result = new Complex(this.real.times(num.real).plus(this.imag.times(num.imag)).div(denom), this.imag.times(num.real).minus(this.real.times(num.imag)).div(denom));
        }
        else if (typeof num === 'string')
            result = this.div(Parser.parseConstant(num));
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    // conjugate
    conj() {
        return new Complex(this._real, this._imag.neg());
    }
}