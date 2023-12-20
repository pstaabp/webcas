import { Expression } from './abstract_expression';
import { Integer, RealConstant, NamedConstant } from '../constants/all_constants';
import { Parser } from './parser';

export abstract class NonconstantExpression extends Expression {
	plus(arg: Expression | string): Sum {
		const expr = typeof arg === 'string' ? Parser.parseExpression(arg, []) : arg;
		return new Sum(this, expr);
	}

	minus(arg: Expression | string): Difference {
		const expr = typeof arg === 'string' ? Parser.parseExpression(arg, []) : arg;
		return new Difference(this, expr);
	}

	times(arg: Expression | string): Product {
		const expr = typeof arg === 'string' ? Parser.parseExpression(arg, []) : arg;
		return new Product(this, expr);
	}

	div(arg: Expression | string): Quotient {
		const expr = typeof arg === 'string' ? Parser.parseExpression(arg, []) : arg;
		return new Quotient(this, expr);
	}

	abstract simplify(): Expression;

	neg(): Product {
		return new Product(new Integer(-1), this);
	}
}

// Variable

export class Variable extends NonconstantExpression {
	private _var: string;

	constructor(arg: string) {
		super();
		this._var = arg;
	}

	get var() {
		return this._var;
	}

	toString() {
		return this._var;
	}

	toLaTeX() {
		return this.toString();
	}

	equals(expr: Expression) {
		return expr instanceof Variable && expr.var === this._var;
	}

	clone() {
		return new Variable(this._var);
	}

	simplify() {
		return this;
	}
}

// Sum

export class Sum extends NonconstantExpression {
	private _expr1: Expression;
	private _expr2: Expression;

	constructor(arg1: Expression, arg2: Expression) {
		super();
		this._expr1 = arg1;
		this._expr2 = arg2;
	}

	get expr1() {
		return this._expr1;
	}

	get expr2() {
		return this._expr2;
	}

	toString() {
		return `(${this._expr1.toString()})+(${this._expr2.toString()})`;
	}

	toLaTeX() {
		return `(${this._expr1.toLaTeX()})+(${this._expr2.toLaTeX()})`;
	}

	equals(expr: Expression) {
		return expr instanceof Sum && this._expr1.equals(expr.expr1) && this._expr2.equals(expr.expr2);
	}

	clone() {
		return new Sum(this._expr1, this._expr2);
	}

	simplify() {
		return this;
	}
}

// Difference

export class Difference extends NonconstantExpression {
	private _expr1: Expression;
	private _expr2: Expression;

	constructor(arg1: Expression, arg2: Expression) {
		super();
		this._expr1 = arg1;
		this._expr2 = arg2;
	}

	get expr1() {
		return this._expr1;
	}

	get expr2() {
		return this._expr2;
	}

	toString() {
		return `(${this._expr1.toString()})-(${this._expr2.toString()})`;
	}

	toLaTeX() {
		return `(${this._expr1.toLaTeX()})-(${this._expr2.toLaTeX()})`;
	}

	equals(expr: Expression) {
		return expr instanceof Difference && this._expr1.equals(expr.expr1) && this._expr2.equals(expr.expr2);
	}

	clone() {
		return new Difference(this._expr1, this._expr2);
	}

	simplify() {
		return this;
	}
}

// Product

export class Product extends NonconstantExpression {
	private _expr1: Expression;
	private _expr2: Expression;

	constructor(arg1: Expression, arg2: Expression) {
		super();
		this._expr1 = arg1;
		this._expr2 = arg2;
	}

	get expr1() {
		return this._expr1;
	}

	get expr2() {
		return this._expr2;
	}

	toString() {
		return `(${this._expr1.toString()})*(${this._expr2.toString()})`;
	}

	toLaTeX() {
		return `(${this._expr1.toLaTeX()})*(${this._expr2.toLaTeX()})`;
	}

	equals(expr: Expression) {
		return expr instanceof Product && this._expr1.equals(expr.expr1) && this._expr2.equals(expr.expr2);
	}

	clone() {
		return new Product(this._expr1, this._expr2);
	}

	simplify() {
		return this;
	}
}

// Quotient

export class Quotient extends NonconstantExpression {
	private _expr1: Expression;
	private _expr2: Expression;

	constructor(arg1: Expression, arg2: Expression) {
		super();
		this._expr1 = arg1;
		this._expr2 = arg2;
	}

	get expr1() {
		return this._expr1;
	}

	get expr2() {
		return this._expr2;
	}

	toString() {
		return `(${this._expr1.toString()})/(${this._expr2.toString()})`;
	}

	toLaTeX() {
		return `(${this._expr1.toLaTeX()})/(${this._expr2.toLaTeX()})`;
	}

	equals(expr: Expression) {
		return expr instanceof Quotient && this._expr1.equals(expr.expr1) && this._expr2.equals(expr.expr2);
	}

	clone() {
		return new Quotient(this._expr1, this._expr2);
	}

	simplify() {
		return this;
	}
}

// Power

export class Power extends NonconstantExpression {
	private _expr1: Expression;
	private _expr2: Expression;

	constructor(arg1: Expression, arg2: Expression) {
		super();
		this._expr1 = arg1;
		this._expr2 = arg2;
	}

	get expr1() {
		return this._expr1;
	}

	get expr2() {
		return this._expr2;
	}

	toString() {
		return `(${this._expr1.toString()})^(${this._expr2.toString()})`;
	}

	toLaTeX() {
		return `{${this._expr1.toLaTeX()}}^{${this._expr2.toLaTeX()}}`;
	}

	equals(expr: Expression) {
		return expr instanceof Power && this._expr1.equals(expr.expr1) && this._expr2.equals(expr.expr2);
	}

	clone() {
		return new Power(this._expr1, this._expr2);
	}

	simplify() {
		return this;
	}
}

export class Sqrt extends Expression {
	private _arg: Expression;

	constructor(arg: Expression) {
		super();
		this._arg = arg;
	}

	get arg() {
		return this._arg;
	}

	toString() {
		return `sqrt(${this._arg})`;
	}

	toLaTeX() {
		return `\sqrt{${this._arg}}`;
	}

	clone() {
		return new Sqrt(this._arg);
	}

	equals(expr: Expression) {
		return expr instanceof Sqrt && this._arg.equals(expr.arg);
	}

	simplify() {
		return this;
	}

	neg() {
		return new Product(new Integer(-1), this);
	}

	plus(expr: Expression) {
		return new Sum(this, expr);
	}

	minus(expr: Expression) {
		return new Difference(this, expr);
	}

	times(expr: Expression) {
		return new Product(this, expr);
	}

	div(expr: Expression) {
		return new Quotient(this, expr);
	}
}

export class Exp extends Expression {
	private _arg: Expression;
	private _base: RealConstant;

	constructor(base: RealConstant, arg: Expression) {
		super();
		this._base = base;
		this._arg = arg;
	}

	get base() {
		return this._base;
	}
	get arg() {
		return this._arg;
	}

	toString() {
		return `${this._base}^(${this._arg})`;
	}

	toLaTeX() {
		return `${this.base}^{${this._arg}}`;
	}

	clone() {
		return new Exp(this._base, this._arg);
	}

	equals(expr: Expression) {
		return expr instanceof Exp && this._base.equals(expr.base) && this._arg.equals(expr.arg);
	}

	simplify() {
		return this;
	}

	neg() {
		return new Product(new Integer(-1), this);
	}

	plus(expr: Expression) {
		return new Sum(this, expr);
	}

	minus(expr: Expression) {
		return new Difference(this, expr);
	}

	times(expr: Expression) {
		return new Product(this, expr);
	}

	div(expr: Expression) {
		return new Quotient(this, expr);
	}
}

export class Log extends Expression {
	private _arg: Expression;
	private _base: RealConstant | NamedConstant;

	// constructor(arg: Expression);
	constructor(arg1: Expression, arg2?: RealConstant | NamedConstant) {
		super();
		this._arg = arg1;
		this._base = arg2 == undefined ? new NamedConstant('e') : arg2;
	}

	get base() {
		return this._base;
	}
	get arg() {
		return this._arg;
	}

	toString() {
		return `log(${this._arg},${this._base})`;
	}

	toLaTeX() {
		return this._base.equals(new NamedConstant('e')) ? `\ln (${this._arg})` : `\\log_{${this._base}}(${this._arg})`;
	}

	clone() {
		return new Log(this._arg, this._base);
	}

	equals(expr: Expression) {
		return expr instanceof Log && this._base.equals(expr.base) && this._arg.equals(expr.arg);
	}

	simplify() {
		return this;
	}

	neg() {
		return new Product(new Integer(-1), this);
	}

	plus(expr: Expression) {
		return new Sum(this, expr);
	}

	minus(expr: Expression) {
		return new Difference(this, expr);
	}

	times(expr: Expression) {
		return new Product(this, expr);
	}

	div(expr: Expression) {
		return new Quotient(this, expr);
	}
}
