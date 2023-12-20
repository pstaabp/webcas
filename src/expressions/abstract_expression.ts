export abstract class Expression {
	abstract toString(): string;
	abstract toLaTeX(): string;
	abstract equals(expr: Expression): boolean;
	abstract clone(): Expression;
	abstract simplify(): Expression;
	abstract plus(num: Expression | string): Expression;
	abstract minus(num: Expression | string): Expression;
	abstract times(num: Expression | string): Expression;
	abstract div(num: Expression | string): Expression;
	abstract neg(): Expression; // unary minus.
}
