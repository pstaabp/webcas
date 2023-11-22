import { RealConstant } from './abstract_real';
import { Integer } from './integer';
import { Complex } from './complex';
import { Real } from './real';
import { Parser, constRe } from './parser';
export class Rational extends RealConstant {
    _numer;
    _denom;
    constructor(arg1, arg2, arg3) {
        super();
        let numer = BigInt(0), denom = BigInt(1);
        if (typeof arg1 !== 'string' && arg2 !== undefined) {
            if (!constRe.integer.test(`${arg1}`))
                throw `The number ${arg1} is not an integer.`;
            if (!constRe.integer.test(`${arg2}`))
                throw `The number ${arg2} is not an integer.`;
            numer = arg1 instanceof Integer ? arg1.value : BigInt(arg1);
            denom = arg2 instanceof Integer ? arg2.value : BigInt(arg2);
        }
        else if (typeof arg1 === 'string' && arg2 === undefined) {
            if (!constRe.rational.test(arg1))
                throw arg1 + ' is not a rational number';
            const match = arg1.match(constRe.rational);
            if (match !== null) {
                numer = BigInt(match[1]);
                denom = BigInt(match[2]);
            }
        }
        else {
            throw "Constructor error. Can't combine a string with an other argument. ";
        }
        this._numer = denom < 0 ? -numer : numer;
        this._denom = denom >= 0 ? denom : -denom;
        // reduce the fraction.
        this.reduce();
    }
    get numer() {
        return this._numer;
    }
    get denom() {
        return this._denom;
    }
    simplify() {
        if (this._denom == 1n)
            return new Integer(this._numer);
        if (this._numer == 0n)
            return new Integer(0);
        return this;
    }
    toString() {
        return (this._numer < 0 ? '-' : '') + (this._numer < 0 ? -this._numer : this._numer) + '/' + this._denom;
    }
    toLaTeX() {
        return ((this._numer < 0 ? '-' : '') +
            '\\frac{ ' +
            (this._numer < 0 ? -this._numer : this._numer) +
            '}{' +
            this._denom +
            '}');
    }
    toReal() {
        return new Real(Number(this._numer) / Number(this._denom));
    }
    equals(num) {
        if (num instanceof Rational)
            return num.numer === this._numer && num.denom === this._denom;
        return false;
    }
    clone() {
        return new Rational(this._numer, this._denom);
    }
    // unary negative.
    neg() {
        return new Rational(-1n * this._numer, this._denom);
    }
    plus(arg) {
        const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
        let result;
        if (num instanceof Integer)
            result = new Rational(num.value * this._denom + this._numer, this._denom);
        else if (num instanceof Real)
            result = new Real(num.value + this.toReal().value);
        else if (num instanceof Rational)
            result = new Rational(num.numer * this._denom + num.denom * this._numer, num.denom * this._denom);
        else if (num instanceof Complex)
            result = new Complex(this.plus(num.real), num.imag);
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    minus(arg) {
        const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
        let result;
        if (num instanceof Integer)
            result = new Rational(this._numer - num.value * this._denom, this._denom);
        else if (num instanceof Real)
            result = new Real(this.toReal().value - num.value);
        else if (num instanceof Rational)
            result = new Rational(num.denom * this._numer - num.numer * this._denom, num.denom * this._denom);
        else if (num instanceof Complex)
            result = new Complex(this.minus(num.real), num.imag.times(new Integer(-1)));
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    times(arg) {
        const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
        let result;
        if (num instanceof Integer)
            result = new Rational(num.value * this._numer, this._denom);
        else if (num instanceof Real)
            result = new Real(num.value * this.toReal().value);
        else if (num instanceof Rational)
            result = new Rational(num.numer * this._numer, num.denom * this._denom);
        else if (num instanceof Complex)
            result = new Complex(this.times(num.real), this.times(num.imag));
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    div(arg) {
        const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
        let result;
        if (num instanceof Integer)
            result = new Rational(this.numer, this.denom * num.value);
        else if (num instanceof Real)
            result = new Real(this.toReal().value / num.value);
        else if (num instanceof Rational)
            result = new Rational(this._numer * num.denom, this._denom * num.numer);
        else if (num instanceof Complex) {
            const d = num.real.times(num.real).plus(num.imag.times(num.imag));
            return new Complex(this.times(num.real).div(d), this.times(num.imag).neg().div(d));
        }
        else
            throw new Error('This line should not be reached.');
        return result.simplify();
    }
    // reduce the fraction such that gcd(numer,denom)=1;
    reduce() {
        const c = Integer.gcd(this._numer, this.denom);
        this._numer /= c;
        this._denom /= c;
    }
}
