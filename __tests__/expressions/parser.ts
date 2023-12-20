import { Integer, NamedConstant } from '../../src/constants/all_constants';
import { Expression } from '../../src/expressions/abstract_expression';
import { Variable, Sum, Difference, Product, Quotient, Power, Sqrt } from '../../src/expressions/expression';
import { Parser } from '../../src/expressions/parser';

describe('parse variables and monomials', () => {
	const expr1 = new Sum(new Variable('x'), new Integer(3));
	const expr2 = new Product(new Integer(2), new Sum(new Variable('x'), new Integer(3)));
	const expr3 = new Sum(new Integer(3), new Product(new Integer(2), new Variable('x')));
	const var1 = new Variable('x');
	test('parse expression that is just a variable', () => {
		expect(Parser.parseExpression('x', [var1])).toStrictEqual(var1);
	});
	test('parse x+3', () => {
		expect(Parser.parseExpression('x+3', [var1])).toStrictEqual(expr1);
	});
	test('parse 3+2*x', () => {
		expect(Parser.parseExpression('3+2*x', [var1])).toStrictEqual(expr3);
	});
	test('parse x+pi', () => {
		expect(Parser.parseExpression('x+pi', [var1])).toStrictEqual(new Sum(new Variable('x'), new NamedConstant('pi')));
	});
	test('parse 2*(x+3)', () => {
		expect(Parser.parseExpression('2*(x+3)', [var1])).toStrictEqual(expr2);
	});
});

describe('parse variables and monomials to check precedence', () => {
	const expr2 = new Sum(new Product(new Integer(2), new Variable('x')), new Integer(3));

	test('parse 2*x+3', () => {
		expect(Parser.parseExpression('2*x+3', [new Variable('x')])).toStrictEqual(expr2);
	});
});

describe('parse with variable not defined.', () => {
	test('parse 2*x but x is not defined.', () => {
		expect(() => {
			Parser.parseExpression('2*x', []);
		}).toThrow("The token 'x' is not defined.");
	});
});

describe('parse expressions with two variables', () => {
	const expr1 = new Sum(new Variable('x'), new Variable('y'));
	const expr2 = new Difference(new Product(new Integer(3), new Variable('x')), new Variable('y'));
	const vars = [new Variable('x'), new Variable('y')];
	test('parse x+y', () => {
		expect(Parser.parseExpression('x+y', vars)).toStrictEqual(expr1);
	});
	test('parse 3x-y', () => {
		expect(Parser.parseExpression('3*x-y', vars)).toStrictEqual(expr2);
	});
});

describe('parse powers', () => {
	const expr1 = new Power(new Variable('x'), new Integer(2));
	const vars = [new Variable('x')];
	test('parse x^2', () => {
		expect(Parser.parseExpression('x^2', vars)).toStrictEqual(expr1);
	});
});

describe('parse expressions with square roots', () => {
	const expr1 = new Sqrt(new Variable('x'));
	const expr2 = new Sqrt(new Sum(new Product(new Integer(2), new Variable('x')), new Integer(3)));
	const vars = [new Variable('x')];
	test('parse sqrt(x)', () => {
		expect(Parser.parseExpression('sqrt(x)', vars)).toStrictEqual(expr1);
	});
	test('parse sqrt(2*x+3)', () => {
		expect(Parser.parseExpression('sqrt(2*x+3', vars)).toStrictEqual(expr2);
	});
});
