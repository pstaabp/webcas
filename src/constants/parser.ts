import { Constant } from './abstract_constant';
import { RealConstant } from './abstract_real';
import { Integer } from './integer';
import { Complex } from './complex';
import { Rational } from './rational';
import { Real } from './real';

const ratStr = '([-+]?\\d+)\\/(\\d+)';
const intStr = '[-+]?\\d+';
const posIntStr = '\\+?\\d+';
const realStr = '[-+]?\\d*\\.\\d*';
const imagStr1 = '([+-]?[\\d.\\/]+)i';
const imagStr2 = '(\\(([+-]?[\\d.\\/]+)\\))i';
const complexStr1 = '([+-]?[\\d.\\/]+)?\\+?(-?[\\d.\\/]+)?i';
const complexStr2 = '\\(([+-]?[\\d.\\/]+)\\)?\\+?(-?[\\d.\\/]+)?i';
const complexStr3 = '([+-]?[\\d.\\/]+)?([+-])?(\\((-?[\\d.\\/]+)\\))?i';
const complexStr4 = '\\(([+-]?[\\d.\\/]+)?\\)([+-])?(\\((-?[\\d.\\/]+)\\))?i';
const imagRe1 = new RegExp('^' + imagStr1 + '$');
const imagRe2 = new RegExp('^' + imagStr2 + '$');
const complexRe1 = new RegExp('^' + complexStr1 + '$');
const complexRe2 = new RegExp('^' + complexStr2 + '$');
const complexRe3 = new RegExp('^' + complexStr3 + '$');
const complexRe4 = new RegExp('^' + complexStr4 + '$');
const complexRe = new RegExp(
	'^' + imagStr1 + '|' + imagStr2 + '|' + complexStr1 + '|' + complexStr2 + '|' + complexStr3 + '|' + complexStr4 + '$'
);

export const constRe = {
	rational: new RegExp('^' + ratStr + '$'),
	integer: new RegExp('^' + intStr + '$'),
	pos_int: new RegExp(`^${posIntStr}$`),
	real: new RegExp('^' + realStr + '$'),
	complex: complexRe,
	real_const: new RegExp('^' + ratStr + '|' + intStr + '|' + realStr + '$'),
};

export class Parser {
	static parseRealConstant(str: string): RealConstant {
		if (constRe.rational.test(str)) return new Rational(str);
		else if (constRe.integer.test(str)) return new Integer(str);
		else if (constRe.real.test(str)) return new Real(str);
		else throw str + ' does not parse to a real constant.';
	}
	static parseConstant(str: string): Constant {
		if (constRe.complex.test(str)) return Parser.parseComplex(str);
		else if (constRe.real_const.test(str)) return Parser.parseRealConstant(str);
		else throw str + ' does not parse to a constant.';
	}
	static parseComplex(str: string): Complex {
		const m1 = imagRe1.exec(str);
		if (m1 && m1[1] !== undefined) return new Complex(0, Parser.parseRealConstant(m1[1]));
		const m2 = imagRe2.exec(str);
		if (m2 && m2[2] !== undefined) return new Complex(0, Parser.parseRealConstant(m2[2]));
		const m3 = complexRe1.exec(str);
		if (m3 && m3[2] !== undefined) return new Complex(Parser.parseRealConstant(m3[1]), Parser.parseRealConstant(m3[2]));
		const m4 = complexRe2.exec(str);
		if (m4 && m4[2] !== undefined) return new Complex(Parser.parseRealConstant(m4[1]), Parser.parseRealConstant(m4[2]));
		const m5 = complexRe3.exec(str);
		if (m5 && m5[4] !== undefined)
			return m5[2] == '+'
				? new Complex(Parser.parseRealConstant(m5[1]), Parser.parseRealConstant(m5[4]))
				: new Complex(Parser.parseRealConstant(m5[1]), Parser.parseRealConstant(m5[4]).neg());
		const m6 = complexRe4.exec(str);
		if (m6 && m6[4] !== undefined)
			return m6[2] == '+'
				? new Complex(Parser.parseRealConstant(m6[1]), Parser.parseRealConstant(m6[4]))
				: new Complex(Parser.parseRealConstant(m6[1]), Parser.parseRealConstant(m6[4]).neg());
		throw new Error('Should not have gotten to this line.');
	}
}
