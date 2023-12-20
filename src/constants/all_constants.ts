
import { Expression } from '../expressions/abstract_expression';
import { Parser, constRe } from './constant_parser';
import { Parser as ConstantParser } from './constant_parser';

// Constant Expression

export abstract class ConstantExpression extends Expression {
	static plus(num1: RealConstant, num2: Complex): Complex;
	static plus(num1: Complex, num2: RealConstant): Complex;
	static plus(num1: Complex, num2: Complex): Complex;
	static plus(num1: RealConstant, num2: RealConstant): RealConstant;
	static plus(num1: RealConstant, num2: RealConstantExpression): RealConstantExpression;
	static plus(num1: RealConstantExpression, num2: RealConstant): RealConstantExpression;
	static plus(num1: ConstantExpression, num2: ComplexConstantExpression): ComplexConstantSum;
	static plus(num1: ComplexConstantExpression, num2: ConstantExpression): ComplexConstantSum;
	static plus(num1: ConstantExpression | Constant, num2: ConstantExpression | Constant): Constant | ConstantExpression {
		if (num1 instanceof RealConstant && num2 instanceof RealConstant) return num1.plus(num2);
		else if (num1 instanceof RealConstant && num2 instanceof Complex) return num1.plus(num2);
		else if (num2 instanceof RealConstant && num1 instanceof Complex) return num1.plus(num2);
		else if (num1 instanceof Complex && num2 instanceof Complex) return num1.plus(num2);
		else if (
			(num1 instanceof RealConstant || num2 instanceof RealConstantExpression) &&
			(num2 instanceof RealConstant || num1 instanceof RealConstantExpression)
		)
			return new RealConstantSum(num1, num2);
		else return new ComplexConstantSum(num1, num2);
	}

	static minus(num1: RealConstant, num2: Complex): Complex;
	static minus(num1: Complex, num2: RealConstant): Complex;
	static minus(num1: Complex, num2: Complex): Complex;
	static minus(num1: RealConstant, num2: RealConstant): RealConstant;
	static minus(num1: RealConstant, num2: RealConstantExpression): RealConstantExpression;
	static minus(num1: RealConstantExpression, num2: RealConstant): RealConstantExpression;
	static minus(num1: ConstantExpression, num2: ComplexConstantExpression): ComplexConstantDifference;
	static minus(num1: ComplexConstantExpression, num2: ConstantExpression): ComplexConstantDifference;
	static minus(num1: ConstantExpression | Constant, num2: ConstantExpression | Constant) {
		if (num1 instanceof RealConstant && num2 instanceof RealConstant) return num1.minus(num2);
		else if (num1 instanceof RealConstant && num2 instanceof Complex) return num1.minus(num2);
		else if (num2 instanceof RealConstant && num1 instanceof Complex) return num1.minus(num2);
		else if (num1 instanceof Complex && num2 instanceof Complex) return num1.minus(num2);
		else if (
			(num1 instanceof RealConstant || num2 instanceof RealConstantExpression) &&
			(num2 instanceof RealConstant || num1 instanceof RealConstantExpression)
		)
			return new RealConstantDifference(num1, num2);
		else return new ComplexConstantDifference(num1, num2);
	}

	static times(num1: RealConstant, num2: Complex): Complex;
	static times(num1: Complex, num2: RealConstant): Complex;
	static times(num1: Complex, num2: Complex): Complex;
	static times(num1: RealConstant, num2: RealConstant): RealConstant;
	static times(num1: RealConstant, num2: RealConstantExpression): RealConstantExpression;
	static times(num1: RealConstantExpression, num2: RealConstant): RealConstantExpression;
	static times(num1: ConstantExpression, num2: ComplexConstantExpression): ComplexConstantSum;
	static times(num1: ComplexConstantExpression, num2: ConstantExpression): ComplexConstantSum;
	static times(num1: ConstantExpression | Constant, num2: ConstantExpression | Constant) {
		if (num1 instanceof RealConstant && num2 instanceof RealConstant) return num1.times(num2);
		else if (num1 instanceof RealConstant && num2 instanceof Complex) return num1.times(num2);
		else if (num2 instanceof RealConstant && num1 instanceof Complex) return num1.times(num2);
		else if (num1 instanceof Complex && num2 instanceof Complex) return num1.times(num2);
		else if (
			(num1 instanceof RealConstant || num2 instanceof RealConstantExpression) &&
			(num2 instanceof RealConstant || num1 instanceof RealConstantExpression)
		)
			return new RealConstantProduct(num1, num2);
		else return new ComplexConstantProduct(num1, num2);
	}

	static div(num1: RealConstant, num2: Complex): Complex;
	static div(num1: Complex, num2: RealConstant): Complex;
	static div(num1: Complex, num2: Complex): Complex;
	static div(num1: RealConstant, num2: RealConstant): RealConstant;
	static div(num1: RealConstant, num2: RealConstantExpression): RealConstantExpression;
	static div(num1: RealConstantExpression, num2: RealConstant): RealConstantExpression;
	static div(num1: ConstantExpression, num2: ComplexConstantExpression): ComplexConstantSum;
	static div(num1: ComplexConstantExpression, num2: ConstantExpression): ComplexConstantSum;
	static div(num1: ConstantExpression, num2: ConstantExpression) {
		if (num1 instanceof RealConstant && num2 instanceof RealConstant) return num1.div(num2);
		else if (num1 instanceof RealConstant && num2 instanceof Complex) return num1.div(num2);
		else if (num2 instanceof RealConstant && num1 instanceof Complex) return num1.div(num2);
		else if (num1 instanceof Complex && num2 instanceof Complex) return num1.div(num2);
		else if (
			(num1 instanceof RealConstant || num2 instanceof RealConstantExpression) &&
			(num2 instanceof RealConstant || num1 instanceof RealConstantExpression)
		)
			return new RealConstantQuotient(num1, num2);
		else return new ComplexConstantQuotient(num1, num2);
	}

	abstract plus(num: ConstantExpression): ConstantExpression;
	abstract minus(num: ConstantExpression): ConstantExpression;
	abstract times(num: ConstantExpression): ConstantExpression;
	abstract div(num: ConstantExpression): ConstantExpression;
	abstract simplify(): ConstantExpression;
	abstract neg(): ConstantExpression;
	abstract equals(expr: Expression): boolean;
}

// Constant

export abstract class Constant extends ConstantExpression {
	abstract toString(): string;
	abstract toLaTeX(): string;
	static ZERO: Constant;
	abstract equals(num: Constant): boolean;
	abstract clone(): Constant;
	abstract simplify(): Constant;
	abstract plus(num: Constant | string): Constant;
	abstract minus(num: Constant | string): Constant;
	abstract times(num: Constant | string): Constant;
	abstract div(num: Constant | string): Constant;
	abstract neg(): Constant; // unary minus.
}

// RealConstantExpression and subclasses

export abstract class RealConstantExpression extends ConstantExpression {}

export abstract class RealConstantBinaryExpression extends RealConstantExpression {
	protected _left: RealConstant | RealConstantExpression;
	protected _right: RealConstant | RealConstantExpression;

	constructor(arg1: RealConstant | RealConstantExpression, arg2: RealConstant | RealConstantExpression) {
		super();
		this._left = arg1;
		this._right = arg2;
	}

	get left() {
		return this._left;
	}
	get right() {
		return this._right;
	}

	plus(
		arg: string | RealConstant | Complex | RealConstantExpression | ComplexConstantExpression
	): RealConstant | Complex | RealConstantSum | ComplexConstantSum {
		const num = typeof arg === 'string' ? ConstantParser.parseConstant(arg) : arg;
		return ConstantExpression.plus(this, num);
	}
	minus(
		arg: string | RealConstant | Complex | RealConstantExpression | ComplexConstantExpression
	): RealConstant | Complex | RealConstantDifference | ComplexConstantDifference {
		const num = typeof arg === 'string' ? ConstantParser.parseConstant(arg) : arg;
		return ConstantExpression.minus(this, num);
	}

	times(
		arg: string | RealConstant | Complex | RealConstantExpression | ComplexConstantExpression
	): Constant | ConstantExpression {
		const num = typeof arg === 'string' ? ConstantParser.parseConstant(arg) : arg;
		return ConstantExpression.times(this, num);
	}
	div(
		arg: string | RealConstant | Complex | RealConstantExpression | ComplexConstantExpression
	): Constant | ConstantExpression {
		const num = typeof arg === 'string' ? ConstantParser.parseConstant(arg) : arg;
		return ConstantExpression.div(this, num);
	}

	abstract simplify(): RealConstantExpression | RealConstant;
	neg(): RealConstantProduct {
		return new RealConstantProduct(new Integer(-1), this);
	}
}

// RealConstantSum

export class RealConstantSum extends RealConstantBinaryExpression {
	constructor(arg1: RealConstant | RealConstantExpression, arg2: RealConstant | RealConstantExpression) {
		super(arg1, arg2);
	}

	toString(): string {
		return `(${this._left})+(${this._right})`;
	}
	toLaTeX(): string {
		return this.toString();
	}
	equals(expr: Expression) {
		return (
			expr instanceof RealConstantSum &&
			this._left.equals((expr as RealConstantSum).left) &&
			this._right.equals((expr as RealConstantSum).right)
		);
	}

	simplify() {
		return this;
	}

	clone() {
		return new RealConstantSum(this._left, this._right);
	}
}

export class RealConstantDifference extends RealConstantBinaryExpression {
	constructor(arg1: RealConstant | RealConstantExpression, arg2: RealConstant | RealConstantExpression) {
		super(arg1, arg2);
	}

	toString(): string {
		return `(${this._left})-(${this._right})`;
	}
	toLaTeX(): string {
		return this.toString();
	}
	equals(expr: Expression) {
		return (
			expr instanceof RealConstantDifference &&
			this._left.equals((expr as RealConstantDifference).left) &&
			this._right.equals((expr as RealConstantDifference).right)
		);
	}

	simplify() {
		return this;
	}

	clone() {
		return new RealConstantDifference(this._left, this._right);
	}
}

export class RealConstantProduct extends RealConstantBinaryExpression {
	constructor(arg1: RealConstant | RealConstantExpression, arg2: RealConstant | RealConstantExpression) {
		super(arg1, arg2);
	}

	toString(): string {
		return `(${this._left})(${this._right})`;
	}
	toLaTeX(): string {
		return this.toString();
	}
	equals(expr: Expression) {
		return (
			expr instanceof RealConstantProduct &&
			this._left.equals((expr as RealConstantProduct).left) &&
			this._right.equals((expr as RealConstantProduct).right)
		);
	}

	simplify() {
		return this;
	}

	clone() {
		return new RealConstantProduct(this._left, this._right);
	}
}
export class RealConstantQuotient extends RealConstantBinaryExpression {
	constructor(arg1: RealConstant | RealConstantExpression, arg2: RealConstant | RealConstantExpression) {
		super(arg1, arg2);
	}

	toString(): string {
		return `(${this._left})/(${this._right})`;
	}
	toLaTeX(): string {
		return `\\frac{${this._left}}{${this._right}}`;
	}
	equals(expr: Expression) {
		return (
			expr instanceof RealConstantQuotient &&
			this._left.equals((expr as RealConstantQuotient).left) &&
			this._right.equals((expr as RealConstantQuotient).right)
		);
	}

	simplify() {
		return this;
	}

	clone() {
		return new RealConstantQuotient(this._left, this._right);
	}
}

// ComplexConstantExpression and subclasses

export abstract class ComplexConstantExpression extends ConstantExpression {}

export abstract class ComplexConstantBinaryExpression extends ComplexConstantExpression {
	protected _real: RealConstantExpression;
	protected _imag: RealConstantExpression;

	constructor(arg1: Complex, arg2: RealConstantExpression);
	constructor(arg1: Complex, arg2: RealConstant);
	constructor(arg1: Complex, arg2: Complex);
	constructor(arg1: Complex, arg2: ComplexConstantExpression);
	constructor(arg1: RealConstant, arg2: Complex);
	constructor(arg1: RealConstant, arg2: ComplexConstantExpression);
	constructor(arg1: RealConstantExpression, arg2: Complex);
	constructor(arg1: RealConstantExpression, arg2: ComplexConstantExpression);
	constructor(
		arg1: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression,
		arg2: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression
	) {
		super();
		if (
			(arg1 instanceof Complex || arg1 instanceof ComplexConstantBinaryExpression) &&
			(arg2 instanceof RealConstant || arg2 instanceof RealConstantExpression)
		) {
			this._real = ConstantExpression.plus(arg1.real, arg2);
			this._imag = arg1.imag;
		} else if (
			(arg1 instanceof RealConstant || arg1 instanceof RealConstantExpression) &&
			(arg2 instanceof Complex || arg2 instanceof ComplexConstantBinaryExpression)
		) {
			this._real = ConstantExpression.plus(arg1, arg2.real);
			this._imag = arg2.imag;
		} else if (arg1 instanceof Complex && arg2 instanceof Complex) {
			this._real = ConstantExpression.plus(arg1.real, arg2.real);
			this._imag = ConstantExpression.plus(arg1.imag, arg2.imag);
		} else {
			this._real = new Integer(0);
			this._imag = new Integer(0);
		}
	}

	get real() {
		return this._real;
	}
	get imag() {
		return this._imag;
	}

	plus(num: RealConstant | Complex | RealConstantExpression | ComplexConstantExpression): Complex | ComplexConstantSum {
		return ConstantExpression.plus(this, num);
	}

	minus(
		num: RealConstant | Complex | RealConstantExpression | ComplexConstantExpression
	): Complex | ComplexConstantDifference {
		return ConstantExpression.minus(this, num);
	}

	times(
		num: RealConstant | Complex | RealConstantExpression | ComplexConstantExpression
	): Complex | ComplexConstantProduct {
		return ConstantExpression.times(this, num);
	}
	div(
		num: RealConstant | Complex | RealConstantExpression | ComplexConstantExpression
	): Complex | ComplexConstantQuotient {
		return ConstantExpression.div(this, num);
	}

	abstract simplify(): Complex | ComplexConstantExpression;
	abstract neg(): Complex | ComplexConstantExpression;
}

export class ComplexConstantSum extends ComplexConstantBinaryExpression {
	constructor(
		arg1: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression,
		arg2: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression
	) {
		super(arg1, arg2);
	}

	toString() {
		return `(${this.real.toString()}) + (${this.imag.toString()})i`;
	}

	toLaTeX() {
		return this.toString();
	}

	simplify() {
		return this;
	}

	clone() {
		return new ComplexConstantSum(this._real, this._imag);
	}
	neg() {
		return new ComplexConstantSum(this._real.neg(), this._imag.neg());
	}

	equals(expr: ConstantExpression) {
		return expr instanceof ComplexConstantSum && this._real.equals(expr.real) && this._imag.equals(expr.imag);
	}
}

export class ComplexConstantDifference extends ComplexConstantBinaryExpression {
	constructor(
		arg1: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression,
		arg2: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression
	) {
		super(arg1, arg2);
	}

	toString() {
		return `(${this.real.toString()}) - (${this.imag.toString()})i`;
	}

	toLaTeX() {
		return this.toString();
	}

	simplify() {
		return this;
	}

	clone() {
		return new ComplexConstantDifference(this._real, this._imag);
	}
	neg() {
		return new ComplexConstantDifference(this._real.neg(), this._imag.neg());
	}

	equals(expr: ConstantExpression) {
		return expr instanceof ComplexConstantDifference && this._real.equals(expr.real) && this._imag.equals(expr.imag);
	}
}

export class ComplexConstantProduct extends ComplexConstantBinaryExpression {
	constructor(
		arg1: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression,
		arg2: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression
	) {
		super(arg1, arg2);
	}

	toString() {
		return `(${this.real.toString()}) * (${this.imag.toString()})i`;
	}

	toLaTeX() {
		return this.toString();
	}

	simplify() {
		return this;
	}

	clone() {
		return new ComplexConstantProduct(this._real, this._imag);
	}
	neg() {
		return new ComplexConstantProduct(this._real.neg(), this._imag.neg());
	}

	equals(expr: ConstantExpression) {
		return expr instanceof ComplexConstantProduct && this._real.equals(expr.real) && this._imag.equals(expr.imag);
	}
}

export class ComplexConstantQuotient extends ComplexConstantBinaryExpression {
	constructor(
		arg1: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression,
		arg2: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression
	) {
		super(arg1, arg2);
	}

	toString() {
		return `(${this.real.toString()})/ (${this.imag.toString()})i`;
	}

	toLaTeX() {
		return this.toString();
	}

	simplify() {
		return this;
	}

	clone() {
		return new ComplexConstantQuotient(this._real, this._imag);
	}
	neg() {
		return new ComplexConstantQuotient(this._real.neg(), this._imag.neg());
	}

	equals(expr: ConstantExpression) {
		return expr instanceof ComplexConstantQuotient && this._real.equals(expr.real) && this._imag.equals(expr.imag);
	}
}

// RealConstant

export abstract class RealConstant extends Constant {
	abstract plus(num: RealConstant): RealConstant;
	abstract plus(num: string): Constant;
	abstract plus(num: Complex): Complex;
	abstract minus(num: RealConstant): RealConstant;
	abstract minus(num: string): Constant;
	abstract minus(num: Complex): Complex;
	abstract times(num: RealConstant): RealConstant;
	abstract times(num: string): Constant;
	abstract times(num: Complex): Complex;
	abstract div(num: RealConstant): RealConstant;
	abstract div(num: string): Constant;
	abstract div(num: Complex): Complex;
	abstract neg(): RealConstant;
	abstract toReal(): Real;
	abstract abs(): RealConstant;
	abstract simplify(): RealConstant;
	abstract equals(num: Constant): boolean;
	compareTo(num: RealConstant) {
		return this.toReal().value - num.toReal().value;
	}

	static isReal(expr: Expression) {
		return (
			expr instanceof Real ||
			expr instanceof Integer ||
			expr instanceof NamedConstant ||
			expr instanceof Rational ||
			expr instanceof RealConstantSum ||
			expr instanceof RealConstantDifference ||
			expr instanceof RealConstantProduct ||
			expr instanceof RealConstantQuotient
		);
	}
}

// Integer

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

	abs() {
		return this._value < 0n ? this.neg() : this.clone();
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
	div(str: string): Constant;
	div(num: Constant): Constant;
	div(arg: Constant | RealConstant | Complex | string): Constant {
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
			if (a < b) [a, b] = [b, a];
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

// Rational

export class Rational extends RealConstant {
	private _numer: bigint;
	private _denom: bigint;
	constructor(str: string);
	constructor(numer: bigint | number | Integer, denom: bigint | number | Integer);
	constructor(num1: bigint | number | Integer, num2: bigint | number | Integer);
	constructor(
		arg1: string | bigint | number | Integer,
		arg2?: bigint | number | Integer,
		arg3?: bigint | number | Integer
	) {
		super();
		let numer = BigInt(0),
			denom = BigInt(1);
		if (typeof arg1 !== 'string' && arg2 !== undefined) {
			if (!constRe.integer.test(`${arg1}`)) throw `The number ${arg1} is not an integer.`;
			if (!constRe.integer.test(`${arg2}`)) throw `The number ${arg2} is not an integer.`;
			numer = arg1 instanceof Integer ? arg1.value : BigInt(arg1);
			denom = arg2 instanceof Integer ? arg2.value : BigInt(arg2);
		} else if (typeof arg1 === 'string' && arg2 === undefined) {
			if (!constRe.rational.test(arg1)) throw arg1 + ' is not a rational number';
			const match = arg1.match(constRe.rational);
			if (match !== null) {
				numer = BigInt(match[1]);
				denom = BigInt(match[2]);
			}
		} else {
			throw "Constructor error. Can't combine a string with an other argument. ";
		}
		this._numer = denom < 0 ? -numer : numer;
		this._denom = denom >= 0 ? denom : -denom;

		// reduce the fraction.
		this.reduce();
	}

	get numer(): bigint {
		return this._numer;
	}
	get denom(): bigint {
		return this._denom;
	}

	simplify() {
		if (this._denom == 1n) return new Integer(this._numer);
		if (this._numer == 0n) return new Integer(0);
		return this;
	}

	toString(): string {
		return (this._numer < 0 ? '-' : '') + (this._numer < 0 ? -this._numer : this._numer) + '/' + this._denom;
	}
	toLaTeX(): string {
		return (
			(this._numer < 0 ? '-' : '') +
			'\\frac{ ' +
			(this._numer < 0 ? -this._numer : this._numer) +
			'}{' +
			this._denom +
			'}'
		);
	}
	toReal(): Real {
		return new Real(Number(this._numer) / Number(this._denom));
	}

	equals(num: Constant): boolean {
		if (num instanceof Rational) return num.numer === this._numer && num.denom === this._denom;
		return false;
	}

	clone(): Rational {
		return new Rational(this._numer, this._denom);
	}

	// unary negative.
	neg(): Rational {
		return new Rational(-1n * this._numer, this._denom);
	}

	abs(): Rational {
		return this._numer < 0n ? this.neg() : this.clone();
	}

	plus(num: RealConstant): Rational | Real | Integer;
	plus(num: Complex): Complex;
	plus(str: string): Constant;
	plus(arg: RealConstant | Complex | string): Constant {
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		let result: Constant;
		if (num instanceof Integer) result = new Rational(num.value * this._denom + this._numer, this._denom);
		else if (num instanceof Real) result = new Real(num.value + this.toReal().value);
		else if (num instanceof Rational)
			result = new Rational(num.numer * this._denom + num.denom * this._numer, num.denom * this._denom);
		else if (num instanceof Complex) result = new Complex(this.plus(num.real), num.imag);
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	minus(num: RealConstant): Rational | Real | Integer;
	minus(num: Complex): Complex;
	minus(str: string): Constant;
	minus(arg: RealConstant | Complex | string): Constant {
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		let result: Constant;
		if (num instanceof Integer) result = new Rational(this._numer - num.value * this._denom, this._denom);
		else if (num instanceof Real) result = new Real(this.toReal().value - num.value);
		else if (num instanceof Rational)
			result = new Rational(num.denom * this._numer - num.numer * this._denom, num.denom * this._denom);
		else if (num instanceof Complex) result = new Complex(this.minus(num.real), num.imag.neg());
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	times(num: RealConstant): Rational | Real | Integer;
	times(num: Complex): Complex;
	times(str: string): Rational | Real | Integer;
	times(arg: RealConstant | Complex | string): Constant {
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		let result: Constant;
		if (num instanceof Integer) result = new Rational(num.value * this._numer, this._denom);
		else if (num instanceof Real) result = new Real(num.value * this.toReal().value);
		else if (num instanceof Rational) result = new Rational(num.numer * this._numer, num.denom * this._denom);
		else if (num instanceof Complex) result = new Complex(this.times(num.real), this.times(num.imag));
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	div(num: RealConstant): Rational | Real | Integer;
	div(num: Complex): Complex;
	div(str: string): Constant;
	div(arg: string | Complex | RealConstant): Constant {
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		let result: Constant;
		if (num instanceof Integer) result = new Rational(this.numer, this.denom * num.value);
		else if (num instanceof Real) result = new Real(this.toReal().value / num.value);
		else if (num instanceof Rational) result = new Rational(this._numer * num.denom, this._denom * num.numer);
		else if (num instanceof Complex) {
			const d = num.real.times(num.real).plus(num.imag.times(num.imag)) as RealConstant;
			return new Complex(this.times(num.real).div(d), this.times(num.imag).neg().div(d));
		} else throw new Error('This line should not be reached.');
		return result.simplify();
	}

	// reduce the fraction such that gcd(numer,denom)=1;
	reduce() {
		const c = Integer.gcd(this._numer, this.denom);
		this._numer /= c;
		this._denom /= c;
	}
}

// Real

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

	abs(): Real {
		return this._value < 0 ? this.neg() : this.clone();
	}

	plus(num: RealConstant): Real;
	plus(num: Complex): Complex;
	plus(str: string): Real | Complex;
	plus(arg: RealConstant | Complex | string): Real | Complex {
		const num = typeof arg === 'string' ? Parser.parseConstant(arg) : arg;
		if (num instanceof Integer) return new Real(Number(num.value) + this._value);
		else if (num instanceof Real) return new Real(num.value + this._value);
		else if (num instanceof Rational) return new Real(this._value + num.toReal().value);
		else if (num instanceof Complex) return new Complex(num.real.plus(this) as RealConstant, num.imag);
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

// Complex

export class Complex extends Constant {
	private _real: RealConstant;
	private _imag: RealConstant;
	// static ZERO = new Complex(0,0);
	constructor(str: string);
	constructor(num1: number | bigint | RealConstant, num2: number | bigint | RealConstant);
	constructor(arg1: string | number | bigint | RealConstant, arg2?: number | bigint | RealConstant) {
		super();
		this._real = new Integer(0);
		this._imag = new Integer(0);
		if (typeof arg1 === 'string' && arg2 == undefined) {
			if (!constRe.complex.test(arg1)) throw arg1 + ' is not a complex number';
			const match = arg1.match(constRe.complex);
			if (match) {
				this._real = Parser.parseRealConstant(match[2]);
				this._imag = Parser.parseRealConstant(match[4]);
			}
			if (match != undefined && match[3] == '-') this._imag.times('-1');
		} else {
			if (arg1 instanceof Integer || arg1 instanceof Real || arg1 instanceof Rational) {
				this._real = arg1;
			} else {
				this._real = Parser.parseRealConstant(`${arg1}`);
			}
			if (arg2 instanceof Integer || arg2 instanceof Real || arg2 instanceof Rational) {
				this._imag = arg2;
			} else {
				this._imag = Parser.parseRealConstant(`${arg2}`);
			}
		}
	}

	get real(): RealConstant {
		return this._real;
	}
	get imag(): RealConstant {
		return this._imag;
	}

	toString() {
		return `${this._real}+${this._imag}i`;
	}
	toLaTeX() {
		return this.toString();
	}

	equals(num: Constant): boolean {
		if (num instanceof Complex) {
			return num.real.equals(this._real) && num.imag.equals(this._imag);
		}
		return false;
	}

	simplify() {
		return new Complex(this._real.simplify(), this._imag.simplify());
	}

	clone(): Complex {
		return new Complex(this._real, this._imag);
	}

	neg(): Complex {
		return new Complex(this._real.neg(), this._imag.neg());
	}

	plus(num: RealConstant): Complex;
	plus(num: Complex): Complex;
	plus(str: string): Complex;
	plus(num: RealConstant | Complex | string): Complex {
		if (typeof num === 'string') {
			const parsed_num = Parser.parseConstant(num);
			return parsed_num instanceof Complex ? this.plus(parsed_num) : this.plus(parsed_num as RealConstant);
		}
		let result: Complex;
		if (num instanceof Integer || num instanceof Real || num instanceof Rational)
			result = new Complex(this.real.plus(num) as RealConstant, this.imag.plus(num) as RealConstant);
		else if (num instanceof Complex)
			result = new Complex(this.real.plus(num.real) as RealConstant, this.imag.plus(num.imag) as RealConstant);
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	minus(num: RealConstant): Complex;
	minus(num: Complex): Complex;
	minus(str: string): Complex;
	minus(num: RealConstant | Complex | string): Complex {
		if (typeof num === 'string') {
			const parsed_num = Parser.parseConstant(num);
			return parsed_num instanceof Complex ? this.minus(parsed_num) : this.minus(parsed_num as RealConstant);
		}
		let result: Complex;
		if (num instanceof Integer) result = new Complex(this._real.minus(num), this._imag);
		else if (num instanceof Real) result = new Complex(this._real.minus(num), this._imag);
		else if (num instanceof Rational) result = new Complex(this._real.minus(num), this._imag);
		else if (num instanceof Complex) result = new Complex(this._real.minus(num.real), this._imag.minus(num.imag));
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	times(num: RealConstant): Complex;
	times(num: Complex): Complex;
	times(str: string): Complex;
	times(num: RealConstant | Complex | string): Complex {
		if (typeof num === 'string') {
			const parsed_num = Parser.parseConstant(num);
			return parsed_num instanceof Complex ? this.plus(parsed_num) : this.plus(parsed_num as RealConstant);
		}
		let result: Complex;
		if (num instanceof Integer) result = new Complex(this._real.times(num), this._imag.times(num));
		else if (num instanceof Real) result = new Complex(this._real.times(num), this._imag.times(num));
		else if (num instanceof Rational) result = new Complex(this._real.times(num), this._imag.times(num));
		else if (num instanceof Complex)
			result = new Complex(
				num.real.times(this._real).minus(num.imag.times(this.imag)),
				num.imag.times(this._real).plus(num.real.times(this._imag))
			);
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	div(num: RealConstant): Complex;
	div(num: Complex): Complex;
	div(num: Constant): Complex;
	div(str: string): Complex;
	div(num: Constant | RealConstant | Complex | string): Complex {
		let result: Complex;
		if (num instanceof Integer) result = new Complex(this._real.div(num), this._imag.div(num));
		else if (num instanceof Real) result = new Complex(this._real.div(num), this._imag.div(num));
		else if (num instanceof Rational) result = new Complex(this._real.div(num), this._imag.div(num));
		else if (num instanceof Complex) {
			const denom = num.real.times(num.real).plus(num.imag.times(num.imag));
			result = new Complex(
				this.real.times(num.real).plus(this.imag.times(num.imag)).div(denom),
				this.imag.times(num.real).minus(this.real.times(num.imag)).div(denom)
			);
		} else if (typeof num === 'string') result = this.div(Parser.parseConstant(num));
		else throw new Error("This line shouldn't be reached.");
		return result.simplify();
	}

	// conjugate
	conj() {
		return new Complex(this._real, this._imag.neg());
	}
}

export class NamedConstant extends RealConstantExpression {
	private _name: string;
	constructor(name: string) {
		super();
		if (name === 'pi') this._name = 'pi';
		else if (name === 'e') this._name = 'e';
		else this._name = '';
	}

	get name() {
		return this._name;
	}

	toString() {
		return this._name;
	}

	toLaTeX() {
		return this._name === 'pi' ? '\\pi' : this._name === 'e' ? 'e' : '';
	}

	clone() {
		return new NamedConstant(this._name);
	}

	equals(expr: Expression): boolean {
		return expr instanceof NamedConstant && expr.name === this._name;
	}

	plus(str: string): RealConstantSum | ComplexConstantSum;
	plus(num: Complex | ComplexConstantExpression): ComplexConstantSum;
	plus(num: RealConstant | RealConstantExpression): RealConstantSum;
	plus(
		arg: string | Complex | ComplexConstantExpression | RealConstant | RealConstantExpression
	): RealConstantSum | ComplexConstantSum {
		const num: Constant = typeof arg === 'string' ? ConstantParser.parseConstant(arg) : arg;
		return RealConstant.isReal(num) ? new RealConstantSum(this, num) : new ComplexConstantSum(this, num);
	}

	minus(str: string): RealConstantSum | ComplexConstantSum;
	minus(num: Complex | ComplexConstantExpression): ComplexConstantDifference;
	minus(num: RealConstant | RealConstantExpression): RealConstantDifference;
	minus(
		arg: string | Complex | ComplexConstantExpression | RealConstant | RealConstantExpression
	): RealConstantDifference | ComplexConstantDifference {
		const num: Constant = typeof arg === 'string' ? ConstantParser.parseConstant(arg) : arg;
		return RealConstant.isReal(num) ? new RealConstantDifference(this, num) : new ComplexConstantDifference(this, num);
	}

	times(num: Complex | ComplexConstantExpression): ComplexConstantProduct;
	times(num: RealConstant | RealConstantExpression): RealConstantProduct;
	times(
		num: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression
	): RealConstantProduct | ComplexConstantProduct {
		return num instanceof RealConstant || num instanceof RealConstantExpression
			? new RealConstantProduct(this, num)
			: new ComplexConstantProduct(this, num);
	}

	div(num: Complex | ComplexConstantExpression): ComplexConstantQuotient;
	div(num: RealConstant | RealConstantExpression): RealConstantQuotient;
	div(
		num: Complex | ComplexConstantExpression | RealConstant | RealConstantExpression
	): RealConstantQuotient | ComplexConstantQuotient {
		return num instanceof RealConstant || num instanceof RealConstantExpression
			? new RealConstantQuotient(this, num)
			: new ComplexConstantQuotient(this, num);
	}

	neg(): RealConstantProduct {
		return new RealConstantProduct(new Integer(-1), this);
	}

	abs(): NamedConstant {
		return this;
	}

	simplify(): NamedConstant {
		return this;
	}

	compareTo(num: RealConstant): number {
		return this.toReal().value - num.toReal().value;
	}

	toReal(): Real {
		return this._name === 'pi'
			? new Real(2 * Math.acos(-1.0))
			: this._name === 'e'
			? new Real(-1 * Math.exp(1))
			: new Real(0);
	}
}
