import { Parser } from './parser';
import { RealConstant } from './abstract_real';
import { Complex } from './complex';
import { Rational } from './rational';
import { Real } from './real';
export class Integer extends RealConstant {
    _value;
    static ZERO = new Integer(0);
    constructor(arg) {
        super();
        // Having trouble loading constRe so will redefine here.
        const intRe = new RegExp('^[-+]?\\d+$');
        if (!intRe.test(`${arg}`))
            throw new Error(`${arg} is not an integer`);
        this._value = BigInt(arg);
    }
    toString() {
        return `${this._value}`;
    }
    toLaTeX() {
        return this.toString();
    }
    get value() {
        return this._value;
    }
    toReal() {
        return new Real(Number(this._value));
    }
    clone() {
        return new Integer(this._value);
    }
    equals(num) {
        if (num instanceof Integer)
            return this._value === num.value;
        return false;
    }
    simplify() {
        return this;
    }
    neg() {
        return new Integer(-1n * this._value);
    }
    plus(arg) {
        let num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
        let result;
        if (num instanceof Integer)
            result = new Integer(num.value + this._value);
        else if (num instanceof Real)
            result = new Real(num.value + Number(this._value));
        else if (num instanceof Rational)
            result = new Rational(num.numer + this._value * num.denom, num.denom);
        else if (num instanceof Complex)
            result = new Complex(this.plus(num.real), num.imag);
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    minus(arg) {
        let num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
        let result;
        if (num instanceof Integer)
            result = new Integer(this._value - num._value);
        else if (num instanceof Real)
            result = new Real(Number(this._value) - num.value);
        else if (num instanceof Rational)
            result = new Rational(this._value * num.denom - num.numer, num.denom);
        else if (num instanceof Complex)
            result = new Complex(this.minus(num.real), num.imag.neg());
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    times(arg) {
        const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
        let result;
        if (num instanceof Integer)
            result = new Integer(num.value * this._value);
        else if (num instanceof Real)
            result = new Real(num.value * Number(this._value));
        else if (num instanceof Rational)
            result = new Rational(num.numer * this._value, num.denom);
        else if (num instanceof Complex)
            result = new Complex(this.times(num.real), this.times(num.imag));
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    div(arg) {
        const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
        let result;
        // need to test for division by 0.
        if (num instanceof Integer)
            result = new Rational(this._value, num.value);
        else if (num instanceof Real)
            result = new Real(Number(this._value) / num.value);
        else if (num instanceof Rational)
            result = new Rational(num.denom * this._value, num.numer);
        else if (num instanceof Complex)
            result = new Complex(this, Integer.ZERO).div(num);
        else
            throw new Error("This line shouldn't be reached.");
        return result.simplify();
    }
    static gcd(...nums) {
        // If argments are of type Integer or number, convert to BigInts.
        const values = nums.map((n) => (n instanceof Integer ? n.value : typeof n === 'number' ? BigInt(n) : n));
        if (values.length == 1) {
            return values[0];
        }
        else if (values.length == 2) {
            let a = values[0] < 0 ? -values[0] : values[0];
            let b = values[1] < 0 ? -values[1] : values[1];
            if (a < b) {
                const t = a;
                a = b;
                b = t;
            }
            while (b !== 0n) {
                const t = a % b;
                a = b;
                b = t;
            }
            return a;
        }
        else if (values.length % 2 == 0) {
            const arr = Array(values.length / 2).fill(0n);
            for (let i = 0; i < values.length / 2; i++) {
                arr[i] = Integer.gcd(values[2 * i], values[2 * i + 1]);
            }
            return Integer.gcd(...arr);
        }
        else {
            const v = values.shift();
            return Integer.gcd(v === undefined ? 1n : v, Integer.gcd(...values));
        }
    }
}
