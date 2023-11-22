"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Real = void 0;
const abstract_real_1 = require("./abstract_real");
const complex_ts_1 = require("./complex.ts");
const integer_ts_1 = require("./integer.ts");
const rational_ts_1 = require("./rational.ts");
const parser_1 = require("./parser");
class Real extends abstract_real_1.RealConstant {
    constructor(arg) {
        super();
        if (typeof arg === 'string') {
            if (!parser_1.constRe.real.test(arg))
                throw arg + ' is not a real number';
            this._value = parseFloat(arg);
        }
        else {
            this._value = arg;
        }
    }
    get value() {
        return this._value;
    }
    toReal() {
        return this;
    }
    toString() {
        return `${this._value}`;
    }
    toLaTeX() {
        return this.toString();
    }
    equals(num) {
        if (num instanceof Real)
            return this._value === num.value;
        return false;
    }
    clone() {
        return new Real(this._value);
    }
    simplify() {
        return this;
    }
    neg() {
        return new Real(-1 * this._value);
    }
    plus(arg) {
        const num = typeof arg === 'string' ? parser_1.Parser.parseConstant(arg) : arg;
        if (num instanceof integer_ts_1.Integer)
            return new Real(Number(num.value) + this._value);
        else if (num instanceof Real)
            return new Real(num.value + this._value);
        else if (num instanceof rational_ts_1.Rational)
            return new Real(this._value + num.toReal().value);
        else if (num instanceof complex_ts_1.Complex)
            return new complex_ts_1.Complex(num.real.plus(this), num.imag);
        else
            throw new Error("This line shouldn't be reached.");
    }
    minus(arg) {
        const num = typeof arg === 'string' ? parser_1.Parser.parseConstant(arg) : arg;
        if (num instanceof integer_ts_1.Integer)
            return new Real(this._value - Number(num.value));
        else if (num instanceof Real)
            return new Real(this._value - num.value);
        else if (num instanceof rational_ts_1.Rational)
            return new Real(this._value - num.toReal().value);
        else if (num instanceof complex_ts_1.Complex)
            return new complex_ts_1.Complex(this.minus(num.real), num.imag.neg());
        else
            throw new Error("This line shouldn't be reached.");
    }
    times(arg) {
        const num = typeof arg === 'string' ? parser_1.Parser.parseConstant(arg) : arg;
        if (num instanceof integer_ts_1.Integer)
            return new Real(this._value * Number(num.value));
        else if (num instanceof Real)
            return new Real(this._value * num.value);
        else if (num instanceof rational_ts_1.Rational)
            return new Real(this._value * num.toReal().value);
        else if (num instanceof complex_ts_1.Complex)
            return new complex_ts_1.Complex(this.times(num.real), this.times(num.imag));
        else
            throw new Error("This line shouldn't be reached.");
    }
    div(arg) {
        // Need to check for division by zero.
        const num = typeof arg === 'string' ? parser_1.Parser.parseConstant(arg) : arg;
        if (num instanceof integer_ts_1.Integer)
            return new Real(this._value / Number(num.value));
        else if (num instanceof Real)
            return new Real(this.value / num._value);
        else if (num instanceof rational_ts_1.Rational)
            return new Real(this._value / num.toReal().value);
        else if (num instanceof complex_ts_1.Complex)
            return new complex_ts_1.Complex(this, Real.ZERO).div(num);
        else
            throw new Error("This line shouldn't be reached.");
    }
}
exports.Real = Real;
Real.ZERO = new Real(0);
