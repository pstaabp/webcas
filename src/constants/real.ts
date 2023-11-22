import { Constant } from './abstract_constant';
import { RealConstant } from './abstract_real';
import { Complex } from './complex';
import { Integer } from './integer';
import { Rational } from './rational';
import { Parser, constRe } from './parser';

export class Real extends RealConstant {
	private _value: number;
	static ZERO = new Real(0);
	constructor(arg: number | string) {
		super();
		if (typeof arg === 'string') {
			if (!constRe.real.test(arg)) throw arg + ' is not a real number';
			this._value = parseFloat(arg);
		} else {
			this._value = arg;
		}
	}

	get value(): number {
		return this._value;
	}

	toReal(): Real {
		return this;
	}

	toString(): string {
		return `${this._value}`;
	}

	toLaTeX(): string {
		return this.toString();
	}

	equals(num: Constant) {
		if (num instanceof Real) return this._value === num.value;
		return false;
	}

	clone(): Real {
		return new Real(this._value);
	}

	simplify() {
		return this;
	}

	neg(): Real {
		return new Real(-1 * this._value);
	}

	plus(num: RealConstant): Real;
	plus(num: Complex): Complex;
	plus(str: string): Real | Complex;
	plus(arg: RealConstant | Complex | string): Real | Complex {
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		if (num instanceof Integer) return new Real(Number(num.value) + this._value);
		else if (num instanceof Real) return new Real(num.value + this._value);
		else if (num instanceof Rational) return new Real(this._value + num.toReal().value);
		else if (num instanceof Complex) return new Complex(num.real.plus(this), num.imag);
		else throw new Error("This line shouldn't be reached.");
	}

	minus(num: RealConstant): Real;
	minus(num: Complex): Complex;
	minus(str: string): Real | Complex;
	minus(arg: RealConstant | Complex | string): Real | Complex {
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		if (num instanceof Integer) return new Real(this._value - Number(num.value));
		else if (num instanceof Real) return new Real(this._value - num.value);
		else if (num instanceof Rational) return new Real(this._value - num.toReal().value);
		else if (num instanceof Complex) return new Complex(this.minus(num.real), num.imag.neg());
		else throw new Error("This line shouldn't be reached.");
	}

	times(num: RealConstant): Real;
	times(num: Complex): Complex;
	times(str: string): Real | Complex;
	times(arg: RealConstant | Complex | string): Real | Complex {
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		if (num instanceof Integer) return new Real(this._value * Number(num.value));
		else if (num instanceof Real) return new Real(this._value * num.value);
		else if (num instanceof Rational) return new Real(this._value * num.toReal().value);
		else if (num instanceof Complex) return new Complex(this.times(num.real), this.times(num.imag));
		else throw new Error("This line shouldn't be reached.");
	}

	div(num: RealConstant): Real;
	div(num: Complex): Complex;
	div(str: string): Real | Complex;
	div(arg: RealConstant | Complex | string): Real | Complex {
		// Need to check for division by zero.
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		if (num instanceof Integer) return new Real(this._value / Number(num.value));
		else if (num instanceof Real) return new Real(this.value / num._value);
		else if (num instanceof Rational) return new Real(this._value / num.toReal().value);
		else if (num instanceof Complex) return new Complex(this, Real.ZERO).div(num);
		else throw new Error("This line shouldn't be reached.");
	}
}
