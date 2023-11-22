import { Parser } from './parser';
import { Constant } from './abstract_constant';
import { RealConstant } from './abstract_real';
import { Complex } from './complex';
import { Rational } from './rational';
import { Real } from './real';

export class Integer extends RealConstant {
	private _value: bigint;
	static ZERO = new Integer(0);

	constructor(arg: number | string | bigint) {
		super();
		// Having trouble loading constRe so will redefine here.
		const intRe = new RegExp('^[-+]?\\d+$');
		if (!intRe.test(`${arg}`)) throw new Error(`${arg} is not an integer`);
		this._value = BigInt(arg);
	}

	toString(): string {
		return `${this._value}`;
	}
	toLaTeX(): string {
		return this.toString();
	}

	get value(): bigint {
		return this._value;
	}

	toReal(): Real {
		return new Real(Number(this._value));
	}

	clone(): Integer {
		return new Integer(this._value);
	}

	equals(num: Constant) {
		if (num instanceof Integer) return this._value === num.value;
		return false;
	}

	simplify() {
		return this;
	}


	neg(): Integer {
		return new Integer(-1n * this._value);
	}

	plus(num: RealConstant): RealConstant;
	plus(num: Complex): Complex;
	plus(str: string): Constant;
	plus(num: Constant): Constant;
	plus(arg: Constant | RealConstant | Complex | string): Constant {
		let num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		let result: Constant;
		if (num instanceof Integer) result = new Integer(num.value + this._value);
		else if (num instanceof Real) result = new Real(num.value + Number(this._value));
		else if (num instanceof Rational) result = new Rational(num.numer + this._value * num.denom, num.denom);
		else if (num instanceof Complex) result = new Complex(this.plus(num.real), num.imag);
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	minus(num: RealConstant): RealConstant;
	minus(num: Complex): Complex;
	minus(str: string): Constant;
	minus(arg: RealConstant | Complex | string): Constant {
		let num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		let result: Constant;
		if (num instanceof Integer) result = new Integer(this._value - num._value);
		else if (num instanceof Real) result = new Real(Number(this._value) - num.value);
		else if (num instanceof Rational) result = new Rational(this._value * num.denom - num.numer, num.denom);
		else if (num instanceof Complex) result = new Complex(this.minus(num.real), num.imag.neg());
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	times(num: RealConstant): RealConstant;
	times(num: Complex): Complex;
	times(str: string): Constant;
	times(arg: RealConstant | Complex | string): Constant {
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		let result: Constant;
		if (num instanceof Integer) result = new Integer(num.value * this._value);
		else if (num instanceof Real) result = new Real(num.value * Number(this._value));
		else if (num instanceof Rational) result = new Rational(num.numer * this._value, num.denom);
		else if (num instanceof Complex) result = new Complex(this.times(num.real), this.times(num.imag));
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	div(num: RealConstant): RealConstant;
	div(num: Complex): Complex;
	div(num: Constant): Constant;
	div(str: string): Constant;
	div(arg: RealConstant | Complex | string | Constant): Constant {
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		let result: Constant;
		// need to test for division by 0.
		if (num instanceof Integer) result = new Rational(this._value, num.value);
		else if (num instanceof Real) result = new Real(Number(this._value) / num.value);
		else if (num instanceof Rational) result = new Rational(num.denom * this._value, num.numer);
		else if (num instanceof Complex) result = new Complex(this, Integer.ZERO).div(num);
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	static gcd(...nums: number[] | bigint[] | Integer[]): bigint {
		// If argments are of type Integer or number, convert to BigInts.
		const values: bigint[] = nums.map((n) => (n instanceof Integer ? n.value : typeof n === 'number' ? BigInt(n) : n));
		if (values.length == 1) {
			return values[0];
		} else if (values.length == 2) {
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
		} else if (values.length % 2 == 0) {
			const arr = Array(values.length / 2).fill(0n);
			for (let i = 0; i < values.length / 2; i++) {
				arr[i] = Integer.gcd(values[2 * i], values[2 * i + 1]);
			}
			return Integer.gcd(...arr);
		} else {
			const v = values.shift();
			return Integer.gcd(v === undefined ? 1n : v, Integer.gcd(...values));
		}
	}
}
