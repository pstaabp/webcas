import { Expression } from '../../src/expressions/abstract_expression';
import { Sum, Difference, Product, Quotient, Variable, Power, Sqrt } from './expression';
import { Integer, NamedConstant } from '../constants/all_constants';
import { Parser as ConstantParser } from '../constants/constant_parser';


const function_names = ['cos', 'sin', 'tan', 'sqrt'];
const var_or_funct = /[a-zA-Z]+/;
const operRe = /(\*)|(\+)|(\-)|(\/)|(\^)/;
const numRe = /\-?\d*\.?\d+/;
const numInt = /\-?\d* /;

export class Parser {
	static parseExpression(str: string, vars: Variable[]): Expression {
		const tokens: string[] = [];
		const tokenRe = new RegExp(/([a-zA-Z]+)|(\()|(\))|(\*)|(\+)|(\-)|(\/)|(\^)|(\d*\.?\d+)/g);
		let arr: RegExpExecArray | null;
		while ((arr = tokenRe.exec(str))) tokens.push(arr[0]);

		const constants = ['pi', 'e'];
		const operators: string[] = [];
		const operands: Expression[] = [];
		const prevToken = '(';
		const thisToken = '(';
		tokens.forEach((t, i) => {
			if (numRe.test(t)) operands.push(ConstantParser.parseConstant(t));
			else if (constants.indexOf(t) > -1) {
				const c = ConstantParser.parseNamedConstant(t);
				if (c !== undefined) operands.push(c);
			} else if (var_or_funct.test(t)) {
				const pos = function_names.indexOf(t);
				if (pos >= 0) operators.push(t);
				else if (vars.map((v) => v.var).indexOf(t) < 0) throw new Error(`The token '${t}' is not defined.`);
				else operands.push(new Variable(t));
			} else if (operRe.test(t)) {
				// unary +
				if (t === '+' && (i === 0 || tokens[i - 1] === '(')) {
				}
				// unary -
				else if (t === '-' && (i === 0 || tokens[i - 1] === '(')) {
					operands.push(new Integer(0));
					operators.push('-');
				} else operators.push(t);
			} else if (t === '(') operators.push('(');
			else if (t === ')') {
				if (operators.indexOf('(') < 0) throw new Error('mismatched parentheses.');
				else {
					while (operators[operators.length - 1] !== '(') Parser.createFunction(operators, operands);
					operators.pop(); // removes the '('

					// check to see if a function name is on the operator stack
					const op = operators.at(-1);
					for (const name in function_names) {
						if (name === op) {
							Parser.createFunction(operators, operands);
							break;
						}
					}
				}
			}
		});
		while (operators.length > 0) Parser.createFunction(operators, operands);
		const expr = operands.pop();
		if (expr === undefined) throw new Error(`Expression '${str}' cannot be parsed`);
		else return expr;
	}

	static createFunction(operators: string[], operands: Expression[]) {
		const otherOperands: Expression[] = [];
		const otherOperators: string[] = [];

		// console.log([operators, operands, otherOperators, otherOperands]);
		if (operators.length > 1) Parser.checkPrecedence(operators, operands, otherOperators, otherOperands);
		// console.log([operators, operands, otherOperators, otherOperands]);
		const oper = operators.pop() ?? '';
		if (operRe.test(oper)) {
			const right = operands.pop();
			if (right == undefined) throw new Error('missing operand.');
			const left = operands.pop();
			if (left == undefined) throw new Error('missing operand.');
			// console.log([oper, left, right]);
			// console.log([operators, operands, otherOperators, otherOperands]);
			switch (oper) {
				case '+':
					operands.push(new Sum(left, right));
					break;
				case '-':
					operands.push(new Difference(left, right));
					break;
				case '*':
					operands.push(new Product(left, right));
					break;
				case '/':
					operands.push(new Quotient(left, right));
					break;
				case '^':
					operands.push(new Power(left, right));
					break;
			}
			// These are going in the wrong order.  Can we run through forEach backwards?
			otherOperands.reverse();
			otherOperands.forEach((op) => operands.push(op));
			// otherOperands = [];
			otherOperators.reverse();
			otherOperators.forEach((op) => operators.push(op));
			// otherOperators = [];
			// console.log([operators, operands, otherOperators, otherOperands]);
		} else {
			switch (oper) {
				case 'sqrt':
					const operand = operands.pop();
					if (operand === undefined) throw new Error('missing operand');
					operands.push(new Sqrt(operand));
					break;
			}
		}
	}

	static checkPrecedence(
		operators: string[],
		operands: Expression[],
		otherOperators: string[],
		otherOperands: Expression[]
	) {
		const currentOperator = operators[operators.length - 1];
		const nextOperator = operators[operators.length - 2];

		if (operRe.test(currentOperator) && operRe.test(nextOperator)) {
			switch (currentOperator) {
				case '-':
				case '+':
					switch (nextOperator) {
						case '-':
						case '+':
						case '*':
						case '/':
						case '^':
							const operand = operands.pop();
							if (operand) otherOperands.push(operand);
							const operator = operators.pop();
							if (operator) otherOperators.push(operator);
							if (operators.length > 1) Parser.checkPrecedence(operators, operands, otherOperators, otherOperands);
							return;
					}
					break;

				case '*':
				case '/':
					switch (nextOperator) {
						case '*':
						case '/':
						case '^':
							const operand = operands.pop();
							if (operand) otherOperands.push(operand);
							const operator = operators.pop();
							if (operator) otherOperators.push(operator);
							if (operators.length > 1) Parser.checkPrecedence(operators, operands, otherOperators, otherOperands);
							return;
					}

				case '^':
					switch (nextOperator) {
						case '^':
							const operand = operands.pop();
							if (operand) otherOperands.push(operand);
							const operator = operators.pop();
							if (operator) otherOperators.push(operator);
							if (operators.length > 1) Parser.checkPrecedence(operators, operands, otherOperators, otherOperands);
							return;
					}
			}
		}
	}
}
